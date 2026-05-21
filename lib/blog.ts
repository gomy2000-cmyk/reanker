import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  publishedAt: string // ISO 8601
  updatedAt?: string
  category: string
  tags: string[]
  cover?: string
  ogTitle?: string
}

export interface BlogPost extends BlogPostMeta {
  html: string
  rawMarkdown: string
}

function readFrontmatter(slug: string): BlogPost {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const html = marked.parse(content, { async: false }) as string

  return {
    slug,
    title: data.title ?? '',
    description: data.description ?? '',
    publishedAt: data.publishedAt ?? '',
    updatedAt: data.updatedAt,
    category: data.category ?? '',
    tags: data.tags ?? [],
    cover: data.cover,
    ogTitle: data.ogTitle,
    html,
    rawMarkdown: content,
  }
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs.readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    return readFrontmatter(slug)
  } catch {
    return null
  }
}

export function getAllBlogPosts(): BlogPost[] {
  return getAllBlogSlugs()
    .map((slug) => readFrontmatter(slug))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

/** 関連記事：同カテゴリ・同タグから N 件（自分自身は除く） */
export function getRelatedPosts(slug: string, limit = 3): BlogPostMeta[] {
  const all = getAllBlogPosts()
  const target = all.find((p) => p.slug === slug)
  if (!target) return []
  const others = all.filter((p) => p.slug !== slug)
  // スコア: 同カテゴリ +2, タグの一致1個ごとに +1
  const scored = others.map((p) => {
    let score = 0
    if (p.category === target.category) score += 2
    score += p.tags.filter((t) => target.tags.includes(t)).length
    return { post: p, score }
  })
  return scored
    .sort((a, b) => b.score - a.score || b.post.publishedAt.localeCompare(a.post.publishedAt))
    .slice(0, limit)
    .map(({ post }) => post)
}

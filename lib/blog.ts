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

/**
 * 詳細ページ用：未来日付の記事もデフォルトで返す（直接URLアクセスは許可）。
 * 一覧・sitemap には載らないが、記事内のリンクから辿った場合は読める。
 * これにより記事間の内部リンクが常に有効になる（404を回避）。
 *
 * もし「直接URLでも未来記事を完全に隠したい」場合は
 * getBlogPost(slug, { onlyPublished: true }) を渡す。
 */
export function getBlogPost(slug: string, opts: { onlyPublished?: boolean } = {}): BlogPost | null {
  try {
    const post = readFrontmatter(slug)
    if (opts.onlyPublished && !isPublished(post.publishedAt)) return null
    return post
  } catch {
    return null
  }
}

/**
 * 未来日付の記事は「予約投稿」として一覧から除外する。
 * publishedAt が今日（ローカル日付）より後の記事は出さない。
 * detail ページ（getBlogPost）は直接URLで触れるが、sitemap・一覧には載らない。
 */
function isPublished(publishedAt: string): boolean {
  if (!publishedAt) return true
  // 'YYYY-MM-DD' 比較で十分（ISO 文字列でも先頭10文字が日付）
  const today = new Date().toISOString().slice(0, 10)
  return publishedAt.slice(0, 10) <= today
}

export function getAllBlogPosts(includeFuture = false): BlogPost[] {
  return getAllBlogSlugs()
    .map((slug) => readFrontmatter(slug))
    .filter((p) => includeFuture || isPublished(p.publishedAt))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

/** 関連記事：同カテゴリ・同タグから N 件（自分自身は除く、未公開記事は表示しない） */
export function getRelatedPosts(slug: string, limit = 3): BlogPostMeta[] {
  const all = getAllBlogPosts() // 公開済みのみ
  // target が未来記事の場合は all に含まれないので、自分のメタを別途取得
  const target = all.find((p) => p.slug === slug) || readFrontmatter(slug)
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

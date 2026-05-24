import type { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog'
import { listCompareSlugs } from '@/lib/compare'

const SITE_URL = 'https://reanker.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // 公開ページのみ（ログイン後ページ・デモ・ログインは除外）
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,         lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/pricing`,  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blog`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/compare`,  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/contact`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE_URL}/terms`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE_URL}/privacy`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE_URL}/legal`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE_URL}/operator`, lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ]

  const posts = getAllBlogPosts().map<MetadataRoute.Sitemap[number]>((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const compares = listCompareSlugs().map<MetadataRoute.Sitemap[number]>((slug) => ({
    url: `${SITE_URL}/compare/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticPages, ...posts, ...compares]
}

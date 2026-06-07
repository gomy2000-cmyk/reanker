import type { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog'
import { listCompareSlugs } from '@/lib/compare'

const SITE_URL = 'https://reanker.com'

// sitemap はデフォルトで静的生成され、ビルド時点の publishedAt で内容が確定する。
// このままだと予約公開（未来日付）の記事が公開日を迎えても、再ビルドまで sitemap に載らない。
// ISR を有効化し最大1時間ごとに再生成することで、公開日到来後は再デプロイなしで自動反映される。
// （値はリテラルで静的解析可能である必要がある。runtime は既定の nodejs なので revalidate が有効。）
export const revalidate = 3600 // 1時間ごとに再検証

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

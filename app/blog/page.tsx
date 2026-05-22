import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { getAllBlogPosts } from '@/lib/blog'
import { MarketingHeader } from '@/components/MarketingHeader'
import { Footer } from '@/components/Footer'
import { BlogSidebar } from '@/components/blog/BlogSidebar'

export const metadata: Metadata = {
  title: 'ブログ',
  description: '競合監視・広報PR・マーケティングの実務に役立つ記事を公開しています。PR TIMES代替・Slack通知・クリッピングサービス比較など。',
  alternates: { canonical: 'https://reanker.com/blog' },
  openGraph: {
    title: 'ブログ｜ReAnker',
    description: '競合監視・広報PR・マーケティングの実務に役立つ記事。',
    url: 'https://reanker.com/blog',
    siteName: 'ReAnker',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ブログ｜ReAnker',
    description: '競合監視・広報PR・マーケティングの実務に役立つ記事。',
  },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export default async function BlogIndexPage() {
  const session = await getServerSession()
  const isAuthenticated = !!session?.user
  const posts = getAllBlogPosts()
  const recentPosts = posts.slice(0, 5)

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <MarketingHeader isAuthenticated={isAuthenticated} />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 pt-14 sm:pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-12">

            {/* === メインコンテンツ === */}
            <div className="min-w-0">
              <div className="mb-10">
                <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">BLOG</p>
                <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
                  競合監視と広報PRの実務ガイド
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  競合企業の動きを追う、リリースを書く、社内に共有する。
                  そんな日々の業務に役立つ実務的なナレッジを公開しています。
                </p>
              </div>

              {posts.length === 0 ? (
                <p className="text-sm text-gray-500">記事はまだありません。</p>
              ) : (
                <ul className="divide-y divide-gray-200 border-y border-gray-200">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block py-6 sm:py-7 hover:bg-gray-50/50 px-2 -mx-2 rounded-md transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[11px] text-[#378ADD] font-medium uppercase tracking-wide">{post.category}</span>
                          <span className="text-[11px] text-gray-400">·</span>
                          <span className="text-[11px] text-gray-500">{formatDate(post.publishedAt)}</span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight mb-2 leading-snug">
                          {post.title}
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                          {post.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* === サイドバー === */}
            <BlogSidebar recentPosts={recentPosts} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

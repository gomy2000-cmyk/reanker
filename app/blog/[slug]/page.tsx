import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import { getBlogPost, getAllBlogSlugs, getRelatedPosts, getAllBlogPosts } from '@/lib/blog'
import { MarketingHeader } from '@/components/MarketingHeader'
import { Footer } from '@/components/Footer'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import './blog-content.css'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Not Found' }

  return {
    title: { absolute: `${post.title}｜ReAnker` },
    description: post.description,
    openGraph: {
      title: post.ogTitle ?? post.title,
      description: post.description,
      url: `https://reanker.com/blog/${slug}`,
      siteName: 'ReAnker',
      locale: 'ja_JP',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ['ReAnker'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.ogTitle ?? post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://reanker.com/blog/${slug}`,
    },
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const session = await getServerSession()
  const isAuthenticated = !!session?.user
  const related = getRelatedPosts(slug, 3)
  const recentPosts = getAllBlogPosts().filter((p) => p.slug !== slug).slice(0, 5)

  // JSON-LD Article schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'ReAnker',
      url: 'https://reanker.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ReAnker',
      url: 'https://reanker.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://reanker.com/blog/${slug}`,
    },
    inLanguage: 'ja',
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <MarketingHeader isAuthenticated={isAuthenticated} />

      {/* JSON-LD 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 pt-6 sm:pt-10 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-12">

          <article className="min-w-0">
          {/* パンくず */}
          <div className="mb-6">
            <Link href="/blog" className="text-xs text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
              <ChevronLeft size={13} />
              ブログ一覧に戻る
            </Link>
          </div>

          {/* メタ */}
          <div className="flex items-center gap-3 mb-3 text-xs">
            <span className="text-[#378ADD] font-medium uppercase tracking-wide">{post.category}</span>
            <span className="text-gray-300">·</span>
            <time className="text-gray-500" dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>

          {/* タイトル */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>

          {/* ディスクリプション */}
          <p className="text-base text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-200">
            {post.description}
          </p>

          {/* タグ */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {post.tags.map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* 本文 */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* CTA */}
          <div className="mt-14 border border-gray-200 rounded-lg p-6 sm:p-7 bg-gray-50">
            <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">ReAnker について</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              競合のPR TIMES・Google Newsを毎日自動チェック
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              監視したい競合を登録するだけ。毎朝9時、前日の新規リリースだけをSlackやメールに自動配信します。
              月額300円から、個人や小規模チームでも本格的な競合監視を始められます。
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href={isAuthenticated ? '/dashboard' : '/login'}
                className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
              >
                {isAuthenticated ? 'ダッシュボードへ' : '無料ではじめる'}
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-white text-gray-700 text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
              >
                料金プランを見る
              </Link>
            </div>
          </div>

          {/* 関連記事 */}
          {related.length > 0 && (
            <div className="mt-14">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">関連記事</h3>
              <ul className="space-y-3">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px]">
                        <span className="text-[#378ADD] font-medium uppercase tracking-wide">{p.category}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-500">{formatDate(p.publishedAt)}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{p.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          </article>

          {/* === サイドバー === */}
          <BlogSidebar recentPosts={recentPosts} sticky />

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

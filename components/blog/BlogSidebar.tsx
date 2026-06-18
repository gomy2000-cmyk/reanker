import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { BlogPostMeta } from '@/lib/blog'

interface Props {
  recentPosts: BlogPostMeta[]
  categories?: Array<{ label: string; href: string; count?: number }>
  relatedKeywords?: string[]
  /** sticky 対応（PCのみ） */
  sticky?: boolean
}

const DEFAULT_CATEGORIES = [
  { label: '競合調査', href: '/blog' },
  { label: 'PR TIMES活用', href: '/blog' },
  { label: '広報・リリース分析', href: '/blog' },
  { label: 'マーケティングリサーチ', href: '/blog' },
  { label: 'リリース監視', href: '/blog' },
]

const DEFAULT_KEYWORDS = [
  '競合調査', '競合分析', 'PR TIMES', 'プレスリリース',
  'Google News', '広報チェック', 'リリース監視', 'マーケティング調査',
]

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

export function BlogSidebar({
  recentPosts,
  categories = DEFAULT_CATEGORIES,
  relatedKeywords = DEFAULT_KEYWORDS,
  sticky = false,
}: Props) {
  return (
    <aside
      className={sticky ? 'lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:pr-1' : ''}
    >
      <div className="space-y-5">
        {/* === 1. ReAnker 紹介カード === */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-2 leading-snug">
            競合のリリース、見逃していませんか？
          </h3>
          <p className="text-[12.5px] text-gray-600 leading-relaxed mb-4">
            ReAnker（リアンカー）は、PR TIMES・Google News（スタンダード以上では@Press・ValuePress・共同通信PRワイヤーも）から競合情報を自動取得し、重要な動きをSlack・メールで通知する競合リリース監視ツールです。
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 w-full bg-gray-900 hover:bg-gray-700 text-white text-[13px] font-medium px-4 py-2.5 rounded-md transition-colors"
          >
            ReAnkerを見る
            <ArrowRight size={13} />
          </Link>
        </section>

        {/* === 2. 無料ログインCTA === */}
        <section className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-2 leading-snug">
            まずは無料で競合監視を始める
          </h3>
          <p className="text-[12px] text-gray-600 leading-relaxed mb-4">
            アンカー3件まで無料で登録できます。競合企業や注目キーワードの新着情報をチェックしましょう。
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-[13px] font-medium px-4 py-2.5 rounded-md transition-colors shadow-sm"
          >
            <GoogleMiniIcon />
            Googleでログイン
          </Link>
        </section>

        {/* === 3. カテゴリ === */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="text-[11px] font-semibold text-gray-500 tracking-wide mb-3 uppercase">カテゴリ</h3>
          <ul className="divide-y divide-gray-100">
            {categories.map((c) => (
              <li key={c.label}>
                <Link
                  href={c.href}
                  className="flex items-center justify-between py-2.5 text-[13px] text-gray-700 hover:text-[#378ADD] transition-colors"
                >
                  <span>{c.label}</span>
                  {typeof c.count === 'number' && (
                    <span className="text-[11px] text-gray-400">{c.count}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* === 4. 最新記事 === */}
        {recentPosts.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="text-[11px] font-semibold text-gray-500 tracking-wide mb-3 uppercase">最新記事</h3>
            <ul className="divide-y divide-gray-100">
              {recentPosts.map((p) => (
                <li key={p.slug} className="py-3 first:pt-0 last:pb-0">
                  <Link href={`/blog/${p.slug}`} className="block group">
                    <p className="text-[13px] font-medium text-gray-900 leading-snug group-hover:text-[#378ADD] transition-colors line-clamp-2 mb-1.5">
                      {p.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
                      <span className="text-gray-300">·</span>
                      <span className="text-[#378ADD]">{p.category}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* === 5. 関連キーワード === */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 hidden sm:block">
          <h3 className="text-[11px] font-semibold text-gray-500 tracking-wide mb-3 uppercase">関連キーワード</h3>
          <div className="flex flex-wrap gap-1.5">
            {relatedKeywords.map((kw) => (
              <span
                key={kw}
                className="text-[11px] px-2 py-1 bg-gray-100 hover:bg-[#378ADD]/10 hover:text-[#378ADD] text-gray-700 rounded transition-colors cursor-default"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>
      </div>
    </aside>
  )
}

function GoogleMiniIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

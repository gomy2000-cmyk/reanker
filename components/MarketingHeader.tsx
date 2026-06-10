'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Wordmark } from './brand/Wordmark'

/**
 * マーケティングページ共通ヘッダー。
 * ログイン状態はクライアント側（useSession）で判定する。
 * サーバーで getServerSession を呼ぶとページ全体が動的レンダリングになり
 * 静的配信（CDNキャッシュ・正しい404ステータス）が壊れるため。
 * SSR時は未ログイン表示で出力し、セッション確認後に切り替わる。
 */
export function MarketingHeader() {
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-[80px] flex items-center justify-between">
        <Link href="/" className="flex items-center text-gray-900 hover:opacity-80 transition-opacity">
          <Wordmark height={64} />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[13px] text-gray-600">
          <a href="#product" className="hover:text-gray-900 transition-colors">プロダクト</a>
          <a href="#comparison" className="hover:text-gray-900 transition-colors">比較</a>
          <Link href="/pricing" className="hover:text-gray-900 transition-colors">料金</Link>
          <Link href="/blog" className="hover:text-gray-900 transition-colors">ブログ</Link>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">お問い合わせ</Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="text-[13px] bg-gray-900 hover:bg-gray-700 text-white px-3.5 py-1.5 rounded-md font-medium transition-colors"
            >
              ダッシュボードへ
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] text-gray-700 hover:text-gray-900 hidden sm:inline"
              >
                ログイン
              </Link>
              <Link
                href="/login"
                className="text-[13px] bg-gray-900 hover:bg-gray-700 text-white px-3.5 py-1.5 rounded-md font-medium transition-colors"
              >
                無料ではじめる
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

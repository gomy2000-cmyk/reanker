import Link from 'next/link'
import type { Metadata } from 'next'
import { Home, ArrowRight } from 'lucide-react'
import { Wordmark } from '@/components/brand/Wordmark'

export const metadata: Metadata = {
  title: 'ページが見つかりません',
  description: 'お探しのページは見つかりませんでした。URLが正しいかご確認ください。',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <Link href="/" className="text-gray-900 mb-8 hover:opacity-80 transition-opacity">
        <Wordmark height={24} />
      </Link>

      <p className="text-xs text-gray-400 font-mono mb-3">404</p>
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3 text-center">
        ページが見つかりません
      </h1>
      <p className="text-sm text-gray-600 text-center max-w-md mb-8 leading-relaxed">
        お探しのページは削除されたか、URLが変更された可能性があります。
      </p>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
        >
          <Home size={14} />
          ホームへ戻る
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
        >
          ブログを見る
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

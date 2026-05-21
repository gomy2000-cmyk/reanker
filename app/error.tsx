'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Anchor, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 本番では Sentry 等へ送信。現状は console に出力。
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Anchor size={20} className="text-[#378ADD]" strokeWidth={2.5} />
        <span className="font-semibold text-gray-900 text-[15px]">Reanker</span>
      </Link>

      <p className="text-xs text-gray-400 font-mono mb-3">ERROR</p>
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3 text-center">
        エラーが発生しました
      </h1>
      <p className="text-sm text-gray-600 text-center max-w-md mb-8 leading-relaxed">
        申し訳ありません。一時的な問題が発生しています。<br />
        しばらく時間をおいてから再度お試しください。
      </p>

      {error.digest && (
        <p className="text-[11px] text-gray-400 font-mono mb-6">エラーID: {error.digest}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
        >
          <RefreshCw size={14} />
          もう一度試す
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
        >
          <Home size={14} />
          ホームへ戻る
        </Link>
      </div>
    </div>
  )
}

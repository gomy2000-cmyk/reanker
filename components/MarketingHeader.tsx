import Link from 'next/link'
import { Anchor } from 'lucide-react'

interface Props {
  isAuthenticated?: boolean
}

export function MarketingHeader({ isAuthenticated = false }: Props) {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <Anchor size={20} className="text-[#378ADD]" />
          <span className="font-bold text-gray-900 text-sm tracking-tight">リアンカー</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-xs text-gray-600">
          <a href="#features" className="hover:text-[#378ADD] transition-colors">機能</a>
          <a href="#usecases" className="hover:text-[#378ADD] transition-colors">利用シーン</a>
          <Link href="/pricing" className="hover:text-[#378ADD] transition-colors">料金プラン</Link>
          <Link href="/contact" className="hover:text-[#378ADD] transition-colors">お問い合わせ</Link>
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="text-xs bg-[#378ADD] hover:bg-[#2d6db5] text-white px-3.5 py-1.5 rounded-lg font-medium transition-colors"
            >
              ダッシュボードへ
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1.5 hidden sm:inline"
              >
                ログイン
              </Link>
              <Link
                href="/login"
                className="text-xs bg-[#378ADD] hover:bg-[#2d6db5] text-white px-3.5 py-1.5 rounded-lg font-medium transition-colors"
              >
                無料で始める
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

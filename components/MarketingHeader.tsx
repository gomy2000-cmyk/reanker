import Link from 'next/link'
import { Anchor } from 'lucide-react'

interface Props {
  isAuthenticated?: boolean
}

export function MarketingHeader({ isAuthenticated = false }: Props) {
  return (
    <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#378ADD] rounded-lg flex items-center justify-center">
            <Anchor size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">リアンカー</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-gray-700">
          <a href="#features" className="hover:text-[#378ADD] transition-colors">機能</a>
          <a href="#reasons" className="hover:text-[#378ADD] transition-colors">選ばれる理由</a>
          <a href="#usecases" className="hover:text-[#378ADD] transition-colors">利用シーン</a>
          <Link href="/pricing" className="hover:text-[#378ADD] transition-colors">料金</Link>
          <a href="#faq" className="hover:text-[#378ADD] transition-colors">よくある質問</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="text-sm bg-[#378ADD] hover:bg-[#2d6db5] text-white px-4 py-2 rounded-full font-semibold transition-colors shadow-sm"
            >
              ダッシュボードへ
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1.5 hidden sm:inline"
              >
                ログイン
              </Link>
              <Link
                href="/login"
                className="text-sm bg-[#378ADD] hover:bg-[#2d6db5] text-white px-4 sm:px-5 py-2 rounded-full font-semibold transition-colors shadow-sm"
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

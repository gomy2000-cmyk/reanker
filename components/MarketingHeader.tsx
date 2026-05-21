import Link from 'next/link'
import { Anchor } from 'lucide-react'

interface Props {
  isAuthenticated?: boolean
}

export function MarketingHeader({ isAuthenticated = false }: Props) {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Anchor size={18} className="text-[#378ADD]" strokeWidth={2.5} />
          <span className="font-semibold text-gray-900 text-[15px] tracking-tight">Reanker</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[13px] text-gray-600">
          <a href="#product" className="hover:text-gray-900 transition-colors">プロダクト</a>
          <a href="#comparison" className="hover:text-gray-900 transition-colors">比較</a>
          <Link href="/pricing" className="hover:text-gray-900 transition-colors">料金</Link>
          <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
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

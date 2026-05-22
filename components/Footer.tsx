import Link from 'next/link'
import { Wordmark } from './brand/Wordmark'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div>
            <div className="text-gray-900 mb-2">
              <Wordmark height={18} />
            </div>
            <p className="text-xs text-gray-500">競合のプレスリリース・ニュースを自動監視。</p>
            <p className="text-[11px] text-gray-400 mt-2">© {new Date().getFullYear()} ReAnker</p>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
            <Link href="/login" className="text-gray-600 hover:text-[#378ADD]">ログイン</Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#378ADD]">お問い合わせ</Link>
            <Link href="/terms" className="text-gray-600 hover:text-[#378ADD]">利用規約</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-[#378ADD]">プライバシーポリシー</Link>
            <Link href="/legal" className="text-gray-600 hover:text-[#378ADD] col-span-2">特定商取引法に基づく表記</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

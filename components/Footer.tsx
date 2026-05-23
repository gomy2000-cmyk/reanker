import Link from 'next/link'
import { Wordmark } from './brand/Wordmark'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 sm:gap-10">
          {/* ブランド + 説明 */}
          <div>
            <div className="text-gray-900 mb-3">
              <Wordmark height={26} />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              競合のプレスリリースを毎日自動でチェックする <strong>競合リリース監視ツール</strong>。
              PR TIMES の新着リリースと Google News の関連報道を1ツールで。
            </p>
          </div>

          {/* サービス */}
          <div>
            <p className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-3">サービス</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="text-gray-600 hover:text-[#378ADD] transition-colors">トップ</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-[#378ADD] transition-colors">料金プラン</Link></li>
              <li><Link href="/compare" className="text-gray-600 hover:text-[#378ADD] transition-colors">他ツールとの比較</Link></li>
              <li><Link href="/login" className="text-gray-600 hover:text-[#378ADD] transition-colors">ログイン</Link></li>
            </ul>
          </div>

          {/* リソース */}
          <div>
            <p className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-3">リソース</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/blog" className="text-gray-600 hover:text-[#378ADD] transition-colors">ブログ</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-[#378ADD] transition-colors">お問い合わせ</Link></li>
            </ul>
          </div>

          {/* 法務 */}
          <div>
            <p className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-3">法務</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/terms" className="text-gray-600 hover:text-[#378ADD] transition-colors">利用規約</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-[#378ADD] transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/legal" className="text-gray-600 hover:text-[#378ADD] transition-colors">特定商取引法に基づく表記</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} ReAnker. All rights reserved.
          </p>
          <p className="text-[11px] text-gray-400">
            運営：Shoebill ／ お問い合わせ：<a href="mailto:support@reanker.com" className="hover:text-[#378ADD]">support@reanker.com</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

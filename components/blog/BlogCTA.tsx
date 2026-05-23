import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

interface Props {
  isAuthenticated?: boolean
}

/**
 * ブログ記事の最下部に常設する ReAnker サービス紹介CTA。
 * SEO流入の読者をサービス理解・登録・問い合わせに繋ぐ共通コンポーネント。
 */
export function BlogCTA({ isAuthenticated = false }: Props) {
  return (
    <aside
      aria-label="ReAnker のご案内"
      className="mt-14 border border-[#378ADD]/30 rounded-xl p-6 sm:p-8 bg-gradient-to-br from-[#378ADD]/[0.04] to-white"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="w-7 h-7 bg-[#378ADD]/10 text-[#378ADD] rounded-md flex items-center justify-center">
          <Sparkles size={15} />
        </span>
        <p className="text-xs text-[#378ADD] font-semibold tracking-wide">ReAnker のご案内</p>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight mb-3 leading-snug">
        競合のリリースを、毎日自動でチェックしませんか？
      </h2>

      <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed mb-6">
        ReAnker（リアンカー）は、競合企業のプレスリリースを毎日自動でチェックする <strong>競合リリース監視ツール</strong> です。
        PR TIMES の新着リリースと Google News の関連報道を1ツールでまとめて把握。
        新サービス・資金調達・業務提携などの発表を、毎朝1通の通知で見逃しません。
      </p>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <Link
          href={isAuthenticated ? '/dashboard' : '/login'}
          className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-3 rounded-md transition-colors"
        >
          {isAuthenticated ? 'ダッシュボードへ' : '無料で試してみる'}
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-medium px-5 py-3 rounded-md transition-colors"
        >
          サービス詳細を見る
        </Link>
      </div>

      <p className="text-[11px] text-gray-500 mt-4">
        月額300円（税抜）から / 無料プランあり / クレジットカード登録不要
      </p>
    </aside>
  )
}

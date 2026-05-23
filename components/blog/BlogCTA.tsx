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
        競合の動きを、毎日自動でチェックしませんか？
      </h2>

      <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed mb-6">
        ReAnker（リアンカー）は、PR TIMES や Google News などから競合企業・注目キーワードの新着情報を自動で収集し、
        必要な情報だけを通知できる競合モニタリングツールです。
        新サービスの発表、導入事例、資金調達、キャンペーン情報などを毎日チェックできます。
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

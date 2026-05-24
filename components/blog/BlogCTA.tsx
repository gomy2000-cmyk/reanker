import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Mail } from 'lucide-react'

interface Props {
  isAuthenticated?: boolean
  /** 'full' = bottom 用、画像 + 説明 + 2ボタン。'compact' = top/middle 用、横長で省スペース。 */
  variant?: 'full' | 'compact'
}

const TITLE = '競合のリリースを毎日自動取得「ReAnker（リアンカー）」'

/**
 * 記事の上部・中部・最下部の3箇所に置く共通CTA。
 * - full：最下部用。ダッシュボード画像 + 詳しい説明 + 2ボタン
 * - compact：上部・中部用。横長の小型、画像なし、1〜2ボタン
 */
export function BlogCTA({ isAuthenticated = false, variant = 'full' }: Props) {
  const ctaHref = isAuthenticated ? '/dashboard' : '/login'
  const ctaLabel = isAuthenticated ? 'ダッシュボードへ' : '無料で試してみる'

  if (variant === 'compact') {
    return (
      <aside
        aria-label="ReAnker のご案内"
        className="not-prose my-8 border border-[#378ADD]/30 rounded-lg bg-gradient-to-r from-[#378ADD]/[0.06] to-white p-4 sm:p-5"
      >
        <div className="flex items-center gap-3 mb-2.5">
          <span className="w-6 h-6 bg-[#378ADD]/10 text-[#378ADD] rounded flex items-center justify-center shrink-0">
            <Mail size={13} />
          </span>
          <p className="text-[15px] sm:text-base font-semibold text-gray-900 leading-snug">
            {TITLE}
          </p>
        </div>
        <p className="text-[13px] sm:text-sm text-gray-700 leading-relaxed mb-3.5 ml-9">
          PR TIMES と Google News の競合リリースを毎朝1通でお届けする <strong>競合リリース監視ツール</strong>。月額300円から。
        </p>
        <div className="ml-9 flex flex-wrap gap-2">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-[13px] font-medium px-4 py-2 rounded-md transition-colors"
          >
            {ctaLabel}
            <ArrowRight size={13} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[#378ADD] hover:text-[#2d6db5] text-[13px] font-medium px-3 py-2"
          >
            サービス詳細を見る →
          </Link>
        </div>
      </aside>
    )
  }

  // variant === 'full' (記事最下部用)
  return (
    <aside
      aria-label="ReAnker のご案内"
      className="not-prose mt-14 border border-[#378ADD]/30 rounded-xl bg-gradient-to-br from-[#378ADD]/[0.04] to-white overflow-hidden"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 bg-[#378ADD]/10 text-[#378ADD] rounded-md flex items-center justify-center">
            <Sparkles size={15} />
          </span>
          <p className="text-xs text-[#378ADD] font-semibold tracking-wide">ReAnker のご案内</p>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight mb-3 leading-snug">
          {TITLE}
        </h2>

        <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed mb-5">
          ReAnker は、競合企業のプレスリリースを毎日自動でチェックする <strong>競合リリース監視ツール</strong> です。
          PR TIMES の新着リリースと Google News の関連報道を1ツールでまとめて把握。
          新サービス・資金調達・業務提携などの発表を、毎朝1通の通知で見逃しません。
        </p>

        {/* ダッシュボードのイメージ */}
        <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 bg-white">
          <Image
            src="/brand/dashboard-mock.svg"
            alt="ReAnker ダッシュボードのイメージ：PR TIMES と Google News の競合リリースが時系列で表示される"
            width={800}
            height={480}
            className="w-full h-auto"
            unoptimized
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-3 rounded-md transition-colors"
          >
            {ctaLabel}
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
      </div>
    </aside>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

// ============================================================
// CTA 設定オブジェクト — ここを変えるだけで全箇所に反映される
// ============================================================
const CTA_CONFIG = {
  /** ブランドラベル（小見出し） */
  badge: 'ReAnker のご案内',

  /** メインタイトル */
  title: '競合のリリースを毎日自動取得「ReAnker（リアンカー）」',

  /** compact バリアント（上部・中部）の説明文 */
  compactDescription:
    'PR TIMES と Google News の競合リリースを毎朝1通でお届けする競合リリース監視ツール。',

  /** full バリアント（最下部）の説明文 */
  fullDescription:
    'ReAnker は、競合企業のプレスリリースを毎日自動でチェックする競合リリース監視ツールです。' +
    'PR TIMES の新着リリースと Google News の関連報道を1ツールでまとめて把握。' +
    'スタンダード以上なら @Press・ValuePress・共同通信PRワイヤーも監視対象に追加できます。' +
    '新サービス・資金調達・業務提携などの発表を、毎朝1通の通知で見逃しません。',

  /** 料金表示テキスト */
  pricing: 'フリー（無料）〜スタンダード（月額300円・税抜）で利用可能 / クレジットカード登録不要',

  /** コンパクト版の補足テキスト（料金の下など） */
  compactPricing: '無料〜1日10円（月額300円）で利用可能',

  /** ダッシュボード画像 */
  image: {
    src: '/brand/dashboard-mock.svg',
    alt: 'ReAnker ダッシュボードのイメージ：PR TIMES と Google News の競合リリースが時系列で表示される',
    width: 800,
    height: 480,
  },

  /** CTAボタン */
  cta: {
    guest:         { href: '/login',      label: '無料で試してみる' },
    authenticated: { href: '/dashboard',  label: 'ダッシュボードへ' },
  },

  /** サービス詳細リンク */
  serviceLink: { href: '/', label: 'サービス詳細を見る' },
} as const
// ============================================================

interface Props {
  isAuthenticated?: boolean
  /**
   * 'full'    = 記事最下部用。画像 + 詳細説明 + 2ボタン。
   * 'compact' = 記事上部・中部用。左テキスト + 右画像の横長レイアウト。
   */
  variant?: 'full' | 'compact'
}

export function BlogCTA({ isAuthenticated = false, variant = 'full' }: Props) {
  const { href: ctaHref, label: ctaLabel } = isAuthenticated
    ? CTA_CONFIG.cta.authenticated
    : CTA_CONFIG.cta.guest

  /* ── compact（記事上部・中部） ── */
  if (variant === 'compact') {
    return (
      <aside
        aria-label="ReAnker のご案内"
        className="not-prose my-8 border border-[#378ADD]/30 rounded-xl bg-gradient-to-r from-[#378ADD]/[0.07] to-white overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-stretch">

          {/* 左：テキスト＋ボタン */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center gap-3">
            {/* バッジ */}
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 bg-[#378ADD]/10 text-[#378ADD] rounded flex items-center justify-center shrink-0">
                <Sparkles size={11} />
              </span>
              <span className="text-[11px] text-[#378ADD] font-semibold tracking-wide uppercase">
                {CTA_CONFIG.badge}
              </span>
            </div>

            {/* タイトル */}
            <p className="text-[14px] sm:text-[15px] font-semibold text-gray-900 leading-snug">
              {CTA_CONFIG.title}
            </p>

            {/* 説明文 */}
            <p className="text-[12px] sm:text-[13px] text-gray-600 leading-relaxed">
              {CTA_CONFIG.compactDescription}
              {' '}
              <span className="text-[#378ADD] font-medium">{CTA_CONFIG.compactPricing}</span>。
            </p>

            {/* ボタン */}
            <div className="flex flex-wrap gap-2">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-[12px] font-medium px-4 py-2 rounded-md transition-colors"
              >
                {ctaLabel}
                <ArrowRight size={12} />
              </Link>
              <Link
                href={CTA_CONFIG.serviceLink.href}
                className="inline-flex items-center gap-1 text-[#378ADD] hover:text-[#2d6db5] text-[12px] font-medium px-2 py-2"
              >
                {CTA_CONFIG.serviceLink.label} →
              </Link>
            </div>
          </div>

          {/* 右：ダッシュボード画像 */}
          <div className="sm:w-[42%] sm:max-w-[240px] bg-white border-t sm:border-t-0 sm:border-l border-[#378ADD]/20 flex items-center justify-center p-3 shrink-0">
            <Image
              src={CTA_CONFIG.image.src}
              alt={CTA_CONFIG.image.alt}
              width={CTA_CONFIG.image.width}
              height={CTA_CONFIG.image.height}
              className="w-full h-auto rounded-md"
              unoptimized
            />
          </div>

        </div>
      </aside>
    )
  }

  /* ── full（記事最下部） ── */
  return (
    <aside
      aria-label="ReAnker のご案内"
      className="not-prose mt-14 border border-[#378ADD]/30 rounded-xl bg-gradient-to-br from-[#378ADD]/[0.04] to-white overflow-hidden"
    >
      <div className="p-6 sm:p-8">
        {/* バッジ */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 bg-[#378ADD]/10 text-[#378ADD] rounded-md flex items-center justify-center">
            <Sparkles size={15} />
          </span>
          <p className="text-xs text-[#378ADD] font-semibold tracking-wide">{CTA_CONFIG.badge}</p>
        </div>

        {/* タイトル */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight mb-3 leading-snug">
          {CTA_CONFIG.title}
        </h2>

        {/* 説明文 */}
        <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed mb-5">
          {CTA_CONFIG.fullDescription}
        </p>

        {/* ダッシュボード画像 */}
        <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 bg-white">
          <Image
            src={CTA_CONFIG.image.src}
            alt={CTA_CONFIG.image.alt}
            width={CTA_CONFIG.image.width}
            height={CTA_CONFIG.image.height}
            className="w-full h-auto"
            unoptimized
          />
        </div>

        {/* ボタン */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-3 rounded-md transition-colors"
          >
            {ctaLabel}
            <ArrowRight size={15} />
          </Link>
          <Link
            href={CTA_CONFIG.serviceLink.href}
            className="inline-flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-medium px-5 py-3 rounded-md transition-colors"
          >
            {CTA_CONFIG.serviceLink.label}
          </Link>
        </div>

        {/* 料金注記 */}
        <p className="text-[11px] text-gray-500 mt-4">{CTA_CONFIG.pricing}</p>
      </div>
    </aside>
  )
}

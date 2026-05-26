'use client'

import Link from 'next/link'
import { Plus, Anchor, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react'

/**
 * 新規ユーザー向けの3ステップ進行バナー。
 * DBの状態から現在のステップを自動判定するので、トラッキング状態を持たない。
 *
 * Step 1: アンカー0個 → 「最初のアンカーを登録しよう」
 * Step 2: アンカー有・items0件 → 「アンカーを開いて記事を取得しよう」
 * Step 3: ハイドした anchor page で表示（別コンポーネント AnchorOnboardingHint）
 */

interface Props {
  anchorCount: number
  totalItems: number
  firstAnchorId?: string
}

function StepDot({ done, active, label, num }: { done: boolean; active: boolean; label: string; num: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
          done
            ? 'bg-emerald-500 text-white'
            : active
              ? 'bg-[#378ADD] text-white ring-2 ring-[#378ADD]/30'
              : 'bg-gray-200 text-gray-400'
        }`}
      >
        {done ? <CheckCircle2 size={12} /> : num}
      </div>
      <span className={`text-[11px] ${done ? 'text-emerald-600' : active ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  )
}

export function OnboardingBanner({ anchorCount, totalItems, firstAnchorId }: Props) {
  // 全アンカー登録 & 記事収集済み → バナー非表示
  if (anchorCount > 0 && totalItems > 0) return null

  const step: 1 | 2 = anchorCount === 0 ? 1 : 2

  return (
    <section className="mb-5 bg-gradient-to-br from-[#378ADD]/5 to-[#378ADD]/10 border border-[#378ADD]/20 rounded-xl p-5">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <div className="flex-1 min-w-[280px]">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            {step === 1 ? '👋 ReAnker へようこそ！' : '🎯 もう一歩で取得開始！'}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {step === 1
              ? '監視したい競合・キーワードを登録すると、PR TIMES と Google News から自動で記事を集めます。'
              : 'アンカーを開いて「今すぐ取得」ボタンを押すと、その場で記事を取得できます。'}
          </p>
        </div>

        {step === 1 ? (
          <Link
            href="/anchor/edit"
            className="inline-flex items-center gap-1.5 bg-[#378ADD] hover:bg-[#2d6db5] text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <Plus size={14} />
            最初のアンカーを登録
          </Link>
        ) : (
          <Link
            href={firstAnchorId ? `/anchor/${firstAnchorId}` : '/dashboard'}
            className="inline-flex items-center gap-1.5 bg-[#378ADD] hover:bg-[#2d6db5] text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <Anchor size={14} />
            アンカーを開く
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* ステップインジケーター */}
      <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-[#378ADD]/15">
        <StepDot num={1} done={step > 1} active={step === 1} label="アンカー登録" />
        <span className="text-gray-300 text-[10px]">─</span>
        <StepDot num={2} done={false} active={step === 2} label="アンカーを開く" />
        <span className="text-gray-300 text-[10px]">─</span>
        <StepDot num={3} done={false} active={false} label="今すぐ取得" />
      </div>
    </section>
  )
}

/**
 * アンカーページ用の Step 3 ヒント。
 * items が空のとき、画面上部に「今すぐ取得を押してね」を表示する。
 */
export function AnchorOnboardingHint({ hasItems }: { hasItems: boolean }) {
  if (hasItems) return null
  return (
    <div className="mb-4 bg-gradient-to-r from-[#378ADD]/5 to-[#378ADD]/10 border border-[#378ADD]/20 rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#378ADD] text-white flex items-center justify-center">
          <RefreshCw size={14} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">あと一歩！「今すぐ取得」ボタンを押しましょう</p>
          <p className="text-xs text-gray-600 mt-0.5">
            右上の <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">今すぐ取得</span> ボタンを押すと、PR TIMES と Google News から記事を集めて表示します。
          </p>
        </div>
      </div>
      <ArrowRight size={20} className="text-[#378ADD] hidden sm:block" />
    </div>
  )
}

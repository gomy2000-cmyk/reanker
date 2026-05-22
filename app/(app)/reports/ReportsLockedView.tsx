'use client'

import { FileBarChart, Lock, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { trackBeginCheckout, trackUpgradeClick } from '@/lib/analytics'

export function ReportsLockedView() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    trackUpgradeClick('reports_locked')
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.url) {
        trackBeginCheckout('standard')
        window.location.href = data.url
      } else {
        alert(data.message ?? 'アップグレード処理に失敗しました。')
        setLoading(false)
      }
    } catch {
      alert('通信エラーが発生しました。')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-1">REPORTS</p>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight mb-2">
          サマリ・レポート
        </h1>
        <p className="text-sm text-gray-600">
          登録したアンカーの動きを、週次・月次でまとめて確認できます。
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
          <Lock size={20} className="text-gray-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          週次・月次サマリは Standard プランで利用できます
        </h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
          毎日の競合ニュースを、週ごと・月ごとに自動で整理します。<br />
          月300円（税抜）で、競合の動きをまとめて確認できます。
        </p>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-6 py-2.5 rounded-md transition-colors disabled:opacity-60"
        >
          {loading ? '処理中...' : 'Standardにアップグレード'}
          <ArrowRight size={14} />
        </button>

        <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs text-gray-600">
          <Bullet icon={<FileBarChart size={14} className="text-[#378ADD]" />} title="週次サマリ" desc="月〜日の動きを週初めにまとめて配信" />
          <Bullet icon={<FileBarChart size={14} className="text-[#378ADD]" />} title="月次サマリ" desc="月初に前月の動向を集約" />
          <Bullet icon={<FileBarChart size={14} className="text-[#378ADD]" />} title="Markdown出力" desc="社内共有・議事録にそのまま貼れる" />
        </div>
      </div>
    </div>
  )
}

function Bullet({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="font-medium text-gray-900">{title}</span>
      </div>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  )
}

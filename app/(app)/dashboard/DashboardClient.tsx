'use client'

import Link from 'next/link'
import { useMemo, useState, useRef, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { FileDown, Circle } from 'lucide-react'
import type { User, PickKeyword, ItemWithKeyword } from '@/lib/types'

interface Props {
  user: User
  keywords: PickKeyword[]
  items: ItemWithKeyword[]
}

// ResponsiveContainer の代替。マウント時と window resize 時のみ幅を測定し、
// 連続 ResizeObserver ループを避ける（ヘッドレス環境でのハング対策 + 軽量化）。
function Chart({ height, children }: { height: number; children: (w: number) => React.ReactElement }) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const measure = () => setWidth(ref.current?.clientWidth ?? 0)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  return (
    <div ref={ref} style={{ width: '100%', height }}>
      {width > 0 ? children(width) : null}
    </div>
  )
}

const PRESETS = [
  { label: '今日', days: 0 },
  { label: '7日', days: 7 },
  { label: '30日', days: 30 },
  { label: '今月', days: -1 },
]

const SOURCE_LABEL = { prtimes: 'PR TIMES', googlenews: 'Google News' }
const SOURCE_COLOR = { prtimes: 'bg-blue-100 text-blue-700', googlenews: 'bg-gray-100 text-gray-600' }

export function DashboardClient({ user, keywords, items }: Props) {
  const [preset, setPreset] = useState(7)
  const [tableLimit, setTableLimit] = useState(10)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const filteredItems = useMemo(() => {
    if (preset === 0) {
      const today = new Date().toISOString().split('T')[0]
      return items.filter((i) => i.published_at === today)
    }
    if (preset === -1) {
      const month = new Date().toISOString().slice(0, 7)
      return items.filter((i) => i.published_at.startsWith(month))
    }
    const since = new Date()
    since.setDate(since.getDate() - preset)
    const sinceStr = since.toISOString().split('T')[0]
    return items.filter((i) => i.published_at >= sinceStr)
  }, [items, preset])

  const unreadItems = filteredItems.filter((i) => !i.is_read).slice(0, 10)

  // 曜日別グラフデータ
  const weekdayData = useMemo(() => {
    const days = ['日', '月', '火', '水', '木', '金', '土']
    const counts: Record<string, { day: string; prtimes: number; googlenews: number }> = {}
    days.forEach((d) => (counts[d] = { day: d, prtimes: 0, googlenews: 0 }))
    filteredItems.forEach((i) => {
      const day = days[new Date(i.published_at).getDay()]
      if (i.source === 'prtimes') counts[day].prtimes++
      else counts[day].googlenews++
    })
    return days.map((d) => counts[d])
  }, [filteredItems])

  // 時間帯別グラフデータ
  const hourData = useMemo(() => {
    const counts = Array.from({ length: 24 }, (_, h) => ({ hour: `${h}`, count: 0 }))
    filteredItems.forEach((i) => {
      if (i.published_hour != null) counts[i.published_hour].count++
    })
    return counts
  }, [filteredItems])

  // サマリーテーブル
  const summary = useMemo(() => {
    return keywords.map((kw) => {
      const kwItems = filteredItems.filter((i) => i.pickkw_id === kw.id)
      const pt = kwItems.filter((i) => i.source === 'prtimes').length
      const gn = kwItems.filter((i) => i.source === 'googlenews').length
      const unread = kwItems.filter((i) => !i.is_read).length
      const lastDate = kwItems[0]?.published_at ?? '—'
      return { ...kw, total: kwItems.length, pt, gn, unread, lastDate }
    })
  }, [keywords, filteredItems])

  const handleExport = () => {
    if (user.plan === 'free') {
      setShowUpgradeModal(true)
      return
    }
    // CSV生成
    const rows = [
      ['アンカー名', 'ソース', 'タイトル', 'URL', '公開日'],
      ...filteredItems.map((i) => [
        i.pick_keywords?.name ?? '',
        SOURCE_LABEL[i.source],
        i.title,
        i.url,
        i.published_at,
      ]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reanker-dashboard-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-xs text-gray-500 mt-0.5">{filteredItems.length}件の記事</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setPreset(p.days)}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  preset === p.days
                    ? 'bg-[#378ADD] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              user.plan === 'free'
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-pointer hover:bg-gray-100'
                : 'border-[#378ADD] text-[#378ADD] hover:bg-[#378ADD]/5 bg-white'
            }`}
            title={user.plan === 'free' ? 'スタンダードプラン限定' : 'CSVでダウンロード'}
          >
            <FileDown size={13} />
            エクスポート
          </button>
        </div>
      </div>

      {/* 未読の新規記事 */}
      <section className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">未読の新規記事</h2>
        {unreadItems.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center">未読の記事はありません</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {unreadItems.map((item) => (
              <li key={item.id} className="py-2.5 flex items-center gap-3">
                <Circle size={6} className="fill-[#378ADD] text-[#378ADD] shrink-0" />
                <span className="text-xs text-gray-500 w-24 truncate shrink-0">
                  {item.pick_keywords?.name}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${SOURCE_COLOR[item.source]}`}>
                  {SOURCE_LABEL[item.source]}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-800 hover:text-[#378ADD] flex-1 truncate"
                >
                  {item.title}
                </a>
                <span className="text-xs text-gray-400 shrink-0">{item.published_at}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* グラフ2カラム */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <section className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">取得件数（曜日別）</h2>
          <Chart height={180}>
            {(w) => (
              <BarChart width={w} height={180} data={weekdayData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="prtimes" stackId="a" fill="#378ADD" name="PR TIMES" isAnimationActive={false} />
                <Bar dataKey="googlenews" stackId="a" fill="#9ca3af" name="Google News" isAnimationActive={false} />
              </BarChart>
            )}
          </Chart>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">投稿時間帯の分布</h2>
          <Chart height={180}>
            {(w) => (
              <BarChart width={w} height={180} data={hourData}>
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
                <Bar dataKey="count" fill="#378ADD" name="件数" isAnimationActive={false} />
              </BarChart>
            )}
          </Chart>
        </section>
      </div>

      {/* アンカー別サマリー */}
      <section className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">アンカー別サマリー</h2>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            {[5, 10, 15].map((n) => (
              <button
                key={n}
                onClick={() => setTableLimit(n)}
                className={`px-2.5 py-1 text-xs ${
                  tableLimit === n ? 'bg-[#378ADD] text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {n}件
              </button>
            ))}
          </div>
        </div>

        {summary.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-500 mb-3">アンカーがまだありません</p>
            <Link
              href="/anchor/edit"
              className="text-xs bg-[#378ADD] hover:bg-[#2d6db5] text-white px-4 py-2 rounded-lg inline-block"
            >
              最初のアンカーを登録
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100">
                <th className="text-left py-2 font-medium">アンカー名</th>
                <th className="text-right py-2 font-medium w-16">取得数</th>
                <th className="text-right py-2 font-medium w-20">PR TIMES</th>
                <th className="text-right py-2 font-medium w-24">Google News</th>
                <th className="text-right py-2 font-medium w-16">未読</th>
                <th className="text-right py-2 font-medium w-24">最終取得日</th>
              </tr>
            </thead>
            <tbody>
              {summary.slice(0, tableLimit).map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5">
                    <Link href={`/anchor/${row.id}`} className="text-gray-800 hover:text-[#378ADD]">
                      {row.name}
                    </Link>
                  </td>
                  <td className="text-right text-gray-600">{row.total}</td>
                  <td className="text-right text-gray-600">{row.pt}</td>
                  <td className="text-right text-gray-600">{row.gn}</td>
                  <td className="text-right">
                    {row.unread > 0 ? (
                      <span className="text-[#378ADD] font-medium">{row.unread}</span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                  <td className="text-right text-gray-500 text-xs">{row.lastDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* アップグレードモーダル */}
      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  )
}

function UpgradeModal({ onClose }: { onClose: () => void }) {
  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        alert(data.message ?? 'アップグレード処理に失敗しました。時間をおいて再度お試しください。')
      }
    } catch (e) {
      alert('通信エラーが発生しました。')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 mb-1">スタンダードプランへアップグレード</h3>
        <p className="text-xs text-gray-500 mb-5">¥300/月で全機能が使えます</p>

        <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="font-semibold text-gray-700 mb-2">フリー</p>
            <ul className="space-y-1 text-gray-500">
              <li>アンカー 3件</li>
              <li>隔日更新</li>
              <li>メール通知</li>
              <li className="text-gray-300">エクスポート不可</li>
            </ul>
          </div>
          <div className="border-2 border-[#378ADD] rounded-lg p-3 bg-[#378ADD]/5">
            <p className="font-semibold text-[#378ADD] mb-2">スタンダード</p>
            <ul className="space-y-1 text-gray-700">
              <li>アンカー 無制限</li>
              <li>毎日更新</li>
              <li>Slack・メール通知</li>
              <li>CSV・PDFエクスポート</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleUpgrade}
          className="w-full bg-[#378ADD] hover:bg-[#2d6db5] text-white font-medium py-2.5 rounded-lg"
        >
          アップグレードする
        </button>
        <button onClick={onClose} className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2 py-2">
          あとで
        </button>
      </div>
    </div>
  )
}

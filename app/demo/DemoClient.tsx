'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Legend } from 'recharts'
import {
  LayoutDashboard, ChevronDown, ChevronRight, Anchor as AnchorIcon, FileBarChart,
  Settings, Lock, FileDown, Circle, Check, Bookmark, Trash2, RefreshCw,
  CheckCircle2, ExternalLink, ArrowRight, Sparkles, Plus, Clock,
} from 'lucide-react'
import { Wordmark } from '@/components/brand/Wordmark'
import type { PickKeyword, ItemWithKeyword, Source } from '@/lib/types'
import type { MockFetchSeed } from '@/lib/mock'
import { pushEvent } from '@/lib/analytics'

const SOURCE_LABEL: Record<Source, string> = { prtimes: 'PR TIMES', googlenews: 'Google News' }
const SOURCE_COLOR: Record<Source, string> = { prtimes: 'bg-blue-100 text-blue-700', googlenews: 'bg-gray-100 text-gray-600' }
const IMPORTANCE_COLOR: Record<string, string> = {
  高: 'bg-red-50 text-red-600',
  中: 'bg-amber-50 text-amber-700',
  低: 'bg-gray-100 text-gray-500',
}

const PRESETS = [
  { label: '今日', days: 0 },
  { label: '7日', days: 7 },
  { label: '30日', days: 30 },
  { label: '今月', days: -1 },
]

// ResponsiveContainer の代替（DashboardClient と同じ手法）
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

function exportCsv(rows: string[][], filename: string) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

interface Props {
  keywords: PickKeyword[]
  initialItems: ItemWithKeyword[]
  fetchPool: Record<string, MockFetchSeed[]>
}

export function DemoClient({ keywords, initialItems, fetchPool }: Props) {
  // 'dashboard' またはアンカーID。ルーティングは使わずデモ内で完結させる
  const [view, setView] = useState<string>('dashboard')
  const [items, setItems] = useState(initialItems)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [fetchedAnchors, setFetchedAnchors] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  const openAnchor = (anchorId: string, itemId?: string) => {
    setView(anchorId)
    const target = itemId
      ? items.find((i) => i.id === itemId)
      : items.find((i) => i.pickkw_id === anchorId)
    setSelectedId(target?.id ?? null)
    if (target && !target.is_read) markRead(target.id, true)
  }

  const markRead = (id: string, read: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_read: read } : i)))
  }

  const toggleClip = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_clipped: !i.is_clipped } : i)))
  }

  const deleteItem = (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    if (!confirm(`「${item.title.slice(0, 50)}${item.title.length > 50 ? '…' : ''}」を削除しますか？（デモなのでリロードで戻ります）`)) return
    setItems((prev) => prev.filter((i) => i.id !== id))
    if (selectedId === id) {
      const rest = items.filter((i) => i.id !== id && i.pickkw_id === item.pickkw_id)
      setSelectedId(rest[0]?.id ?? null)
    }
  }

  // 「今すぐ取得」シミュレーション: アンカーごとに1回だけ新着を注入
  const simulateFetch = async (anchorId: string): Promise<{ saved: number; message: string }> => {
    await new Promise((r) => setTimeout(r, 1100))
    if (fetchedAnchors[anchorId]) {
      return { saved: 0, message: '新着なし - すべて取得済みです' }
    }
    const seeds = fetchPool[anchorId] ?? []
    const kw = keywords.find((k) => k.id === anchorId)!
    const now = new Date()
    const newItems: ItemWithKeyword[] = seeds.map((s, i) => ({
      id: `fetched-${anchorId}-${i}`,
      pickkw_id: anchorId,
      source: s.source,
      title: s.title,
      url: s.source === 'prtimes' ? 'https://prtimes.jp/' : 'https://news.google.com/',
      summary: s.summary,
      published_at: now.toISOString().split('T')[0],
      published_hour: now.getHours(),
      is_read: false,
      is_clipped: false,
      notified: false,
      deleted_at: null,
      category: s.category,
      importance: s.importance,
      ai_summary: s.summary,
      importance_reason: null,
      created_at: '',
      pick_keywords: kw,
    }))
    setItems((prev) => [...newItems, ...prev])
    setFetchedAnchors((prev) => ({ ...prev, [anchorId]: true }))
    const bySource = seeds.reduce<Record<string, number>>((acc, s) => {
      acc[s.source] = (acc[s.source] ?? 0) + 1
      return acc
    }, {})
    const summary = Object.entries(bySource)
      .map(([src, n]) => `${SOURCE_LABEL[src as Source]}: 新規${n}件`)
      .join(' / ')
    return { saved: seeds.length, message: `✓ 新規 ${seeds.length}件保存（${summary}）` }
  }

  const handleCta = (location: string) => {
    pushEvent('demo_cta_click', { location })
  }

  const currentAnchor = keywords.find((k) => k.id === view) ?? null

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* トップバー */}
      <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2 text-gray-900">
          <Wordmark height={20} />
          <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">DEMO</span>
          <span className="text-[11px] text-gray-400 hidden sm:inline">サンプルデータで自由に操作できます</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            onClick={() => handleCta('header_login')}
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            ログイン
          </Link>
          <Link
            href="/login"
            onClick={() => handleCta('header_signup')}
            className="text-xs bg-[#378ADD] hover:bg-[#2d6db5] text-white font-medium px-3.5 py-1.5 rounded-lg"
          >
            無料で始める
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <DemoSideNav
          keywords={keywords}
          view={view}
          onNavigate={(v) => (v === 'dashboard' ? setView('dashboard') : openAnchor(v))}
          onLocked={(label) => showToast(`「${label}」は無料登録後にご利用いただけます`)}
        />

        <main className="flex-1 overflow-y-auto p-6 pb-24">
          {currentAnchor ? (
            <AnchorView
              keyword={currentAnchor}
              items={items.filter((i) => i.pickkw_id === currentAnchor.id)}
              selectedId={selectedId}
              fetched={!!fetchedAnchors[currentAnchor.id]}
              onSelect={(item) => {
                setSelectedId(item.id)
                if (!item.is_read) markRead(item.id, true)
              }}
              onToggleRead={(item) => markRead(item.id, !item.is_read)}
              onToggleClip={(item) => toggleClip(item.id)}
              onDelete={(item) => deleteItem(item.id)}
              onFetch={() => simulateFetch(currentAnchor.id)}
            />
          ) : (
            <DashboardView
              keywords={keywords}
              items={items}
              onOpenAnchor={openAnchor}
            />
          )}
        </main>
      </div>

      {/* 下部CTAバー */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-gray-900/95 backdrop-blur text-white px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <Sparkles size={16} className="text-amber-300 shrink-0" />
            <p className="text-xs sm:text-sm truncate">
              これはサンプルデータの体験デモです。<span className="text-white/70 hidden md:inline">自社の競合・キーワードを登録すると、毎日自動で記事が集まります。</span>
            </p>
          </div>
          <Link
            href="/login"
            onClick={() => handleCta('bottom_bar')}
            className="inline-flex items-center gap-1.5 bg-[#378ADD] hover:bg-[#2d6db5] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap shrink-0"
          >
            無料で始める
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* トースト */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
          <Lock size={12} className="text-amber-300" />
          {toast}
          <Link href="/login" onClick={() => handleCta('toast')} className="underline text-[#9cc8f0] hover:text-white ml-1">
            登録する
          </Link>
        </div>
      )}
    </div>
  )
}

/* ───────────────────────── サイドナビ（デモ用） ───────────────────────── */

function DemoSideNav({
  keywords, view, onNavigate, onLocked,
}: {
  keywords: PickKeyword[]
  view: string
  onNavigate: (view: string) => void
  onLocked: (label: string) => void
}) {
  const [listOpen, setListOpen] = useState(true)

  return (
    <nav className="w-[220px] bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="flex-1 overflow-y-auto py-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-2 px-3 py-2 text-sm mx-1 rounded-md w-[calc(100%-8px)] text-left transition-colors ${
            view === 'dashboard' ? 'bg-[#378ADD]/10 text-[#378ADD] font-medium' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard size={15} />
          ダッシュボード
        </button>

        <div className="mt-1">
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 mx-1">
            <AnchorIcon size={14} />
            <span className="font-medium">アンカー</span>
          </div>

          <div className="ml-4 pl-2 border-l border-gray-100 mb-1">
            <button
              onClick={() => onLocked('アンカー登録')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs mx-1 rounded-md w-[calc(100%-8px)] text-left text-gray-400 hover:bg-gray-50 transition-colors"
            >
              <Plus size={12} />
              アンカー登録
              <Lock size={10} className="ml-auto" />
            </button>

            <div className="mt-0.5">
              <button
                onClick={() => setListOpen(!listOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs w-full text-left text-gray-600 hover:bg-gray-50 mx-1 rounded-md transition-colors"
              >
                {listOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                <span>アンカー一覧</span>
                <span className="ml-auto text-[10px] text-gray-400">{keywords.length}</span>
              </button>

              {listOpen && (
                <div className="ml-3 pl-2 border-l border-gray-100 mt-0.5">
                  {keywords.map((kw) => (
                    <button
                      key={kw.id}
                      onClick={() => onNavigate(kw.id)}
                      className={`flex items-center justify-between w-[calc(100%-8px)] px-2.5 py-1.5 mx-1 rounded-md text-[11px] text-left transition-colors ${
                        view === kw.id ? 'bg-[#378ADD]/10 text-[#378ADD]' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{kw.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onLocked('サマリ・レポート')}
          className="flex items-center gap-2 px-3 py-2 text-sm mx-1 rounded-md w-[calc(100%-8px)] text-left text-gray-400 hover:bg-gray-50 transition-colors"
        >
          <FileBarChart size={15} />
          サマリ・レポート
          <Lock size={11} className="ml-auto" />
        </button>
      </div>

      <div className="border-t border-gray-100 py-2">
        <button
          onClick={() => onLocked('設定')}
          className="flex items-center gap-2 px-3 py-2 text-sm mx-1 rounded-md w-[calc(100%-8px)] text-left text-gray-400 hover:bg-gray-50 transition-colors"
        >
          <Settings size={15} />
          設定
          <Lock size={11} className="ml-auto" />
        </button>
      </div>
    </nav>
  )
}

/* ───────────────────────── ダッシュボード ───────────────────────── */

function DashboardView({
  keywords, items, onOpenAnchor,
}: {
  keywords: PickKeyword[]
  items: ItemWithKeyword[]
  onOpenAnchor: (anchorId: string, itemId?: string) => void
}) {
  const [preset, setPreset] = useState(7)

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

  const hourData = useMemo(() => {
    const counts = Array.from({ length: 24 }, (_, h) => ({ hour: `${h}`, count: 0 }))
    filteredItems.forEach((i) => {
      if (i.published_hour != null) counts[i.published_hour].count++
    })
    return counts
  }, [filteredItems])

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
    exportCsv(
      [
        ['アンカー名', 'ソース', 'タイトル', 'カテゴリ', '重要度', '公開日'],
        ...filteredItems.map((i) => [
          i.pick_keywords?.name ?? '',
          SOURCE_LABEL[i.source],
          i.title,
          i.category,
          i.importance,
          i.published_at,
        ]),
      ],
      `reanker-demo-dashboard-${new Date().toISOString().split('T')[0]}.csv`,
    )
  }

  return (
    <div>
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
                  preset === p.days ? 'bg-[#378ADD] text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#378ADD] text-[#378ADD] hover:bg-[#378ADD]/5 bg-white transition-colors"
            title="CSVでダウンロード（デモでも実際に動きます）"
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
                <span className="text-xs text-gray-500 w-24 truncate shrink-0">{item.pick_keywords?.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${SOURCE_COLOR[item.source]}`}>
                  {SOURCE_LABEL[item.source]}
                </span>
                <button
                  onClick={() => onOpenAnchor(item.pickkw_id, item.id)}
                  className="text-sm text-gray-800 hover:text-[#378ADD] flex-1 truncate text-left"
                >
                  {item.title}
                </button>
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
        <h2 className="text-sm font-semibold text-gray-700 mb-3">アンカー別サマリー</h2>
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
            {summary.map((row) => (
              <tr
                key={row.id}
                onClick={() => onOpenAnchor(row.id)}
                className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-2.5 text-gray-800 hover:text-[#378ADD]">{row.name}</td>
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
        <p className="text-[11px] text-gray-400 mt-3">行をクリックすると、そのアンカーの記事一覧が開きます</p>
      </section>
    </div>
  )
}

/* ───────────────────────── アンカー詳細（記事一覧 + プレビュー） ───────────────────────── */

function AnchorView({
  keyword, items, selectedId, fetched, onSelect, onToggleRead, onToggleClip, onDelete, onFetch,
}: {
  keyword: PickKeyword
  items: ItemWithKeyword[]
  selectedId: string | null
  fetched: boolean
  onSelect: (item: ItemWithKeyword) => void
  onToggleRead: (item: ItemWithKeyword) => void
  onToggleClip: (item: ItemWithKeyword) => void
  onDelete: (item: ItemWithKeyword) => void
  onFetch: () => Promise<{ saved: number; message: string }>
}) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'clipped'>('all')
  const [fetching, setFetching] = useState(false)
  const [fetchResult, setFetchResult] = useState<{ kind: 'ok'; message: string } | null>(null)

  const counts = useMemo(() => ({
    all: items.length,
    unread: items.filter((i) => !i.is_read).length,
    read: items.filter((i) => i.is_read).length,
    clipped: items.filter((i) => i.is_clipped).length,
  }), [items])

  const filtered = useMemo(() => {
    if (filter === 'unread') return items.filter((i) => !i.is_read)
    if (filter === 'read') return items.filter((i) => i.is_read)
    if (filter === 'clipped') return items.filter((i) => i.is_clipped)
    return items
  }, [items, filter])

  const selected = items.find((i) => i.id === selectedId) ?? filtered[0] ?? null

  const handleFetch = async () => {
    setFetching(true)
    setFetchResult(null)
    const result = await onFetch()
    setFetchResult({ kind: 'ok', message: result.message })
    setFetching(false)
    setTimeout(() => setFetchResult(null), 8000)
  }

  const handleExport = () => {
    exportCsv(
      [
        ['ソース', 'タイトル', 'カテゴリ', '重要度', 'URL', '公開日', '既読'],
        ...filtered.map((i) => [
          SOURCE_LABEL[i.source], i.title, i.category, i.importance, i.url, i.published_at, i.is_read ? '既読' : '未読',
        ]),
      ],
      `reanker-demo-${keyword.name}-${new Date().toISOString().split('T')[0]}.csv`,
    )
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{keyword.name}</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {keyword.type === 'service' ? 'サービス名' : keyword.type === 'keyword' ? 'キーワード' : 'ドメイン'}
            ・<span className="font-mono">{keyword.query_value}</span>
            {fetched && (
              <>
                <span className="mx-1.5">・</span>
                <Clock size={10} className="inline-block mr-1 -mt-0.5 text-gray-400" />
                最終取得 たった今
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleFetch}
            disabled={fetching}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            title="デモでも体験できます（サンプルの新着記事を取得します）"
          >
            <RefreshCw size={13} className={fetching ? 'animate-spin' : ''} />
            {fetching ? '取得中...' : '今すぐ取得'}
          </button>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs bg-white">
            {([
              { key: 'all', label: 'すべて', count: counts.all },
              { key: 'unread', label: '未読', count: counts.unread },
              { key: 'read', label: '既読', count: counts.read },
              { key: 'clipped', label: 'クリップ', count: counts.clipped },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 transition-colors ${
                  filter === f.key ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f.label}
                <span className={`ml-1 text-[10px] ${filter === f.key ? 'text-white/70' : 'text-gray-400'}`}>{f.count}</span>
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#378ADD] text-[#378ADD] hover:bg-[#378ADD]/5 bg-white transition-colors"
          >
            <FileDown size={13} />
            エクスポート
          </button>
        </div>
      </div>

      {fetchResult && (
        <div className="mb-4 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg border bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
          <span>{fetchResult.message}</span>
        </div>
      )}

      {/* メインエリア 左右2ペイン */}
      <div className="flex gap-5 items-start">
        {/* 左: 記事テーブル */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center px-6">
              <p className="text-sm text-gray-500">該当する記事がありません</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-xs text-gray-500">
                  <th className="text-center py-2 pl-3 w-7"></th>
                  <th className="text-center py-2 w-9"></th>
                  <th className="text-center py-2 w-9"></th>
                  <th className="text-left py-2 font-medium">タイトル</th>
                  <th className="text-left py-2 font-medium w-24">ソース</th>
                  <th className="text-left py-2 font-medium w-20">公開日</th>
                  <th className="text-center py-2 w-9 pr-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className={`group border-b border-gray-50 cursor-pointer transition-colors ${
                      selected?.id === item.id
                        ? 'bg-[#378ADD]/5'
                        : item.is_read
                          ? 'bg-gray-50/30 hover:bg-gray-50'
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="pl-3 py-2.5 text-center">
                      {!item.is_read && <Circle size={6} className="fill-[#378ADD] text-[#378ADD] inline-block" />}
                    </td>
                    <td className="py-2.5 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleClip(item) }}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                          item.is_clipped ? 'text-amber-500' : 'text-gray-300 hover:text-gray-500'
                        }`}
                        title={item.is_clipped ? 'クリップを外す' : 'クリップする'}
                      >
                        <Bookmark size={14} fill={item.is_clipped ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="py-2.5 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleRead(item) }}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                          item.is_read ? 'text-[#378ADD]' : 'text-gray-300 hover:text-gray-500'
                        }`}
                        title={item.is_read ? '未読に戻す' : '既読にする'}
                      >
                        <Check size={14} />
                      </button>
                    </td>
                    <td className="py-2.5 pr-2 pl-1">
                      <span className={`text-sm truncate block max-w-[380px] ${item.is_read ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
                        {item.title}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SOURCE_COLOR[item.source]} ${item.is_read ? 'opacity-60' : ''}`}>
                        {SOURCE_LABEL[item.source]}
                      </span>
                    </td>
                    <td className={`py-2.5 text-xs ${item.is_read ? 'text-gray-400' : 'text-gray-500'}`}>{item.published_at}</td>
                    <td className="py-2.5 pr-3 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item) }}
                        className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="この記事を削除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {filtered.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
              {filtered.length}件
            </div>
          )}
        </div>

        {/* 右: プレビューペイン */}
        <aside className="w-[440px] bg-white border border-gray-200 rounded-xl shrink-0 sticky top-4 self-start max-h-[calc(100vh-140px)] overflow-y-auto hidden lg:block">
          {selected ? (
            <article>
              <div className="w-full h-40 bg-gradient-to-br from-[#378ADD]/10 to-gray-100 rounded-t-xl flex items-center justify-center">
                <span className={`text-xs px-2 py-1 rounded font-medium ${SOURCE_COLOR[selected.source]}`}>
                  {SOURCE_LABEL[selected.source]}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3 text-xs flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded font-medium ${SOURCE_COLOR[selected.source]}`}>
                    {SOURCE_LABEL[selected.source]}
                  </span>
                  <span className="text-gray-500">{selected.published_at}</span>
                  {selected.published_hour != null && (
                    <span className="text-gray-400">{String(selected.published_hour).padStart(2, '0')}:00</span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-3 leading-snug">{selected.title}</h3>

                {/* AI分類バッジ */}
                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#378ADD]/10 text-[#378ADD] font-medium">
                    {selected.category}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${IMPORTANCE_COLOR[selected.importance] ?? IMPORTANCE_COLOR['低']}`}>
                    重要度: {selected.importance}
                  </span>
                </div>

                {selected.ai_summary && (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-4">
                    <p className="text-[10px] text-gray-400 font-medium mb-1 flex items-center gap-1">
                      <Sparkles size={10} className="text-[#378ADD]" />
                      AI要約
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{selected.ai_summary}</p>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <span
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 cursor-not-allowed font-medium"
                    title="デモのため外部リンクは無効です"
                  >
                    <ExternalLink size={14} />
                    記事を開く（デモでは無効）
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => onToggleClip(selected)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                        selected.is_clipped
                          ? 'border-amber-400 bg-amber-50 text-amber-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Bookmark size={12} fill={selected.is_clipped ? 'currentColor' : 'none'} />
                      {selected.is_clipped ? 'クリップ済み' : 'クリップ'}
                    </button>
                    <button
                      onClick={() => onToggleRead(selected)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                        selected.is_read
                          ? 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          : 'border-[#378ADD] text-[#378ADD] hover:bg-[#378ADD]/5'
                      }`}
                    >
                      {selected.is_read ? '未読に戻す' : '既読にする'}
                    </button>
                    <button
                      onClick={() => onDelete(selected)}
                      className="ml-auto flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} />
                      削除
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <div className="p-8 text-center">
              <p className="text-xs text-gray-400">左の記事をクリックすると<br />ここにプレビューが表示されます</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

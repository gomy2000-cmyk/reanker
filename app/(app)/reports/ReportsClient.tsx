'use client'

import { useState, useEffect } from 'react'
import {
  FileBarChart, Copy, CheckCircle2, ExternalLink, Loader2, ChevronDown, FileText,
} from 'lucide-react'
import type { Report } from '@/lib/types'

interface ReportListItem {
  id: string
  type: 'weekly' | 'monthly'
  period_start: string
  period_end: string
  title: string
  total_items: number
}

interface Props {
  initialReport: Report | null
  initialType: 'weekly' | 'monthly'
  weeklyList: ReportListItem[]
  monthlyList: ReportListItem[]
}

const IMPORTANCE_COLOR = {
  '高': 'bg-blue-50 text-blue-700 border-blue-200',
  '中': 'bg-gray-100 text-gray-700 border-gray-200',
  '低': 'bg-gray-50 text-gray-500 border-gray-200',
}

const SOURCE_COLOR = {
  prtimes: 'bg-blue-100 text-blue-700',
  googlenews: 'bg-gray-100 text-gray-600',
}

export function ReportsClient({ initialReport, initialType, weeklyList, monthlyList }: Props) {
  const [type, setType] = useState<'weekly' | 'monthly'>(initialType)
  const [report, setReport] = useState<Report | null>(initialReport)
  const [loading, setLoading] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'plain' | 'md'>('idle')

  const currentList = type === 'weekly' ? weeklyList : monthlyList

  // タブ切替時、選択中なければ最新を取得
  useEffect(() => {
    let cancelled = false
    if (initialType === type && initialReport) return
    setLoading(true)
    fetch(`/api/reports?type=${type}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setReport(data.report ?? null)
          setLoading(false)
        }
      })
      .catch(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  const loadReport = async (periodStart: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reports?type=${type}&start=${periodStart}`)
      const data = await res.json()
      setReport(data.report ?? null)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPlain = async () => {
    if (!report) return
    const text = buildPlainSummary(report)
    await navigator.clipboard.writeText(text)
    setCopyState('plain')
    setTimeout(() => setCopyState('idle'), 2000)
  }

  const handleCopyMarkdown = async () => {
    if (!report) return
    const md = buildMarkdownSummary(report)
    await navigator.clipboard.writeText(md)
    setCopyState('md')
    setTimeout(() => setCopyState('idle'), 2000)
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-5">
        <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-1">REPORTS</p>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight mb-2">
          サマリ・レポート
        </h1>
        <p className="text-sm text-gray-600">
          登録したアンカーの動きを、週次・月次でまとめて確認できます。
        </p>
      </div>

      {/* タブ */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => setType('weekly')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm transition-colors ${
              type === 'weekly' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileBarChart size={14} />
            週次サマリ
          </button>
          <button
            onClick={() => setType('monthly')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm transition-colors ${
              type === 'monthly' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileBarChart size={14} />
            月次サマリ
          </button>
        </div>

        {/* 期間選択 */}
        {currentList.length > 0 && (
          <div className="relative">
            <select
              value={report?.period_start ?? ''}
              onChange={(e) => loadReport(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg pl-3 pr-8 py-2 bg-white appearance-none text-gray-700 cursor-pointer hover:border-gray-300"
            >
              {currentList.map((r) => (
                <option key={r.id} value={r.period_start}>
                  {r.title}（{r.total_items}件）
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      ) : !report ? (
        <EmptyState type={type} />
      ) : (
        <div className="space-y-5">
          {/* 期間 + コピーボタン */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs text-gray-500">対象期間</p>
              <p className="text-base font-semibold text-gray-900">
                {formatJP(report.period_start)}〜{formatJP(report.period_end)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPlain}
                className="flex items-center gap-1.5 text-xs border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md transition-colors"
              >
                {copyState === 'plain' ? <CheckCircle2 size={12} className="text-green-600" /> : <Copy size={12} />}
                {copyState === 'plain' ? 'コピーしました' : 'サマリをコピー'}
              </button>
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 text-xs border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md transition-colors"
              >
                {copyState === 'md' ? <CheckCircle2 size={12} className="text-green-600" /> : <FileText size={12} />}
                {copyState === 'md' ? 'コピーしました' : 'Markdownでコピー'}
              </button>
            </div>
          </div>

          {/* サマリーカード4つ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="取得記事数" value={`${report.total_items}件`} />
            <StatCard label="未読記事数" value={`${report.unread_items}件`} />
            <StatCard label="動きが多いアンカー" value={report.top_anchor_name ?? '—'} sub={report.top_anchor_name ? `${getAnchorCount(report)}件` : undefined} />
            <StatCard label="最多カテゴリ" value={report.top_category ?? '—'} sub={report.top_category ? `${report.category_counts?.[report.top_category] ?? 0}件` : undefined} />
          </div>

          {/* ハイライト */}
          {report.highlights && report.highlights.length > 0 && (
            <Section title={type === 'weekly' ? '今週のハイライト' : '今月のハイライト'}>
              <ul className="space-y-2">
                {report.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-[10px] font-bold text-[#378ADD] bg-[#378ADD]/10 w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-gray-800 leading-snug">{h.text}</p>
                      {h.reason && <p className="text-[11px] text-gray-400 mt-0.5">{h.reason}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* アンカー別サマリ */}
          {report.anchor_summaries && report.anchor_summaries.length > 0 && (
            <Section title="アンカー別サマリ">
              <div className="grid sm:grid-cols-2 gap-3">
                {report.anchor_summaries.map((a) => (
                  <div key={a.anchor_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <p className="text-sm font-semibold text-gray-900">{a.anchor_name}</p>
                      <p className="text-xs text-gray-500">{a.total}件</p>
                    </div>
                    {a.main_categories.length > 0 && (
                      <p className="text-[11px] text-gray-500 mb-3">
                        主なカテゴリ: {a.main_categories.join('、')}
                      </p>
                    )}
                    {a.notable_titles.length > 0 && (
                      <ul className="space-y-1 mb-3">
                        {a.notable_titles.map((t, i) => (
                          <li key={i} className="text-xs text-gray-700 leading-snug flex items-start gap-1">
                            <span className="text-gray-300">・</span>
                            <a href={t.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#378ADD] truncate">
                              {t.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    <a
                      href={`/anchor/${a.anchor_id}`}
                      className="text-[11px] text-[#378ADD] hover:underline inline-flex items-center gap-1"
                    >
                      記事一覧を見る <ExternalLink size={10} />
                    </a>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* カテゴリ別 */}
          {report.category_counts && Object.keys(report.category_counts).length > 0 && (
            <Section title="カテゴリ別の動き">
              <CategoryBars counts={report.category_counts} />
            </Section>
          )}

          {/* 注目記事一覧 */}
          {report.notable_items && report.notable_items.length > 0 && (
            <Section title="注目記事">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-xs text-gray-500">
                      <th className="text-left py-2 px-3 font-medium w-14">重要度</th>
                      <th className="text-left py-2 px-3 font-medium">タイトル</th>
                      <th className="text-left py-2 px-3 font-medium w-32">カテゴリ</th>
                      <th className="text-left py-2 px-3 font-medium w-24">アンカー</th>
                      <th className="text-left py-2 px-3 font-medium w-24">ソース</th>
                      <th className="text-left py-2 px-3 font-medium w-20">公開日</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.notable_items.map((it) => (
                      <tr key={it.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="py-2 px-3">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${IMPORTANCE_COLOR[it.importance]}`}>
                            {it.importance}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <a href={it.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-[#378ADD] truncate block max-w-[420px]">
                            {it.title}
                          </a>
                        </td>
                        <td className="py-2 px-3 text-xs text-gray-600">{it.category}</td>
                        <td className="py-2 px-3 text-xs text-gray-600 truncate max-w-[100px]">{it.anchor_name}</td>
                        <td className="py-2 px-3">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SOURCE_COLOR[it.source]}`}>
                            {it.source === 'prtimes' ? 'PR TIMES' : 'Google News'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-xs text-gray-500">{it.published_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-[11px] text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900 truncate">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">{title}</h2>
      {children}
    </section>
  )
}

function CategoryBars({ counts }: { counts: Record<string, number> }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const max = entries[0]?.[1] ?? 1
  return (
    <div className="space-y-2">
      {entries.map(([cat, n]) => (
        <div key={cat} className="flex items-center gap-3 text-xs">
          <div className="w-32 text-gray-700 truncate shrink-0">{cat}</div>
          <div className="flex-1 bg-gray-100 rounded h-5 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 bg-[#378ADD]/70" style={{ width: `${(n / max) * 100}%` }} />
          </div>
          <div className="w-12 text-right text-gray-700 font-medium tabular-nums">{n}件</div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ type }: { type: 'weekly' | 'monthly' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
      <FileBarChart size={32} className="text-gray-300 mx-auto mb-3" />
      <p className="text-sm text-gray-700 font-medium mb-1">まだレポートがありません</p>
      <p className="text-xs text-gray-500 leading-relaxed">
        アンカーを登録すると、{type === 'weekly' ? '週次' : '月次'}サマリが自動で作成されます。<br />
        {type === 'weekly'
          ? '最初の週次サマリは、次の月曜日 9:00 に生成されます。'
          : '最初の月次サマリは、翌月1日 9:00 に生成されます。'}
      </p>
    </div>
  )
}

function getAnchorCount(report: Report): number {
  if (!report.top_anchor_name) return 0
  return report.anchor_summaries?.find((a) => a.anchor_name === report.top_anchor_name)?.total ?? 0
}

function formatJP(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`
}

function buildPlainSummary(r: Report): string {
  const lines: string[] = []
  lines.push(`【ReAnker ${r.type === 'weekly' ? '週次' : '月次'}サマリ】 ${formatJP(r.period_start)}〜${formatJP(r.period_end)}`)
  lines.push('')
  lines.push(`■ 概要`)
  lines.push(`・取得記事数: ${r.total_items}件`)
  lines.push(`・未読記事数: ${r.unread_items}件`)
  if (r.top_anchor_name) lines.push(`・動きが多いアンカー: ${r.top_anchor_name}`)
  if (r.top_category) lines.push(`・最多カテゴリ: ${r.top_category}`)

  if (r.highlights?.length) {
    lines.push('')
    lines.push(`■ ハイライト`)
    for (const h of r.highlights) lines.push(`・${h.text}`)
  }

  if (r.anchor_summaries?.length) {
    lines.push('')
    lines.push(`■ アンカー別`)
    for (const a of r.anchor_summaries) {
      lines.push(`・${a.anchor_name}: ${a.total}件（${a.main_categories.join('、') || '—'}）`)
    }
  }

  return lines.join('\n')
}

function buildMarkdownSummary(r: Report): string {
  const lines: string[] = []
  lines.push(`# ReAnker ${r.type === 'weekly' ? '週次' : '月次'}サマリ`)
  lines.push('')
  lines.push(`対象期間：${formatJP(r.period_start)}〜${formatJP(r.period_end)}`)
  lines.push('')
  lines.push(`## 概要`)
  lines.push(`- 取得記事数：${r.total_items}件`)
  lines.push(`- 未読記事数：${r.unread_items}件`)
  if (r.top_anchor_name) lines.push(`- 動きが多いアンカー：${r.top_anchor_name}`)
  if (r.top_category) lines.push(`- 最多カテゴリ：${r.top_category}`)

  if (r.highlights?.length) {
    lines.push('')
    lines.push(`## ${r.type === 'weekly' ? '今週' : '今月'}のハイライト`)
    for (const h of r.highlights) lines.push(`- ${h.text}`)
  }

  if (r.anchor_summaries?.length) {
    lines.push('')
    lines.push(`## アンカー別サマリ`)
    for (const a of r.anchor_summaries) {
      lines.push(`### ${a.anchor_name}`)
      lines.push(`- 取得記事：${a.total}件`)
      if (a.main_categories.length) {
        lines.push(`- 主なカテゴリ：${a.main_categories.join('、')}`)
      }
      if (a.notable_titles.length) {
        lines.push(`- 注目記事：`)
        for (const t of a.notable_titles) {
          lines.push(`  - [${t.title}](${t.url})`)
        }
      }
      lines.push('')
    }
  }

  if (r.category_counts && Object.keys(r.category_counts).length) {
    lines.push(`## カテゴリ別の動き`)
    const entries = Object.entries(r.category_counts).sort((a, b) => b[1] - a[1])
    for (const [c, n] of entries) lines.push(`- ${c}：${n}件`)
  }

  return lines.join('\n')
}

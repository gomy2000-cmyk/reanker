'use client'

import { useState } from 'react'
import { Users, FileText, Anchor, AlertCircle, TrendingUp, Crown } from 'lucide-react'

interface UserRow {
  id: string
  plan: string
  created_at: string
  has_stripe: boolean
  anchors: number
  items: number
  items_read: number
  items_clipped: number
  last_fetch_at: string | null
  has_error: boolean
}

interface AnchorRow {
  user_short: string
  name_masked: string
  type: string
  sources: string[]
  items: number
  last_fetch_at: string | null
  last_status: string | null
  created_at: string
}

interface DailyStat {
  date: string
  total_runs: number
  ok: number
  partial: number
  error: number
  total_saved: number
}

interface ErrorRow {
  started_at: string
  status: string
  issues: string[]
}

interface Props {
  summary: {
    users_total: number
    users_free: number
    users_standard: number
    users_new_24h: number
    users_with_error: number
    anchors_total: number
    items_total: number
  }
  users: UserRow[]
  anchors: AnchorRow[]
  dailyStats: DailyStat[]
  errors: ErrorRow[]
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function timeAgo(iso: string | null): string {
  if (!iso) return '未取得'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'たった今'
  if (m < 60) return `${m}分前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}時間前`
  const d = Math.floor(h / 24)
  return `${d}日前`
}

function Stat({ icon, label, value, sub, intent }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string;
  intent?: 'default' | 'good' | 'warn' | 'bad'
}) {
  const color = {
    default: 'text-gray-900',
    good: 'text-emerald-600',
    warn: 'text-amber-600',
    bad: 'text-red-600',
  }[intent ?? 'default']
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
        {icon}
        {label}
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

export function AdminDashboard({ summary, users, anchors, dailyStats, errors }: Props) {
  const [tab, setTab] = useState<'users' | 'anchors' | 'errors'>('users')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">管理ダッシュボード</h1>
          <p className="text-xs text-gray-500 mt-1">
            運営者専用・個人情報は表示しません（ID は匿名化、アンカー名は文字数のみ）
          </p>
        </header>

        {/* サマリ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Stat
            icon={<Users size={12} />}
            label="ユーザー総数"
            value={summary.users_total}
            sub={`Free ${summary.users_free} / Standard ${summary.users_standard}`}
          />
          <Stat
            icon={<TrendingUp size={12} />}
            label="24h 新規"
            value={`+${summary.users_new_24h}`}
            intent={summary.users_new_24h > 0 ? 'good' : 'default'}
          />
          <Stat
            icon={<Anchor size={12} />}
            label="アンカー総数"
            value={summary.anchors_total}
            sub={`記事 ${summary.items_total.toLocaleString()} 件`}
          />
          <Stat
            icon={<AlertCircle size={12} />}
            label="24h エラーユーザー"
            value={summary.users_with_error}
            intent={summary.users_with_error > 0 ? 'warn' : 'good'}
          />
        </div>

        {/* 直近7日の取得サマリ */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">直近7日の取得サマリ</h2>
          {dailyStats.length === 0 ? (
            <p className="text-xs text-gray-400">取得データなし</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left pb-2">日付</th>
                  <th className="text-right pb-2">実行</th>
                  <th className="text-right pb-2 text-emerald-600">OK</th>
                  <th className="text-right pb-2 text-amber-600">Partial</th>
                  <th className="text-right pb-2 text-red-600">Error</th>
                  <th className="text-right pb-2">保存合計</th>
                </tr>
              </thead>
              <tbody>
                {dailyStats.map((s) => (
                  <tr key={s.date} className="text-xs border-b border-gray-50 last:border-0">
                    <td className="py-2 font-mono text-gray-600">{s.date}</td>
                    <td className="py-2 text-right text-gray-700">{s.total_runs}</td>
                    <td className="py-2 text-right text-emerald-700">{s.ok}</td>
                    <td className="py-2 text-right text-amber-700">{s.partial || '—'}</td>
                    <td className="py-2 text-right text-red-700">{s.error || '—'}</td>
                    <td className="py-2 text-right text-gray-700 font-medium">{s.total_saved.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* タブ */}
        <div className="flex gap-1 mb-3 text-xs">
          <button
            onClick={() => setTab('users')}
            className={`px-3 py-1.5 rounded-md ${tab === 'users' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            ユーザー ({users.length})
          </button>
          <button
            onClick={() => setTab('anchors')}
            className={`px-3 py-1.5 rounded-md ${tab === 'anchors' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            アンカー ({anchors.length})
          </button>
          <button
            onClick={() => setTab('errors')}
            className={`px-3 py-1.5 rounded-md ${tab === 'errors' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            最近のエラー ({errors.length})
          </button>
        </div>

        {/* ユーザー一覧 */}
        {tab === 'users' && (
          <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
                <tr>
                  <th className="text-left px-4 py-2">ID</th>
                  <th className="text-left px-4 py-2">Plan</th>
                  <th className="text-right px-4 py-2">アンカー</th>
                  <th className="text-right px-4 py-2">記事</th>
                  <th className="text-right px-4 py-2">既読</th>
                  <th className="text-right px-4 py-2">クリップ</th>
                  <th className="text-left px-4 py-2">最終取得</th>
                  <th className="text-left px-4 py-2">登録</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="text-xs border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-gray-700">{u.id}</td>
                    <td className="px-4 py-2">
                      {u.plan === 'standard' ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#378ADD]/10 text-[#378ADD] rounded text-[10px] font-medium">
                          <Crown size={10} /> Standard
                        </span>
                      ) : (
                        <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">Free</span>
                      )}
                      {u.has_stripe && u.plan === 'free' && (
                        <span className="ml-1 text-[10px] text-amber-600" title="Stripe customer 存在（過去課金あり）">●</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-700">{u.anchors}</td>
                    <td className="px-4 py-2 text-right text-gray-700">{u.items.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-gray-500">{u.items_read}</td>
                    <td className="px-4 py-2 text-right text-gray-500">{u.items_clipped}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {timeAgo(u.last_fetch_at)}
                      {u.has_error && <AlertCircle size={11} className="inline-block ml-1 text-red-500" />}
                    </td>
                    <td className="px-4 py-2 text-gray-500">{fmtDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* アンカー一覧 */}
        {tab === 'anchors' && (
          <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
                <tr>
                  <th className="text-left px-4 py-2">ユーザー</th>
                  <th className="text-left px-4 py-2">名前長さ</th>
                  <th className="text-left px-4 py-2">タイプ</th>
                  <th className="text-left px-4 py-2">ソース</th>
                  <th className="text-right px-4 py-2">記事</th>
                  <th className="text-left px-4 py-2">最終取得</th>
                  <th className="text-left px-4 py-2">作成</th>
                </tr>
              </thead>
              <tbody>
                {anchors.map((a, idx) => (
                  <tr key={idx} className="text-xs border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-gray-700">{a.user_short}</td>
                    <td className="px-4 py-2 text-gray-500">{a.name_masked}</td>
                    <td className="px-4 py-2 text-gray-500">{a.type}</td>
                    <td className="px-4 py-2 text-gray-500">{a.sources.join(', ')}</td>
                    <td className={`px-4 py-2 text-right font-medium ${a.items === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                      {a.items.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {timeAgo(a.last_fetch_at)}
                      {a.last_status === 'error' && (
                        <span className="ml-1 text-red-500" title="最終取得エラー">●</span>
                      )}
                      {a.last_status === 'partial' && (
                        <span className="ml-1 text-amber-500" title="一部失敗">●</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-500">{fmtDate(a.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* エラー一覧 */}
        {tab === 'errors' && (
          <section className="bg-white border border-gray-200 rounded-xl p-5">
            {errors.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">直近10件にエラーなし 🎉</p>
            ) : (
              <ul className="space-y-3">
                {errors.map((e, idx) => (
                  <li key={idx} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        e.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {e.status}
                      </span>
                      <span className="text-gray-500">{fmtDate(e.started_at)}</span>
                    </div>
                    <ul className="text-xs text-gray-700 mt-1.5 ml-1 space-y-0.5">
                      {e.issues.map((iss, i) => <li key={i}>• {iss}</li>)}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

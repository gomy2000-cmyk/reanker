'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileDown, Check, Circle, ExternalLink, Sliders, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import type { User, PickKeyword, Item } from '@/lib/types'

interface Props {
  user: User
  keyword: PickKeyword
  initialItems: Item[]
}

const SOURCE_LABEL = { prtimes: 'PR TIMES', googlenews: 'Google News' }
const SOURCE_COLOR = { prtimes: 'bg-blue-100 text-blue-700', googlenews: 'bg-gray-100 text-gray-600' }

export function AnchorClient({ user, keyword, initialItems }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [pageSize, setPageSize] = useState(25)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Item | null>(initialItems[0] ?? null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [fetchResult, setFetchResult] = useState<{ kind: 'ok' | 'err'; message: string } | null>(null)

  const handleFetchNow = async () => {
    setFetching(true)
    setFetchResult(null)
    try {
      const res = await fetch(`/api/anchor/${keyword.id}/fetch`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setFetchResult({ kind: 'err', message: data.error ?? '取得に失敗しました' })
      } else {
        const { found = 0, saved = 0, skipped = 0 } = data
        if (saved > 0) {
          setFetchResult({ kind: 'ok', message: `新着 ${saved}件を取得しました（既存 ${skipped}件はスキップ）` })
          // 新着があったら一覧をリロード
          router.refresh()
        } else if (found > 0) {
          setFetchResult({ kind: 'ok', message: `新着なし（取得 ${found}件はすべて取得済）` })
        } else {
          setFetchResult({ kind: 'ok', message: '取得対象の記事がありませんでした' })
        }
      }
    } catch (e: any) {
      setFetchResult({ kind: 'err', message: '通信エラーが発生しました' })
    } finally {
      setFetching(false)
      // 5秒後にメッセージを消す
      setTimeout(() => setFetchResult(null), 5000)
    }
  }

  const filtered = useMemo(() => {
    if (filter === 'unread') return items.filter((i) => !i.is_read)
    if (filter === 'read') return items.filter((i) => i.is_read)
    return items
  }, [items, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const toggleRead = async (item: Item) => {
    const newRead = !item.is_read
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_read: newRead } : i)))
    if (selected?.id === item.id) setSelected({ ...item, is_read: newRead })
    await fetch('/api/items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, is_read: newRead }),
    })
  }

  const handleExport = () => {
    if (user.plan === 'free') {
      setShowUpgrade(true)
      return
    }
    const rows = [
      ['ソース', 'タイトル', 'URL', '公開日', '既読'],
      ...filtered.map((i) => [
        SOURCE_LABEL[i.source],
        i.title,
        i.url,
        i.published_at,
        i.is_read ? '既読' : '未読',
      ]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reanker-${keyword.name}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">{keyword.name}</h1>
            <Link
              href={`/anchor/edit?id=${keyword.id}`}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <Sliders size={14} />
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {keyword.type === 'service' ? 'サービス名' : keyword.type === 'keyword' ? 'キーワード' : 'ドメイン'}
            ・<span className="font-mono">{keyword.query_value}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFetchNow}
            disabled={fetching}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            title="PR TIMES / Google News から今すぐ記事を取得"
          >
            <RefreshCw size={13} className={fetching ? 'animate-spin' : ''} />
            {fetching ? '取得中...' : '今すぐ取得'}
          </button>
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value as any); setPage(1) }}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600"
          >
            <option value="all">すべて</option>
            <option value="unread">未読のみ</option>
            <option value="read">既読のみ</option>
          </select>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600"
          >
            <option value={25}>25件</option>
            <option value={50}>50件</option>
            <option value={100}>100件</option>
          </select>
          <button
            onClick={handleExport}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              user.plan === 'free'
                ? 'border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100'
                : 'border-[#378ADD] text-[#378ADD] hover:bg-[#378ADD]/5 bg-white'
            }`}
          >
            <FileDown size={13} />
            エクスポート
          </button>
        </div>
      </div>

      {fetchResult && (
        <div
          className={`mb-4 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg border ${
            fetchResult.kind === 'ok'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {fetchResult.kind === 'ok'
            ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
            : <AlertCircle size={14} className="shrink-0 mt-0.5" />
          }
          <span>{fetchResult.message}</span>
        </div>
      )}

      {/* メインエリア 左右2ペイン */}
      <div className="flex gap-5 items-start">
        {/* 左: 記事テーブル */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
          {paged.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-gray-400">記事がまだありません</p>
              <p className="text-xs text-gray-400 mt-1">翌朝Cronで取得されます</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-xs text-gray-500">
                  <th className="text-left py-2 pl-3 w-6"></th>
                  <th className="text-left py-2 font-medium">タイトル</th>
                  <th className="text-left py-2 font-medium w-24">ソース</th>
                  <th className="text-left py-2 font-medium w-24">公開日</th>
                  <th className="text-center py-2 font-medium w-12 pr-3"></th>
                </tr>
              </thead>
              <tbody>
                {paged.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`border-b border-gray-50 cursor-pointer transition-colors ${
                      selected?.id === item.id ? 'bg-[#378ADD]/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="pl-3 py-2.5">
                      {!item.is_read && <Circle size={6} className="fill-[#378ADD] text-[#378ADD]" />}
                    </td>
                    <td className="py-2.5 pr-2">
                      <span className={`text-sm truncate block max-w-[400px] ${item.is_read ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                        {item.title}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SOURCE_COLOR[item.source]}`}>
                        {SOURCE_LABEL[item.source]}
                      </span>
                    </td>
                    <td className="py-2.5 text-xs text-gray-500">{item.published_at}</td>
                    <td className="py-2.5 pr-3 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleRead(item) }}
                        className={`text-xs ${item.is_read ? 'text-[#378ADD]' : 'text-gray-300 hover:text-gray-500'}`}
                        title={item.is_read ? '既読' : '未読にする'}
                      >
                        <Check size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* フッター */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
              <span>{filtered.length}件中 {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}件</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-0.5 hover:bg-white rounded disabled:opacity-30">前へ</button>
                <span>{page} / {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-0.5 hover:bg-white rounded disabled:opacity-30">次へ</button>
              </div>
            </div>
          )}
        </div>

        {/* 右: プレビューペイン */}
        <aside className="w-[240px] bg-white border border-gray-200 rounded-xl p-4 shrink-0">
          {selected ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SOURCE_COLOR[selected.source]}`}>
                  {SOURCE_LABEL[selected.source]}
                </span>
                <span className="text-xs text-gray-500">{selected.published_at}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug">{selected.title}</h3>
              {selected.summary && (
                <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-6">{selected.summary}</p>
              )}
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#378ADD] hover:underline"
              >
                <ExternalLink size={12} />
                記事を開く
              </a>
            </>
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">記事を選択してください</p>
          )}
        </aside>
      </div>

      {showUpgrade && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowUpgrade(false)}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">スタンダードプランへ</h3>
            <p className="text-xs text-gray-500 mb-4">エクスポート機能はスタンダードプラン（¥300/月・税抜）でご利用いただけます</p>
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/stripe/checkout', { method: 'POST' })
                  const data = await res.json()
                  if (res.ok && data.url) {
                    window.location.href = data.url
                  } else {
                    alert(data.message ?? 'アップグレード処理に失敗しました。')
                  }
                } catch {
                  alert('通信エラーが発生しました。')
                }
              }}
              className="w-full bg-[#378ADD] hover:bg-[#2d6db5] text-white py-2 rounded-lg text-sm font-medium"
            >
              アップグレードする
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

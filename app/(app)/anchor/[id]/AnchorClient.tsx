'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileDown, Check, Circle, ExternalLink, Sliders, RefreshCw, CheckCircle2, AlertCircle, Loader2, Bookmark, Trash2 } from 'lucide-react'
import type { User, PickKeyword, Item } from '@/lib/types'

interface PreviewData {
  title?: string
  description?: string
  image?: string
  siteName?: string
  snippet?: string
}

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
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'clipped'>('all')
  const [pageSize, setPageSize] = useState(25)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Item | null>(initialItems[0] ?? null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [fetchResult, setFetchResult] = useState<{ kind: 'ok' | 'err'; message: string } | null>(null)
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState(false)

  // 選択された記事のOGPプレビューを取得
  useEffect(() => {
    if (!selected) {
      setPreview(null)
      setPreviewError(false)
      return
    }
    let cancelled = false
    setPreview(null)
    setPreviewError(false)
    setPreviewLoading(true)
    fetch(`/api/preview?url=${encodeURIComponent(selected.url)}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        if (!cancelled) {
          setPreview(data)
          setPreviewLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPreviewError(true)
          setPreviewLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [selected?.id])

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  /** 記事を選択（同時に未読なら自動既読に） */
  const selectItem = (item: Item) => {
    setSelected(item)
    if (!item.is_read) {
      // 楽観的更新 + サーバ同期
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_read: true } : i)))
      void fetch('/api/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_read: true }),
      })
    }
  }

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

  const toggleClip = async (item: Item) => {
    const newClipped = !item.is_clipped
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_clipped: newClipped } : i)))
    if (selected?.id === item.id) setSelected({ ...item, is_clipped: newClipped })
    await fetch('/api/items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, is_clipped: newClipped }),
    })
  }

  const deleteItem = async (item: Item) => {
    if (!confirm(`「${item.title.slice(0, 50)}${item.title.length > 50 ? '…' : ''}」を削除しますか？\n\n削除した記事は次回取得時にも再表示されません。`)) return
    // 楽観的削除
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    if (selected?.id === item.id) {
      const remaining = items.filter((i) => i.id !== item.id)
      setSelected(remaining[0] ?? null)
    }
    await fetch(`/api/items?id=${item.id}`, { method: 'DELETE' })
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
          <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs bg-white">
            {([
              { key: 'all', label: 'すべて', count: counts.all },
              { key: 'unread', label: '未読', count: counts.unread },
              { key: 'read', label: '既読', count: counts.read },
              { key: 'clipped', label: 'クリップ', count: counts.clipped },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => { setFilter(f.key); setPage(1) }}
                className={`px-3 py-1.5 transition-colors ${
                  filter === f.key
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f.label}
                <span className={`ml-1 text-[10px] ${filter === f.key ? 'text-white/70' : 'text-gray-400'}`}>{f.count}</span>
              </button>
            ))}
          </div>
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
            <div className="py-16 text-center px-6">
              <p className="text-sm text-gray-500">記事がまだありません</p>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                毎日定期的に取得します。<br />
                右上の「今すぐ取得」ボタンから手動で取得することも可能です。
              </p>
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
                  <th className="text-left py-2 font-medium w-20 pr-3">公開日</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => selectItem(item)}
                    className={`border-b border-gray-50 cursor-pointer transition-colors ${
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
                        onClick={(e) => { e.stopPropagation(); toggleClip(item) }}
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
                        onClick={(e) => { e.stopPropagation(); toggleRead(item) }}
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
                    <td className={`py-2.5 pr-3 text-xs ${item.is_read ? 'text-gray-400' : 'text-gray-500'}`}>{item.published_at}</td>
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
        <aside className="w-[440px] bg-white border border-gray-200 rounded-xl shrink-0 sticky top-4 self-start max-h-[calc(100vh-32px)] overflow-y-auto hidden lg:block">
          {selected ? (
            <article>
              {/* 画像 */}
              {preview?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.image}
                  alt={preview.title ?? selected.title}
                  className="w-full h-48 object-cover rounded-t-xl bg-gray-100"
                />
              ) : previewLoading ? (
                <div className="w-full h-48 bg-gray-50 rounded-t-xl flex items-center justify-center">
                  <Loader2 size={20} className="text-gray-300 animate-spin" />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl flex items-center justify-center">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${SOURCE_COLOR[selected.source]}`}>
                    {SOURCE_LABEL[selected.source]}
                  </span>
                </div>
              )}

              {/* メタ + タイトル */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <span className={`px-1.5 py-0.5 rounded font-medium ${SOURCE_COLOR[selected.source]}`}>
                    {SOURCE_LABEL[selected.source]}
                  </span>
                  <span className="text-gray-500">{selected.published_at}</span>
                  {selected.published_hour != null && (
                    <span className="text-gray-400">{String(selected.published_hour).padStart(2, '0')}:00</span>
                  )}
                  {preview?.siteName && (
                    <span className="text-gray-400 ml-auto truncate max-w-[120px]">{preview.siteName}</span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-3 leading-snug">
                  {preview?.title ?? selected.title}
                </h3>

                {/* 本文プレビュー */}
                {previewLoading ? (
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-4/6" />
                  </div>
                ) : preview?.snippet ? (
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {preview.snippet}
                  </p>
                ) : preview?.description ? (
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {preview.description}
                  </p>
                ) : selected.summary ? (
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {selected.summary}
                  </p>
                ) : previewError ? (
                  <p className="text-xs text-gray-400 mb-4">プレビュー取得失敗 — リンクから直接ご覧ください</p>
                ) : null}

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-[#378ADD] hover:underline font-medium"
                  >
                    <ExternalLink size={14} />
                    記事を開く
                  </a>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => toggleClip(selected)}
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
                      onClick={() => toggleRead(selected)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                        selected.is_read
                          ? 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          : 'border-[#378ADD] text-[#378ADD] hover:bg-[#378ADD]/5'
                      }`}
                    >
                      {selected.is_read ? '未読に戻す' : '既読にする'}
                    </button>
                    <button
                      onClick={() => deleteItem(selected)}
                      className="ml-auto flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      title="この記事を削除（再取得もされません）"
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

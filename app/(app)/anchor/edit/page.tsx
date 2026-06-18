'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, Trash2, AlertCircle, Lock } from 'lucide-react'
import type { PickKeyword, AnchorType, Source } from '@/lib/types'
import { SOURCE_META, SOURCE_ORDER } from '@/lib/sources/meta'
import { trackAnchorCreate, trackCreateKeyword, trackBeginCheckout, trackUpgradeClick } from '@/lib/analytics'

const TYPE_OPTIONS: { value: AnchorType; label: string; desc: string }[] = [
  { value: 'service', label: 'サービス名', desc: '例：Salesforce、kintone' },
  { value: 'keyword', label: 'キーワード', desc: '例：AI受発注、SaaS営業' },
  { value: 'domain', label: 'ドメイン', desc: '例：example.com' },
]

export default function AnchorEditPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const isEdit = !!editId

  const [name, setName] = useState('')
  const [type, setType] = useState<AnchorType>('service')
  const [queryValue, setQueryValue] = useState('')
  const [sources, setSources] = useState<Source[]>(['prtimes', 'googlenews'])
  const [notifySlack, setNotifySlack] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [plan, setPlan] = useState<'free' | 'standard'>('free')
  const [anchorCount, setAnchorCount] = useState(0)
  const [maxAnchors, setMaxAnchors] = useState(3)

  // ユーザープランを取得
  useEffect(() => {
    fetch('/api/user')
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.plan) setPlan(data.user.plan)
        if (typeof data?.anchorCount === 'number') setAnchorCount(data.anchorCount)
        if (data?.limits?.maxAnchors) {
          setMaxAnchors(data.limits.maxAnchors === Infinity || data.limits.maxAnchors > 1000 ? Infinity : data.limits.maxAnchors)
        }
        // 新規 + Standard なら Slack デフォルトON
        if (!editId && data?.user?.plan === 'standard') setNotifySlack(true)
      })
      .catch(() => {})
  }, [editId])

  const isFree = plan === 'free'
  const atAnchorLimit = !editId && isFree && anchorCount >= maxAnchors
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!editId) return
    fetch(`/api/anchor/${editId}`)
      .then((r) => r.json())
      .then((kw: PickKeyword) => {
        setName(kw.name)
        setType(kw.type)
        setQueryValue(kw.query_value)
        setSources(kw.sources)
        setNotifySlack(kw.notify_slack)
        setNotifyEmail(kw.notify_email)
      })
  }, [editId])

  const toggleSource = (src: Source) => {
    // 有料ソースは Free では選択させない（サーバー側でも除外される）
    if (SOURCE_META[src].premium && isFree) return
    setSources((prev) =>
      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !queryValue.trim()) {
      setError('アンカー名と検索クエリは必須です')
      return
    }
    if (sources.length === 0) {
      setError('取得ソースを1つ以上選択してください')
      return
    }
    if (!notifySlack && !notifyEmail) {
      setError('通知先を1つ以上選択してください')
      return
    }

    setLoading(true)
    const body = { id: editId, name, type, query_value: queryValue, sources, notify_slack: notifySlack, notify_email: notifyEmail }
    const res = await fetch('/api/anchor', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    setLoading(false)

    if (!res.ok) {
      if (json.error === 'PLAN_LIMIT') {
        setError('フリープランは3件まで。スタンダードにアップグレードしてください。')
      } else {
        setError(json.error ?? '保存に失敗しました')
      }
      return
    }

    // 新規作成成功時のみ送信（編集は対象外）
    if (!isEdit) {
      trackAnchorCreate({ plan, anchor_type: type })
      trackCreateKeyword({ plan, anchor_type: type })
    }

    router.push('/dashboard')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!editId) return
    setLoading(true)
    await fetch('/api/anchor', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId }),
    })
    setLoading(false)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ChevronLeft size={16} />
        戻る
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-2">
        {isEdit ? 'アンカーを編集' : '新規アンカー登録'}
      </h1>

      {!isEdit && (
        <p className="text-xs text-gray-500 mb-6">
          現在の登録数：
          <span className={atAnchorLimit ? 'text-red-600 font-semibold' : 'text-gray-700 font-medium'}>
            {anchorCount}
          </span>
          {' / '}
          {maxAnchors === Infinity ? '無制限' : `${maxAnchors}件`}
          {isFree && (
            <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">Free</span>
          )}
        </p>
      )}

      {atAnchorLimit && (
        <div className="mb-5 bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-3">
          <Lock size={16} className="text-gray-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-1">アンカー登録は3件までです</p>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Standardプランでは、アンカーを無制限に登録できます。
              週次・月次サマリやSlack通知も利用できるようになります。
            </p>
            <button
              type="button"
              onClick={async () => {
                trackUpgradeClick('anchor_limit_modal')
                try {
                  const res = await fetch('/api/stripe/checkout', { method: 'POST' })
                  const data = await res.json()
                  if (res.ok && data.url) {
                    trackBeginCheckout('standard')
                    window.location.href = data.url
                  } else alert(data.message ?? 'アップグレード処理に失敗しました')
                } catch { alert('通信エラーが発生しました') }
              }}
              className="text-xs bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Standardにアップグレード
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`bg-white border border-gray-200 rounded-xl p-6 space-y-6 ${atAnchorLimit ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* アンカー名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            アンカー名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：競合A社"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#378ADD]/50 focus:border-[#378ADD]"
          />
        </div>

        {/* 検索タイプ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            検索タイプ <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  type === opt.value
                    ? 'border-[#378ADD] bg-[#378ADD]/5 text-[#378ADD]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <p className="text-xs font-medium">{opt.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 検索クエリ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            検索クエリ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={queryValue}
            onChange={(e) => setQueryValue(e.target.value)}
            placeholder={
              type === 'service' ? '例：Salesforce' :
              type === 'keyword' ? '例：AI受発注' :
              '例：example.com'
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#378ADD]/50 focus:border-[#378ADD]"
          />
        </div>

        {/* 取得ソース */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">取得ソース</label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {SOURCE_ORDER.map((src) => {
              const premiumLocked = SOURCE_META[src].premium && isFree
              return (
                <label
                  key={src}
                  className={`flex items-center gap-2 ${premiumLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  <input
                    type="checkbox"
                    checked={sources.includes(src) && !premiumLocked}
                    disabled={premiumLocked}
                    onChange={() => toggleSource(src)}
                    className="accent-[#378ADD]"
                  />
                  <span className="text-sm text-gray-600">{SOURCE_META[src].label}</span>
                  {premiumLocked && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">Standard</span>
                  )}
                </label>
              )
            })}
          </div>
          {isFree && (
            <p className="text-[11px] text-gray-400 mt-2">
              @Press・ValuePress・共同通信PRワイヤーの監視はStandardプランで利用できます。
            </p>
          )}
        </div>

        {/* 通知先 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            通知先 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className={`flex items-center gap-2 ${isFree ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                checked={!isFree && notifySlack}
                disabled={isFree}
                onChange={(e) => setNotifySlack(e.target.checked)}
                className="accent-[#378ADD]"
              />
              <span className="text-sm text-gray-600">Slack</span>
              {isFree && (
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">Standard</span>
              )}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="accent-[#378ADD]"
              />
              <span className="text-sm text-gray-600">メール</span>
            </label>
          </div>
        </div>

        {/* エラー */}
        {error && (
          <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* ボタン */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#378ADD] hover:bg-[#2d6db5] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? '保存中...' : isEdit ? '保存する' : '登録する'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
            >
              キャンセル
            </button>
          </div>

          {isEdit && (
            <div>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">本当に削除しますか？</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg"
                  >
                    削除する
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    戻る
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                  削除
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-400">登録翌日09:00から通知が始まります</p>
      </form>
    </div>
  )
}

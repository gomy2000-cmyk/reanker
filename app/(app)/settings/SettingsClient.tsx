'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, ShieldCheck, ExternalLink, Send } from 'lucide-react'
import type { User } from '@/lib/types'
import { trackBeginCheckout, trackPurchase, trackUpgradeClick } from '@/lib/analytics'

interface Props { user: User }

/** 入力中の Slack Webhook URL がそれらしい形式か（クライアント側の即時フィードバック用） */
function looksLikeSlackWebhook(url: string): boolean {
  const v = url.trim()
  return v === '' || /^https:\/\/hooks\.slack\.com\//.test(v)
}

/**
 * 決済の安心訴求。スタンダードへの誘導まわりに添える。
 * カード情報を自社で保持しない（Stripe 管理）ことを明示し、アップグレードの心理的ハードルを下げる。
 */
function StripeSafetyNote() {
  return (
    <p className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-relaxed mt-2">
      <ShieldCheck size={13} className="text-gray-400 shrink-0 mt-px" />
      <span>
        お支払いは決済プラットフォーム「Stripe」で処理されます。カード情報はReAnkerのサーバーには保存・通過せず、
        Stripeの安全な環境で管理されるため、情報が抜き取られる心配はありません。
      </span>
    </p>
  )
}

/**
 * Slack Webhook URL の設定フィールド（Standard ユーザー向け）。
 * - 取得手順とヘルプリンクを表示してオンボーディングを補助
 * - 「テスト送信」で保存前でも疎通確認できる
 * - 形式チェックの結果と保存／テスト結果をその場でフィードバック
 */
function SlackWebhookField({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const valid = looksLikeSlackWebhook(value)

  const handleSave = async () => {
    if (!valid) {
      setMsg({ type: 'error', text: 'URLは「https://hooks.slack.com/」で始まる必要があります。' })
      return
    }
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slack_webhook_url: value.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg({ type: 'error', text: data.error ?? '保存に失敗しました。' })
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 1500)
      }
    } catch {
      setMsg({ type: 'error', text: '通信エラーが発生しました。' })
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    if (!value.trim()) {
      setMsg({ type: 'error', text: 'テストするWebhook URLを入力してください。' })
      return
    }
    if (!valid) {
      setMsg({ type: 'error', text: 'URLは「https://hooks.slack.com/」で始まる必要があります。' })
      return
    }
    setTesting(true)
    setMsg(null)
    try {
      const res = await fetch('/api/user/slack-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slack_webhook_url: value.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg({ type: 'error', text: data.error ?? 'テスト送信に失敗しました。' })
      } else {
        setMsg({ type: 'success', text: 'テスト通知を送信しました。Slackをご確認ください。' })
      }
    } catch {
      setMsg({ type: 'error', text: '通信エラーが発生しました。' })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">Slack Webhook URL</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://hooks.slack.com/services/..."
          className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
            valid
              ? 'border-gray-200 focus:ring-[#378ADD]/50 focus:border-[#378ADD]'
              : 'border-red-300 focus:ring-red-300/50 focus:border-red-400'
          }`}
        />
        <button
          onClick={handleTest}
          disabled={testing || saving}
          className="text-xs px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-600 disabled:opacity-50 flex items-center gap-1 whitespace-nowrap"
        >
          <Send size={12} /> {testing ? '送信中' : 'テスト送信'}
        </button>
        <button
          onClick={handleSave}
          disabled={saving || testing}
          className="text-xs px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-600 disabled:opacity-50 flex items-center gap-1 whitespace-nowrap"
        >
          {saved ? <><Check size={12} className="text-green-600" /> 保存済</> : saving ? '保存中' : '保存'}
        </button>
      </div>

      {msg && (
        <p className={`text-xs mt-2 ${msg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {msg.text}
        </p>
      )}

      {/* 取得手順のガイド */}
      <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs font-medium text-gray-700 mb-1.5">Webhook URL の取得方法</p>
        <ol className="text-xs text-gray-600 leading-relaxed list-decimal list-inside space-y-0.5">
          <li>Slack APIのページで「Incoming Webhooks」を有効にしたアプリを作成</li>
          <li>通知を受け取りたいSlackチャンネルにこのアプリをAdd</li>
          <li>発行された <code className="bg-white border border-gray-200 rounded px-1">https://hooks.slack.com/...</code> をここに貼り付け → 保存</li>
          <li>「テスト送信」で実際に通知が届くか確認</li>
        </ol>
        <a
          href="https://api.slack.com/messaging/webhooks"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[#378ADD] hover:underline mt-2"
        >
          Slack公式の設定手順を見る <ExternalLink size={11} />
        </a>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({
  label, value, onChange, onSave, placeholder, type = 'text', readOnly = false,
}: {
  label: string; value: string; onChange?: (v: string) => void; onSave?: () => Promise<void>
  placeholder?: string; type?: string; readOnly?: boolean
}) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const handleSave = async () => {
    if (!onSave) return
    setSaving(true)
    await onSave()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#378ADD]/50 focus:border-[#378ADD] ${
            readOnly ? 'bg-gray-50 text-gray-500' : ''
          }`}
        />
      </div>
      {!readOnly && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-xs px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-600 disabled:opacity-50 flex items-center gap-1"
        >
          {saved ? <><Check size={12} className="text-green-600" /> 保存済</> : saving ? '保存中' : '保存'}
        </button>
      )}
    </div>
  )
}

export function SettingsClient({ user }: Props) {
  // Stripe checkout 成功時の購入完了イベント（?upgraded=1 で戻ってきたとき）
  const purchaseFired = useRef(false)
  useEffect(() => {
    if (purchaseFired.current) return
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgraded') !== '1') return
    purchaseFired.current = true
    trackPurchase({ plan: 'standard', value: 300, currency: 'JPY' })
    // クエリを掃除して二重送信を防ぐ
    const url = new URL(window.location.href)
    url.searchParams.delete('upgraded')
    window.history.replaceState({}, '', url.pathname + (url.search ? `?${url.searchParams}` : ''))
  }, [])

  const [name, setName] = useState(user.name ?? '')
  const [notifyEmail, setNotifyEmail] = useState(user.notify_email ?? user.email)
  const [invoiceMonth, setInvoiceMonth] = useState(new Date().toISOString().slice(0, 7))

  const save = async (body: object) => {
    await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  const handleUpgrade = async () => {
    trackUpgradeClick('settings')
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.url) {
        trackBeginCheckout('standard')
        window.location.href = data.url
      } else {
        alert(data.message ?? 'アップグレード処理に失敗しました。')
      }
    } catch {
      alert('通信エラーが発生しました。')
    }
  }

  const handlePortal = async () => {
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        alert(data.message ?? '決済管理ページを開けませんでした。')
      }
    } catch {
      alert('通信エラーが発生しました。')
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-gray-900 mb-6">設定</h1>

      <Section title="アカウント情報">
        <Field label="名前" value={name} onChange={setName} onSave={() => save({ name })} />
        <Field label="メールアドレス（ログイン用・変更不可）" value={user.email} readOnly />
        <Field label="ログイン方法" value="Googleアカウント連携中" readOnly />
      </Section>

      <Section title="通知連携">
        {user.plan !== 'standard' ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Slack Webhook URL
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">Standard</span>
                </p>
                <p className="text-xs text-gray-600">
                  競合の新着リリースを毎朝Slackへ自動通知。チームでの共有に便利です。Standardプランで利用できます。
                </p>
              </div>
              <button
                onClick={handleUpgrade}
                className="text-xs bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-md whitespace-nowrap"
              >
                アップグレード
              </button>
            </div>
            <StripeSafetyNote />
          </div>
        ) : (
          <SlackWebhookField initialValue={user.slack_webhook_url ?? ''} />
        )}
        <Field
          label="通知メール"
          value={notifyEmail}
          onChange={setNotifyEmail}
          onSave={() => save({ notify_email: notifyEmail })}
          type="email"
        />
      </Section>

      <Section title="決済情報">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">現在のプラン</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              user.plan === 'standard' ? 'bg-[#378ADD]/10 text-[#378ADD]' : 'bg-gray-100 text-gray-600'
            }`}>
              {user.plan === 'standard' ? 'スタンダード（¥300/月・税抜）' : 'フリー'}
            </span>
          </div>
          {user.plan === 'free' ? (
            <button onClick={handleUpgrade} className="text-xs bg-[#378ADD] hover:bg-[#2d6db5] text-white px-4 py-2 rounded-lg">
              プランを変更
            </button>
          ) : (
            <button onClick={handlePortal} className="text-xs border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg text-gray-600">
              プランを管理
            </button>
          )}
        </div>

        {user.plan === 'free' && <StripeSafetyNote />}

        {user.plan === 'standard' && (
          <>
            <div>
              <p className="text-xs text-gray-500 mb-1">次回請求日</p>
              <p className="text-sm text-gray-700">—（Stripe管理画面で確認）</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">お支払い方法</p>
              <button onClick={handlePortal} className="text-xs border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-gray-600">
                Stripeカード管理
              </button>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">請求書発行</p>
              <div className="flex gap-2 items-center">
                <input
                  type="month"
                  value={invoiceMonth}
                  onChange={(e) => setInvoiceMonth(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                />
                <button onClick={handlePortal} className="text-xs border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-gray-600">
                  発行
                </button>
              </div>
            </div>
            <button onClick={handlePortal} className="text-xs text-[#378ADD] hover:underline">
              請求履歴を見る →
            </button>
          </>
        )}
      </Section>
    </div>
  )
}

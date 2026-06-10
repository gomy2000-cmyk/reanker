'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { trackContactSubmit } from '@/lib/analytics'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#378ADD]/50 focus:border-[#378ADD]'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // honeypot
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!consent) {
      setError('プライバシーポリシーへの同意が必要です')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company: company || undefined, message, consent, website }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? '送信に失敗しました。時間をおいて再度お試しください。')
        return
      }
      trackContactSubmit()
      setSent(true)
    } catch {
      setError('通信エラーが発生しました。時間をおいて再度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 flex items-start gap-3">
        <CheckCircle className="text-[#378ADD] shrink-0 mt-0.5" size={18} />
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">お問い合わせを受け付けました</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            ご入力いただいたメールアドレス宛に、通常2〜3営業日以内にご返信します。
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} placeholder="例：山田 太郎" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="例：taro@example.com" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">会社名</label>
        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} maxLength={100} placeholder="例：株式会社サンプル" className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="お問い合わせ内容をご記入ください（10文字以上）"
          className={inputClass}
        />
      </div>

      {/* honeypot: 画面には表示しない。bot がここに入力したら捨てる */}
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="accent-[#378ADD] mt-0.5"
        />
        <span className="text-xs text-gray-600 leading-relaxed">
          <Link href="/privacy" className="text-[#378ADD] hover:underline" target="_blank">プライバシーポリシー</Link>
          に同意のうえ送信します <span className="text-red-500">*</span>
        </span>
      </label>

      {error && (
        <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-[#378ADD] hover:bg-[#2d6db5] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        <Send size={14} />
        {loading ? '送信中...' : '送信する'}
      </button>
    </form>
  )
}

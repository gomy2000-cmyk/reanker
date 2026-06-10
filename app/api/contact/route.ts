import { NextRequest, NextResponse } from 'next/server'
import { contactSchema, parseBody } from '@/lib/validation'

export const maxDuration = 15

/**
 * お問い合わせフォームの送信。認証不要（公開フォーム）。
 * Resend で運営宛にメール転送する。reply_to に送信者メールを入れるので
 * 受信ボックスからそのまま返信できる。
 */

// 簡易レート制限（インスタンス内メモリ）。同一IPからの連投を抑止する。
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 3
const recentSubmissions = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (recentSubmissions.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT_MAX) return true
  timestamps.push(now)
  recentSubmissions.set(ip, timestamps)
  return false
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: '送信回数が多すぎます。しばらく待ってから再度お試しください。' }, { status: 429 })
  }

  const parsed = await parseBody(req, contactSchema)
  if (!parsed.ok) return NextResponse.json({ error: parsed.message }, { status: 400 })
  const { name, email, company, message, website } = parsed.data

  // honeypot に値が入っていたら bot。成功を装って捨てる。
  if (website) return NextResponse.json({ ok: true })

  const apiKey = (process.env.RESEND_API_KEY ?? '').replace(/^﻿/, '') || undefined
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY not set')
    return NextResponse.json(
      { error: '現在フォームを利用できません。お手数ですが support@reanker.com 宛にメールでお問い合わせください。' },
      { status: 503 }
    )
  }

  const to = process.env.CONTACT_TO_EMAIL || 'support@reanker.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'ReAnker <reanker@syojin.com>'

  const html = `
    <div style="font-family:-apple-system,'Segoe UI',sans-serif;max-width:600px;color:#222;">
      <h2 style="font-size:16px;margin:0 0 16px;">ReAnker お問い合わせフォーム</h2>
      <table style="font-size:13px;border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;color:#888;">お名前</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888;">メール</td><td>${escapeHtml(email)}</td></tr>
        ${company ? `<tr><td style="padding:4px 12px 4px 0;color:#888;">会社名</td><td>${escapeHtml(company)}</td></tr>` : ''}
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
      <p style="font-size:13px;line-height:1.8;white-space:pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to,
        reply_to: email,
        subject: `【お問い合わせ】${name}様より`,
        html,
      }),
    })
    if (!res.ok) {
      console.error('[contact] Resend failed:', res.status, await res.text())
      return NextResponse.json({ error: '送信に失敗しました。時間をおいて再度お試しください。' }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    console.error('[contact] error:', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: '送信に失敗しました。時間をおいて再度お試しください。' }, { status: 502 })
  }
}

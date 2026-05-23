import type { SavedItem } from './fetchAndSave'

export interface AnchorSummary {
  anchorName: string
  items: SavedItem[]
}

/**
 * メール内リンクに UTM パラメータを付与する共通ヘルパー。
 * utm_source=email / utm_medium=email は固定、utm_campaign と utm_content のみ指定する。
 */
function urlWithUtm(path: string, campaign: string, content?: string): string {
  const params = new URLSearchParams({
    utm_source: 'email',
    utm_medium: 'email',
    utm_campaign: campaign,
  })
  if (content) params.set('utm_content', content)
  return `https://reanker.com${path}?${params}`
}

/**
 * Slack に1通の集約サマリーを送る。
 * - 複数のアンカーを1メッセージにグルーピング表示
 * - 0件のアンカーは含まれていない前提（呼び出し側でフィルタ済み）
 */
export async function sendSlackDigest(
  webhookUrl: string,
  summaries: AnchorSummary[]
): Promise<void> {
  const totalItems = summaries.reduce((sum, s) => sum + s.items.length, 0)
  if (totalItems === 0) return

  const blocks = summaries
    .map((s) => {
      const lines = s.items.map((it) => `・${it.title}\n  ${it.url}`).join('\n')
      return `*━ ${s.anchorName}（${s.items.length}件）━*\n${lines}`
    })
    .join('\n\n')

  const text =
    `【ReAnker】今日の新着 ${totalItems}件\n\n${blocks}\n\n` +
    `ダッシュボードで詳細を見る: https://reanker.com/dashboard`

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

/**
 * メールに1通の集約サマリーを送る。
 */
export async function sendEmailDigest(
  to: string,
  summaries: AnchorSummary[]
): Promise<void> {
  const totalItems = summaries.reduce((sum, s) => sum + s.items.length, 0)
  if (totalItems === 0) return

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[notify] RESEND_API_KEY not set, skipping email')
    return
  }

  const sections = summaries
    .map(
      (s) => `
    <h3 style="font-size:14px;margin:24px 0 8px;color:#111;border-bottom:1px solid #eee;padding-bottom:6px;">
      ${escapeHtml(s.anchorName)}
      <span style="color:#666;font-weight:normal;font-size:12px;margin-left:6px;">${s.items.length}件</span>
    </h3>
    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.8;">
      ${s.items
        .map(
          (it) =>
            `<li style="margin-bottom:6px;">
              <a href="${escapeAttr(it.url)}" style="color:#378ADD;text-decoration:none;">${escapeHtml(it.title)}</a>
            </li>`
        )
        .join('')}
    </ul>
  `
    )
    .join('')

  const html = `
    <div style="font-family:-apple-system,'Segoe UI',sans-serif;max-width:600px;color:#222;">
      <h2 style="font-size:18px;margin:0 0 4px;">【ReAnker】今日の新着 ${totalItems}件</h2>
      <p style="font-size:12px;color:#666;margin:0 0 16px;">${new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</p>
      ${sections}
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="font-size:12px;color:#666;">
        <a href="${urlWithUtm('/dashboard', 'daily_digest')}" style="color:#378ADD;">ダッシュボードで確認</a> ・
        <a href="${urlWithUtm('/settings', 'daily_digest', 'settings_link')}" style="color:#666;">通知設定を変更</a>
      </p>
    </div>
  `

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'ReAnker <noreply@reanker.com>',
      to,
      subject: `【ReAnker】今日の新着 ${totalItems}件`,
      html,
    }),
  })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;')
}

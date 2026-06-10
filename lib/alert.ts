/**
 * 運用者向けアラート。cron の失敗・エラーを Slack に通知する。
 * ALERT_SLACK_WEBHOOK_URL（運用者用 Incoming Webhook）が未設定なら何もしない。
 * このモジュールは例外を投げない（アラート失敗で本体処理を落とさない）。
 */

const MAX_LINES = 10

export async function sendOpsAlert(title: string, lines: string[] = []): Promise<void> {
  const webhookUrl = process.env.ALERT_SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  const shown = lines.slice(0, MAX_LINES)
  const omitted = lines.length - shown.length
  const body =
    `:rotating_light: *[ReAnker] ${title}*` +
    (shown.length > 0 ? `\n${shown.map((l) => `・${l}`).join('\n')}` : '') +
    (omitted > 0 ? `\n…ほか${omitted}件` : '')

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: body }),
    })
    if (!res.ok) {
      console.error('[alert] ops alert failed:', res.status, await res.text())
    }
  } catch (e: unknown) {
    console.error('[alert] ops alert error:', e instanceof Error ? e.message : e)
  }
}

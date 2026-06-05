import type { SavedItem } from './runFetch'

export interface AnchorSummary {
  anchorName: string
  items: SavedItem[]
}

/**
 * 通知送信の結果。
 * - success: 実際に送信し成功
 * - failed : 送信を試みたが失敗（HTTPエラー等）
 * - skipped: 送信していない（APIキー未設定・送信先なし・対象0件など）
 * 呼び出し側はこの結果を見て items.notified を更新し、notification_logs に記録する。
 * このモジュールは例外を投げず、必ず NotifyResult を返す。
 */
export type NotifyStatus = 'success' | 'failed' | 'skipped'
export interface NotifyResult {
  status: NotifyStatus
  error?: string
}

/**
 * 429（レート制限）と一時的な5xxを吸収する fetch ラッパー。
 * Resend は「毎秒2リクエストまで」の制限があり、複数ユーザーへ連続送信すると
 * 3通目以降が 429 で弾かれる。Retry-After を尊重しつつ指数バックオフで再試行する。
 */
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  { retries = 4, baseDelayMs = 600 }: { retries?: number; baseDelayMs?: number } = {}
): Promise<Response> {
  let lastRes: Response | null = null
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, init)
    if (res.status !== 429 && res.status < 500) return res
    lastRes = res
    if (attempt === retries) break
    const retryAfter = Number(res.headers.get('retry-after'))
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : baseDelayMs * Math.pow(2, attempt) // 600, 1200, 2400, 4800ms
    await new Promise((r) => setTimeout(r, waitMs))
  }
  return lastRes!
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
): Promise<NotifyResult> {
  const totalItems = summaries.reduce((sum, s) => sum + s.items.length, 0)
  if (totalItems === 0) return { status: 'skipped', error: 'no items' }

  const blocks = summaries
    .map((s) => {
      const lines = s.items.map((it) => `・${it.title}\n  ${it.url}`).join('\n')
      return `*━ ${s.anchorName}（${s.items.length}件）━*\n${lines}`
    })
    .join('\n\n')

  const text =
    `【ReAnker】今日の新着 ${totalItems}件\n\n${blocks}\n\n` +
    `ダッシュボードで詳細を見る: https://reanker.com/dashboard`

  try {
    const res = await fetchWithRetry(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) {
      return { status: 'failed', error: `Slack webhook failed: HTTP ${res.status} ${await res.text()}` }
    }
    return { status: 'success' }
  } catch (e: any) {
    return { status: 'failed', error: `Slack webhook error: ${e?.message ?? e}` }
  }
}

/**
 * タイトルが SHARED_CHARS 文字以上共通する記事を重複とみなして除去する。
 * 同じリリースが PR TIMES / Google News 両方で取得された場合などを排除する。
 */
const SHARED_CHARS = 10

function longestCommonSubstring(a: string, b: string): number {
  const m = a.length, n = b.length
  let max = 0
  // dp[i][j] = a[i-1]とb[j-1]で終わる共通部分文字列の長さ
  const dp: number[] = new Array(n + 1).fill(0)
  for (let i = 1; i <= m; i++) {
    let prev = 0
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]
      if (a[i - 1] === b[j - 1]) {
        dp[j] = prev + 1
        if (dp[j] > max) max = dp[j]
      } else {
        dp[j] = 0
      }
      prev = tmp
    }
  }
  return max
}

function deduplicateByTitle(items: SavedItem[]): SavedItem[] {
  const kept: SavedItem[] = []
  for (const item of items) {
    const isDup = kept.some(
      (k) => longestCommonSubstring(k.title, item.title) >= SHARED_CHARS
    )
    if (!isDup) kept.push(item)
  }
  return kept
}

/**
 * メールに1通の集約サマリーを送る。
 * - タイトルが10文字以上共通する記事は重複として除外
 */
export async function sendEmailDigest(
  to: string,
  summaries: AnchorSummary[]
): Promise<NotifyResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // 未設定時は「送信成功」扱いにしない。skipped を返し、呼び出し側で notified=true にしない。
    console.warn('[notify] RESEND_API_KEY not set, skipping email')
    return { status: 'skipped', error: 'RESEND_API_KEY not set' }
  }

  // 重複タイトル除去
  const dedupedSummaries = summaries
    .map((s) => ({ ...s, items: deduplicateByTitle(s.items) }))
    .filter((s) => s.items.length > 0)

  const totalItems = dedupedSummaries.reduce((sum, s) => sum + s.items.length, 0)
  if (totalItems === 0) return { status: 'skipped', error: 'no items' }

  const dateStr = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  })
  const dashboardUrl = urlWithUtm('/dashboard', 'daily_digest')

  const sections = dedupedSummaries
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
      <h2 style="font-size:18px;margin:0 0 4px;color:#111;">【ReAnker】今日の新着 ${totalItems}件</h2>
      <p style="font-size:12px;color:#888;margin:0 0 12px;">${dateStr}</p>
      <p style="font-size:14px;color:#444;margin:0 0 20px;line-height:1.7;">
        本日の競合・業界の新着プレスリリースをお届けします。<br>
        気になる記事はリンクから原文をご確認ください。
      </p>
      ${sections}
      <hr style="border:none;border-top:1px solid #eee;margin:28px 0 20px;">
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${escapeAttr(dashboardUrl)}"
           style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;
                  font-size:14px;font-weight:600;padding:12px 32px;border-radius:6px;letter-spacing:.3px;
                  border-top:3px solid #378ADD;">
          ダッシュボードで全件確認 →
        </a>
      </div>
      <p style="font-size:11px;color:#aaa;text-align:center;margin:0;">
        <a href="${urlWithUtm('/settings', 'daily_digest', 'settings_link')}" style="color:#aaa;">通知設定を変更</a>
      </p>
    </div>
  `

  try {
    const res = await fetchWithRetry('https://api.resend.com/emails', {
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
    if (!res.ok) {
      return { status: 'failed', error: `Resend failed: HTTP ${res.status} ${await res.text()}` }
    }
    return { status: 'success' }
  } catch (e: any) {
    return { status: 'failed', error: `Resend error: ${e?.message ?? e}` }
  }
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

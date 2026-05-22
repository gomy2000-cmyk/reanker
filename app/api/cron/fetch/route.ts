import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { yesterdayJST } from '@/lib/scraper'
import { fetchAndSaveForAnchor, type SavedItem } from '@/lib/fetchAndSave'
import { sendSlackDigest, sendEmailDigest, type AnchorSummary } from '@/lib/notify'

export const maxDuration = 300

interface AnchorRow {
  id: string
  name: string
  query_value: string
  sources: string[]
  notify_slack: boolean
  notify_email: boolean
  warmup_until: string
  user_id: string
  users: {
    id: string
    plan: string
    email: string
    notify_email: string | null
    slack_webhook_url: string | null
  }
}

/**
 * Vercel Cron: 09:00 JST (00:00 UTC) 毎日
 *
 * 動作:
 *   1. 全アンカーから記事を取得・保存（フリープランは隔日）
 *   2. 取得分が0件のユーザーには通知しない
 *   3. ユーザーごとに、新規取得した記事をアンカー別にグルーピングして1通だけ通知
 *   4. warmup_until 経過後のアンカーのみ通知対象（warmup中はsilentにnotified=trueマーク）
 *   5. 手動「今すぐ取得」(/api/anchor/[id]/fetch) からは呼ばれない=通知も飛ばない
 *
 * 手動実行例（デバッグ）:
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *        "https://www.reanker.com/api/cron/fetch?date=any&notify=false"
 *
 * クエリパラメータ:
 *   ?date=YYYY-MM-DD  指定日のみ取得
 *   ?date=any         日付フィルタなし全件取得（デフォルトは yesterdayJST）
 *   ?notify=false     通知をスキップ（デバッグ用）
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dateParam = req.nextUrl.searchParams.get('date')
  const notifyEnabled = req.nextUrl.searchParams.get('notify') !== 'false'
  const targetDate: string | null =
    dateParam === 'any' ? null : (dateParam ?? yesterdayJST())

  const now = new Date()
  const isEvenDay = now.getDate() % 2 === 0

  // 全アンカー取得（ユーザー情報込み）
  const { data: anchors } = await supabaseAdmin
    .from('pick_keywords')
    .select('id, name, query_value, sources, notify_slack, notify_email, warmup_until, user_id, users!inner(id, plan, email, notify_email, slack_webhook_url)')

  if (!anchors || anchors.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, message: 'no anchors' })
  }

  // ユーザーごとに通知対象を蓄積
  const userNotificationBuckets = new Map<
    string,
    {
      user: AnchorRow['users']
      slack: AnchorSummary[]
      email: AnchorSummary[]
      allSavedItemIds: string[] // 通知後にnotified=trueをマーク
    }
  >()

  let processed = 0
  let totalSaved = 0
  let totalSkipped = 0
  const errorsAcc: string[] = []

  for (const anchor of anchors as unknown as AnchorRow[]) {
    // フリープランは隔日（偶数日のみ実行）
    if (anchor.users.plan === 'free' && !isEvenDay) continue

    processed++
    const result = await fetchAndSaveForAnchor(
      { id: anchor.id, query_value: anchor.query_value, sources: anchor.sources },
      targetDate
    )
    totalSaved += result.saved
    totalSkipped += result.skipped
    errorsAcc.push(...result.errors)

    // 新着0件 → 何もしない
    if (result.savedItems.length === 0) continue

    const warmupActive = new Date(anchor.warmup_until) > now

    if (warmupActive || !notifyEnabled) {
      // warmup期間中 or 通知無効 → 取得した記事を silent に notified=true マーク
      const ids = result.savedItems.map((i) => i.id)
      await supabaseAdmin.from('items').update({ notified: true }).in('id', ids)
      continue
    }

    // 通知バケットに追加
    if (!userNotificationBuckets.has(anchor.user_id)) {
      userNotificationBuckets.set(anchor.user_id, {
        user: anchor.users,
        slack: [],
        email: [],
        allSavedItemIds: [],
      })
    }
    const bucket = userNotificationBuckets.get(anchor.user_id)!
    bucket.allSavedItemIds.push(...result.savedItems.map((i) => i.id))

    if (anchor.notify_slack) {
      bucket.slack.push({ anchorName: anchor.name, items: result.savedItems })
    }
    if (anchor.notify_email) {
      bucket.email.push({ anchorName: anchor.name, items: result.savedItems })
    }
  }

  // ユーザーごとに通知送信
  let slackNotifications = 0
  let emailNotifications = 0
  const notifyErrors: string[] = []

  for (const [userId, bucket] of userNotificationBuckets) {
    try {
      if (bucket.slack.length > 0 && bucket.user.slack_webhook_url) {
        await sendSlackDigest(bucket.user.slack_webhook_url, bucket.slack)
        slackNotifications++
      }
      if (bucket.email.length > 0) {
        const to = bucket.user.notify_email || bucket.user.email
        if (to) {
          await sendEmailDigest(to, bucket.email)
          emailNotifications++
        }
      }
      // 通知成功 → notified=true をマーク
      if (bucket.allSavedItemIds.length > 0) {
        await supabaseAdmin
          .from('items')
          .update({ notified: true })
          .in('id', bucket.allSavedItemIds)
      }
    } catch (e: any) {
      notifyErrors.push(`user ${userId}: ${e?.message ?? e}`)
    }
  }

  return NextResponse.json({
    ok: true,
    target_date: targetDate,
    notify_enabled: notifyEnabled,
    processed,
    found: 0, // フィールドは互換用
    saved: totalSaved,
    skipped: totalSkipped,
    slack_notifications: slackNotifications,
    email_notifications: emailNotifications,
    errors: [...errorsAcc, ...notifyErrors],
  })
}

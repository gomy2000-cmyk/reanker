import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { yesterdayJST } from '@/lib/scraper'
import { fetchAndSaveForAnchor } from '@/lib/fetchAndSave'
import { sendSlackDigest, sendEmailDigest, type AnchorSummary } from '@/lib/notify'
import { isFetchDayJST, isStandardPlan, canUseSlackNotification, normalizePlan, type Plan } from '@/lib/plan'

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
 * プラン制御:
 *   - Free: JST月・水・金のみ実行（他曜日はスキップ）、Slack通知不可（メールのみ）
 *   - Standard: 毎日実行、Slack/メール両方OK
 *
 * 動作:
 *   1. 全アンカー走査、ユーザープランに応じて取得スキップ判定
 *   2. 取得・保存（is_clipped, deleted_at, category, importance 含む）
 *   3. 取得分が0件のユーザーには通知しない
 *   4. ユーザーごとに、新規取得した記事をアンカー別にグルーピングして1通だけ通知
 *   5. warmup_until 経過後のアンカーのみ通知対象（warmup中はsilent mark）
 *   6. FreeはSlack通知をスキップ（DBで notify_slack=true でも送らない）
 *   7. 手動「今すぐ取得」(/api/anchor/[id]/fetch) からは呼ばれない=通知も飛ばない
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

  // 全アンカー取得（ユーザー情報込み）
  const { data: anchors } = await supabaseAdmin
    .from('pick_keywords')
    .select('id, name, query_value, sources, notify_slack, notify_email, warmup_until, user_id, users!inner(id, plan, email, notify_email, slack_webhook_url)')

  if (!anchors || anchors.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, message: 'no anchors' })
  }

  const userNotificationBuckets = new Map<
    string,
    {
      user: AnchorRow['users']
      slack: AnchorSummary[]
      email: AnchorSummary[]
      allSavedItemIds: string[]
    }
  >()

  let processed = 0
  let skippedByPlan = 0
  let totalSaved = 0
  let totalSkipped = 0
  const errorsAcc: string[] = []

  for (const anchor of anchors as unknown as AnchorRow[]) {
    const plan: Plan = normalizePlan(anchor.users.plan)

    // プラン別: 取得曜日チェック (Free は月水金のみ、Standard は毎日)
    if (!isFetchDayJST(plan, now)) {
      skippedByPlan++
      continue
    }

    processed++
    const result = await fetchAndSaveForAnchor(
      { id: anchor.id, query_value: anchor.query_value, sources: anchor.sources },
      targetDate
    )
    totalSaved += result.saved
    totalSkipped += result.skipped
    errorsAcc.push(...result.errors)

    if (result.savedItems.length === 0) continue

    const warmupActive = new Date(anchor.warmup_until) > now
    if (warmupActive || !notifyEnabled) {
      const ids = result.savedItems.map((i) => i.id)
      await supabaseAdmin.from('items').update({ notified: true }).in('id', ids)
      continue
    }

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

    // プラン別: Slack通知はStandardのみ
    if (anchor.notify_slack && canUseSlackNotification(plan)) {
      bucket.slack.push({ anchorName: anchor.name, items: result.savedItems })
    }
    if (anchor.notify_email) {
      bucket.email.push({ anchorName: anchor.name, items: result.savedItems })
    }
  }

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
    skipped_by_plan: skippedByPlan,
    saved: totalSaved,
    skipped: totalSkipped,
    slack_notifications: slackNotifications,
    email_notifications: emailNotifications,
    errors: [...errorsAcc, ...notifyErrors],
  })
}

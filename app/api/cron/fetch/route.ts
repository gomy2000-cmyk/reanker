import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { yesterdayJST } from '@/lib/scraper'
import { runFetch, type SavedItem } from '@/lib/runFetch'
import { sendSlackDigest, sendEmailDigest, type AnchorSummary } from '@/lib/notify'
import { isFetchDayJST, canUseSlackNotification, normalizePlan, type Plan } from '@/lib/plan'

export const maxDuration = 300

interface AnchorRow {
  id: string
  name: string
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
 * 全アンカーで runFetch() を呼び、新規取得分を通知パイプラインに流す。
 * 各実行は fetch_runs テーブルに記録される。
 *
 * プラン制御:
 *   - Free: JST月・水・金のみ実行（他曜日はスキップ）、Slack通知不可
 *   - Standard: 毎日実行、Slack/メール両方
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

  const { data: anchors } = await supabaseAdmin
    .from('pick_keywords')
    .select('id, name, notify_slack, notify_email, warmup_until, user_id, users!inner(id, plan, email, notify_email, slack_webhook_url)')

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
  let totalDuplicate = 0
  const runErrors: string[] = []

  for (const anchor of anchors as unknown as AnchorRow[]) {
    const plan: Plan = normalizePlan(anchor.users.plan)

    if (!isFetchDayJST(plan, now)) {
      skippedByPlan++
      continue
    }

    processed++
    const result = await runFetch(anchor.id, 'cron', targetDate)
    totalSaved += result.total_saved
    totalDuplicate += result.total_duplicate

    if (result.status === 'error' && result.error_message) {
      runErrors.push(`anchor ${anchor.id}: ${result.error_message}`)
    }
    for (const [name, sr] of Object.entries(result.sources)) {
      if (sr.error_sample) {
        runErrors.push(`anchor ${anchor.id} [${name}]: ${sr.error_sample}`)
      }
    }

    if (result.saved_items.length === 0) continue

    const warmupActive = new Date(anchor.warmup_until) > now
    if (warmupActive || !notifyEnabled) {
      const ids = result.saved_items.map((i: SavedItem) => i.id)
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
    bucket.allSavedItemIds.push(...result.saved_items.map((i) => i.id))

    if (anchor.notify_slack && canUseSlackNotification(plan)) {
      bucket.slack.push({ anchorName: anchor.name, items: result.saved_items })
    }
    if (anchor.notify_email) {
      bucket.email.push({ anchorName: anchor.name, items: result.saved_items })
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
    duplicate: totalDuplicate,
    slack_notifications: slackNotifications,
    email_notifications: emailNotifications,
    errors: [...runErrors, ...notifyErrors],
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { daysAgoJST } from '@/lib/scraper'
import { runFetch, type SavedItem } from '@/lib/runFetch'
import { sendSlackDigest, sendEmailDigest, type AnchorSummary, type NotifyResult } from '@/lib/notify'
import { isFetchDayJST, canUseSlackNotification, normalizePlan, type Plan } from '@/lib/plan'
import { sendOpsAlert } from '@/lib/alert'

export const maxDuration = 300

type NotificationLogInsert = {
  user_id: string
  item_id: string
  channel: 'slack' | 'email'
  status: 'success' | 'failed' | 'skipped'
  error_message: string | null
  sent_at: string | null
}

/** Postgres/PostgREST のテーブル未作成エラー判定（schema.sql 未適用の検知用）。 */
function isMissingTableError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false
  return (
    error.code === '42P01' ||       // undefined_table (Postgres)
    error.code === 'PGRST205' ||    // PostgREST: table not found in schema cache
    /does not exist|could not find the table/i.test(error.message ?? '')
  )
}

/**
 * notification_logs への記録。
 * テーブル未作成・INSERT失敗でも通知処理本体は落とさない（握りつぶさず console.error で可視化）。
 */
async function logNotifications(rows: NotificationLogInsert[]): Promise<void> {
  if (rows.length === 0) return
  try {
    const { error } = await supabaseAdmin.from('notification_logs').insert(rows)
    if (error) {
      const hint = isMissingTableError(error)
        ? '（notification_logs テーブル未作成の可能性。supabase/schema.sql のSQLを適用してください）'
        : ''
      console.error(`[notify] notification_logs への記録に失敗${hint}:`, error.message)
    }
  } catch (e: unknown) {
    console.error('[notify] notification_logs への記録で例外:', e instanceof Error ? e.message : e)
  }
}

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

  try {
    return await handleCronFetch(req)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[cron/fetch] unhandled error:', e)
    await sendOpsAlert('日次取得cronが異常終了しました', [msg])
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

async function handleCronFetch(req: NextRequest) {
  const dateParam = req.nextUrl.searchParams.get('date')
  const notifyEnabled = req.nextUrl.searchParams.get('notify') !== 'false'
  // 直近ウィンドウの下限日。完全一致ではなく「この日以降」を採用する。
  //   - News/PR TIMES は関連度順で古い記事も返すため、完全一致(=昨日)では取りこぼす。
  //   - cron は毎日走るが、取りこぼし・実行時刻・相対日付の誤差を吸収するため3日遡る。
  //   - 重複は items の UNIQUE(pickkw_id, url) で自然にスキップされるので窓を広げても安全。
  const sinceDate: string | null =
    dateParam === 'any' ? null : (dateParam ?? daysAgoJST(3))

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
    const result = await runFetch(anchor.id, 'cron', sinceDate)
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
      // 登録直後の初回取得分・過去記事は通知対象にしない（従来どおり notified=true で抑制）。
      const ids = result.saved_items.map((i: SavedItem) => i.id)
      await supabaseAdmin.from('items').update({ notified: true }).in('id', ids)
      // 送信せず抑制した分は skipped として記録（追える状態にする）。
      const channels: ('slack' | 'email')[] = []
      if (anchor.notify_slack && canUseSlackNotification(plan)) channels.push('slack')
      if (anchor.notify_email) channels.push('email')
      const reason = warmupActive ? 'warmup' : 'notify disabled'
      await logNotifications(
        channels.flatMap((ch) =>
          ids.map((id) => ({
            user_id: anchor.user_id,
            item_id: id,
            channel: ch,
            status: 'skipped' as const,
            error_message: reason,
            sent_at: null,
          }))
        )
      )
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

  let userIndex = 0
  for (const [userId, bucket] of userNotificationBuckets) {
    // Resend は毎秒2リクエスト制限。ユーザー間に間隔を空けて 429 を予防する
    // （sendEmailDigest/sendSlackDigest 側にも 429 リトライがあるので二重防御）。
    if (userIndex++ > 0) await new Promise((r) => setTimeout(r, 600))
    try {
      // チャンネルごとに送信対象の item id を集計（notified 判定に使う）。
      const slackItemIds = bucket.slack.flatMap((s) => s.items.map((i) => i.id))
      const emailItemIds = bucket.email.flatMap((s) => s.items.map((i) => i.id))

      // ---- Slack 送信 ----
      let slackResult: NotifyResult = { status: 'skipped', error: 'no slack target' }
      if (bucket.slack.length > 0) {
        slackResult = bucket.user.slack_webhook_url
          ? await sendSlackDigest(bucket.user.slack_webhook_url, bucket.slack)
          : { status: 'skipped', error: 'no slack_webhook_url' }
        if (slackResult.status === 'success') slackNotifications++
        else if (slackResult.status === 'failed') {
          notifyErrors.push(`user ${userId} [slack]: ${slackResult.error ?? 'failed'}`)
        }
      }

      // ---- メール送信 ----
      let emailResult: NotifyResult = { status: 'skipped', error: 'no email target' }
      if (bucket.email.length > 0) {
        const to = bucket.user.notify_email || bucket.user.email
        emailResult = to
          ? await sendEmailDigest(to, bucket.email)
          : { status: 'skipped', error: 'no recipient' }
        if (emailResult.status === 'success') emailNotifications++
        else if (emailResult.status === 'failed') {
          notifyErrors.push(`user ${userId} [email]: ${emailResult.error ?? 'failed'}`)
        }
      }

      // ---- notification_logs に記事×チャンネル単位で記録 ----
      const nowIso = new Date().toISOString()
      await logNotifications([
        ...slackItemIds.map((id) => ({
          user_id: userId,
          item_id: id,
          channel: 'slack' as const,
          status: slackResult.status,
          error_message: slackResult.error ?? null,
          sent_at: slackResult.status === 'success' ? nowIso : null,
        })),
        ...emailItemIds.map((id) => ({
          user_id: userId,
          item_id: id,
          channel: 'email' as const,
          status: emailResult.status,
          error_message: emailResult.error ?? null,
          sent_at: emailResult.status === 'success' ? nowIso : null,
        })),
      ])

      // ---- notified 判定：対象チャンネルが「failed でない」記事を true にする ----
      // success と skipped（送信先なし・APIキー未設定・対象0件など）は通知完了扱い。
      // failed のチャンネルを含む記事だけ notified=false のまま残し、次回 cron で再送候補にする。
      //   ※ skipped を false 扱いにすると、例えば RESEND 未設定環境では Slack が成功しても
      //     永久に notified=false のままになり、notified 列が信頼できなくなる。
      const slackFailed = slackResult.status === 'failed'
      const emailFailed = emailResult.status === 'failed'
      const slackSet = new Set(slackItemIds)
      const emailSet = new Set(emailItemIds)
      const toMark: string[] = []
      for (const id of bucket.allSavedItemIds) {
        const inSlack = slackSet.has(id)
        const inEmail = emailSet.has(id)
        if (!inSlack && !inEmail) {
          // 通知対象チャンネルなし＝送るものが無いので true。
          toMark.push(id)
          continue
        }
        const slackPass = !inSlack || !slackFailed
        const emailPass = !inEmail || !emailFailed
        if (slackPass && emailPass) toMark.push(id)
      }
      const uniqueMark = [...new Set(toMark)]
      if (uniqueMark.length > 0) {
        await supabaseAdmin.from('items').update({ notified: true }).in('id', uniqueMark)
      }
    } catch (e: unknown) {
      notifyErrors.push(`user ${userId}: ${e instanceof Error ? e.message : e}`)
    }
  }

  const allErrors = [...runErrors, ...notifyErrors]
  if (allErrors.length > 0) {
    await sendOpsAlert(`日次取得cronでエラー ${allErrors.length}件`, allErrors)
  }

  return NextResponse.json({
    ok: true,
    since_date: sinceDate,
    notify_enabled: notifyEnabled,
    processed,
    skipped_by_plan: skippedByPlan,
    saved: totalSaved,
    duplicate: totalDuplicate,
    slack_notifications: slackNotifications,
    email_notifications: emailNotifications,
    errors: allErrors,
  })
}

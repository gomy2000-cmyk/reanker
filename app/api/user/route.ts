import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { canUseSlackNotification, normalizePlan, planLimitErrorBody, PLAN_LIMITS } from '@/lib/plan'
import { isValidSlackWebhookUrl } from '@/lib/notify'

/**
 * GET /api/user
 * 現在ログイン中ユーザーの基本情報 + プラン + プラン制限情報を返す。
 * UI側でプラン分岐に使う。
 */
export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, email, name, plan, slack_webhook_url, notify_email')
    .eq('email', session.user.email)
    .single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const plan = normalizePlan(user.plan)
  const { count: anchorCount } = await supabaseAdmin
    .from('pick_keywords')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return NextResponse.json({
    user: { ...user, plan },
    limits: PLAN_LIMITS[plan],
    anchorCount: anchorCount ?? 0,
  })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, plan')
    .eq('email', session.user.email)
    .single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const plan = normalizePlan(user.plan)
  const body = await req.json()
  // ログイン用 email は更新対象から除外（変更不可）。通知先は notify_email のみ編集可。
  const allowed = ['name', 'slack_webhook_url', 'notify_email']
  const updates: Record<string, any> = {}
  for (const k of allowed) if (k in body) updates[k] = body[k]

  // 通知先メール: 空 → null（送信時はログインメールにフォールバック）、非空 → メール形式を検証
  if ('notify_email' in updates) {
    const raw = typeof updates.notify_email === 'string' ? updates.notify_email.trim() : ''
    if (raw === '') {
      updates.notify_email = null
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
      return NextResponse.json({ error: 'メールアドレスの形式が正しくありません。' }, { status: 400 })
    } else {
      updates.notify_email = raw
    }
  }

  // Slack Webhook URL: 空 → null（クリア、全プランで可）、非空 → Standard限定＋形式検証
  if ('slack_webhook_url' in updates) {
    const raw = typeof updates.slack_webhook_url === 'string' ? updates.slack_webhook_url.trim() : ''
    if (raw === '') {
      updates.slack_webhook_url = null
    } else {
      if (!canUseSlackNotification(plan)) {
        return NextResponse.json(planLimitErrorBody('slack'), { status: 403 })
      }
      if (!isValidSlackWebhookUrl(raw)) {
        return NextResponse.json(
          { error: 'Slack Webhook URL の形式が正しくありません。「https://hooks.slack.com/」で始まるURLを入力してください。' },
          { status: 400 }
        )
      }
      updates.slack_webhook_url = raw
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true })
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('email', session.user.email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

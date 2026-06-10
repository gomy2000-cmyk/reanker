import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { canUseSlackNotification, normalizePlan, planLimitErrorBody, PLAN_LIMITS } from '@/lib/plan'
import { userPatchSchema, parseBody } from '@/lib/validation'

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
  // ログイン用 email は更新対象から除外（変更不可）。通知先は notify_email のみ編集可。
  const parsed = await parseBody(req, userPatchSchema)
  if (!parsed.ok) return NextResponse.json({ error: parsed.message }, { status: 400 })

  const updates: Record<string, string | null> = {}
  if (parsed.data.name !== undefined) updates.name = parsed.data.name
  if (parsed.data.slack_webhook_url !== undefined) {
    // 空 → null（クリア）
    updates.slack_webhook_url = parsed.data.slack_webhook_url || null
  }
  if (parsed.data.notify_email !== undefined) {
    // 空 → null（送信時はログインメールにフォールバック）
    updates.notify_email = parsed.data.notify_email || null
  }

  // Free は Slack Webhook URL の設定不可（空文字でクリアは OK）
  if ('slack_webhook_url' in updates && updates.slack_webhook_url) {
    if (!canUseSlackNotification(plan)) {
      return NextResponse.json(planLimitErrorBody('slack'), { status: 403 })
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

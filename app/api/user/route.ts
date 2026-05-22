import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { canUseSlackNotification, normalizePlan, planLimitErrorBody, PLAN_LIMITS } from '@/lib/plan'

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
  const allowed = ['name', 'email', 'slack_webhook_url', 'notify_email']
  const updates: Record<string, any> = {}
  for (const k of allowed) if (k in body) updates[k] = body[k]

  // Free は Slack Webhook URL の設定不可（空文字でクリアは OK）
  if ('slack_webhook_url' in updates && updates.slack_webhook_url) {
    if (!canUseSlackNotification(plan)) {
      return NextResponse.json(planLimitErrorBody('slack'), { status: 403 })
    }
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('email', session.user.email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

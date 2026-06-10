import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { canCreateAnchor, canUseSlackNotification, normalizePlan, planLimitErrorBody } from '@/lib/plan'
import { anchorCreateSchema, anchorUpdateSchema, anchorDeleteSchema, parseBody } from '@/lib/validation'
function nextDay9amJST(): string {
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const next = new Date(jst)
  next.setDate(next.getDate() + 1)
  next.setHours(9, 0, 0, 0)
  // JST→UTC
  return new Date(next.getTime() - 9 * 60 * 60 * 1000).toISOString()
}

async function getUser(email: string) {
  const { data } = await supabaseAdmin.from('users').select('*').eq('email', email).single()
  return data
}

// 登録
export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const plan = normalizePlan(user.plan)

  // アンカー数制限（Free=3件、Standard=無制限）
  const { count } = await supabaseAdmin
    .from('pick_keywords')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
  if (!canCreateAnchor(plan, count ?? 0)) {
    return NextResponse.json(planLimitErrorBody('anchor_limit'), { status: 403 })
  }

  const parsed = await parseBody(req, anchorCreateSchema)
  if (!parsed.ok) return NextResponse.json({ error: parsed.message }, { status: 400 })
  const { name, type, query_value, sources, exclude_keywords, notify_slack, notify_email } = parsed.data

  // Slack 通知は Standard のみ許可
  const slackRequested = notify_slack === true
  if (slackRequested && !canUseSlackNotification(plan)) {
    return NextResponse.json(planLimitErrorBody('slack'), { status: 403 })
  }

  const { data, error } = await supabaseAdmin.from('pick_keywords').insert({
    user_id: user.id,
    name,
    type,
    query_value,
    sources: sources ?? ['prtimes', 'googlenews'],
    exclude_keywords: exclude_keywords ?? [],
    notify_slack: slackRequested && canUseSlackNotification(plan),
    notify_email: notify_email ?? false,
    warmup_until: nextDay9amJST(),
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// 更新
export async function PATCH(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const plan = normalizePlan(user.plan)
  const parsed = await parseBody(req, anchorUpdateSchema)
  if (!parsed.ok) return NextResponse.json({ error: parsed.message }, { status: 400 })
  const { id, name, type, query_value, sources, exclude_keywords, notify_slack, notify_email } = parsed.data

  // Slack 通知の有効化は Standard のみ
  if (notify_slack === true && !canUseSlackNotification(plan)) {
    return NextResponse.json(planLimitErrorBody('slack'), { status: 403 })
  }

  const { data, error } = await supabaseAdmin
    .from('pick_keywords')
    .update({
      name,
      type,
      query_value,
      sources,
      exclude_keywords: exclude_keywords ?? [],
      notify_slack: notify_slack === true && canUseSlackNotification(plan),
      notify_email,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  // 0行更新 = 存在しない or 他人のアンカー
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

// 削除
export async function DELETE(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const parsed = await parseBody(req, anchorDeleteSchema)
  if (!parsed.ok) return NextResponse.json({ error: parsed.message }, { status: 400 })
  const { id } = parsed.data

  const { data, error } = await supabaseAdmin
    .from('pick_keywords')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  // 0行削除 = 存在しない or 他人のアンカー（従来は200を返していた）
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'
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

  // フリープラン: 3件制限
  if (user.plan === 'free') {
    const { count } = await supabaseAdmin
      .from('pick_keywords')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'PLAN_LIMIT', message: 'フリープランは3件まで' }, { status: 403 })
    }
  }

  const body = await req.json()
  const { name, type, query_value, sources, notify_slack, notify_email } = body

  const { data, error } = await supabaseAdmin.from('pick_keywords').insert({
    user_id: user.id,
    name,
    type,
    query_value,
    sources: sources ?? ['prtimes', 'googlenews'],
    notify_slack: notify_slack ?? true,
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

  const body = await req.json()
  const { id, name, type, query_value, sources, notify_slack, notify_email } = body

  const { data, error } = await supabaseAdmin
    .from('pick_keywords')
    .update({ name, type, query_value, sources, notify_slack, notify_email })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// 削除
export async function DELETE(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { id } = await req.json()

  const { error } = await supabaseAdmin
    .from('pick_keywords')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

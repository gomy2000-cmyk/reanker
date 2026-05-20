import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('email', session.user.email).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { id, is_read } = await req.json()

  // 自分のkeywordに属する記事のみ更新可
  const { data: item } = await supabaseAdmin
    .from('items')
    .select('id, pick_keywords!inner(user_id)')
    .eq('id', id)
    .single() as any

  if (!item || item.pick_keywords.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabaseAdmin.from('items').update({ is_read }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

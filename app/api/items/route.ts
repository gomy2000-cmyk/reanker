import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'

/** 認証 + 所有権チェック共通ヘルパー */
async function verifyOwnership(itemId: string, email: string): Promise<boolean> {
  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('email', email).single()
  if (!user) return false

  const { data: item } = await supabaseAdmin
    .from('items')
    .select('id, pick_keywords!inner(user_id)')
    .eq('id', itemId)
    .single() as any

  return !!item && item.pick_keywords?.user_id === user.id
}

/** PATCH /api/items
 *  body: { id, is_read?, is_clipped? } のいずれか・任意の組み合わせ
 */
export async function PATCH(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, is_read, is_clipped } = body
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  if (!(await verifyOwnership(id, session.user.email))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updates: Record<string, unknown> = {}
  if (typeof is_read === 'boolean') updates.is_read = is_read
  if (typeof is_clipped === 'boolean') updates.is_clipped = is_clipped
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('items').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

/** DELETE /api/items?id=xxx
 *  ソフトデリート（deleted_at をセット）。再取得時 URL UNIQUE 制約で重複防止。
 */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  if (!(await verifyOwnership(id, session.user.email))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabaseAdmin
    .from('items')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { fetchAndSaveForAnchor } from '@/lib/fetchAndSave'

export const maxDuration = 60

/**
 * 個別アンカーの「今すぐ取得」エンドポイント。
 * UI から手動でトリガーする想定。日付フィルタなしで全件取得。
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 所有者チェック
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: anchor } = await supabaseAdmin
    .from('pick_keywords')
    .select('id, query_value, sources, user_id')
    .eq('id', id)
    .single()

  if (!anchor) return NextResponse.json({ error: 'Anchor not found' }, { status: 404 })
  if (anchor.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 日付フィルタなし → 検索結果ページに出ている分（最大10件）すべて取得
  const result = await fetchAndSaveForAnchor(
    { id: anchor.id, query_value: anchor.query_value, sources: anchor.sources },
    null
  )

  return NextResponse.json({
    ok: true,
    found: result.found,
    saved: result.saved,
    skipped: result.skipped,
    errors: result.errors,
  })
}

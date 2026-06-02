import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { runFetch } from '@/lib/runFetch'
import { daysAgoJST } from '@/lib/scraper'

export const maxDuration = 60

/**
 * 個別アンカーの「今すぐ取得」エンドポイント。
 * UI から手動でトリガーする想定。直近14日分を取得する。
 * （全件取得すると検索結果に混ざる数年前の古い記事まで保存してしまうため）
 *
 * すべての取得は lib/runFetch.ts の runFetch() を通る（cron と共通の入口）。
 * 実行結果は fetch_runs テーブルに記録される。
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

  // 所有者チェック（service_role を使うので RLS バイパス、明示的にチェックする）
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: anchor } = await supabaseAdmin
    .from('pick_keywords')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (!anchor) return NextResponse.json({ error: 'Anchor not found' }, { status: 404 })
  if (anchor.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const result = await runFetch(id, 'manual', daysAgoJST(14))

  return NextResponse.json({
    ok: result.status !== 'error',
    status: result.status,
    run_id: result.run_id,
    found: result.total_found,
    saved: result.total_saved,
    duplicate: result.total_duplicate,
    errors: result.total_errors,
    sources: result.sources,
    duration_ms: result.duration_ms,
    error_message: result.error_message,
  })
}

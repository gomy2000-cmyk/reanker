import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { canUseReports, normalizePlan, planLimitErrorBody } from '@/lib/plan'

/**
 * GET /api/reports?type=weekly|monthly&start=YYYY-MM-DD
 *
 * start を指定しなければ最新のレポートを1件返す。
 * 指定すれば該当 period_start のレポート1件を返す。
 *
 * Free プランは 403。
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, plan')
    .eq('email', session.user.email)
    .single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const plan = normalizePlan(user.plan)
  if (!canUseReports(plan)) {
    return NextResponse.json(planLimitErrorBody('reports'), { status: 403 })
  }

  const type = req.nextUrl.searchParams.get('type') === 'monthly' ? 'monthly' : 'weekly'
  const start = req.nextUrl.searchParams.get('start')

  let query = supabaseAdmin
    .from('reports')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', type)
    .order('period_start', { ascending: false })

  if (start) {
    query = query.eq('period_start', start).limit(1)
  } else {
    query = query.limit(1)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    report: data?.[0] ?? null,
  })
}

/** GET /api/reports/list?type=weekly|monthly → 期間リストだけ返す */
export async function POST() {
  return NextResponse.json({ error: 'Use GET' }, { status: 405 })
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { canUseReports, normalizePlan, planLimitErrorBody } from '@/lib/plan'

/**
 * GET /api/reports/list?type=weekly|monthly
 * → 過去レポートの一覧（id, period_start, period_end, title）を新しい順で返す。
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

  const { data, error } = await supabaseAdmin
    .from('reports')
    .select('id, type, period_start, period_end, title, total_items')
    .eq('user_id', user.id)
    .eq('type', type)
    .order('period_start', { ascending: false })
    .limit(24)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reports: data ?? [] })
}

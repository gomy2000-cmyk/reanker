import { requireUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { canUseReports, normalizePlan } from '@/lib/plan'
import { ReportsClient } from './ReportsClient'
import { ReportsLockedView } from './ReportsLockedView'
import type { Report } from '@/lib/types'

export default async function ReportsPage() {
  const user = await requireUser()
  const plan = normalizePlan(user.plan)

  if (!canUseReports(plan)) {
    return <ReportsLockedView />
  }

  // 初期表示用: 直近の週次レポート + 一覧
  const [weeklyLatest, weeklyList, monthlyList] = await Promise.all([
    supabaseAdmin
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'weekly')
      .order('period_start', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseAdmin
      .from('reports')
      .select('id, type, period_start, period_end, title, total_items')
      .eq('user_id', user.id)
      .eq('type', 'weekly')
      .order('period_start', { ascending: false })
      .limit(24),
    supabaseAdmin
      .from('reports')
      .select('id, type, period_start, period_end, title, total_items')
      .eq('user_id', user.id)
      .eq('type', 'monthly')
      .order('period_start', { ascending: false })
      .limit(24),
  ])

  return (
    <ReportsClient
      initialReport={(weeklyLatest.data as Report | null) ?? null}
      initialType="weekly"
      weeklyList={weeklyList.data ?? []}
      monthlyList={monthlyList.data ?? []}
    />
  )
}

import { requireUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { canUseReports, normalizePlan } from '@/lib/plan'
import { computeReportForUser, getPreviousWeekRangeJST, getPreviousMonthRangeJST } from '@/lib/reports'
import { ReportsClient } from './ReportsClient'
import type { Report } from '@/lib/types'

export default async function ReportsPage() {
  const user = await requireUser()
  const plan = normalizePlan(user.plan)
  const isStandard = canUseReports(plan)

  if (!isStandard) {
    // Free プラン: 自分のデータを「前週分」の集計でその場プレビュー（DB保存はしない）
    const { start, end } = getPreviousWeekRangeJST()
    const computed = await computeReportForUser(user.id, 'weekly', start, end)

    const previewReport: Report | null = computed.ok
      ? {
          id: 'preview-weekly',
          user_id: user.id,
          type: 'weekly',
          period_start: start,
          period_end: end,
          title: `週次サマリ ${start}〜${end}`,
          summary: computed.payload.summary,
          total_items: computed.payload.total_items,
          unread_items: computed.payload.unread_items,
          top_anchor_name: computed.payload.top_anchor_name,
          top_category: computed.payload.top_category,
          highlights: computed.payload.highlights,
          anchor_summaries: computed.payload.anchor_summaries,
          category_counts: computed.payload.category_counts,
          notable_items: computed.payload.notable_items,
          created_at: new Date().toISOString(),
        }
      : null

    return (
      <ReportsClient
        initialReport={previewReport}
        initialType="weekly"
        weeklyList={[]}
        monthlyList={[]}
        isPreview
      />
    )
  }

  // Standard: 通常表示
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

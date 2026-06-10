import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isStandardPlan } from '@/lib/plan'
import { generateReportForUser, getPreviousMonthRangeJST } from '@/lib/reports'
import { sendOpsAlert } from '@/lib/alert'

export const maxDuration = 300

/**
 * Vercel Cron: 毎月1日 09:00 JST (1日 00:00 UTC)
 *
 * 動作:
 *   - 全 Standard ユーザーに対して前月分の月次レポートを生成・保存
 *   - Free ユーザーはスキップ
 *   - 同一期間のレポートが既にあれば上書き（upsert）
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const overrideStart = req.nextUrl.searchParams.get('start')
  const overrideEnd = req.nextUrl.searchParams.get('end')
  const { start, end } =
    overrideStart && overrideEnd
      ? { start: overrideStart, end: overrideEnd }
      : getPreviousMonthRangeJST()

  const { data: users } = await supabaseAdmin.from('users').select('id, plan')
  if (!users) return NextResponse.json({ ok: true, generated: 0 })

  let generated = 0
  let skipped = 0
  const errors: string[] = []

  for (const u of users) {
    if (!isStandardPlan(u.plan)) {
      skipped++
      continue
    }
    const r = await generateReportForUser(u.id, 'monthly', start, end)
    if (r.ok) generated++
    else if (r.error) errors.push(`user ${u.id}: ${r.error}`)
  }

  if (errors.length > 0) {
    await sendOpsAlert(`月次レポート生成でエラー ${errors.length}件`, errors)
  }

  return NextResponse.json({
    ok: true,
    type: 'monthly',
    period_start: start,
    period_end: end,
    generated,
    skipped_free: skipped,
    errors,
  })
}

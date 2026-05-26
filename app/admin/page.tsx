import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminSession, anonymizeUserId } from '@/lib/admin'
import { AdminDashboard } from './AdminDashboard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '管理ダッシュボード｜ReAnker',
  robots: { index: false, follow: false },
}

interface UserRow {
  id: string
  plan: string
  created_at: string
  has_stripe: boolean
  anchors: number
  items: number
  items_read: number
  items_clipped: number
  last_fetch_at: string | null
  has_error: boolean
}

interface AnchorRow {
  user_short: string
  name_masked: string
  type: string
  sources: string[]
  items: number
  last_fetch_at: string | null
  last_status: string | null
  created_at: string
}

interface FetchRunStat {
  date: string
  total_runs: number
  ok: number
  partial: number
  error: number
  total_saved: number
}

export default async function AdminPage() {
  const auth = await isAdminSession()
  if (!auth.ok) redirect('/login?from=admin')

  // ---------- ユーザー一覧（集計 + 匿名化） ----------
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id, plan, created_at, stripe_customer_id, stripe_subscription_id')
    .order('created_at', { ascending: false })

  const userRows: UserRow[] = []
  for (const u of users ?? []) {
    const [{ count: anchorCount }, { count: itemCount }, { count: readCount }, { count: clipCount }] = await Promise.all([
      supabaseAdmin.from('pick_keywords').select('id', { count: 'exact', head: true }).eq('user_id', u.id),
      supabaseAdmin
        .from('items')
        .select('id, pickkw_id, pick_keywords!inner(user_id)', { count: 'exact', head: true })
        .eq('pick_keywords.user_id', u.id)
        .is('deleted_at', null),
      supabaseAdmin
        .from('items')
        .select('id, pickkw_id, pick_keywords!inner(user_id)', { count: 'exact', head: true })
        .eq('pick_keywords.user_id', u.id)
        .eq('is_read', true)
        .is('deleted_at', null),
      supabaseAdmin
        .from('items')
        .select('id, pickkw_id, pick_keywords!inner(user_id)', { count: 'exact', head: true })
        .eq('pick_keywords.user_id', u.id)
        .eq('is_clipped', true)
        .is('deleted_at', null),
    ])

    // 最終取得時刻 + 直近にエラー有無
    const { data: lastRun } = await supabaseAdmin
      .from('fetch_runs')
      .select('started_at, status, pickkw_id, pick_keywords!inner(user_id)')
      .eq('pick_keywords.user_id', u.id)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const { count: errorRunsLast24h } = await supabaseAdmin
      .from('fetch_runs')
      .select('id, pickkw_id, pick_keywords!inner(user_id)', { count: 'exact', head: true })
      .eq('pick_keywords.user_id', u.id)
      .eq('status', 'error')
      .gte('started_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    userRows.push({
      id: anonymizeUserId(u.id),
      plan: u.plan,
      created_at: u.created_at,
      has_stripe: !!u.stripe_customer_id || !!u.stripe_subscription_id,
      anchors: anchorCount ?? 0,
      items: itemCount ?? 0,
      items_read: readCount ?? 0,
      items_clipped: clipCount ?? 0,
      last_fetch_at: lastRun?.started_at ?? null,
      has_error: (errorRunsLast24h ?? 0) > 0,
    })
  }

  // ---------- アンカー一覧（query_value マスク） ----------
  const { data: anchors } = await supabaseAdmin
    .from('pick_keywords')
    .select('id, name, type, sources, user_id, created_at')
    .order('created_at', { ascending: false })

  const anchorRows: AnchorRow[] = []
  for (const a of anchors ?? []) {
    const { count: itemCount } = await supabaseAdmin
      .from('items')
      .select('id', { count: 'exact', head: true })
      .eq('pickkw_id', a.id)
      .is('deleted_at', null)

    const { data: lastRun } = await supabaseAdmin
      .from('fetch_runs')
      .select('started_at, status')
      .eq('pickkw_id', a.id)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    anchorRows.push({
      user_short: anonymizeUserId(a.user_id),
      // アンカー名は1文字目+伏字+末尾1文字 だと運営者でも見えにくいので、
      // 長さだけマスク表示（"7文字" のように）
      name_masked: `${a.name.length}文字`,
      type: a.type,
      sources: a.sources,
      items: itemCount ?? 0,
      last_fetch_at: lastRun?.started_at ?? null,
      last_status: lastRun?.status ?? null,
      created_at: a.created_at,
    })
  }

  // ---------- 直近7日の取得サマリ ----------
  const { data: runs7d } = await supabaseAdmin
    .from('fetch_runs')
    .select('status, total_saved, started_at')
    .gte('started_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  const statByDate = new Map<string, FetchRunStat>()
  for (const r of runs7d ?? []) {
    const date = r.started_at.slice(0, 10)
    if (!statByDate.has(date)) {
      statByDate.set(date, { date, total_runs: 0, ok: 0, partial: 0, error: 0, total_saved: 0 })
    }
    const s = statByDate.get(date)!
    s.total_runs++
    if (r.status === 'ok') s.ok++
    else if (r.status === 'partial') s.partial++
    else if (r.status === 'error') s.error++
    s.total_saved += r.total_saved ?? 0
  }
  const dailyStats = Array.from(statByDate.values()).sort((a, b) => b.date.localeCompare(a.date))

  // ---------- 直近の取得エラー詳細 ----------
  const { data: recentErrors } = await supabaseAdmin
    .from('fetch_runs')
    .select('id, started_at, status, sources, error_message, pickkw_id')
    .in('status', ['partial', 'error'])
    .order('started_at', { ascending: false })
    .limit(10)

  const errorRows = (recentErrors ?? []).map((r) => {
    const issues: string[] = []
    if (r.error_message) issues.push(`run: ${r.error_message}`)
    for (const [src, info] of Object.entries(r.sources as Record<string, { error_sample: string | null }>)) {
      if (info.error_sample) issues.push(`${src}: ${info.error_sample}`)
    }
    return {
      started_at: r.started_at,
      status: r.status,
      issues,
    }
  })

  // ---------- 集計 ----------
  const summary = {
    users_total: userRows.length,
    users_free: userRows.filter((u) => u.plan === 'free').length,
    users_standard: userRows.filter((u) => u.plan === 'standard').length,
    users_new_24h: userRows.filter((u) => new Date(u.created_at) > new Date(Date.now() - 86400000)).length,
    users_with_error: userRows.filter((u) => u.has_error).length,
    anchors_total: anchorRows.length,
    items_total: userRows.reduce((sum, u) => sum + u.items, 0),
  }

  return (
    <AdminDashboard
      summary={summary}
      users={userRows}
      anchors={anchorRows}
      dailyStats={dailyStats}
      errors={errorRows}
    />
  )
}

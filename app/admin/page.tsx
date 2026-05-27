import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminSession, anonymizeUserId } from '@/lib/admin'
import { AdminDashboard } from './AdminDashboard'

// ---- タイトル類似度判定（メールの dedup と同じアルゴリズム） ----
function longestCommonSubstring(a: string, b: string): number {
  const m = a.length, n = b.length
  let max = 0
  const dp: number[] = new Array(n + 1).fill(0)
  for (let i = 1; i <= m; i++) {
    let prev = 0
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]
      if (a[i - 1] === b[j - 1]) { dp[j] = prev + 1; if (dp[j] > max) max = dp[j] }
      else dp[j] = 0
      prev = tmp
    }
  }
  return max
}

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
      name_masked: a.name,   // 管理者は実名表示
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

  // ---------- 重複記事検出（直近7日・クロスソース限定） ----------
  const { data: recentItems } = await supabaseAdmin
    .from('items')
    .select('id, title, source, url, published_at, pickkw_id')
    .is('deleted_at', null)
    .gte('published_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('published_at', { ascending: false })
    .limit(300)

  // アンカー別にグルーピングしてから類似タイトルを検出
  const byAnchor = new Map<string, { title: string; source: string; url: string; published_at: string }[]>()
  for (const item of recentItems ?? []) {
    if (!byAnchor.has(item.pickkw_id)) byAnchor.set(item.pickkw_id, [])
    byAnchor.get(item.pickkw_id)!.push({
      title: item.title,
      source: item.source,
      url: item.url,
      published_at: item.published_at,
    })
  }

  interface DupGroup {
    representative: string
    items: { title: string; source: string; url: string; published_at: string }[]
  }
  const dupGroups: DupGroup[] = []
  for (const [, items] of byAnchor) {
    const groups: DupGroup[] = []
    for (const item of items) {
      const found = groups.find((g) =>
        g.items.some((gi) => longestCommonSubstring(gi.title, item.title) >= 10)
      )
      if (found) {
        found.items.push(item)
      } else {
        groups.push({ representative: item.title, items: [item] })
      }
    }
    for (const g of groups) {
      const sources = new Set(g.items.map((i) => i.source))
      if (g.items.length >= 2 && sources.size >= 2) {
        dupGroups.push(g)
      }
    }
  }
  // 新しい順にソート（グループ内最新 published_at 基準）
  dupGroups.sort((a, b) => {
    const latestA = a.items[0]?.published_at ?? ''
    const latestB = b.items[0]?.published_at ?? ''
    return latestB.localeCompare(latestA)
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
      duplicates={dupGroups}
    />
  )
}

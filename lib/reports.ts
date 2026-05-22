/**
 * 週次・月次レポート生成ロジック（DB集計版）。
 *
 * 集計対象: items テーブル（deleted_at IS NULL のもの）
 * 出力先: reports テーブル（type, period_start, period_end ごとに1行 upsert）
 */
import { supabaseAdmin } from './supabase'
import type { Category } from './classify'
import type {
  ReportAnchorSummary,
  ReportHighlight,
  ReportNotableItem,
} from './types'

export type ReportType = 'weekly' | 'monthly'

interface ItemRow {
  id: string
  pickkw_id: string
  source: 'prtimes' | 'googlenews'
  title: string
  url: string
  published_at: string
  is_read: boolean
  category: string
  importance: string
  pick_keywords: {
    id: string
    name: string
    user_id: string
  }
}

interface UserBucket {
  userId: string
  items: ItemRow[]
}

/**
 * 指定期間の前週月曜〜日曜（JST）を返す。
 * 例: 2026-05-22 (金) 実行 → start=2026-05-12 (前々週月) ではなく、
 *      前週分は 2026-05-12 (月) 〜 2026-05-18 (日)
 *
 * 「前週」= 今週月曜の前の月曜から日曜まで。
 */
export function getPreviousWeekRangeJST(now: Date = new Date()): {
  start: string
  end: string
} {
  // JSTに変換
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const dayOfWeek = jst.getUTCDay() // 0=Sun, 1=Mon, ..., 6=Sat
  // 今週月曜への差分（月曜なら0、日曜なら6前）
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  // 今週月曜
  const thisMonday = new Date(jst)
  thisMonday.setUTCDate(jst.getUTCDate() - daysSinceMonday)
  // 前週月曜 = 今週月曜 - 7日
  const prevMonday = new Date(thisMonday)
  prevMonday.setUTCDate(thisMonday.getUTCDate() - 7)
  // 前週日曜 = 前週月曜 + 6日
  const prevSunday = new Date(prevMonday)
  prevSunday.setUTCDate(prevMonday.getUTCDate() + 6)

  return {
    start: prevMonday.toISOString().split('T')[0],
    end: prevSunday.toISOString().split('T')[0],
  }
}

/**
 * 前月の月初〜月末をJST基準で返す。
 */
export function getPreviousMonthRangeJST(now: Date = new Date()): {
  start: string
  end: string
} {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const year = jst.getUTCFullYear()
  const month = jst.getUTCMonth() // 0-indexed (0..11)
  // 前月: month -1
  const prevYear = month === 0 ? year - 1 : year
  const prevMonth = month === 0 ? 11 : month - 1
  const firstDay = new Date(Date.UTC(prevYear, prevMonth, 1))
  // 月末: 翌月の1日の前日
  const lastDay = new Date(Date.UTC(prevYear, prevMonth + 1, 0))
  return {
    start: firstDay.toISOString().split('T')[0],
    end: lastDay.toISOString().split('T')[0],
  }
}

/**
 * 指定ユーザー・期間のレポートをDB保存せずに計算するだけ。
 * Free プランのプレビュー表示（その場集計）で使う。
 */
export async function computeReportForUser(
  userId: string,
  type: ReportType,
  periodStart: string,
  periodEnd: string
) {
  const { data: rawItems, error } = await supabaseAdmin
    .from('items')
    .select('id, pickkw_id, source, title, url, published_at, is_read, category, importance, pick_keywords!inner(id, name, user_id)')
    .gte('published_at', periodStart)
    .lte('published_at', periodEnd)
    .is('deleted_at', null)
    .eq('pick_keywords.user_id', userId)
    .order('published_at', { ascending: false })

  if (error) return { ok: false as const, error: error.message }

  const items = (rawItems ?? []) as unknown as ItemRow[]
  const payload = buildReportPayload(items, type, periodStart, periodEnd)
  return { ok: true as const, itemCount: items.length, payload }
}

/**
 * 指定ユーザー・期間のレポートを生成して reports テーブルに upsert。
 * type+user_id+period_start のユニーク制約で重複保存を防止。
 */
export async function generateReportForUser(
  userId: string,
  type: ReportType,
  periodStart: string,
  periodEnd: string
): Promise<{ ok: boolean; reportId?: string; itemCount: number; error?: string }> {
  const computed = await computeReportForUser(userId, type, periodStart, periodEnd)
  if (!computed.ok) return { ok: false, itemCount: 0, error: computed.error }

  const result = computed.payload
  const itemCount = computed.itemCount

  // upsert（ユニーク制約：user_id, type, period_start）
  const { data: upserted, error: upsertErr } = await supabaseAdmin
    .from('reports')
    .upsert(
      {
        user_id: userId,
        type,
        period_start: periodStart,
        period_end: periodEnd,
        ...result,
      },
      { onConflict: 'user_id,type,period_start' }
    )
    .select('id')
    .single()

  if (upsertErr) {
    return { ok: false, itemCount, error: upsertErr.message }
  }

  return { ok: true, reportId: upserted?.id, itemCount }
}

/** 期間内 items → reports テーブルへ保存する payload を構築 */
function buildReportPayload(
  items: ItemRow[],
  type: ReportType,
  periodStart: string,
  periodEnd: string
) {
  const total = items.length
  const unread = items.filter((i) => !i.is_read).length

  // アンカー別集計
  const byAnchor = new Map<string, { name: string; items: ItemRow[] }>()
  for (const it of items) {
    const a = it.pick_keywords
    if (!byAnchor.has(a.id)) byAnchor.set(a.id, { name: a.name, items: [] })
    byAnchor.get(a.id)!.items.push(it)
  }

  // カテゴリ別集計
  const categoryCounts: Record<string, number> = {}
  for (const it of items) {
    categoryCounts[it.category] = (categoryCounts[it.category] ?? 0) + 1
  }

  // 動きが多いアンカー = 件数最大
  let topAnchorName: string | null = null
  let topAnchorCount = 0
  for (const [, a] of byAnchor) {
    if (a.items.length > topAnchorCount) {
      topAnchorCount = a.items.length
      topAnchorName = a.name
    }
  }

  // 最多カテゴリ
  let topCategory: string | null = null
  let topCategoryCount = 0
  for (const [c, n] of Object.entries(categoryCounts)) {
    if (n > topCategoryCount) {
      topCategoryCount = n
      topCategory = c
    }
  }

  // ハイライト：重要度「高」を優先、次に同一アンカーで複数記事
  const highlights: ReportHighlight[] = buildHighlights(items, byAnchor)

  // アンカー別サマリ
  const anchorSummaries: ReportAnchorSummary[] = []
  for (const [id, a] of byAnchor) {
    const cats: Record<string, number> = {}
    for (const it of a.items) cats[it.category] = (cats[it.category] ?? 0) + 1
    const mainCategories = Object.entries(cats)
      .sort((x, y) => y[1] - x[1])
      .slice(0, 3)
      .map(([c]) => c)
    const notable = a.items
      .slice()
      .sort((x, y) => importanceWeight(y.importance) - importanceWeight(x.importance))
      .slice(0, 3)
      .map((it) => ({ title: it.title, url: it.url }))
    anchorSummaries.push({
      anchor_id: id,
      anchor_name: a.name,
      total: a.items.length,
      main_categories: mainCategories,
      notable_titles: notable,
    })
  }
  anchorSummaries.sort((a, b) => b.total - a.total)

  // 注目記事一覧（重要度高→中、最大15件）
  const notableItems: ReportNotableItem[] = items
    .slice()
    .sort((x, y) => importanceWeight(y.importance) - importanceWeight(x.importance))
    .slice(0, 15)
    .map((it) => ({
      id: it.id,
      title: it.title,
      url: it.url,
      importance: (it.importance as '高' | '中' | '低') ?? '中',
      category: it.category ?? 'その他',
      published_at: it.published_at,
      anchor_name: it.pick_keywords.name,
      source: it.source,
    }))

  const title =
    type === 'weekly'
      ? `週次サマリ ${formatDate(periodStart)}〜${formatDate(periodEnd)}`
      : `月次サマリ ${formatDate(periodStart, 'short')}`

  const summary = `期間内 ${total}件 / 未読 ${unread}件${
    topAnchorName ? ` / 動きが多いアンカー: ${topAnchorName} (${topAnchorCount}件)` : ''
  }${topCategory ? ` / 最多カテゴリ: ${topCategory} (${topCategoryCount}件)` : ''}`

  return {
    title,
    summary,
    total_items: total,
    unread_items: unread,
    top_anchor_name: topAnchorName,
    top_category: topCategory,
    highlights,
    anchor_summaries: anchorSummaries,
    category_counts: categoryCounts,
    notable_items: notableItems,
  }
}

function buildHighlights(
  items: ItemRow[],
  byAnchor: Map<string, { name: string; items: ItemRow[] }>
): ReportHighlight[] {
  const highs = items.filter((i) => i.importance === '高')
  const seen = new Set<string>()
  const out: ReportHighlight[] = []

  // 1. 重要度「高」の記事を最大3件
  for (const h of highs.slice(0, 3)) {
    out.push({
      text: `${h.pick_keywords.name}：${h.title}`,
      anchor_name: h.pick_keywords.name,
      reason: `重要度「高」（${h.category}）`,
    })
    seen.add(h.id)
  }

  // 2. 複数記事を出しているアンカーをハイライト
  for (const [, a] of byAnchor) {
    if (out.length >= 5) break
    if (a.items.length >= 3 && !out.some((o) => o.anchor_name === a.name)) {
      out.push({
        text: `${a.name}が${a.items.length}件のリリースを発表`,
        anchor_name: a.name,
        reason: '同一アンカーで複数記事',
      })
    }
  }

  // 3. 充足しない場合、未読の上位を追加
  if (out.length < 3) {
    for (const it of items.filter((i) => !i.is_read && !seen.has(i.id))) {
      if (out.length >= 5) break
      out.push({
        text: `${it.pick_keywords.name}：${it.title}`,
        anchor_name: it.pick_keywords.name,
        reason: '未読',
      })
    }
  }

  return out
}

function importanceWeight(importance: string | null | undefined): number {
  if (importance === '高') return 3
  if (importance === '中') return 2
  return 1
}

function formatDate(iso: string, fmt: 'full' | 'short' = 'full'): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (fmt === 'short') return `${y}年${m}月`
  return `${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`
}

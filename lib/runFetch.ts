/**
 * 取得実行の唯一のエントリポイント。
 * 手動「今すぐ取得」と cron の両方からここを呼ぶ。
 *
 * 責務:
 *   1. アンカーをロード
 *   2. fetch_runs にレコード作成（status='running'）
 *   3. 各ソースを並列実行（PR TIMES + Google News）
 *   4. items テーブルに保存
 *      - URL の重複は UNIQUE 制約で自然にスキップ
 *      - タイトルの重複（同一リリースがソースを跨いで取得されたケース）は
 *        PR TIMES を正として1件に統合し、sources 配列に取得元を併記する
 *   5. fetch_runs を最終状態で更新（ok / partial / error）
 *   6. 詳細な結果を返す
 *
 * エラーは throw しない。必ず FetchRunResult を返す。
 */

import { supabaseAdmin } from './supabase'
import { classifyArticle } from './classify'
import { normalizeTitle, sortSources, SOURCE_PRIORITY } from './dedupe'
import { prtimesSource } from './sources/prtimes'
import { googlenewsSource } from './sources/googlenews'
import { atpressSource, valuepressSource, kyodoSource } from './sources/sites'
import type { SourceFetcher, SourceFetchResult, ScrapedItem, SourceName } from './sources/types'

export type FetchTrigger = 'manual' | 'cron' | 'test'

export interface SavedItem {
  id: string
  title: string
  url: string
  source: SourceName
}

export interface SourceRunResult {
  found: number
  saved: number
  duplicate: number
  errors: number
  error_sample: string | null
  http_status: number | null
  duration_ms: number
}

export interface FetchRunResult {
  run_id: string | null  // fetch_runs.id（DB保存できなかった場合は null）
  status: 'ok' | 'partial' | 'error'
  /** ソース別の詳細 */
  sources: Record<SourceName, SourceRunResult>
  total_found: number
  total_saved: number
  total_duplicate: number
  total_errors: number
  /** 通知パイプライン用: 今回新規保存された記事のみ */
  saved_items: SavedItem[]
  duration_ms: number
  error_message: string | null
}

const SOURCE_REGISTRY: Record<SourceName, SourceFetcher> = {
  prtimes: prtimesSource,
  googlenews: googlenewsSource,
  atpress: atpressSource,
  valuepress: valuepressSource,
  kyodo: kyodoSource,
}

/**
 * 取得実行の唯一の入口。
 *
 * @param anchorId   pick_keywords.id
 * @param trigger    'manual' (今すぐ取得) / 'cron' / 'test'
 * @param sinceDate  YYYY-MM-DD。この日以降（>=）に公開された記事のみ採用する下限。
 *                   null なら日付フィルタなし（全件）。
 */
export async function runFetch(
  anchorId: string,
  trigger: FetchTrigger,
  sinceDate: string | null = null
): Promise<FetchRunResult> {
  const start = Date.now()

  // 1. アンカーをロード
  const { data: anchor, error: anchorErr } = await supabaseAdmin
    .from('pick_keywords')
    .select('id, query_value, sources')
    .eq('id', anchorId)
    .single()

  if (anchorErr || !anchor) {
    return errorResult(`anchor not found: ${anchorErr?.message ?? 'no data'}`, start)
  }

  // 2. fetch_runs にレコード作成
  const { data: runRow, error: runInsertErr } = await supabaseAdmin
    .from('fetch_runs')
    .insert({
      pickkw_id: anchor.id,
      trigger,
      status: 'running',
      sources: {},
    })
    .select('id')
    .single()

  const runId: string | null = runRow?.id ?? null
  if (runInsertErr) {
    // fetch_runs に書けなくても処理は続行する（最悪、ログだけ残らない）
    console.warn('[runFetch] fetch_runs insert failed:', runInsertErr.message)
  }

  // 3. ソースを並列実行
  const sourceNames = (anchor.sources as SourceName[]) ?? []
  const fetchPromises = sourceNames.map(async (name) => {
    const fetcher = SOURCE_REGISTRY[name]
    if (!fetcher) {
      return [name, {
        items: [],
        http_status: null,
        error: `unknown source: ${name}`,
        duration_ms: 0,
      } as SourceFetchResult] as const
    }
    const result = await fetcher.fetch(anchor.query_value, sinceDate)
    return [name, result] as const
  })
  const fetchResults = await Promise.all(fetchPromises)

  // 4. 保存
  const sourceRunResults: Record<string, SourceRunResult> = {}
  const allSavedItems: SavedItem[] = []
  let totalFound = 0
  let totalSaved = 0
  let totalDup = 0
  let totalErrors = 0

  for (const [sourceName, fetchResult] of fetchResults) {
    const sr: SourceRunResult = {
      found: fetchResult.items.length,
      saved: 0,
      duplicate: 0,
      errors: 0,
      error_sample: fetchResult.error,
      http_status: fetchResult.http_status,
      duration_ms: fetchResult.duration_ms,
    }
    if (fetchResult.error) {
      sr.errors += 1
    }
    sourceRunResults[sourceName] = sr
  }

  // 4a. 過去の実行分とのタイトル重複を統合するため、同アンカーの直近記事をロード。
  //     （別ソースは URL が異なるため UNIQUE 制約では弾けない）
  const titleLookbackDays = 30
  const lookback = new Date(Date.now() + 9 * 60 * 60 * 1000)
  lookback.setUTCDate(lookback.getUTCDate() - titleLookbackDays)
  const titleCutoff = sinceDate ?? lookback.toISOString().split('T')[0]

  interface ExistingRow {
    id: string
    title: string
    source: SourceName
    sources: SourceName[] | null
    deleted_at: string | null
  }
  const { data: existingRows, error: existingErr } = await supabaseAdmin
    .from('items')
    .select('id, title, source, sources, deleted_at')
    .eq('pickkw_id', anchor.id)
    .gte('published_at', titleCutoff)
  // sources 列のマイグレーション未適用（42703: undefined column）でも動けるようにする。
  // その場合はタイトル統合・ソース併記なしの従来動作にフォールバックする。
  const hasSourcesColumn = existingErr?.code !== '42703'
  if (existingErr) {
    // 統合用ルックアップに失敗しても取得自体は続行（最悪、URL重複チェックのみになる）
    console.warn('[runFetch] existing items lookup failed:', existingErr.message)
  }
  const existingByTitle = new Map<string, ExistingRow>()
  for (const row of (existingRows ?? []) as ExistingRow[]) {
    existingByTitle.set(normalizeTitle(row.title), row)
  }

  // 4b. ソース横断でタイトル重複を統合。PR TIMES を先に処理し、後続ソースの
  //     同一タイトル記事は sources への併記のみ行う（PR TIMES 版を正とする）。
  const orderedResults = [...fetchResults].sort(
    ([a], [b]) => SOURCE_PRIORITY.indexOf(a) - SOURCE_PRIORITY.indexOf(b)
  )
  const pending = new Map<string, { item: ScrapedItem; sources: SourceName[] }>()

  for (const [, fetchResult] of orderedResults) {
    for (const item of fetchResult.items) {
      const sr = sourceRunResults[item.source]
      const key = normalizeTitle(item.title)

      const existing = existingByTitle.get(key)
      if (existing) {
        // 過去に保存済みのタイトル → 新規行は作らず、既存行へソースを併記
        sr.duplicate += 1
        if (!existing.deleted_at) {
          await mergeSourceIntoExisting(existing, item)
        }
        continue
      }

      const pend = pending.get(key)
      if (pend) {
        // 今回の実行内でのソース跨ぎ重複 → 先に積んだ優先ソースの記事に併記
        pend.sources = sortSources([...pend.sources, item.source])
        sr.duplicate += 1
        continue
      }

      pending.set(key, { item, sources: [item.source] })
    }
  }

  // 4c. 統合済みの記事を保存
  for (const { item, sources } of pending.values()) {
    const sr = sourceRunResults[item.source]
    const { category, importance, importance_reason } = classifyArticle(item.title)
    const { data, error } = await supabaseAdmin
      .from('items')
      .insert({
        pickkw_id: anchor.id,
        source: item.source,
        ...(hasSourcesColumn ? { sources } : {}),
        title: item.title,
        url: item.url,
        summary: item.summary,
        published_at: item.published_at,
        published_hour: item.published_hour,
        category,
        importance,
        importance_reason,
      })
      .select('id, title, url, source')
      .single()

    if (!error && data) {
      sr.saved += 1
      allSavedItems.push(data as SavedItem)
    } else if (error?.code === '23505') {
      // UNIQUE (url) 違反 → 既知のURL
      sr.duplicate += 1
    } else if (error) {
      sr.errors += 1
      if (!sr.error_sample) sr.error_sample = `db: ${error.message}`
      console.error(`[runFetch] db insert error (${item.source}):`, error.message)
    }
  }

  for (const sr of Object.values(sourceRunResults)) {
    totalFound += sr.found
    totalSaved += sr.saved
    totalDup += sr.duplicate
    totalErrors += sr.errors
  }

  /**
   * 既存行に取得元ソースを併記する。新ソースが PR TIMES で既存行が
   * Google News 版なら、本文情報（タイトル・URL・要約）も PR TIMES 版に差し替える。
   */
  async function mergeSourceIntoExisting(existing: ExistingRow, item: ScrapedItem) {
    const current = existing.sources?.length ? existing.sources : [existing.source]
    const merged = sortSources([...current, item.source])
    const upgrade = item.source === 'prtimes' && existing.source !== 'prtimes'
    if (merged.length === current.length && !upgrade) return

    const patch: Record<string, unknown> = { sources: merged }
    if (upgrade) {
      patch.source = 'prtimes'
      patch.title = item.title
      patch.url = item.url
      if (item.summary) patch.summary = item.summary
    }
    const { error } = await supabaseAdmin.from('items').update(patch).eq('id', existing.id)
    if (error && upgrade) {
      // PR TIMES 版の URL が別行と衝突した場合などは、ソース併記のみ行う
      await supabaseAdmin.from('items').update({ sources: merged }).eq('id', existing.id)
    }
    existing.sources = merged
    if (upgrade && !error) existing.source = 'prtimes'
  }

  // 5. status を決定
  const allFailed = fetchResults.length > 0 && fetchResults.every(([, r]) => r.error)
  const anyError = totalErrors > 0 || fetchResults.some(([, r]) => r.error)
  const status: 'ok' | 'partial' | 'error' = allFailed ? 'error' : anyError ? 'partial' : 'ok'
  const duration_ms = Date.now() - start

  // 6. fetch_runs を更新
  if (runId) {
    await supabaseAdmin
      .from('fetch_runs')
      .update({
        finished_at: new Date().toISOString(),
        status,
        sources: sourceRunResults,
        total_found: totalFound,
        total_saved: totalSaved,
        total_duplicate: totalDup,
        total_errors: totalErrors,
        duration_ms,
      })
      .eq('id', runId)
  }

  return {
    run_id: runId,
    status,
    sources: sourceRunResults as Record<SourceName, SourceRunResult>,
    total_found: totalFound,
    total_saved: totalSaved,
    total_duplicate: totalDup,
    total_errors: totalErrors,
    saved_items: allSavedItems,
    duration_ms,
    error_message: null,
  }
}

function errorResult(message: string, start: number): FetchRunResult {
  return {
    run_id: null,
    status: 'error',
    sources: {} as Record<SourceName, SourceRunResult>,
    total_found: 0,
    total_saved: 0,
    total_duplicate: 0,
    total_errors: 1,
    saved_items: [],
    duration_ms: Date.now() - start,
    error_message: message,
  }
}

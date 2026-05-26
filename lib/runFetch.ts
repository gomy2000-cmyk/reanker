/**
 * 取得実行の唯一のエントリポイント。
 * 手動「今すぐ取得」と cron の両方からここを呼ぶ。
 *
 * 責務:
 *   1. アンカーをロード
 *   2. fetch_runs にレコード作成（status='running'）
 *   3. 各ソースを並列実行（PR TIMES + Google News）
 *   4. items テーブルに保存（重複は UNIQUE 制約で自然にスキップ）
 *   5. fetch_runs を最終状態で更新（ok / partial / error）
 *   6. 詳細な結果を返す
 *
 * エラーは throw しない。必ず FetchRunResult を返す。
 */

import { supabaseAdmin } from './supabase'
import { classifyArticle } from './classify'
import { prtimesSource } from './sources/prtimes'
import { googlenewsSource } from './sources/googlenews'
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
}

/**
 * 取得実行の唯一の入口。
 *
 * @param anchorId   pick_keywords.id
 * @param trigger    'manual' (今すぐ取得) / 'cron' / 'test'
 * @param targetDate YYYY-MM-DD で取得対象日を絞る。null なら検索結果ページの全件。
 */
export async function runFetch(
  anchorId: string,
  trigger: FetchTrigger,
  targetDate: string | null = null
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
    const result = await fetcher.fetch(anchor.query_value, targetDate)
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

    for (const item of fetchResult.items) {
      const { category, importance, importance_reason } = classifyArticle(item.title)
      const { data, error } = await supabaseAdmin
        .from('items')
        .insert({
          pickkw_id: anchor.id,
          source: item.source,
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
        // UNIQUE (pickkw_id, url) 違反 → アンカー内の重複
        sr.duplicate += 1
      } else if (error) {
        sr.errors += 1
        if (!sr.error_sample) sr.error_sample = `db: ${error.message}`
        console.error(`[runFetch] db insert error (${sourceName}):`, error.message)
      }
    }

    sourceRunResults[sourceName] = sr
    totalFound += sr.found
    totalSaved += sr.saved
    totalDup += sr.duplicate
    totalErrors += sr.errors
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

/**
 * ニュースソースの共通型定義。
 * 各ソース（PR TIMES、Google News等）は SourceFetcher を実装する。
 */

export type SourceName = 'prtimes' | 'googlenews'

export interface ScrapedItem {
  title: string
  url: string
  summary: string | null
  published_at: string // YYYY-MM-DD（JST基準）
  published_hour: number | null
  source: SourceName
}

/**
 * 1ソースの取得結果。
 * - 取得成功: items に取得記事 + error=null
 * - 取得失敗: items=[] + error にメッセージ
 * 必ずどちらか一方が埋まる（throwしない）。呼び出し側でエラー記録できるようにするため。
 */
export interface SourceFetchResult {
  items: ScrapedItem[]
  http_status: number | null
  error: string | null
  duration_ms: number
}

/**
 * ソースの実装インターフェース。
 * fetch(query, sinceDate) を実装すれば追加可能。
 *
 * sinceDate: YYYY-MM-DD（JST）。この日以降（>=）に公開された記事のみ採用する下限。
 *            null なら日付フィルタなし（全件）。
 */
export interface SourceFetcher {
  name: SourceName
  fetch(query: string, sinceDate: string | null): Promise<SourceFetchResult>
}

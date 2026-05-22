import { supabaseAdmin } from './supabase'
import { fetchPRTimes, fetchGoogleNews, type ScrapedItem } from './scraper'
import { classifyArticle } from './classify'

export interface AnchorForFetch {
  id: string
  query_value: string
  sources: string[]
}

export interface SavedItem {
  id: string
  title: string
  url: string
  source: 'prtimes' | 'googlenews'
}

export interface FetchResult {
  found: number
  saved: number
  skipped: number
  errors: string[]
  /** 今回新しく保存された記事（通知に使う） */
  savedItems: SavedItem[]
}

/**
 * 1つのアンカーについて、PR TIMES と Google News から記事を取得して DB に保存。
 * - 重複URLは items テーブルの UNIQUE 制約で自動的に弾かれる（skipped としてカウント）
 * - targetDate=null で日付フィルタなし全件取得（手動「今すぐ取得」用）
 * - targetDate=YYYY-MM-DD で当該日のみ取得（cron 用）
 * - 戻り値の savedItems は通知メッセージ生成用
 */
export async function fetchAndSaveForAnchor(
  anchor: AnchorForFetch,
  targetDate: string | null
): Promise<FetchResult> {
  const all: ScrapedItem[] = []
  const errors: string[] = []

  if (anchor.sources.includes('prtimes')) {
    try {
      const items = await fetchPRTimes(anchor.query_value, targetDate)
      all.push(...items)
    } catch (e: any) {
      errors.push(`prtimes: ${e?.message ?? e}`)
    }
  }
  if (anchor.sources.includes('googlenews')) {
    try {
      const items = await fetchGoogleNews(anchor.query_value, targetDate)
      all.push(...items)
    } catch (e: any) {
      errors.push(`googlenews: ${e?.message ?? e}`)
    }
  }

  const savedItems: SavedItem[] = []
  let saved = 0
  let skipped = 0
  for (const item of all) {
    // ルールベースでカテゴリ・重要度を判定（タイトル基準）
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
      saved++
      savedItems.push(data as SavedItem)
    } else if (error?.code === '23505') {
      // UNIQUE 制約違反 = 既に保存済の重複URL or 過去削除済URL
      skipped++
    } else if (error) {
      errors.push(`db insert: ${error.message}`)
    }
  }

  return { found: all.length, saved, skipped, errors, savedItems }
}

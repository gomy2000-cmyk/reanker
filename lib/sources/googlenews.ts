/**
 * Google News ソース実装。
 * 優先順位:
 *   1. SerpAPI（SERPAPI_KEY 設定済みなら使う / 有料・高品質）
 *   2. Google News RSS（無料・フォールバック）
 *
 * SERPAPI_KEY が未設定でも RSS で動くので、最低限の取得は保証される。
 */
import type { SourceFetcher, SourceFetchResult, ScrapedItem } from './types'

function isValidSerpApiKey(key: string | undefined): boolean {
  if (!key) return false
  // プレースホルダ判定（.env.example などの初期値を排除）
  if (/^(your_|placeholder|<.+>)/i.test(key)) return false
  return key.length > 20
}

export const googlenewsSource: SourceFetcher = {
  name: 'googlenews',
  async fetch(query, sinceDate): Promise<SourceFetchResult> {
    const start = Date.now()
    const useSerpApi = isValidSerpApiKey(process.env.SERPAPI_KEY)

    // SerpAPI が使えるなら優先（高品質）。失敗したら RSS にフォールバック。
    if (useSerpApi) {
      try {
        const items = await fetchViaSerpApi(query, sinceDate)
        return { items, http_status: 200, error: null, duration_ms: Date.now() - start }
      } catch (e: any) {
        console.warn(`[googlenews] SerpAPI failed (${e?.message ?? e}), falling back to RSS`)
        // fallthrough → RSS
      }
    }

    try {
      const items = await fetchViaRss(query, sinceDate)
      return { items, http_status: 200, error: null, duration_ms: Date.now() - start }
    } catch (e: any) {
      return {
        items: [],
        http_status: e?.status ?? null,
        error: `rss: ${e?.message ?? e}`,
        duration_ms: Date.now() - start,
      }
    }
  },
}

// -------------------- SerpAPI --------------------

interface SerpApiNewsResult {
  title: string
  link: string
  snippet?: string
  date?: string
}

async function fetchViaSerpApi(query: string, sinceDate: string | null): Promise<ScrapedItem[]> {
  const apiKey = process.env.SERPAPI_KEY!
  const url =
    `https://serpapi.com/search.json?engine=google&tbm=nws` +
    `&q=${encodeURIComponent(query)}&hl=ja&gl=jp&api_key=${apiKey}`

  const res = await fetch(url)
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`) as any
    err.status = res.status
    throw err
  }

  const json = (await res.json()) as { news_results?: SerpApiNewsResult[] }
  const news = json.news_results ?? []

  const items: ScrapedItem[] = []
  const seen = new Set<string>()
  for (const n of news) {
    const parsed = parseRelativeOrISO(n.date)
    if (!parsed) continue
    if (sinceDate && parsed.date < sinceDate) continue
    if (seen.has(n.link)) continue
    seen.add(n.link)
    items.push({
      title: n.title,
      url: n.link,
      summary: n.snippet ?? null,
      published_at: parsed.date,
      published_hour: parsed.hour,
      source: 'googlenews',
    })
  }
  return items
}

// -------------------- Google News RSS（無料フォールバック） --------------------

async function fetchViaRss(query: string, sinceDate: string | null): Promise<ScrapedItem[]> {
  const url =
    `https://news.google.com/rss/search?q=${encodeURIComponent(query)}` +
    `&hl=ja&gl=JP&ceid=JP:ja`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ReankerBot/1.0)' },
  })
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`) as any
    err.status = res.status
    throw err
  }

  const xml = await res.text()
  return parseGoogleNewsRss(xml, sinceDate)
}

function parseGoogleNewsRss(xml: string, sinceDate: string | null): ScrapedItem[] {
  const items: ScrapedItem[] = []
  const seen = new Set<string>()

  // <item>...</item> ブロックを取り出して各フィールドを抽出
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match: RegExpExecArray | null
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title = extractRssField(block, 'title')
    const link = extractRssField(block, 'link')
    const pubDate = extractRssField(block, 'pubDate')
    const source = extractRssField(block, 'source')

    if (!title || !link || !pubDate) continue

    const parsed = parsePubDate(pubDate)
    if (!parsed) continue
    if (sinceDate && parsed.date < sinceDate) continue
    if (seen.has(link)) continue
    seen.add(link)

    items.push({
      title: decodeHtmlEntities(title),
      url: link,
      summary: source ? `${decodeHtmlEntities(source)}（Google News）` : null,
      published_at: parsed.date,
      published_hour: parsed.hour,
      source: 'googlenews',
    })
  }

  return items
}

function extractRssField(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`)
  const m = block.match(re)
  return m ? m[1].trim() : null
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

/**
 * RSS の pubDate（RFC 822）を JST date+hour にパース。
 * 例: "Mon, 26 May 2026 12:34:56 GMT"
 */
function parsePubDate(input: string): { date: string; hour: number | null } | null {
  const d = new Date(input)
  if (isNaN(d.getTime())) return null
  const jstMs = d.getTime() + 9 * 60 * 60 * 1000
  const jst = new Date(jstMs)
  return {
    date: jst.toISOString().split('T')[0],
    hour: jst.getUTCHours(),
  }
}

/**
 * SerpAPI の日付文字列（"2 hours ago" / "May 21, 2026" / ISO 等）を JST date+hour にパース。
 */
function parseRelativeOrISO(input?: string): { date: string; hour: number | null } | null {
  if (!input) return null

  const isoTry = new Date(input)
  if (!isNaN(isoTry.getTime()) && /\d{4}-\d{2}-\d{2}/.test(input)) {
    const jstMs = isoTry.getTime() + 9 * 60 * 60 * 1000
    const jst = new Date(jstMs)
    return { date: jst.toISOString().split('T')[0], hour: jst.getUTCHours() }
  }

  const ymd = input.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  if (ymd) {
    const date = `${ymd[1]}-${ymd[2].padStart(2, '0')}-${ymd[3].padStart(2, '0')}`
    const time = input.match(/(\d{1,2}):(\d{2})/)
    return { date, hour: time ? Number(time[1]) : null }
  }

  if (/時間前|分前|秒前|hour|minute|second/i.test(input)) {
    const now = new Date(Date.now() + 9 * 60 * 60 * 1000)
    return { date: now.toISOString().split('T')[0], hour: now.getUTCHours() }
  }

  const en = input.match(/([A-Z][a-z]+)\s+(\d{1,2}),?\s+(\d{4})/)
  if (en) {
    const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
    const m = months.indexOf(en[1].toLowerCase().slice(0, 3))
    if (m >= 0) {
      return { date: `${en[3]}-${String(m + 1).padStart(2, '0')}-${en[2].padStart(2, '0')}`, hour: null }
    }
  }

  return null
}

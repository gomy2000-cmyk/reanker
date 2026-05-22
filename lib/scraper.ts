import * as cheerio from 'cheerio'

export interface ScrapedItem {
  title: string
  url: string
  summary: string | null
  published_at: string // YYYY-MM-DD（JST基準）
  published_hour: number | null
  source: 'prtimes' | 'googlenews'
}

const PRTIMES_BASE = 'https://prtimes.jp'
const UA = 'Mozilla/5.0 (compatible; ReankerBot/1.0; +https://reanker.com)'

/**
 * PR TIMES のキーワード検索結果ページから記事をスクレイピング。
 * URL例: https://prtimes.jp/topics/keywords/{query}
 *
 * 実HTML構造（2026-05時点）:
 *   <article class="item item-ordinary">
 *     <h3 class="title-item"><a href="/main/html/rd/p/..."> タイトル </a></h3>
 *     <time datetime="2026-05-21T11:26:52+0900">22時間前</time>
 *     <a class="link-name-company"> 会社名 </a>
 *   </article>
 *
 * @param query 検索キーワード（サービス名・キーワード・ドメインいずれも）
 * @param targetDate 取得対象日（YYYY-MM-DD、JST基準）。
 *                   null/undefined を渡せば日付フィルタなしで全件返す。
 */
export async function fetchPRTimes(
  query: string,
  targetDate: string | null
): Promise<ScrapedItem[]> {
  const url = `${PRTIMES_BASE}/topics/keywords/${encodeURIComponent(query)}`

  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (!res.ok) {
      console.warn(`[prtimes] HTTP ${res.status} for "${query}"`)
      return []
    }
    const html = await res.text()
    const $ = cheerio.load(html)

    const items: ScrapedItem[] = []

    $('article.item').each((_, el) => {
      const $el = $(el)

      // タイトル + URL: <h3 class="title-item"><a href="...">
      const $titleLink = $el.find('h3.title-item a').first()
      const title = $titleLink.text().trim()
      const href = $titleLink.attr('href')

      // 公開日時: <time datetime="2026-05-21T11:26:52+0900">
      const datetime = $el.find('time[datetime]').first().attr('datetime')

      // 会社名（要約代わり）
      const company = $el.find('.link-name-company').first().text().trim()

      if (!title || !href || !datetime) return

      const parsed = parseISODateJST(datetime)
      if (!parsed) return
      if (targetDate && parsed.date !== targetDate) return

      const fullUrl = href.startsWith('http') ? href : `${PRTIMES_BASE}${href}`

      items.push({
        title,
        url: fullUrl,
        summary: company ? `${company}（PR TIMES）` : null,
        published_at: parsed.date,
        published_hour: parsed.hour,
        source: 'prtimes',
      })
    })

    if (items.length === 0 && targetDate) {
      // デバッグ用：何件取得しようとして 0 件だったか
      const allCount = $('article.item').length
      console.info(`[prtimes] "${query}" → ${allCount}件中 ${targetDate} 該当: 0`)
    }

    return dedupeByUrl(items)
  } catch (e) {
    console.error(`[prtimes] scrape error for "${query}":`, e)
    return []
  }
}

/**
 * Google News via SerpAPI
 */
export async function fetchGoogleNews(
  query: string,
  targetDate: string | null
): Promise<ScrapedItem[]> {
  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey) return []

  const url =
    `https://serpapi.com/search.json?engine=google&tbm=nws` +
    `&q=${encodeURIComponent(query)}&hl=ja&gl=jp&api_key=${apiKey}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`[googlenews] HTTP ${res.status} for "${query}"`)
      return []
    }
    const json = (await res.json()) as { news_results?: GoogleNewsResult[] }
    const news = json.news_results ?? []

    const items: ScrapedItem[] = []
    for (const n of news) {
      const parsed = parseRelativeOrISO(n.date)
      if (!parsed) continue
      if (targetDate && parsed.date !== targetDate) continue
      items.push({
        title: n.title,
        url: n.link,
        summary: n.snippet ?? null,
        published_at: parsed.date,
        published_hour: parsed.hour,
        source: 'googlenews',
      })
    }
    return dedupeByUrl(items)
  } catch (e) {
    console.error(`[googlenews] fetch error for "${query}":`, e)
    return []
  }
}

interface GoogleNewsResult {
  title: string
  link: string
  snippet?: string
  date?: string
}

/**
 * ISO 8601 形式（タイムゾーン付き）の日時文字列を JST 基準の date + hour に変換。
 * 例: "2026-05-21T11:26:52+0900" → { date: "2026-05-21", hour: 11 }
 */
function parseISODateJST(input: string): { date: string; hour: number | null } | null {
  if (!input) return null
  const d = new Date(input)
  if (isNaN(d.getTime())) return null

  // UTC instant を JST に shift（UTC+9）
  const jstMs = d.getTime() + 9 * 60 * 60 * 1000
  const jst = new Date(jstMs)
  return {
    date: jst.toISOString().split('T')[0],
    hour: jst.getUTCHours(),
  }
}

/**
 * Google News の "2 hours ago" / "May 21, 2026" / 日本語の相対表記等を吸収。
 */
function parseRelativeOrISO(input?: string): { date: string; hour: number | null } | null {
  if (!input) return null

  // ISO 8601 形式（タイムゾーン付き）が来ることもある
  const isoTry = new Date(input)
  if (!isNaN(isoTry.getTime()) && /\d{4}-\d{2}-\d{2}/.test(input)) {
    return parseISODateJST(input)
  }

  // YYYY-MM-DD or YYYY/MM/DD 単体
  const ymd = input.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  if (ymd) {
    const date = `${ymd[1]}-${ymd[2].padStart(2, '0')}-${ymd[3].padStart(2, '0')}`
    const time = input.match(/(\d{1,2}):(\d{2})/)
    return { date, hour: time ? Number(time[1]) : null }
  }

  // 相対表記（"3 時間前", "3 hours ago" 等）→ 当日扱い
  if (/時間前|分前|秒前|hour|minute|second/i.test(input)) {
    const now = new Date(Date.now() + 9 * 60 * 60 * 1000)
    return { date: now.toISOString().split('T')[0], hour: now.getUTCHours() }
  }

  // "May 21, 2026" など英語表記
  const en = input.match(/([A-Z][a-z]+)\s+(\d{1,2}),?\s+(\d{4})/)
  if (en) {
    const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
    const m = months.indexOf(en[1].toLowerCase().slice(0, 3))
    if (m >= 0) {
      const date = `${en[3]}-${String(m + 1).padStart(2, '0')}-${en[2].padStart(2, '0')}`
      return { date, hour: null }
    }
  }

  return null
}

function dedupeByUrl(items: ScrapedItem[]): ScrapedItem[] {
  const seen = new Set<string>()
  return items.filter((i) => {
    if (seen.has(i.url)) return false
    seen.add(i.url)
    return true
  })
}

/** 昨日のJST日付（YYYY-MM-DD）を返す */
export function yesterdayJST(): string {
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  jst.setUTCDate(jst.getUTCDate() - 1)
  return jst.toISOString().split('T')[0]
}

/** 今日のJST日付（YYYY-MM-DD）を返す */
export function todayJST(): string {
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().split('T')[0]
}

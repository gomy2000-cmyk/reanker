import * as cheerio from 'cheerio'

export interface ScrapedItem {
  title: string
  url: string
  summary: string | null
  published_at: string // YYYY-MM-DD
  published_hour: number | null
  source: 'prtimes' | 'googlenews'
}

/**
 * PR TIMES 検索結果をスクレイピング
 * 例: https://prtimes.jp/topics/keywords/{query}
 */
export async function fetchPRTimes(query: string, targetDate: string): Promise<ScrapedItem[]> {
  const url = `https://prtimes.jp/topics/keywords/${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ReankerBot/1.0)' },
    })
    if (!res.ok) return []
    const html = await res.text()
    const $ = cheerio.load(html)

    const items: ScrapedItem[] = []
    $('article, .list-article, [class*="release-list"] a').each((_, el) => {
      const $el = $(el)
      const link = $el.find('a').first().attr('href') || $el.attr('href')
      const title = $el.find('h3, .title, [class*="title"]').first().text().trim()
      const dateText = $el.find('time, [datetime]').first().attr('datetime')
        || $el.find('time, .date').first().text().trim()
      const summary = $el.find('p, .summary').first().text().trim() || null

      if (!link || !title || !dateText) return

      const fullUrl = link.startsWith('http') ? link : `https://prtimes.jp${link}`
      const parsed = parseDate(dateText)
      if (!parsed) return
      if (parsed.date !== targetDate) return

      items.push({
        title,
        url: fullUrl,
        summary,
        published_at: parsed.date,
        published_hour: parsed.hour,
        source: 'prtimes',
      })
    })

    return dedupeByUrl(items)
  } catch (e) {
    console.error('PR TIMES scrape error:', e)
    return []
  }
}

/**
 * Google News via SerpAPI
 */
export async function fetchGoogleNews(query: string, targetDate: string): Promise<ScrapedItem[]> {
  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey) return []

  const url = `https://serpapi.com/search.json?engine=google&tbm=nws&q=${encodeURIComponent(query)}&hl=ja&gl=jp&api_key=${apiKey}`
  try {
    const res = await fetch(url)
    if (!res.ok) return []
    const json = await res.json()
    const news = json.news_results ?? []

    const items: ScrapedItem[] = []
    for (const n of news) {
      const parsed = parseDate(n.date)
      if (!parsed || parsed.date !== targetDate) continue
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
    console.error('Google News fetch error:', e)
    return []
  }
}

/** JST基準で日付・時刻を抽出 */
function parseDate(input: string): { date: string; hour: number | null } | null {
  if (!input) return null
  // ISO形式
  const iso = input.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)
  if (iso) {
    const d = new Date(input)
    if (isNaN(d.getTime())) return null
    const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
    return { date: jst.toISOString().split('T')[0], hour: jst.getUTCHours() }
  }
  // YYYY-MM-DD
  const ymd = input.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  if (ymd) {
    const date = `${ymd[1]}-${ymd[2].padStart(2, '0')}-${ymd[3].padStart(2, '0')}`
    const time = input.match(/(\d{1,2}):(\d{2})/)
    return { date, hour: time ? Number(time[1]) : null }
  }
  // 相対表記（"3時間前" など）→ 当日扱い
  if (/時間前|分前/.test(input)) {
    const now = new Date(Date.now() + 9 * 60 * 60 * 1000)
    return { date: now.toISOString().split('T')[0], hour: now.getUTCHours() }
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

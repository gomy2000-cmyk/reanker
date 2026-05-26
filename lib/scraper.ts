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
 * PR TIMES の検索結果ページから記事をスクレイピング。
 * URL: https://prtimes.jp/main/action.php?run=html&page=searchkey&search_word={query}
 *
 * （/topics/keywords/ は編集されたサブセットしか出ないため使わない）
 *
 * 実HTML構造（2026-05時点 / CSSモジュール）:
 *   <article class="release-card_article__HASH">
 *     <a class="release-card_link__HASH" href="/main/html/rd/p/...">
 *       <h3 class="release-card_title__HASH"> タイトル </h3>
 *       <time>21時間前</time>  または  <time>2026年5月22日 15時30分</time>
 *     </a>
 *     <a class="release-card_companyLink__HASH"> 会社名 </a>
 *   </article>
 *
 * 注意: クラス名末尾のハッシュはビルド毎に変わる可能性があるので、
 * `[class*="release-card_article"]` のような部分一致セレクタを使う。
 *
 * @param query 検索キーワード（サービス名・キーワード・ドメインいずれも）
 * @param targetDate 取得対象日（YYYY-MM-DD、JST基準）。
 *                   null/undefined を渡せば日付フィルタなしで全件返す。
 */
export async function fetchPRTimes(
  query: string,
  targetDate: string | null
): Promise<ScrapedItem[]> {
  const url =
    `${PRTIMES_BASE}/main/action.php?run=html&page=searchkey` +
    `&search_word=${encodeURIComponent(query)}`

  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (!res.ok) {
      console.warn(`[prtimes] HTTP ${res.status} for "${query}"`)
      return []
    }
    const html = await res.text()
    const $ = cheerio.load(html)

    const items: ScrapedItem[] = []

    $('article[class*="release-card_article"]').each((_, el) => {
      const $el = $(el)

      // タイトル + URL: <a class="release-card_link_..."><h3 class="release-card_title_...">
      const $titleLink = $el.find('a[class*="release-card_link"]').first()
      const href = $titleLink.attr('href')
      const title = $titleLink.find('h3[class*="release-card_title"]').first().text().trim()

      // 公開日時: <time>21時間前</time> または <time>2026年5月22日 15時30分</time>
      const timeText = $titleLink.find('time').first().text().trim()

      // 会社名（要約代わり）
      const company = $el.find('a[class*="release-card_companyLink"]').first().text().trim()

      if (!title || !href || !timeText) return

      const parsed = parsePRTimesDate(timeText)
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
      const allCount = $('article[class*="release-card_article"]').length
      console.info(`[prtimes] "${query}" → ${allCount}件中 ${targetDate} 該当: 0`)
    }

    return dedupeByUrl(items)
  } catch (e) {
    console.error(`[prtimes] scrape error for "${query}":`, e)
    return []
  }
}

/**
 * PR TIMES の <time> 内文字列を JST 基準の date + hour に変換。
 * - "21時間前" / "5分前" / "30秒前" → 現在時刻 - N
 * - "1日前" → 現在時刻 - 1日
 * - "2026年5月22日 15時30分" → 絶対表記
 */
function parsePRTimesDate(input: string): { date: string; hour: number | null } | null {
  if (!input) return null

  // 絶対表記: "2026年5月22日 15時30分"
  const abs = input.match(/(\d{4})年(\d{1,2})月(\d{1,2})日(?:\s+(\d{1,2})時(\d{1,2})分)?/)
  if (abs) {
    const date = `${abs[1]}-${abs[2].padStart(2, '0')}-${abs[3].padStart(2, '0')}`
    return { date, hour: abs[4] ? Number(abs[4]) : null }
  }

  // 相対表記
  const now = new Date()
  const rel = input.match(/(\d+)\s*(秒|分|時間|日|週間|ヶ月)前/)
  if (rel) {
    const n = Number(rel[1])
    const unit = rel[2]
    const msPerUnit: Record<string, number> = {
      '秒': 1000,
      '分': 60 * 1000,
      '時間': 60 * 60 * 1000,
      '日': 24 * 60 * 60 * 1000,
      '週間': 7 * 24 * 60 * 60 * 1000,
      'ヶ月': 30 * 24 * 60 * 60 * 1000,
    }
    const past = new Date(now.getTime() - n * msPerUnit[unit])
    const jstMs = past.getTime() + 9 * 60 * 60 * 1000
    const jst = new Date(jstMs)
    return {
      date: jst.toISOString().split('T')[0],
      hour: jst.getUTCHours(),
    }
  }

  return null
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

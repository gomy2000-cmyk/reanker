/**
 * PR TIMES ソース実装。
 * URL: https://prtimes.jp/main/action.php?run=html&page=searchkey&search_word={query}
 * （/topics/keywords/ は編集者キュレーションなので使わない）
 *
 * HTML構造（CSSモジュール / ハッシュ付きクラス名）:
 *   <article class="release-card_article__HASH">
 *     <a class="release-card_link__HASH" href="/main/html/rd/p/...">
 *       <h3 class="release-card_title__HASH">タイトル</h3>
 *       <time>21時間前 | 2026年5月22日 15時30分</time>
 *     </a>
 *     <a class="release-card_companyLink__HASH">会社名</a>
 *   </article>
 *
 * クラス名のハッシュは変わる可能性があるので `[class*="release-card_article"]` で部分一致。
 */
import * as cheerio from 'cheerio'
import type { SourceFetcher, SourceFetchResult, ScrapedItem } from './types'

const PRTIMES_BASE = 'https://prtimes.jp'
const UA = 'Mozilla/5.0 (compatible; ReankerBot/1.0; +https://reanker.com)'

export const prtimesSource: SourceFetcher = {
  name: 'prtimes',
  async fetch(query, targetDate): Promise<SourceFetchResult> {
    const start = Date.now()
    const url =
      `${PRTIMES_BASE}/main/action.php?run=html&page=searchkey` +
      `&search_word=${encodeURIComponent(query)}`

    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } })
      const duration_ms = Date.now() - start

      // PR TIMES は検索結果0件のとき HTTP 404 を返す → これは「ヒットなし」、エラー扱いしない
      if (res.status === 404) {
        return { items: [], http_status: 404, error: null, duration_ms }
      }

      if (!res.ok) {
        return {
          items: [],
          http_status: res.status,
          error: `HTTP ${res.status}`,
          duration_ms,
        }
      }

      const html = await res.text()
      const items = parsePRTimesHtml(html, targetDate)

      // 構造変化検知:
      //   - 「検索結果: 0件」テキストが含まれる → 本当にヒット0件（正常）
      //   - そのテキストすら無い + カード0件 → セレクタ崩壊の疑い（要修正）
      if (items.length === 0 && !targetDate) {
        const $ = cheerio.load(html)
        const cardCount = $('article[class*="release-card_article"]').length
        const totalText = $('[class*="search-result-total"]').text() // "検索結果：N件"
        const isGenuineZero =
          /検索結果[：:]\s*0\s*件/.test(totalText) ||
          /検索結果[：:]\s*0\s*件/.test(html)

        if (cardCount === 0 && !isGenuineZero) {
          return {
            items: [],
            http_status: res.status,
            error: 'HTML構造変化の疑い: release-card セレクタが0件マッチ',
            duration_ms,
          }
        }
      }

      return { items, http_status: res.status, error: null, duration_ms }
    } catch (e: any) {
      return {
        items: [],
        http_status: null,
        error: `fetch error: ${e?.message ?? e}`,
        duration_ms: Date.now() - start,
      }
    }
  },
}

function parsePRTimesHtml(html: string, targetDate: string | null): ScrapedItem[] {
  const $ = cheerio.load(html)
  const items: ScrapedItem[] = []
  const seen = new Set<string>()

  $('article[class*="release-card_article"]').each((_, el) => {
    const $el = $(el)
    const $titleLink = $el.find('a[class*="release-card_link"]').first()
    const href = $titleLink.attr('href')
    const title = $titleLink.find('h3[class*="release-card_title"]').first().text().trim()
    const timeText = $titleLink.find('time').first().text().trim()
    const company = $el.find('a[class*="release-card_companyLink"]').first().text().trim()

    if (!title || !href || !timeText) return

    const parsed = parsePRTimesDate(timeText)
    if (!parsed) return
    if (targetDate && parsed.date !== targetDate) return

    const fullUrl = href.startsWith('http') ? href : `${PRTIMES_BASE}${href}`
    if (seen.has(fullUrl)) return
    seen.add(fullUrl)

    items.push({
      title,
      url: fullUrl,
      summary: company ? `${company}（PR TIMES）` : null,
      published_at: parsed.date,
      published_hour: parsed.hour,
      source: 'prtimes',
    })
  })

  return items
}

/**
 * PR TIMES <time>テキストを date+hour にパース。
 * - "21時間前" / "5分前" / "30秒前" / "1日前" / "2週間前" / "1ヶ月前" → 現在時刻 - N
 * - "2026年5月22日 15時30分" → 絶対表記
 */
function parsePRTimesDate(input: string): { date: string; hour: number | null } | null {
  if (!input) return null

  const abs = input.match(/(\d{4})年(\d{1,2})月(\d{1,2})日(?:\s+(\d{1,2})時(\d{1,2})分)?/)
  if (abs) {
    const date = `${abs[1]}-${abs[2].padStart(2, '0')}-${abs[3].padStart(2, '0')}`
    return { date, hour: abs[4] ? Number(abs[4]) : null }
  }

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
    const past = new Date(Date.now() - n * msPerUnit[unit])
    const jstMs = past.getTime() + 9 * 60 * 60 * 1000
    const jst = new Date(jstMs)
    return {
      date: jst.toISOString().split('T')[0],
      hour: jst.getUTCHours(),
    }
  }

  return null
}

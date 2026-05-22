/**
 * OGPプレビュー取得のローカルテスト
 *   npx tsx scripts/test-preview.ts [url]
 */
import * as cheerio from 'cheerio'

async function main() {
  const url = process.argv[2] ?? 'https://prtimes.jp/main/html/rd/p/000000092.000007831.html'

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ReankerBot/1.0)' },
  })
  if (!res.ok) {
    console.log('HTTP', res.status)
    return
  }
  const html = await res.text()
  const $ = cheerio.load(html)

  const meta = (sel: string) => $(sel).attr('content')?.trim() ?? undefined

  console.log('=== OGP Preview Test ===')
  console.log('URL            :', url)
  console.log('og:title       :', meta('meta[property="og:title"]'))
  console.log('og:description :', meta('meta[property="og:description"]'))
  console.log('og:image       :', meta('meta[property="og:image"]'))
  console.log('og:site_name   :', meta('meta[property="og:site_name"]'))
  console.log()

  const candidates = [
    'p.release__text',
    '[class*="release-body"] p',
    'main p',
    'article p',
    '.body p',
  ]
  for (const sel of candidates) {
    const t = $(sel).first().text().trim()
    if (t && t.length > 20) {
      console.log(`snippet (${sel}):`, t.slice(0, 200))
      break
    }
  }
}
main().catch(console.error)

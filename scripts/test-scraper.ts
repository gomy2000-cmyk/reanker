/**
 * 各ソースの単体スクレイピングテスト（DB保存なし）。
 * HTML構造変化や401エラーをすぐ検知できる。
 *
 * 使い方:
 *   npx tsx scripts/test-scraper.ts <query> [source]
 *     source = prtimes (default) | googlenews | atpress | valuepress | kyodo
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
import type { SourceName, SourceFetcher } from '../lib/sources/types'

async function main() {
  const query = process.argv[2] ?? 'Salesforce'
  const sourceName = (process.argv[3] ?? 'prtimes') as SourceName

  let fetcher: SourceFetcher
  if (sourceName === 'prtimes') {
    fetcher = (await import('../lib/sources/prtimes')).prtimesSource
  } else if (sourceName === 'googlenews') {
    fetcher = (await import('../lib/sources/googlenews')).googlenewsSource
  } else {
    const sites = await import('../lib/sources/sites')
    const map: Record<string, SourceFetcher> = {
      atpress: sites.atpressSource,
      valuepress: sites.valuepressSource,
      kyodo: sites.kyodoSource,
    }
    fetcher = map[sourceName]
    if (!fetcher) { console.error(`unknown source: ${sourceName}`); process.exit(1) }
  }

  console.log(`\n=== ${sourceName} scraper test ===`)
  console.log(`query: ${query}`)
  console.log()

  const result = await fetcher.fetch(query, null)
  console.log(`✓ http=${result.http_status} items=${result.items.length} error=${result.error} ${result.duration_ms}ms\n`)

  for (const [i, item] of result.items.entries()) {
    console.log(`[${i + 1}] ${item.published_at} ${String(item.published_hour ?? '--').padStart(2, '0')}:00`)
    console.log(`    ${item.title}`)
    console.log(`    ${item.url}`)
    if (item.summary) console.log(`    ${item.summary}`)
    console.log()
  }

  if (result.error) {
    console.error(`\n⚠️ ERROR: ${result.error}`)
    process.exit(1)
  }
}

main().catch((e) => { console.error('TEST FAILED:', e); process.exit(1) })

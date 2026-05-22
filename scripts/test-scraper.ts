/**
 * PR TIMES スクレイパーの実機テスト。
 * 使い方:
 *   npx tsx scripts/test-scraper.ts Salesforce
 *   npx tsx scripts/test-scraper.ts kintone 2026-05-21
 */
import { fetchPRTimes, yesterdayJST, todayJST } from '../lib/scraper'

async function main() {
  const query = process.argv[2] ?? 'Salesforce'
  const targetDate = process.argv[3] ?? null // null なら日付フィルタなし

  console.log(`\n=== PR TIMES test ===`)
  console.log(`Query     : ${query}`)
  console.log(`Target day: ${targetDate ?? '(no filter, all results)'}`)
  console.log(`Yesterday : ${yesterdayJST()}`)
  console.log(`Today     : ${todayJST()}`)
  console.log()

  const start = Date.now()
  const items = await fetchPRTimes(query, targetDate)
  const elapsed = Date.now() - start

  console.log(`✓ Fetched ${items.length} items in ${elapsed}ms\n`)

  for (const [i, item] of items.entries()) {
    console.log(`[${i + 1}] ${item.published_at} ${String(item.published_hour ?? '--').padStart(2, '0')}:00`)
    console.log(`    ${item.title}`)
    console.log(`    ${item.url}`)
    if (item.summary) console.log(`    ${item.summary}`)
    console.log()
  }
}

main().catch((e) => {
  console.error('TEST FAILED:', e)
  process.exit(1)
})

/**
 * Google News RSS フォールバックの単体テスト。
 * SERPAPI_KEY を強制的に無効化して RSS 経路を検証する。
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

// SERPAPI_KEY を強制的に消す
delete process.env.SERPAPI_KEY

async function main() {
  const query = process.argv[2] ?? 'プロカン'
  const { googlenewsSource } = await import('../lib/sources/googlenews')
  const r = await googlenewsSource.fetch(query, null)
  console.log(`\n=== Google News RSS test ===`)
  console.log(`query: ${query}`)
  console.log(`http_status: ${r.http_status}  items: ${r.items.length}  error: ${r.error}  ${r.duration_ms}ms`)
  console.log()
  for (const item of r.items.slice(0, 10)) {
    console.log(`[${item.published_at}] ${item.title}`)
    console.log(`    ${item.url}`)
    if (item.summary) console.log(`    ${item.summary}`)
    console.log()
  }
}

main().catch((e) => { console.error('TEST FAILED:', e); process.exit(1) })

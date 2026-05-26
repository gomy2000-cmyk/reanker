/**
 * 健全性チェック: 全アンカーで runFetch() を実行し、
 * いずれかのソースが取得できているかを検証する。
 *
 * デプロイ前/後にローカルから実行する想定:
 *   npx tsx scripts/smoke-test.ts
 *
 * 終了コード:
 *   0 = 全アンカー OK
 *   1 = 1つでも完全失敗（全ソースエラー）したアンカーあり
 *   2 = 警告（一部ソース失敗）
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

interface AnchorRow {
  id: string
  name: string
  query_value: string
  sources: string[]
}

async function main() {
  const { runFetch } = await import('../lib/runFetch')
  const { supabaseAdmin } = await import('../lib/supabase')

  const { data: anchors, error } = await supabaseAdmin
    .from('pick_keywords')
    .select('id, name, query_value, sources')
    .limit(100)

  if (error || !anchors) {
    console.error('Failed to load anchors:', error?.message)
    process.exit(1)
  }

  console.log(`\n=== Smoke test: ${anchors.length} anchors ===\n`)

  let okCount = 0
  let partialCount = 0
  let errorCount = 0
  const errors: string[] = []
  const partials: string[] = []

  for (const anchor of anchors as AnchorRow[]) {
    process.stdout.write(`  [${anchor.name.padEnd(20)}] `)
    const result = await runFetch(anchor.id, 'test', null)

    const srcSummary = Object.entries(result.sources)
      .map(([n, s]) => `${n}=${s.found}/${s.saved}/${s.errors}`)
      .join(' ')

    if (result.status === 'ok') {
      console.log(`✅ ok    (${srcSummary})`)
      okCount++
    } else if (result.status === 'partial') {
      console.log(`⚠️  partial (${srcSummary})`)
      partialCount++
      partials.push(`${anchor.name}: ${srcSummary}`)
    } else {
      console.log(`❌ error  (${srcSummary}) ${result.error_message ?? ''}`)
      errorCount++
      errors.push(`${anchor.name}: ${result.error_message ?? srcSummary}`)
    }
  }

  console.log()
  console.log(`==================================`)
  console.log(`Total:    ${anchors.length}`)
  console.log(`  OK:      ${okCount}`)
  console.log(`  Partial: ${partialCount}`)
  console.log(`  Error:   ${errorCount}`)
  console.log(`==================================`)

  if (partials.length) {
    console.log('\n⚠️ Partial failures:')
    partials.forEach((e) => console.log('  ' + e))
  }
  if (errors.length) {
    console.log('\n❌ Errors:')
    errors.forEach((e) => console.log('  ' + e))
  }

  if (errorCount > 0) process.exit(1)
  if (partialCount > 0) process.exit(2)
  process.exit(0)
}

main().catch((e) => { console.error('SMOKE TEST FAILED:', e); process.exit(1) })

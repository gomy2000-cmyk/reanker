/**
 * 統合エントリ runFetch() を直接実行して、本番と同じ経路でDBに保存されるか検証する。
 * 使い方: npx tsx scripts/test-fetch-now.ts <anchor_id>
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

async function main() {
  const anchorId = process.argv[2]
  if (!anchorId) {
    console.error('Usage: npx tsx scripts/test-fetch-now.ts <anchor_id>')
    process.exit(1)
  }

  const { runFetch } = await import('../lib/runFetch')
  const { supabaseAdmin } = await import('../lib/supabase')

  const { data: anchor } = await supabaseAdmin
    .from('pick_keywords')
    .select('name, query_value, sources')
    .eq('id', anchorId)
    .single()

  console.log(`\n=== runFetch test ===`)
  console.log(`anchor:  ${anchor?.name ?? '(unknown)'}`)
  console.log(`query:   ${anchor?.query_value ?? ''}`)
  console.log(`sources: ${anchor?.sources ?? ''}`)
  console.log()

  const result = await runFetch(anchorId, 'test', null)

  console.log(`✓ status=${result.status} run_id=${result.run_id} ${result.duration_ms}ms`)
  console.log(`  total:  found=${result.total_found} saved=${result.total_saved} dup=${result.total_duplicate} errors=${result.total_errors}`)
  for (const [src, sr] of Object.entries(result.sources)) {
    console.log(`  [${src}] http=${sr.http_status} found=${sr.found} saved=${sr.saved} dup=${sr.duplicate} errors=${sr.errors} ${sr.duration_ms}ms`)
    if (sr.error_sample) console.log(`         error: ${sr.error_sample}`)
  }
  if (result.error_message) console.log(`  TOP ERROR: ${result.error_message}`)
}

main().catch((e) => { console.error('TEST FAILED:', e); process.exit(1) })

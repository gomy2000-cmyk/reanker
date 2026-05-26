/**
 * runFetch() の包括的な統合テスト。
 * 複数アカウント・並行実行・冪等性・異常系を検証する。
 *
 * 使い方: npx tsx scripts/integration-test.ts
 * 終了コード: 0 = 全パス, 1 = 1件でも失敗
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

type Result = { name: string; pass: boolean; detail: string }
const results: Result[] = []

function record(name: string, pass: boolean, detail: string) {
  results.push({ name, pass, detail })
  const mark = pass ? '✅' : '❌'
  console.log(`${mark} ${name}`)
  console.log(`   ${detail}`)
  console.log()
}

async function main() {
  const { runFetch } = await import('../lib/runFetch')
  const { supabaseAdmin } = await import('../lib/supabase')

  // -------- セットアップ：全アンカー取得 --------
  const { data: anchors } = await supabaseAdmin
    .from('pick_keywords')
    .select('id, name, query_value, user_id, users!inner(email)')
    .order('created_at')

  if (!anchors) {
    console.error('no anchors')
    process.exit(1)
  }

  type AnchorRow = { id: string; name: string; query_value: string; user_id: string; users: { email: string } }
  const allAnchors = anchors as unknown as AnchorRow[]
  console.log(`\n=== Found ${allAnchors.length} anchors across ${new Set(allAnchors.map(a => a.user_id)).size} users ===\n`)

  // ---------- Test 1: Smoke test ----------
  console.log('## Test 1: 全アンカー Smoke')
  {
    const errs: string[] = []
    for (const a of allAnchors) {
      const r = await runFetch(a.id, 'test', null)
      if (r.status === 'error') {
        errs.push(`${a.name} (${a.users.email}): ${r.error_message}`)
      }
    }
    record(
      'Test1: Smoke',
      errs.length === 0,
      errs.length === 0 ? `${allAnchors.length}件すべて ok/partial` : `失敗: ${errs.join(', ')}`
    )
  }

  // ---------- Test 2: アカウント間分離 ----------
  console.log('## Test 2: アカウント間分離（警備フォース x 2ユーザー）')
  {
    const keibiAnchors = allAnchors.filter(a => a.name === '警備フォース')
    if (keibiAnchors.length !== 2) {
      record('Test2: 分離', false, `期待 2件、実際 ${keibiAnchors.length}件`)
    } else {
      const [a1, a2] = keibiAnchors
      const { count: c1 } = await supabaseAdmin
        .from('items').select('id', { count: 'exact', head: true })
        .eq('pickkw_id', a1.id).is('deleted_at', null)
      const { count: c2 } = await supabaseAdmin
        .from('items').select('id', { count: 'exact', head: true })
        .eq('pickkw_id', a2.id).is('deleted_at', null)
      const isolated = (c1 ?? 0) > 0 && (c2 ?? 0) > 0
      record(
        'Test2: 分離',
        isolated,
        `${a1.users.email}=${c1}件, ${a2.users.email}=${c2}件 (両方>0なら分離OK)`
      )
    }
  }

  // ---------- Test 3: 冪等性 ----------
  console.log('## Test 3: 冪等性（同一アンカーで2連続）')
  {
    const anchor = allAnchors[0]
    const r1 = await runFetch(anchor.id, 'test', null)
    const r2 = await runFetch(anchor.id, 'test', null)
    // 2回目は全件 dup or 0 saved + 0 errors であるべき
    const idempotent = r2.total_errors === 0 && r2.total_saved === 0
    record(
      'Test3: 冪等',
      idempotent,
      `2回目: found=${r2.total_found} saved=${r2.total_saved} dup=${r2.total_duplicate} errors=${r2.total_errors}`
    )
  }

  // ---------- Test 4: 並行実行 ----------
  console.log('## Test 4: 並行実行（同一アンカーで Promise.all）')
  {
    const anchor = allAnchors[0]
    const [r1, r2, r3] = await Promise.all([
      runFetch(anchor.id, 'test', null),
      runFetch(anchor.id, 'test', null),
      runFetch(anchor.id, 'test', null),
    ])
    const noFatal = r1.status !== 'error' && r2.status !== 'error' && r3.status !== 'error'
    const totalSaved = r1.total_saved + r2.total_saved + r3.total_saved
    // 並行3回でも UNIQUE 違反は dup に吸収され errors=0 になるはず
    const totalErrors = r1.total_errors + r2.total_errors + r3.total_errors
    record(
      'Test4: 並行',
      noFatal && totalErrors === 0,
      `3並行: saved合計=${totalSaved} errors合計=${totalErrors} (errors=0なら正常)`
    )
  }

  // ---------- Test 5: fetch_runs / items 整合 ----------
  console.log('## Test 5: fetch_runs の total_saved が実DBに反映されている')
  {
    const anchor = allAnchors[2] // 一旦clean に近い anchor を選ぶ
    // 新規 anchor を作って取得→count検証する方が確実だが、既存anchorで確認
    const before = await supabaseAdmin
      .from('items').select('id', { count: 'exact', head: true })
      .eq('pickkw_id', anchor.id).is('deleted_at', null)
    const r = await runFetch(anchor.id, 'test', null)
    const after = await supabaseAdmin
      .from('items').select('id', { count: 'exact', head: true })
      .eq('pickkw_id', anchor.id).is('deleted_at', null)
    const delta = (after.count ?? 0) - (before.count ?? 0)
    const match = delta === r.total_saved
    record(
      'Test5: 整合',
      match,
      `runで saved=${r.total_saved}, items差分=${delta} (一致なら整合OK)`
    )
  }

  // ---------- Test 6: 存在しないアンカー ----------
  console.log('## Test 6: 存在しない anchor_id')
  {
    const r = await runFetch('00000000-0000-0000-0000-000000000000', 'test', null)
    const correct = r.status === 'error' && r.error_message?.includes('not found')
    record('Test6: 異常系', !!correct, `status=${r.status} msg="${r.error_message}"`)
  }

  // ---------- Test 7: ヒット0件 ----------
  console.log('## Test 7: ヒット0件のクエリ')
  {
    // 一時的なテスト用アンカーを作成
    const testUser = allAnchors[0].user_id
    const { data: tmpAnchor } = await supabaseAdmin
      .from('pick_keywords')
      .insert({
        user_id: testUser,
        name: '__test_zero_hit__',
        type: 'keyword',
        query_value: 'zzzzzzz_no_such_query_xyz_test_only',
        sources: ['prtimes', 'googlenews'],
        warmup_until: new Date(Date.now() + 86400000).toISOString(),
      })
      .select('id')
      .single()

    if (!tmpAnchor) {
      record('Test7: 0件', false, 'テスト用anchor作成失敗')
    } else {
      const r = await runFetch(tmpAnchor.id, 'test', null)
      const correct = r.status === 'ok' && r.total_saved === 0 && r.total_errors === 0
      record(
        'Test7: 0件',
        correct,
        `status=${r.status} found=${r.total_found} saved=${r.total_saved} errors=${r.total_errors}`
      )
      // クリーンアップ
      await supabaseAdmin.from('pick_keywords').delete().eq('id', tmpAnchor.id)
    }
  }

  // ---------- Test 8: cron エンドポイント認証ガード ----------
  console.log('## Test 8: 本番 cron エンドポイント（auth ガード検証）')
  {
    // Vercel Cron は内部で CRON_SECRET を持つ。ローカルからは到達できないのが正解。
    // ここでは「auth が外せていないこと」を確認する:
    //   - 無認証 → 401  (route 存在 + auth 有効)
    //   - 偽secret → 401
    try {
      const noAuth = await fetch('https://www.reanker.com/api/cron/fetch', { method: 'GET' })
      const fakeAuth = await fetch('https://www.reanker.com/api/cron/fetch', {
        method: 'GET',
        headers: { authorization: 'Bearer FAKE_SECRET_XXX' },
      })
      const authWorking = noAuth.status === 401 && fakeAuth.status === 401
      record(
        'Test8: cron auth',
        authWorking,
        `noAuth=${noAuth.status} fakeAuth=${fakeAuth.status} (両方401でauth正常)`
      )
    } catch (e: any) {
      record('Test8: cron auth', false, `通信エラー: ${e?.message}`)
    }
  }

  // ---------- Test 9: 本番 anchor fetch endpoint（auth ガード） ----------
  console.log('## Test 9: 本番 anchor/[id]/fetch（auth ガード検証）')
  {
    try {
      const noAuth = await fetch('https://www.reanker.com/api/anchor/aaa/fetch', { method: 'POST' })
      const authWorking = noAuth.status === 401
      record(
        'Test9: anchor auth',
        authWorking,
        `status=${noAuth.status} (401でauth正常)`
      )
    } catch (e: any) {
      record('Test9: anchor auth', false, `通信エラー: ${e?.message}`)
    }
  }

  // -------- 結果 --------
  const passed = results.filter(r => r.pass).length
  const failed = results.filter(r => !r.pass).length
  console.log('\n==========================')
  console.log(`合計: ${results.length}  パス: ${passed}  失敗: ${failed}`)
  console.log('==========================')
  if (failed > 0) {
    console.log('\n失敗詳細:')
    results.filter(r => !r.pass).forEach(r => console.log(`  ${r.name}: ${r.detail}`))
    process.exit(1)
  }
  process.exit(0)
}

main().catch(e => { console.error('SUITE FAILED:', e); process.exit(1) })

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

  // ---------- Test 1: Smoke test (status='ok' のみ pass) ----------
  console.log('## Test 1: 全アンカー Smoke (status=ok 限定)')
  {
    const issues: string[] = []
    for (const a of allAnchors) {
      const r = await runFetch(a.id, 'test', null)
      if (r.status !== 'ok') {
        issues.push(`${a.name}: ${r.status} - ${JSON.stringify(r.sources)}`)
      }
    }
    record(
      'Test1: Smoke',
      issues.length === 0,
      issues.length === 0 ? `${allAnchors.length}件すべて status=ok` : `partial/error あり:\n   ${issues.join('\n   ')}`
    )
  }

  // ---------- Test 2: アカウント間分離 + URL重複確認 ----------
  console.log('## Test 2: アカウント間分離（両ユーザーで同一URLが個別保存されている）')
  {
    const keibiAnchors = allAnchors.filter(a => a.name === '警備フォース')
    if (keibiAnchors.length !== 2) {
      record('Test2: 分離', false, `期待 2件、実際 ${keibiAnchors.length}件`)
    } else {
      const [a1, a2] = keibiAnchors
      // 両ユーザーで保存されている URL を比較し、重なりを検出する
      const { data: items1 } = await supabaseAdmin
        .from('items').select('url').eq('pickkw_id', a1.id).is('deleted_at', null)
      const { data: items2 } = await supabaseAdmin
        .from('items').select('url').eq('pickkw_id', a2.id).is('deleted_at', null)
      const urls1 = new Set((items1 ?? []).map(i => i.url))
      const urls2 = new Set((items2 ?? []).map(i => i.url))
      const overlap = [...urls1].filter(u => urls2.has(u)).length
      // 真の検証: 両ユーザーが「同一URLを共有」しつつ、pickkw_id 別に独立保存されている
      const ok = overlap > 0 && urls1.size > 0 && urls2.size > 0
      record(
        'Test2: 分離',
        ok,
        `user1=${urls1.size}件, user2=${urls2.size}件, 共有URL=${overlap}件 (overlap>0で「同URLを別pickkw_idに保存」=正しい分離)`
      )
    }
  }

  // -------- ヘルパー：一時アンカー作成 + items クリア --------
  async function createCleanAnchor(name: string, query: string, userId: string) {
    const { data } = await supabaseAdmin
      .from('pick_keywords')
      .insert({
        user_id: userId, name, type: 'keyword', query_value: query,
        sources: ['prtimes', 'googlenews'],
        warmup_until: new Date(Date.now() + 86400000).toISOString(),
      })
      .select('id').single()
    return data!.id as string
  }
  async function cleanup(anchorId: string) {
    await supabaseAdmin.from('pick_keywords').delete().eq('id', anchorId)
  }

  const testUserId = allAnchors[0].user_id

  // ---------- Test 3: 冪等性（クリーンなアンカーで saved→dup を確認） ----------
  console.log('## Test 3: 冪等性（新規anchor: 1回目saved>0, 2回目全dup）')
  {
    const tmpId = await createCleanAnchor('__test3_idempotent__', 'kintone', testUserId)
    const r1 = await runFetch(tmpId, 'test', null)
    const r2 = await runFetch(tmpId, 'test', null)
    const ok =
      r1.total_saved > 0 &&            // 1回目は実際に保存
      r2.total_saved === 0 &&          // 2回目は何も保存しない
      r2.total_duplicate === r1.total_saved && // すべて dup
      r2.total_errors === 0
    record(
      'Test3: 冪等',
      ok,
      `r1: saved=${r1.total_saved} | r2: saved=${r2.total_saved} dup=${r2.total_duplicate} errors=${r2.total_errors}`
    )
    await cleanup(tmpId)
  }

  // ---------- Test 4: 並行実行（クリーンanchor 3並列で正しく dedupされる） ----------
  console.log('## Test 4: 並行実行（クリーンanchorに3並列：誰か1人がsaved、残りはdup、errors=0）')
  {
    const tmpId = await createCleanAnchor('__test4_race__', 'Slack', testUserId)
    const [r1, r2, r3] = await Promise.all([
      runFetch(tmpId, 'test', null),
      runFetch(tmpId, 'test', null),
      runFetch(tmpId, 'test', null),
    ])
    const totalSaved = r1.total_saved + r2.total_saved + r3.total_saved
    const totalDup = r1.total_duplicate + r2.total_duplicate + r3.total_duplicate
    const totalErrors = r1.total_errors + r2.total_errors + r3.total_errors
    const totalFoundSum = r1.total_found + r2.total_found + r3.total_found

    // 実際に保存された unique URL 数
    const { count: actualItems } = await supabaseAdmin
      .from('items').select('id', { count: 'exact', head: true })
      .eq('pickkw_id', tmpId).is('deleted_at', null)

    // 期待値: errors=0、(saved+dup) === sum(found)、actualItems === totalSaved
    const ok =
      totalErrors === 0 &&
      totalSaved > 0 &&
      (totalSaved + totalDup) === totalFoundSum &&
      actualItems === totalSaved
    record(
      'Test4: 並行',
      ok,
      `found合計=${totalFoundSum} saved=${totalSaved} dup=${totalDup} errors=${totalErrors} | DB実件数=${actualItems}`
    )
    await cleanup(tmpId)
  }

  // ---------- Test 5: fetch_runs.total_saved == 実DB差分 ----------
  console.log('## Test 5: fetch_runs.total_saved と items 差分が一致（クリーンanchor）')
  {
    const tmpId = await createCleanAnchor('__test5_integrity__', 'Notion', testUserId)
    const r = await runFetch(tmpId, 'test', null)
    const { count } = await supabaseAdmin
      .from('items').select('id', { count: 'exact', head: true })
      .eq('pickkw_id', tmpId).is('deleted_at', null)
    const ok = r.total_saved > 0 && count === r.total_saved
    record(
      'Test5: 整合',
      ok,
      `run.total_saved=${r.total_saved} / DB実件数=${count}`
    )
    await cleanup(tmpId)
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

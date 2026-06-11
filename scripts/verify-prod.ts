/**
 * 本番デプロイの全機能動作確認スクリプト。
 * デプロイ後に必ず実行して全エンドポイント + 主要動作を実機検証する。
 *
 * 使い方: npx tsx scripts/verify-prod.ts
 * 終了コード: 0 = 全パス, 1 = 1件でも失敗
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

const BASE = 'https://www.reanker.com'

type Result = { name: string; pass: boolean; detail: string }
const results: Result[] = []

function record(name: string, pass: boolean, detail: string) {
  results.push({ name, pass, detail })
  console.log(`${pass ? '✅' : '❌'} ${name}`)
  console.log(`   ${detail}\n`)
}

async function main() {
  // ---- 1. /admin auth ガード ----
  {
    const r = await fetch(`${BASE}/admin`, { redirect: 'manual' })
    const loc = r.headers.get('location') ?? ''
    record('1. /admin 未認証→login redirect',
      r.status === 307 && loc.includes('/login'),
      `status=${r.status}, location=${loc}`)
  }

  // ---- 2. cron with bad secret ----
  {
    const r = await fetch(`${BASE}/api/cron/fetch?notify=false`, {
      headers: { authorization: 'Bearer FAKE_INVALID' },
    })
    record('2. cron 偽secret→401',
      r.status === 401,
      `status=${r.status}`)
  }

  // ---- 3. cron with valid secret ----
  {
    const secret = process.env.CRON_SECRET
    if (!secret) {
      record('3. cron 正規secret', false, 'local CRON_SECRET 未設定')
    } else {
      const r = await fetch(`${BASE}/api/cron/fetch?notify=false&date=any`, {
        headers: { authorization: `Bearer ${secret}` },
      })
      const body = await r.json()
      record('3. cron 正規secret→200',
        r.status === 200 && body.ok === true && Number.isInteger(body.processed),
        `status=${r.status} processed=${body.processed} saved=${body.saved} errors=${(body.errors ?? []).length}`)
    }
  }

  // ---- 4. cron が fetch_runs に trigger='cron' で記録される ----
  {
    const { supabaseAdmin } = await import('../lib/supabase')
    const { count: cronRunsLast5min } = await supabaseAdmin
      .from('fetch_runs')
      .select('id', { count: 'exact', head: true })
      .eq('trigger', 'cron')
      .gte('started_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())
    record('4. cron 実行が fetch_runs に記録',
      (cronRunsLast5min ?? 0) > 0,
      `直近5分の trigger='cron' レコード: ${cronRunsLast5min}`)
  }

  // ---- 5. webhook auth ガード (no signature) ----
  {
    const r = await fetch(`${BASE}/api/stripe/webhook`, { method: 'POST', body: '{}' })
    record('5. webhook 署名なし→400',
      r.status === 400,
      `status=${r.status}`)
  }

  // ---- 6. webhook auth ガード (偽署名) ----
  {
    const r = await fetch(`${BASE}/api/stripe/webhook`, {
      method: 'POST',
      headers: { 'stripe-signature': 't=1,v1=fake' },
      body: '{}',
    })
    record('6. webhook 偽署名→400',
      r.status === 400,
      `status=${r.status}`)
  }

  // ---- 7. anchor fetch endpoint auth ----
  {
    const r = await fetch(`${BASE}/api/anchor/00000000-0000-0000-0000-000000000000/fetch`, {
      method: 'POST',
    })
    record('7. anchor/[id]/fetch 未認証→401',
      r.status === 401,
      `status=${r.status}`)
  }

  // ---- 8. 公開ページが200 ----
  for (const path of ['/', '/pricing', '/operator', '/legal', '/privacy', '/terms']) {
    const r = await fetch(`${BASE}${path}`)
    record(`8. ${path} 公開ページ→200`,
      r.status === 200,
      `status=${r.status}`)
  }

  // ---- 9. sitemap, robots ----
  {
    const sm = await fetch(`${BASE}/sitemap.xml`)
    const rb = await fetch(`${BASE}/robots.txt`)
    record('9. sitemap.xml + robots.txt',
      sm.status === 200 && rb.status === 200,
      `sitemap=${sm.status} robots=${rb.status}`)
  }

  // ---- 10. Resend 未設定の警告検出 (notify path がエラーなく skip するか) ----
  {
    const { sendEmailDigest } = await import('../lib/notify')
    let threw = false
    try {
      await sendEmailDigest('test@example.com', [{
        anchorName: 'test',
        items: [{ id: 'x', title: 't', url: 'https://example.com', source: 'prtimes' }],
      }])
    } catch { threw = true }
    record('10. sendEmailDigest が key 不在でもクラッシュしない',
      !threw,
      'API key 不在時は warning だけ出して silent skip')
  }

  // ---- 11. DB 健全性: 全アンカーで status='ok' な fetch_run が最近1日内 ----
  {
    const { supabaseAdmin } = await import('../lib/supabase')
    const { data: anchors } = await supabaseAdmin
      .from('pick_keywords').select('id, name')
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    let healthy = 0
    let unhealthy: string[] = []
    for (const a of anchors ?? []) {
      const { data: lastRun } = await supabaseAdmin
        .from('fetch_runs')
        .select('status, started_at')
        .eq('pickkw_id', a.id)
        .gte('started_at', oneDayAgo)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (lastRun?.status === 'ok') healthy++
      else unhealthy.push(`${a.name}=${lastRun?.status ?? 'no-run'}`)
    }
    record('11. 全アンカーが直近24h で status=ok',
      unhealthy.length === 0,
      `healthy=${healthy}/${(anchors ?? []).length}, unhealthy=[${unhealthy.join(',')}]`)
  }

  // ---- 12. /admin の HTML が正しく生成 (login redirect → login page が描画) ----
  {
    const r = await fetch(`${BASE}/admin`, { redirect: 'follow' })
    const html = await r.text()
    record('12. /admin → login ページ描画',
      r.status === 200 && (html.includes('Googleでログイン') || html.includes('login')),
      `final status=${r.status}, contains login UI`)
  }

  // ---- 集計 ----
  const passed = results.filter(r => r.pass).length
  const failed = results.length - passed
  console.log('====================================')
  console.log(`合計: ${results.length}  パス: ${passed}  失敗: ${failed}`)
  console.log('====================================')
  if (failed > 0) {
    console.log('\n失敗詳細:')
    results.filter(r => !r.pass).forEach(r => console.log(`  ❌ ${r.name}: ${r.detail}`))
    process.exit(1)
  }
  process.exit(0)
}

main().catch(e => { console.error('VERIFY FAILED:', e); process.exit(1) })

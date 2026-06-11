/**
 * gomy1145@gmail.com に直近の取得記事をテストメール送信する。
 * DB は変更しない（既存 items から最新数件を抽出して digest 形式でメール）。
 *
 * 使い方: npx tsx scripts/send-test-email.ts
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

const TARGET_EMAIL = 'gomy1145@gmail.com'

async function main() {
  const { supabaseAdmin } = await import('../lib/supabase')
  const { sendEmailDigest } = await import('../lib/notify')

  const { data: user } = await supabaseAdmin
    .from('users').select('id, email').eq('email', TARGET_EMAIL).single()
  if (!user) { console.error('user not found'); process.exit(1) }

  const { data: anchors } = await supabaseAdmin
    .from('pick_keywords')
    .select('id, name')
    .eq('user_id', user.id)
  if (!anchors?.length) { console.error('no anchors'); process.exit(1) }

  // 各アンカーから最新3件を取り出して digest を組み立てる
  const summaries = []
  for (const a of anchors) {
    const { data: items } = await supabaseAdmin
      .from('items')
      .select('id, title, url, source')
      .eq('pickkw_id', a.id)
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(3)
    if (items && items.length > 0) {
      summaries.push({ anchorName: a.name, items: items as any })
    }
  }

  if (summaries.length === 0) {
    console.error('no items to send')
    process.exit(1)
  }

  const totalItems = summaries.reduce((s, x) => s + x.items.length, 0)
  console.log(`Sending test digest to ${TARGET_EMAIL}: ${summaries.length} anchors / ${totalItems} items`)
  for (const s of summaries) {
    console.log(`  - ${s.anchorName} (${s.items.length}件)`)
  }

  await sendEmailDigest(TARGET_EMAIL, summaries)
  console.log('\n✓ Email sent (check inbox)')
}

main().catch(e => { console.error('FAILED:', e); process.exit(1) })

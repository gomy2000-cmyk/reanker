// Stripe Webhook のフル動作確認スクリプト
// 本物のStripe署名を計算してエンドポイントに送り、各イベントタイプに対するDB更新を検証する
import crypto from 'node:crypto'

const WEBHOOK_URL = 'https://www.reanker.com/api/stripe/webhook'
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? (() => { throw new Error('STRIPE_WEBHOOK_SECRET env var required') })()

function sign(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000)
  const signedPayload = `${timestamp}.${payload}`
  const signature = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex')
  return `t=${timestamp},v1=${signature}`
}

async function sendEvent(event, label) {
  const body = JSON.stringify(event)
  const sig = sign(body, WEBHOOK_SECRET)
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'stripe-signature': sig },
    body,
  })
  const text = await res.text()
  console.log(`[${label}] status=${res.status} body=${text.slice(0, 200)}`)
  return res.status
}

const TEST_USER_ID = '06d88d52-ca78-4daf-8687-6b1eba023120' // gomy1145@gmail.com
const TEST_SUB_ID = 'sub_TEST_E2E_' + Date.now()

async function main() {
  const scenario = process.argv[2]

  if (scenario === 'checkout') {
    // テスト1: checkout.session.completed → plan='standard' + sub_id 保存
    await sendEvent({
      id: 'evt_test_' + Date.now(),
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_' + Date.now(),
          object: 'checkout.session',
          mode: 'subscription',
          subscription: TEST_SUB_ID,
          metadata: { user_id: TEST_USER_ID },
        },
      },
    }, 'checkout.session.completed')
  } else if (scenario === 'sub_active') {
    // テスト2: customer.subscription.updated (active) → standard維持
    await sendEvent({
      id: 'evt_test_' + Date.now(),
      object: 'event',
      type: 'customer.subscription.updated',
      data: { object: { id: process.env.SUB_ID, object: 'subscription', status: 'active' } },
    }, 'subscription.updated (active)')
  } else if (scenario === 'sub_pastdue') {
    // テスト3: customer.subscription.updated (past_due) → free
    await sendEvent({
      id: 'evt_test_' + Date.now(),
      object: 'event',
      type: 'customer.subscription.updated',
      data: { object: { id: process.env.SUB_ID, object: 'subscription', status: 'past_due' } },
    }, 'subscription.updated (past_due)')
  } else if (scenario === 'sub_canceled') {
    // テスト4: customer.subscription.updated (canceled) → free
    await sendEvent({
      id: 'evt_test_' + Date.now(),
      object: 'event',
      type: 'customer.subscription.updated',
      data: { object: { id: process.env.SUB_ID, object: 'subscription', status: 'canceled' } },
    }, 'subscription.updated (canceled)')
  } else if (scenario === 'sub_deleted') {
    // テスト5: customer.subscription.deleted → free
    await sendEvent({
      id: 'evt_test_' + Date.now(),
      object: 'event',
      type: 'customer.subscription.deleted',
      data: { object: { id: process.env.SUB_ID, object: 'subscription', status: 'canceled' } },
    }, 'subscription.deleted')
  } else if (scenario === 'sub_trial') {
    // テスト6: trial期間中 → standard
    await sendEvent({
      id: 'evt_test_' + Date.now(),
      object: 'event',
      type: 'customer.subscription.updated',
      data: { object: { id: process.env.SUB_ID, object: 'subscription', status: 'trialing' } },
    }, 'subscription.updated (trialing)')
  } else if (scenario === 'race_sub_first') {
    // テスト7: 順番問題 - subscription.updated が先に来て stripe_subscription_id が未保存
    const subId = 'sub_RACE_' + Date.now()
    console.log('[race] sub_id=' + subId)
    await sendEvent({
      id: 'evt_test_' + Date.now(),
      object: 'event',
      type: 'customer.subscription.updated',
      data: { object: { id: subId, object: 'subscription', status: 'active' } },
    }, 'race: subscription.updated FIRST (should silently do nothing)')
    await new Promise(r => setTimeout(r, 500))
    await sendEvent({
      id: 'evt_test_' + Date.now(),
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_race_' + Date.now(),
          object: 'checkout.session',
          mode: 'subscription',
          subscription: subId,
          metadata: { user_id: TEST_USER_ID },
        },
      },
    }, 'race: checkout.session.completed SECOND (should set plan=standard)')
  } else if (scenario === 'bad_sig') {
    // テスト8: 不正署名拒否
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'stripe-signature': 't=1,v1=invalid' },
      body: JSON.stringify({ type: 'checkout.session.completed' }),
    })
    console.log(`[bad_sig] status=${res.status} (期待: 400)`)
  } else if (scenario === 'no_metadata') {
    // テスト9: checkout イベントだが metadata.user_id がない（万一の異常）
    await sendEvent({
      id: 'evt_test_' + Date.now(),
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_nometa_' + Date.now(),
          object: 'checkout.session',
          mode: 'subscription',
          subscription: 'sub_NOMETA_' + Date.now(),
          metadata: {}, // 空
        },
      },
    }, 'checkout.session.completed (no user_id metadata)')
  } else {
    console.error('Usage: node test-webhook-flows.mjs <scenario>')
    console.error('scenarios: checkout, sub_active, sub_pastdue, sub_canceled, sub_deleted, sub_trial, race_sub_first, bad_sig, no_metadata')
    process.exit(1)
  }
}

main().catch(e => { console.error(e); process.exit(1) })

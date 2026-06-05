import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

/** Postgres/PostgREST のテーブル未作成エラー判定（schema.sql 未適用の検知用）。 */
function isMissingTableError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false
  return (
    error.code === '42P01' ||       // undefined_table (Postgres)
    error.code === 'PGRST205' ||    // PostgREST: table not found in schema cache
    /does not exist|could not find the table/i.test(error.message ?? '')
  )
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  const body = await req.text()
  let event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }

  // --- billing_events に受信記録（stripe_event_id ユニークで二重処理を防止）---
  // テーブル未作成・記録失敗でもプラン更新は止めない（エラーは console.error で可視化）。
  let logged = false
  const { error: insErr } = await supabaseAdmin.from('billing_events').insert({
    stripe_event_id: event.id,
    event_type: event.type,
    status: 'received',
    raw_payload: event as any,
  })
  if (insErr) {
    if (insErr.code === '23505') {
      // 同一イベントの再送 → 二重処理を避けて即終了。
      return NextResponse.json({ received: true, duplicate: true })
    }
    const missing = isMissingTableError(insErr)
    console.error(
      `[webhook] billing_events への記録に失敗${
        missing ? '（billing_events テーブル未作成の可能性。supabase/schema.sql のSQLを適用してください）' : ''
      }:`,
      insErr.message
    )
    // 記録に失敗してもプラン更新は続行する。
  } else {
    logged = true
  }

  let userId: string | null = null
  let handledStatus = 'ignored'
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as any
        userId = s.metadata?.user_id ?? null
        if (userId) {
          const { error: upErr } = await supabaseAdmin.from('users').update({
            plan: 'standard',
            stripe_subscription_id: s.subscription,
          }).eq('id', userId)
          if (upErr) console.error('[webhook] users 更新に失敗 (checkout.session.completed):', upErr.message)
        }
        handledStatus = 'processed'
        break
      }
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const sub = event.data.object as any
        const status = sub.status
        const plan = status === 'active' || status === 'trialing' ? 'standard' : 'free'
        const { data: updated, error: upErr } = await supabaseAdmin
          .from('users')
          .update({ plan })
          .eq('stripe_subscription_id', sub.id)
          .select('id')
          .maybeSingle()
        if (upErr) console.error(`[webhook] users 更新に失敗 (${event.type}):`, upErr.message)
        userId = updated?.id ?? null
        handledStatus = 'processed'
        break
      }
    }
  } catch (e: any) {
    console.error('[webhook] イベント処理で例外:', event.type, e?.message ?? e)
    if (logged) {
      await supabaseAdmin.from('billing_events')
        .update({ status: 'error', user_id: userId })
        .eq('stripe_event_id', event.id)
    }
    // Stripe には 200 を返し本文でエラーを示す（プラン更新は上で best-effort 実施済み）。
    return NextResponse.json({ received: true, error: e?.message ?? 'handler error' })
  }

  // 処理結果を billing_events に反映（記録できている場合のみ）。
  if (logged) {
    const { error: updErr } = await supabaseAdmin.from('billing_events')
      .update({ status: handledStatus, user_id: userId })
      .eq('stripe_event_id', event.id)
    if (updErr) console.error('[webhook] billing_events のステータス更新に失敗:', updErr.message)
  }

  return NextResponse.json({ received: true })
}

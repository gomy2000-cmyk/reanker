import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  const body = await req.text()
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as any
      const userId = s.metadata?.user_id
      if (userId) {
        await supabaseAdmin.from('users').update({
          plan: 'standard',
          stripe_subscription_id: s.subscription,
        }).eq('id', userId)
      }
      break
    }
    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      const sub = event.data.object as any
      const status = sub.status
      const plan = status === 'active' || status === 'trialing' ? 'standard' : 'free'
      await supabaseAdmin.from('users').update({ plan }).eq('stripe_subscription_id', sub.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: user } = await supabaseAdmin
    .from('users').select('*').eq('email', session.user.email).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const origin = process.env.NEXTAUTH_URL!

  let customerId = user.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    })
    customerId = customer.id
    await supabaseAdmin.from('users').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const checkout = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_STANDARD_PRICE_ID!, quantity: 1 }],
    success_url: `${origin}/settings?upgraded=1`,
    cancel_url: `${origin}/settings`,
    metadata: { user_id: user.id },
  })

  return NextResponse.json({ url: checkout.url })
}

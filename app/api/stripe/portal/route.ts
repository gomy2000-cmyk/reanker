import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getStripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: user } = await supabaseAdmin
    .from('users').select('*').eq('email', session.user.email).single()
  if (!user?.stripe_customer_id) {
    return NextResponse.json({ error: 'No Stripe customer' }, { status: 404 })
  }

  const portal = await getStripe().billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${process.env.NEXTAUTH_URL}/settings`,
  })

  return NextResponse.json({ url: portal.url })
}

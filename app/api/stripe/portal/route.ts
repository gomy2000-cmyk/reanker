import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getStripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error: 'BILLING_NOT_READY',
          message: '決済管理は現在準備中です。',
        },
        { status: 503 }
      )
    }

    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user } = await supabaseAdmin
      .from('users').select('*').eq('email', session.user.email).single()
    if (!user?.stripe_customer_id) {
      return NextResponse.json(
        {
          error: 'NO_CUSTOMER',
          message: 'まだ有料プランをご利用いただいていません。',
        },
        { status: 404 }
      )
    }

    const portal = await getStripe().billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXTAUTH_URL ?? 'https://reanker.com'}/settings`,
    })

    return NextResponse.json({ url: portal.url })
  } catch (e: any) {
    console.error('Stripe portal error:', e)
    return NextResponse.json(
      {
        error: 'PORTAL_FAILED',
        message: '決済管理ページの作成に失敗しました。',
      },
      { status: 500 }
    )
  }
}

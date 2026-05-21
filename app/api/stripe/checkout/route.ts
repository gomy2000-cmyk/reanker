import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getStripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    // 環境変数が未設定の場合は分かりやすいエラーを返す（500ではなく503）
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_STANDARD_PRICE_ID) {
      return NextResponse.json(
        {
          error: 'BILLING_NOT_READY',
          message: '決済機能は現在準備中です。お問い合わせよりご連絡ください。',
        },
        { status: 503 }
      )
    }

    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const origin = process.env.NEXTAUTH_URL ?? 'https://reanker.com'
    const stripe = getStripe()

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
      line_items: [{ price: process.env.STRIPE_STANDARD_PRICE_ID, quantity: 1 }],
      success_url: `${origin}/settings?upgraded=1`,
      cancel_url: `${origin}/settings`,
      metadata: { user_id: user.id },
    })

    return NextResponse.json({ url: checkout.url })
  } catch (e: any) {
    console.error('Stripe checkout error:', e)
    return NextResponse.json(
      {
        error: 'CHECKOUT_FAILED',
        message: '決済セッションの作成に失敗しました。時間をおいて再度お試しください。',
      },
      { status: 500 }
    )
  }
}

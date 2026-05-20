import Stripe from 'stripe'

// ビルド時に環境変数が無くてもクラッシュしないよう遅延初期化。
// 実際に Stripe API を叩く時だけインスタンス化される。
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(key, {
      apiVersion: '2024-12-18.acacia' as any,
    })
  }
  return _stripe
}

// GTM / dataLayer ヘルパー
// GA4 は GTM 管理画面側で設定する。コードからは event 名と最小限の属性のみ送る。

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || ''
/**
 * GTM が有効か。NEXT_PUBLIC_GTM_ID が設定されていれば有効。
 * 本番のみで動かしたい場合は Vercel の Environment を Production に絞って
 * 環境変数をセットすれば、結果として本番のみ動く。
 */
export const GTM_ENABLED = typeof GTM_ID === 'string' && GTM_ID.length > 0

/**
 * dataLayer.push の薄いラッパー。
 * - SSR / 未設定環境では何もしない
 * - GTM 未読込でも window.dataLayer は GTM スニペット側で初期化されるが、
 *   念のためここでも初期化しておく
 */
export function pushEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  if (!GTM_ENABLED) return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
}

// === 主要イベント ===

export function trackSignUp(method: string = 'google') {
  pushEvent('sign_up', { method })
}

export function trackLogin(method: string = 'google') {
  pushEvent('login', { method })
}

export function trackAnchorCreate(params: { plan?: string; anchor_type?: string } = {}) {
  pushEvent('anchor_create', params)
}

export function trackUpgradeClick(location?: string) {
  pushEvent('upgrade_click', location ? { location } : {})
}

export function trackBeginCheckout(plan: string = 'standard') {
  pushEvent('begin_checkout', { plan })
}

export function trackPurchase(params: { plan?: string; value?: number; currency?: string } = {}) {
  pushEvent('purchase', { currency: 'JPY', ...params })
}

export function trackReportView(params: { plan?: string; is_preview?: boolean } = {}) {
  pushEvent('report_view', params)
}

export function trackReportCopy() {
  pushEvent('report_copy')
}

export function trackContactSubmit() {
  pushEvent('contact_submit')
}

export function trackPricingView() {
  pushEvent('pricing_view')
}

// GTM 経由で GA4 計測。GA4測定IDはGTMコンソール側で管理する。

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export const GTM_ID = 'GTM-MQBBQ2C4'
export const GA4_ID = 'G-Q54M9ZZ3YM' // GTMコンソール側で設定済み（コード側では参照のみ）
export const GTM_ENABLED = true
export const GA4_ENABLED = GTM_ENABLED

/**
 * GTM の dataLayer に任意のイベントをプッシュする。
 * GTM コンソール側で対応するカスタムイベントトリガー + GA4 イベントタグを設定すること。
 */
export function pushEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
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

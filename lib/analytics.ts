// GA4 直接タグ（gtag.js）ヘルパー
// GTM は廃止。gtag() 経由でイベントを送る。

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
  }
}

export const GA4_ID = 'G-Q54M9ZZ3YM'
export const GTM_ID = ''         // GTM廃止。GTM.tsx が参照するが '' のため何も出力しない
export const GA4_ENABLED = true
export const GTM_ENABLED = GA4_ENABLED  // 後方互換（GTMPageView が参照）

/**
 * gtag('event', ...) の薄いラッパー。
 * - SSR では何もしない
 * - gtag.js ロード前は dataLayer にキューされ、ロード後に処理される
 */
export function pushEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params)
  } else {
    // gtag.js ロード前のキュー
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...params })
  }
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

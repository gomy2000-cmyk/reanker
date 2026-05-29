'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { GTM_ENABLED, pushEvent } from '@/lib/analytics'

/**
 * App Router の SPA クライアント遷移でも page_view を GTM dataLayer に push する。
 * 初期ロードは GTM の「All Pages」トリガーが GA4 Configuration タグ経由で処理するためスキップ。
 * 2回目以降のパス変化のみ push し、GTM 側のカスタムイベントトリガー (page_view) で拾う。
 */
export function GTMPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!GTM_ENABLED) return
    const qs = searchParams?.toString()
    const url = pathname + (qs ? `?${qs}` : '')

    // 初回ロードは GTM All Pages トリガーが処理するためスキップ
    if (isFirstRender.current) {
      isFirstRender.current = false
      lastPath.current = url
      return
    }

    // SPA 遷移時のみ push（同一URLの重複防止）
    if (lastPath.current === url) return
    lastPath.current = url
    pushEvent('page_view', { page_path: url })
  }, [pathname, searchParams])

  return null
}

'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { GTM_ENABLED, pushEvent } from '@/lib/analytics'

/**
 * App Router のクライアント遷移でも pageview を送る。
 * GTM 側で「page_view」というカスタムイベントトリガーを作り、
 * GA4 設定タグ or GA4 イベントタグを発火させる想定。
 */
export function GTMPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!GTM_ENABLED) return
    const qs = searchParams?.toString()
    const url = pathname + (qs ? `?${qs}` : '')
    // 同じURLの二重送信を防ぐ
    if (lastPath.current === url) return
    lastPath.current = url
    pushEvent('page_view', { page_path: url })
  }, [pathname, searchParams])

  return null
}

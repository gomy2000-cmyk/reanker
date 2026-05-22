'use client'

import { useEffect, useRef } from 'react'
import { trackPricingView } from '@/lib/analytics'

export function PricingViewTracker() {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    trackPricingView()
  }, [])
  return null
}

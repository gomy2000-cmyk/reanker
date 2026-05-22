'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { trackLogin, trackSignUp } from '@/lib/analytics'

/**
 * (app) レイアウト配下で一度だけ sign_up / login を送る。
 * sessionStorage で二重送信を防止する。
 */
export function AuthEvents() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return
    if (typeof window === 'undefined') return

    const key = `ra_auth_fired_${session.user.email ?? 'unknown'}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    if (session.user.isNewUser) {
      trackSignUp('google')
    } else {
      trackLogin('google')
    }
  }, [status, session])

  return null
}

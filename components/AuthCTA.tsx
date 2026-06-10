'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Props {
  className?: string
  /** 未ログイン時のリンク先・文言（デフォルト: /login「無料ではじめる」） */
  anonHref?: string
  anonText?: string
  /** ログイン時のリンク先・文言（デフォルト: /dashboard「ダッシュボードへ」） */
  authedHref?: string
  authedText?: string
  children?: React.ReactNode
}

/**
 * ログイン状態でリンク先・文言が変わるCTA。
 * マーケページをサーバー側のセッション参照なし（=静的）に保つためのクライアント部品。
 * SSR時は未ログイン表示で出力し、セッション確認後に切り替わる。
 */
export function AuthCTA({
  className,
  anonHref = '/login',
  anonText = '無料ではじめる',
  authedHref = '/dashboard',
  authedText = 'ダッシュボードへ',
  children,
}: Props) {
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user

  return (
    <Link href={isAuthenticated ? authedHref : anonHref} className={className}>
      {isAuthenticated ? authedText : anonText}
      {children}
    </Link>
  )
}

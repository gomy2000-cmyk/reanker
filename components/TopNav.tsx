'use client'

import { signOut, useSession } from 'next-auth/react'
import { ChevronDown } from 'lucide-react'
import { Wordmark } from './brand/Wordmark'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

export function TopNav() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-11 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
      <div className="flex items-center text-gray-900">
        <Wordmark height={16} />
      </div>

      {session?.user && (
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-md px-2 py-1 transition-colors"
          >
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="avatar"
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#378ADD] flex items-center justify-center text-white text-xs font-bold">
                {session.user.name?.[0] ?? session.user.email?.[0] ?? 'U'}
              </div>
            )}
            <span className="text-xs text-gray-600 max-w-[120px] truncate">{session.user.name ?? session.user.email}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {open && (
            <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-lg shadow-md w-44 py-1 z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-700 truncate">{session.user.email}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-0.5 inline-block ${
                  session.user.plan === 'standard'
                    ? 'bg-[#378ADD]/10 text-[#378ADD]'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {session.user.plan === 'standard' ? 'スタンダード' : 'フリー'}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                ログアウト
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

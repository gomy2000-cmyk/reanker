'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, ChevronDown, ChevronRight, Settings, LogOut, Plus, Sliders
} from 'lucide-react'
import { useState } from 'react'
import type { PickKeyword } from '@/lib/types'

interface Props {
  keywords: PickKeyword[]
}

const TYPE_LABELS = { service: 'サービス名', keyword: 'キーワード', domain: 'ドメイン' }

export function SideNav({ keywords }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const grouped = keywords.reduce<Record<string, PickKeyword[]>>((acc, kw) => {
    if (!acc[kw.type]) acc[kw.type] = []
    acc[kw.type].push(kw)
    return acc
  }, {})

  const isActive = (path: string) => pathname === path

  return (
    <nav className="w-[200px] bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="flex-1 overflow-y-auto py-2">
        {/* ダッシュボード */}
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 px-3 py-2 text-sm mx-1 rounded-md transition-colors ${
            isActive('/dashboard')
              ? 'bg-[#378ADD]/10 text-[#378ADD] font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <LayoutDashboard size={15} />
          ダッシュボード
        </Link>

        {/* アンカー アコーディオン */}
        <div className="mt-1">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left text-gray-600 hover:bg-gray-100 mx-1 rounded-md transition-colors"
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="font-medium">アンカー</span>
          </button>

          {open && (
            <div className="ml-3">
              {Object.entries(TYPE_LABELS).map(([type, label]) => {
                const items = grouped[type] ?? []
                if (items.length === 0) return null
                return (
                  <div key={type} className="mt-1">
                    <p className="text-[10px] text-gray-400 px-3 py-0.5 uppercase tracking-wide">{label}</p>
                    {items.map((kw) => (
                      <div
                        key={kw.id}
                        className={`group relative flex items-center justify-between pr-2 mx-1 rounded-md transition-colors ${
                          pathname === `/anchor/${kw.id}`
                            ? 'bg-[#378ADD]/10 text-[#378ADD]'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Link
                          href={`/anchor/${kw.id}`}
                          className="flex-1 px-3 py-1.5 text-xs truncate"
                        >
                          <span className="truncate max-w-[120px] block">{kw.name}</span>
                        </Link>
                        <Link
                          href={`/anchor/edit?id=${kw.id}`}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 p-0.5 shrink-0"
                        >
                          <Sliders size={11} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 区切り */}
        <div className="my-2 border-t border-gray-100 mx-3" />

        <Link
          href="/anchor/edit"
          className={`flex items-center gap-2 px-3 py-2 text-sm mx-1 rounded-md transition-colors ${
            pathname === '/anchor/edit'
              ? 'bg-[#378ADD]/10 text-[#378ADD] font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Plus size={14} />
          アンカー登録/編集
        </Link>
      </div>

      {/* 下部固定 */}
      <div className="border-t border-gray-100 py-2">
        <Link
          href="/settings"
          className={`flex items-center gap-2 px-3 py-2 text-sm mx-1 rounded-md transition-colors ${
            isActive('/settings')
              ? 'bg-[#378ADD]/10 text-[#378ADD] font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Settings size={15} />
          設定
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 px-3 py-2 text-sm mx-1 rounded-md text-gray-600 hover:bg-gray-100 w-full text-left transition-colors"
        >
          <LogOut size={15} />
          ログアウト
        </button>
      </div>
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, ChevronDown, ChevronRight, Settings, LogOut, Plus, Sliders,
  Anchor as AnchorIcon, FileBarChart,
} from 'lucide-react'
import { useState } from 'react'
import type { PickKeyword } from '@/lib/types'

interface Props {
  keywords: PickKeyword[]
}

export function SideNav({ keywords }: Props) {
  const pathname = usePathname()
  const [anchorOpen, setAnchorOpen] = useState(true)
  const [listOpen, setListOpen] = useState(true)

  const isActive = (path: string) => pathname === path
  const isAnchorActive = (id: string) => pathname === `/anchor/${id}`

  return (
    <nav className="w-[220px] bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="flex-1 overflow-y-auto py-3">
        {/* ダッシュボード */}
        <NavLink
          href="/dashboard"
          icon={<LayoutDashboard size={15} />}
          label="ダッシュボード"
          active={isActive('/dashboard')}
        />

        {/* アンカー アコーディオン */}
        <div className="mt-1">
          <button
            onClick={() => setAnchorOpen(!anchorOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left text-gray-700 hover:bg-gray-50 mx-1 rounded-md transition-colors"
          >
            {anchorOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <AnchorIcon size={14} />
            <span className="font-medium">アンカー</span>
          </button>

          {anchorOpen && (
            <div className="ml-4 pl-2 border-l border-gray-100 mt-1 mb-1">
              {/* アンカー登録 */}
              <Link
                href="/anchor/edit"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs mx-1 rounded-md transition-colors ${
                  pathname === '/anchor/edit'
                    ? 'bg-[#378ADD]/10 text-[#378ADD] font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Plus size={12} />
                アンカー登録
              </Link>

              {/* アンカー一覧（サブアコーディオン） */}
              <div className="mt-0.5">
                <button
                  onClick={() => setListOpen(!listOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs w-full text-left text-gray-600 hover:bg-gray-50 mx-1 rounded-md transition-colors"
                >
                  {listOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  <span>アンカー一覧</span>
                  {keywords.length > 0 && (
                    <span className="ml-auto text-[10px] text-gray-400">{keywords.length}</span>
                  )}
                </button>

                {listOpen && keywords.length > 0 && (
                  <div className="ml-3 pl-2 border-l border-gray-100 mt-0.5">
                    {keywords.map((kw) => (
                      <div
                        key={kw.id}
                        className={`group relative flex items-center justify-between pr-1.5 mx-1 rounded-md transition-colors ${
                          isAnchorActive(kw.id)
                            ? 'bg-[#378ADD]/10 text-[#378ADD]'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Link
                          href={`/anchor/${kw.id}`}
                          className="flex-1 px-2.5 py-1 text-[11px] truncate"
                        >
                          <span className="truncate max-w-[130px] block">{kw.name}</span>
                        </Link>
                        <Link
                          href={`/anchor/edit?id=${kw.id}`}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 p-0.5 shrink-0"
                          title="編集"
                        >
                          <Sliders size={10} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
                {listOpen && keywords.length === 0 && (
                  <p className="text-[10px] text-gray-400 px-3 py-1 ml-3">登録なし</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* サマリ・レポート */}
        <NavLink
          href="/reports"
          icon={<FileBarChart size={15} />}
          label="サマリ・レポート"
          active={pathname.startsWith('/reports')}
        />
      </div>

      {/* 下部固定 */}
      <div className="border-t border-gray-100 py-2">
        <NavLink
          href="/settings"
          icon={<Settings size={15} />}
          label="設定"
          active={isActive('/settings')}
        />
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 px-3 py-2 text-sm mx-1 rounded-md text-gray-600 hover:bg-gray-50 w-full text-left transition-colors"
        >
          <LogOut size={15} />
          ログアウト
        </button>
      </div>
    </nav>
  )
}

function NavLink({
  href, icon, label, active,
}: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 text-sm mx-1 rounded-md transition-colors ${
        active
          ? 'bg-[#378ADD]/10 text-[#378ADD] font-medium'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}

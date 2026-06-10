import type { Metadata } from 'next'
import { Wordmark } from '@/components/brand/Wordmark'
import { SideNav } from '@/components/SideNav'
import { DashboardClient } from '../(app)/dashboard/DashboardClient'
import { mockUser, mockKeywords, mockItems } from '@/lib/mock'

export const metadata: Metadata = {
  title: 'デモ',
  description: 'ReAnker のダッシュボード画面をログイン不要で体験できます（ダミーデータ）。',
  // ルートレイアウトの canonical（トップページ）を継承しないよう自身を指定
  alternates: { canonical: 'https://reanker.com/demo' },
  robots: { index: false, follow: false },
}

// 認証・DBなしでダッシュボード(ホーム)を確認するためのデモ画面
export default function DemoPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* トップナビ（デモ用簡易版） */}
      <header className="h-11 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center text-gray-900">
          <Wordmark height={20} />
          <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">DEMO</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#378ADD] flex items-center justify-center text-white text-xs font-bold">デ</div>
          <span className="text-xs text-gray-600">デモユーザー</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <SideNav keywords={mockKeywords} />
        <main className="flex-1 overflow-y-auto p-6">
          <DashboardClient user={mockUser} keywords={mockKeywords} items={mockItems} />
        </main>
      </div>
    </div>
  )
}

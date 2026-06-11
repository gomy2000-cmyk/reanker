import type { Metadata } from 'next'
import { DemoClient } from './DemoClient'
import { mockKeywords, mockItems, mockFetchPool } from '@/lib/mock'

export const metadata: Metadata = {
  title: 'デモ',
  description: 'ReAnker をログイン不要で体験できます。ダッシュボードと記事一覧をサンプルデータで自由に操作できます。',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://reanker.com/demo' },
}

// 認証・DBなしで主要画面を体験するためのデモ。
// 画面遷移はすべて DemoClient 内の state で完結する（実ルートへ飛ばすとログインに弾かれるため）。
export default function DemoPage() {
  return <DemoClient keywords={mockKeywords} initialItems={mockItems} fetchPool={mockFetchPool} />
}

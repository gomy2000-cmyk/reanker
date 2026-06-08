import type { Metadata } from 'next'
import { NailyLp } from './NailyLp'

export const metadata: Metadata = {
  title: 'ナイリー（nAIly）｜好きな名前で使えるAIチャット環境',
  description:
    '会社名、サービス名、ブランド名など、好きな名前で利用できるAIチャット環境を最短5営業日でご提供。ナイリーはChatGPTやClaude同等の機能を、あなたの名前・ロゴ・専用URLで。',
  openGraph: {
    title: 'ナイリー（nAIly）｜好きな名前で使えるAIチャット環境',
    description:
      '会社名、サービス名、ブランド名など、好きな名前で利用できるAIチャット環境を最短5営業日でご提供。',
    locale: 'ja_JP',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function NailyPage() {
  return <NailyLp />
}

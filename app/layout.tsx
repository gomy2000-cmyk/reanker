import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { GoogleTagManager } from '@next/third-parties/google'
import './globals.css'
import { Providers } from './providers'
import { GTMPageView } from '@/components/GTMPageView'

// 診断のため：env var が空でもハードコード値で必ず GTM を出す
// （Vercel の NEXT_PUBLIC_GTM_ID 設定確認後、フォールバックは削除して `|| ''` に戻してよい）
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-MQBBQ2C4'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://reanker.com'),
  title: {
    default: 'ReAnker｜競合リリースを毎日自動チェックする監視ツール',
    template: '%s｜ReAnker',
  },
  description: 'ReAnkerは、競合企業のプレスリリースを毎日自動でチェックし、新着リリースをSlackやメールに通知する競合リリース監視ツールです。PR TIMES と Google News の関連報道もまとめて把握できます。',
  applicationName: 'ReAnker',
  keywords: [
    '競合リリース監視', '競合監視', '競合分析', 'プレスリリース監視', 'PR TIMES 監視',
    'Google News', 'Slack 通知', '広報PR', '競合リリース', 'ReAnker',
  ],
  authors: [{ name: 'ReAnker' }],
  creator: 'ReAnker',
  publisher: 'ReAnker',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://reanker.com',
    siteName: 'ReAnker',
    title: 'ReAnker｜競合リリースを毎日自動チェックする監視ツール',
    description: '競合企業のプレスリリースを毎日自動で監視し、新着リリースだけをSlack・メールに通知する競合リリース監視ツール。月額300円から。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReAnker｜競合リリースを毎日自動チェックする監視ツール',
    description: '競合のプレスリリースを毎日自動チェック・通知する競合リリース監視ツール。',
  },
  alternates: {
    canonical: 'https://reanker.com',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#378ADD',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      {/* Next.js 16 公式の Google Tag Manager コンポーネント。
          <html> 直下に置くのが正しい（<head> 内に raw <script> を入れる旧手法は
          App Router の <head> 管理と干渉して出力されないことがある）。
          GoogleTagManager が <script> + noscript <iframe> を両方適切に出力する。 */}
      <GoogleTagManager gtmId={GTM_ID} />
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Suspense fallback={null}>
          <GTMPageView />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

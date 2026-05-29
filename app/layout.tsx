import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { Providers } from './providers'
import { GTMPageView } from '@/components/GTMPageView'
import { GTMScript, GTMNoScript } from '@/components/GTM'

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
      <head>
        {/* GTM スニペット: <head> 内にできるだけ早く配置 */}
        <GTMScript />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* GTM noscript フォールバック: <body> 直後 */}
        <GTMNoScript />

        {/* SPA クライアント遷移の page_view を dataLayer に push */}
        <Suspense fallback={null}>
          <GTMPageView />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

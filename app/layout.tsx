import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { Providers } from './providers'
import { GTMScript, GTMNoScript } from '@/components/GTM'
import { GTMPageView } from '@/components/GTMPageView'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://reanker.com'),
  title: {
    default: 'Reanker｜競合のプレスリリース・ニュースを自動監視',
    template: '%s｜ReAnker',
  },
  description: 'Reankerは、PR TIMESやGoogle Newsから競合企業の動きを自動取得し、Slackやメールで通知するBtoB向け競合監視SaaSです。',
  applicationName: 'ReAnker',
  keywords: [
    '競合監視', '競合分析', 'クリッピングサービス', 'プレスリリース', 'PR TIMES',
    'Google News', 'Slack 通知', '広報PR', 'BtoB SaaS', 'ReAnker',
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
    title: 'Reanker｜競合のプレスリリース・ニュースを自動監視',
    description: 'PR TIMES・Google Newsから競合企業の動きを自動取得し、Slack・メールで通知するBtoB向け競合監視SaaS。月額300円から。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reanker｜競合のプレスリリース・ニュースを自動監視',
    description: 'PR TIMES・Google Newsから競合の動きを毎日自動取得・通知するBtoB向けSaaS。',
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
        <GTMScript />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <GTMNoScript />
        <Suspense fallback={null}>
          <GTMPageView />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'
import { GTMPageView } from '@/components/GTMPageView'

const GA4_ID = 'G-Q54M9ZZ3YM'

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
      <head />
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* Google tag (gtag.js) - GA4 直接設置 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}', { send_page_view: false });
          `}
        </Script>
        {/* End Google tag */}

        {/* SPA クライアント遷移でも page_view を送る */}
        <Suspense fallback={null}>
          <GTMPageView />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

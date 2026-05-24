import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { Providers } from './providers'
import { GTMPageView } from '@/components/GTMPageView'

// 診断用：env var ではなくハードコード直書きで本番HTMLに出るか切り分け
const GTM_ID = 'GTM-MQBBQ2C4'

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

// Google Tag Manager - 古典的スニペット（inline script + noscript iframe）
// 診断のため、env var ではなくハードコードで直書きする。
// インライン script 内に 'https://www.googletagmanager.com/gtm.js?id=GTM-MQBBQ2C4' の
// URL文字列が含まれるため、curl での grep 確認が可能。
const GTM_HEAD_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* Google Tag Manager - 古典的スニペット（head 内 inline script） */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: GTM_HEAD_SCRIPT }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* Google Tag Manager (noscript) - body 開始直後 */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <Suspense fallback={null}>
          <GTMPageView />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

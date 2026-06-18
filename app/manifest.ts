import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ReAnker — 競合リリースを毎日自動チェックする監視ツール',
    short_name: 'ReAnker',
    description: '競合企業のプレスリリースを毎日自動でチェックし、新着リリースをSlack・メールに通知する競合リリース監視ツール。',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#378ADD',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    lang: 'ja',
  }
}

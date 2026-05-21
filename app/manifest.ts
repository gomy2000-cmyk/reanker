import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Reanker — 競合のプレスリリース・ニュースを自動監視',
    short_name: 'Reanker',
    description: 'PR TIMES・Google Newsから競合企業の動きを自動取得し、Slackやメールで通知するBtoB向け競合監視SaaS。',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#378ADD',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
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

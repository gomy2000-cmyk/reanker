import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API routes はクロール不要
          '/dashboard',      // 認証後ページ
          '/anchor',         // 認証後ページ
          '/settings',       // 認証後ページ
          '/demo',           // モックデータのデモ画面
          '/login',          // ログインページは noindex
        ],
      },
    ],
    sitemap: 'https://reanker.com/sitemap.xml',
    host: 'https://reanker.com',
  }
}

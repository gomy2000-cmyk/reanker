import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/anchor', '/settings'],
      },
    ],
    sitemap: 'https://reanker.com/sitemap.xml',
    host: 'https://reanker.com',
  }
}

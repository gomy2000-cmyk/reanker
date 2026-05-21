import { ImageResponse } from 'next/og'
import { getBlogPost, getAllBlogSlugs } from '@/lib/blog'

export const runtime = 'nodejs'
export const alt = 'Reanker Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  const title = post?.title ?? 'Reanker Blog'
  const category = post?.category ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* ブランドワードマーク（小） */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: 38, fontWeight: 900, color: '#0a0a0a', letterSpacing: '-2px', lineHeight: 1, display: 'flex' }}>
            RE
          </span>
          <svg width="24" height="38" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 2px' }}>
            <path d="M12 1 L7 7 L17 7 Z" fill="#0a0a0a" />
            <line x1="12" y1="6" x2="12" y2="24" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="5" y1="10.5" x2="19" y2="10.5" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M12 22 L4 29 M4 29 L8 28 M4 29 L5 25" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M12 22 L20 29 M20 29 L16 28 M20 29 L19 25" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span style={{ fontSize: 38, fontWeight: 900, color: '#0a0a0a', letterSpacing: '-2px', lineHeight: 1, display: 'flex' }}>
            NKER
          </span>
          <span style={{ fontSize: 24, color: '#9ca3af', marginLeft: 16, display: 'flex' }}>· ブログ</span>
        </div>

        {/* Category badge */}
        {category && (
          <span
            style={{
              fontSize: 18,
              color: '#378ADD',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 20,
              display: 'flex',
            }}
          >
            {category}
          </span>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: title.length > 40 ? 44 : title.length > 25 ? 52 : 60,
            fontWeight: 700,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            margin: 0,
            display: 'flex',
            flex: 1,
            alignItems: 'flex-start',
          }}
        >
          {title}
        </h1>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 32,
            borderTop: '1px solid #e5e7eb',
            paddingTop: 24,
          }}
        >
          <span style={{ fontSize: 20, color: '#6b7280', display: 'flex' }}>BtoB 競合監視 SaaS · 月¥300〜</span>
          <span style={{ fontSize: 20, color: '#6b7280', display: 'flex' }}>reanker.com</span>
        </div>
      </div>
    ),
    { ...size }
  )
}

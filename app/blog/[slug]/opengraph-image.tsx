import { ImageResponse } from 'next/og'
import { getBlogPost, getAllBlogSlugs } from '@/lib/blog'

export const runtime = 'nodejs' // ファイルシステム読み込みのため Node ランタイム
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
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: '#378ADD',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '22px',
              fontWeight: 700,
            }}
          >
            ⚓
          </div>
          <span style={{ fontSize: '26px', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Reanker</span>
          <span style={{ fontSize: '20px', color: '#9ca3af', marginLeft: '8px' }}>· ブログ</span>
        </div>

        {/* Category badge */}
        {category && (
          <span style={{
            fontSize: '18px',
            color: '#378ADD',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            {category}
          </span>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: title.length > 40 ? '44px' : title.length > 25 ? '52px' : '60px',
            fontWeight: 700,
            color: '#111827',
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
          <span style={{ fontSize: '20px', color: '#6b7280' }}>競合監視SaaS · 月¥300〜</span>
          <span style={{ fontSize: '20px', color: '#6b7280' }}>reanker.com</span>
        </div>
      </div>
    ),
    { ...size }
  )
}

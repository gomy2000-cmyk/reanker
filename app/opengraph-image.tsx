import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ReAnker｜競合リリースを毎日自動チェックする監視ツール'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* ブランドワードマーク */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <span
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: '#0a0a0a',
              letterSpacing: '-3px',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            RE
          </span>
          <svg width="36" height="58" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 2px' }}>
            <path d="M12 1 L7 7 L17 7 Z" fill="#0a0a0a" />
            <line x1="12" y1="6" x2="12" y2="24" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="5" y1="10.5" x2="19" y2="10.5" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M12 22 L4 29 M4 29 L8 28 M4 29 L5 25" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M12 22 L20 29 M20 29 L16 28 M20 29 L19 25" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: '#0a0a0a',
              letterSpacing: '-3px',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            NKER
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <p style={{ fontSize: 22, color: '#378ADD', fontWeight: 600, marginBottom: 18, letterSpacing: '0.08em', display: 'flex' }}>
            競合リリース監視ツール
          </p>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#0a0a0a',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>競合のリリースを、</span>
            <span>毎日自動でチェック。</span>
          </h1>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 24,
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <span style={{ fontSize: 22, color: '#6b7280', display: 'flex' }}>月額 ¥300 から · 無料プランあり</span>
          <span style={{ fontSize: 22, color: '#6b7280', display: 'flex' }}>reanker.com</span>
        </div>
      </div>
    ),
    { ...size }
  )
}

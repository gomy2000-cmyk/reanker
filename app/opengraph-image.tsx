import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Reanker — 競合のPR TIMES・Google Newsを毎日自動チェック'
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
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '36px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: '#378ADD',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              fontWeight: 700,
            }}
          >
            ⚓
          </div>
          <span style={{ fontSize: '32px', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Reanker</span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <p style={{ fontSize: '20px', color: '#378ADD', fontWeight: 600, marginBottom: '16px', letterSpacing: '0.05em' }}>
            BtoB 競合監視 SaaS
          </p>
          <h1 style={{ fontSize: '64px', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
            競合のPR TIMES・Google Newsを<br />毎日自動チェック。
          </h1>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontSize: '22px', color: '#6b7280' }}>月額 ¥300 から · 無料プランあり</span>
          <span style={{ fontSize: '22px', color: '#6b7280' }}>reanker.com</span>
        </div>
      </div>
    ),
    { ...size }
  )
}

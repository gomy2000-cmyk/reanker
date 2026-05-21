import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
          padding: '20px 26px',
        }}
      >
        {/* R 文字 */}
        <span
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-6px',
            lineHeight: 1,
            display: 'flex',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          R
        </span>
        {/* 錨マーク（SVG） */}
        <svg width="60" height="76" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 4 }}>
          <path d="M12 1 L7 7 L17 7 Z" fill="#fff" />
          <line x1="12" y1="6" x2="12" y2="24" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="5" y1="10.5" x2="19" y2="10.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 22 L4 29 M4 29 L8 28 M4 29 L5 25" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M12 22 L20 29 M20 29 L16 28 M20 29 L19 25" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    ),
    { ...size }
  )
}

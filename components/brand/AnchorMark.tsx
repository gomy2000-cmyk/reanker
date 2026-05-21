/**
 * Reanker のブランドアンカーマーク。
 * 上向き矢印 + 縦軸 + 横棒 + V字に開く矢印付きフルーク。
 * `currentColor` を継承するので `text-*` で色指定可能。
 */
interface Props {
  size?: number
  className?: string
  strokeWidth?: number
}

export function AnchorMark({ size = 24, className, strokeWidth = 2 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 上向きの矢じり（リング部分） */}
      <path d="M12 2 L7.5 7 L16.5 7 Z" fill="currentColor" />
      {/* 縦軸 */}
      <line x1="12" y1="6.5" x2="12" y2="17.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* 横棒（クロスバー） */}
      <line x1="6.5" y1="10" x2="17.5" y2="10" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* 左フルーク（下外向き矢印） */}
      <path
        d="M12 16 L6 22 M6 22 L9.2 21.2 M6 22 L6.8 18.8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 右フルーク（下外向き矢印） */}
      <path
        d="M12 16 L18 22 M18 22 L14.8 21.2 M18 22 L17.2 18.8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

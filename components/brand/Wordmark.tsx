import { AnchorMark } from './AnchorMark'

/**
 * Reanker のワードマーク（ロゴ全体）。
 * "RE" + アンカーマーク + "NKER" の構成で、アンカーが "A" の位置に来る。
 * テキストは Inter Bold 系で表示し、currentColor を継承。
 */
interface Props {
  /** ロゴの高さ（px）。テキストとアンカーがこの高さで整列。 */
  height?: number
  className?: string
  /** "REANKER" のテキスト部分のクラス（色・字間など上書き用） */
  textClassName?: string
}

export function Wordmark({ height = 22, className, textClassName }: Props) {
  // テキスト部分は font-extrabold で約9割の高さに見える
  const fontSize = height * 0.95
  const anchorSize = height * 1.05
  const gap = height * 0.05

  return (
    <span
      className={`inline-flex items-center ${className ?? ''}`}
      style={{ height, lineHeight: 1, letterSpacing: '-0.02em' }}
      aria-label="Reanker"
    >
      <span
        className={`font-extrabold leading-none ${textClassName ?? ''}`}
        style={{ fontSize, letterSpacing: '-0.04em' }}
      >
        RE
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', margin: `0 ${gap}px` }}>
        <AnchorMark size={anchorSize} />
      </span>
      <span
        className={`font-extrabold leading-none ${textClassName ?? ''}`}
        style={{ fontSize, letterSpacing: '-0.04em' }}
      >
        NKER
      </span>
    </span>
  )
}

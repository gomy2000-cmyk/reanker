import Image from 'next/image'

/**
 * ReAnker のワードマーク（公式PNG使用）。
 * デフォルトは黒透明背景版。`variant="white"` でダーク背景用に切替可。
 */
interface Props {
  /** ロゴの高さ（px）。アスペクト比は約 5:1 で自動計算。 */
  height?: number
  className?: string
  /** 'black'（既定）: 明色ヘッダー用 / 'white': 暗色ヘッダー用 */
  variant?: 'black' | 'white'
  /** リンク等にラップするとき alt が外側にあるならこちらを true に */
  decorative?: boolean
}

export function Wordmark({ height = 22, className, variant = 'black', decorative = false }: Props) {
  const src =
    variant === 'white'
      ? '/brand/03_primary_logo_white_on_black.png'
      : '/brand/02_primary_logo_black_transparent.png'

  // 元PNG (1600x400) のアスペクト比 4:1
  const width = Math.round(height * 4)

  return (
    <Image
      src={src}
      alt={decorative ? '' : 'ReAnker'}
      width={width}
      height={height}
      priority
      className={className}
      style={{ height, width: 'auto' }}
    />
  )
}

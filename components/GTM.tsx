import { GTM_ID } from '@/lib/analytics'

/**
 * <head> に挿入する GTM スニペット（生の <script>）。
 *
 * 仕様：
 * - NEXT_PUBLIC_GTM_ID が設定されている場合のみ出力する
 * - 値が空なら何も出さない（アプリは落ちない）
 * - next/script ではなく素の <script> を server-render することで、
 *   first-paint 前から HTML に確実に含まれる（View Source でも見える）
 * - NODE_ENV のゲートは外した。Vercel 側で Production 環境にだけ
 *   NEXT_PUBLIC_GTM_ID をセットすれば、結果として本番のみで動く
 */
export function GTMScript() {
  if (!GTM_ID) return null
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
        `.trim(),
      }}
    />
  )
}

/**
 * <body> 直後に挿入する noscript フォールバック。
 */
export function GTMNoScript() {
  if (!GTM_ID) return null
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}

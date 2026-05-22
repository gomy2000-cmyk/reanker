import Script from 'next/script'
import { GTM_ENABLED, GTM_ID } from '@/lib/analytics'

/**
 * <head> に挿入する GTM スニペット。
 * 本番 (NODE_ENV === 'production') かつ NEXT_PUBLIC_GTM_ID が設定されている場合のみ読み込む。
 */
export function GTMScript() {
  if (!GTM_ENABLED) return null
  return (
    <Script
      id="gtm-init"
      strategy="afterInteractive"
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
  if (!GTM_ENABLED) return null
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

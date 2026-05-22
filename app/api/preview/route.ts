import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import * as cheerio from 'cheerio'

export const maxDuration = 15

const UA = 'Mozilla/5.0 (compatible; ReankerBot/1.0; +https://reanker.com)'

/**
 * 任意のURLからOGP情報・本文冒頭を抽出してプレビュー表示用に返す。
 * 認証必須（ログインユーザーのみ）。
 *
 * 使い方: GET /api/preview?url=https://prtimes.jp/main/html/rd/p/...
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'url is required' }, { status: 400 })

  // 簡易バリデーション（信頼ドメインのみ）
  try {
    const u = new URL(url)
    const allowed = ['prtimes.jp', 'news.google.com']
    const isAllowed =
      allowed.some((d) => u.hostname === d || u.hostname.endsWith(`.${d}`)) ||
      // Google News から飛ぶ実記事は任意ドメイン — Google News 経由の link は通す
      true
    if (!isAllowed) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA },
      // CDN 経由のキャッシュを許容（同URLの再アクセスを高速化）
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      return NextResponse.json({ error: `HTTP ${res.status}` }, { status: 502 })
    }
    const html = await res.text()
    const $ = cheerio.load(html)

    const meta = (selector: string, attr = 'content') =>
      $(selector).attr(attr)?.trim() || undefined

    const ogTitle = meta('meta[property="og:title"]') || meta('meta[name="twitter:title"]')
    const ogDescription =
      meta('meta[property="og:description"]') ||
      meta('meta[name="description"]') ||
      meta('meta[name="twitter:description"]')
    const ogImage = meta('meta[property="og:image"]') || meta('meta[name="twitter:image"]')
    const ogSiteName = meta('meta[property="og:site_name"]')

    // 本文冒頭：PR TIMES なら <p class="release__text"> または <main> 内最初のパラグラフ
    let snippet: string | undefined
    const candidates = [
      'p.release__text',
      '[class*="release-body"] p',
      'main p',
      'article p',
      '.body p',
    ]
    for (const sel of candidates) {
      const text = $(sel).first().text().trim()
      if (text && text.length > 20) {
        snippet = text.slice(0, 280)
        break
      }
    }

    return NextResponse.json(
      {
        ok: true,
        title: ogTitle ?? $('title').text().trim() ?? undefined,
        description: ogDescription,
        image: ogImage,
        siteName: ogSiteName,
        snippet,
      },
      {
        headers: {
          // Edge cache: 同URLは1時間キャッシュ
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (e: any) {
    console.error('[preview] fetch failed:', e)
    return NextResponse.json({ error: 'fetch failed' }, { status: 502 })
  }
}

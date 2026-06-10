import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import * as cheerio from 'cheerio'
import { supabaseAdmin } from '@/lib/supabase'

export const maxDuration = 15

const UA = 'Mozilla/5.0 (compatible; ReankerBot/1.0; +https://reanker.com)'

const TRUSTED_DOMAINS = ['prtimes.jp', 'news.google.com']

function isTrustedDomain(hostname: string): boolean {
  return TRUSTED_DOMAINS.some((d) => hostname === d || hostname.endsWith(`.${d}`))
}

/**
 * 自分のアンカーで取得済みの記事URLかどうか（SSRF対策の本丸）。
 * Google News 経由の実記事は任意ドメインだが、必ず items に保存されたURLからしか
 * プレビューしないため、「ログインユーザー本人の items に存在するURL」のみ許可する。
 */
async function isOwnSavedItemUrl(url: string, email: string): Promise<boolean> {
  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('email', email).single()
  if (!user) return false

  const { data: item } = await supabaseAdmin
    .from('items')
    .select('id, pick_keywords!inner(user_id)')
    .eq('url', url)
    .eq('pick_keywords.user_id', user.id)
    .limit(1)
    .maybeSingle()

  return !!item
}

/**
 * 記事URLからOGP情報・本文冒頭を抽出してプレビュー表示用に返す。
 * 認証必須（ログインユーザーのみ）。
 *
 * 許可するURL:
 *   - 信頼ドメイン（prtimes.jp / news.google.com）
 *   - または自分のアンカーで取得済み（items に存在する）URL
 * それ以外は 403。内部ネットワーク等への任意リクエスト（SSRF）を防ぐ。
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

  try {
    const u = new URL(url)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
    }
    const allowed = isTrustedDomain(u.hostname) || (await isOwnSavedItemUrl(url, session.user.email))
    if (!allowed) {
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
  } catch (e: unknown) {
    console.error('[preview] fetch failed:', e)
    return NextResponse.json({ error: 'fetch failed' }, { status: 502 })
  }
}

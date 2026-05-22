import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { yesterdayJST } from '@/lib/scraper'
import { fetchAndSaveForAnchor } from '@/lib/fetchAndSave'

export const maxDuration = 300

/**
 * Vercel Cron: 01:00 JST (16:00 UTC) 毎日
 * 前日分の記事を取得・保存（通知はしない）
 *
 * 手動実行例:
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *        "https://reanker.com/api/cron/fetch?date=2026-05-21"
 *
 * クエリ:
 *   ?date=YYYY-MM-DD  指定日のみ取得（デバッグ用）
 *   ?date=any         日付フィルタなし全件（デバッグ用）
 *   （省略時）         yesterdayJST() を使用
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dateParam = req.nextUrl.searchParams.get('date')
  const targetDate: string | null =
    dateParam === 'any' ? null : (dateParam ?? yesterdayJST())

  const today = new Date()
  const isEvenDay = today.getDate() % 2 === 0

  // 全アンカー取得（ユーザーのプラン情報込み）
  const { data: anchors } = await supabaseAdmin
    .from('pick_keywords')
    .select('id, query_value, sources, users!inner(plan)')

  if (!anchors) return NextResponse.json({ ok: true, processed: 0 })

  let totalSaved = 0
  let totalFound = 0
  let totalSkipped = 0
  let processed = 0
  const perAnchor: Array<{ id: string; query: string; found: number; saved: number; skipped: number; errors: string[] }> = []

  for (const anchor of anchors as any[]) {
    // フリープランは隔日（偶数日のみ実行）
    if (anchor.users.plan === 'free' && !isEvenDay) continue

    processed++
    const result = await fetchAndSaveForAnchor(
      { id: anchor.id, query_value: anchor.query_value, sources: anchor.sources },
      targetDate
    )
    totalFound += result.found
    totalSaved += result.saved
    totalSkipped += result.skipped
    perAnchor.push({
      id: anchor.id,
      query: anchor.query_value,
      found: result.found,
      saved: result.saved,
      skipped: result.skipped,
      errors: result.errors,
    })
  }

  return NextResponse.json({
    ok: true,
    target_date: targetDate,
    processed,
    found: totalFound,
    saved: totalSaved,
    skipped: totalSkipped,
    per_anchor: perAnchor,
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { fetchPRTimes, fetchGoogleNews, yesterdayJST } from '@/lib/scraper'
import type { PickKeyword } from '@/lib/types'

export const maxDuration = 300

/**
 * Vercel Cron: 01:00 JST (16:00 UTC) 毎日
 * 前日分の記事を取得・保存（通知はしない）
 */
export async function GET(req: NextRequest) {
  // Vercel Cron認証
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const targetDate = yesterdayJST()
  const today = new Date()
  const isEvenDay = today.getDate() % 2 === 0

  // 全アンカー取得（ユーザーのプランも一緒に）
  const { data: keywords } = await supabaseAdmin
    .from('pick_keywords')
    .select('*, users!inner(plan)')

  if (!keywords) return NextResponse.json({ ok: true, processed: 0 })

  let totalSaved = 0
  let totalProcessed = 0

  for (const kw of keywords as (PickKeyword & { users: { plan: string } })[]) {
    // フリープランは隔日（偶数日のみ実行）
    if (kw.users.plan === 'free' && !isEvenDay) continue

    totalProcessed++
    const all = []

    if (kw.sources.includes('prtimes')) {
      const items = await fetchPRTimes(kw.query_value, targetDate)
      all.push(...items)
    }
    if (kw.sources.includes('googlenews')) {
      const items = await fetchGoogleNews(kw.query_value, targetDate)
      all.push(...items)
    }

    // 重複URLはINSERT時に弾かれる（unique制約）
    for (const item of all) {
      const { error } = await supabaseAdmin.from('items').insert({
        pickkw_id: kw.id,
        source: item.source,
        title: item.title,
        url: item.url,
        summary: item.summary,
        published_at: item.published_at,
        published_hour: item.published_hour,
      })
      if (!error) totalSaved++
    }
  }

  return NextResponse.json({ ok: true, target_date: targetDate, processed: totalProcessed, saved: totalSaved })
}

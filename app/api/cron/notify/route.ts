import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendSlack, sendEmail } from '@/lib/notify'
import { yesterdayJST } from '@/lib/scraper'

export const maxDuration = 300

/**
 * Vercel Cron: 09:00 JST (00:00 UTC) 毎日
 * notified=false かつ published_at=昨日 かつ now>=warmup_until を通知
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const targetDate = yesterdayJST()
  const now = new Date().toISOString()

  // 通知対象のitemsを取得（warmup_until を過ぎたkeywordのみ）
  const { data: items } = await supabaseAdmin
    .from('items')
    .select('*, pick_keywords!inner(*, users!inner(*))')
    .eq('notified', false)
    .eq('published_at', targetDate)
    .lte('pick_keywords.warmup_until', now) as any

  if (!items || items.length === 0) {
    return NextResponse.json({ ok: true, notified: 0 })
  }

  // アンカー別グルーピング
  const groups = new Map<string, any>()
  for (const item of items) {
    const kwId = item.pickkw_id
    if (!groups.has(kwId)) {
      groups.set(kwId, { keyword: item.pick_keywords, user: item.pick_keywords.users, items: [] })
    }
    groups.get(kwId).items.push(item)
  }

  let notifiedCount = 0
  const successIds: string[] = []

  for (const group of groups.values()) {
    const { keyword, user, items: groupItems } = group
    try {
      if (keyword.notify_slack && user.slack_webhook_url) {
        await sendSlack(user.slack_webhook_url, keyword.name, groupItems)
      }
      if (keyword.notify_email && (user.notify_email || user.email)) {
        await sendEmail(user.notify_email || user.email, keyword.name, groupItems)
      }
      successIds.push(...groupItems.map((i: any) => i.id))
      notifiedCount += groupItems.length
    } catch (e) {
      console.error(`Notify failed for keyword ${keyword.id}:`, e)
    }
  }

  if (successIds.length > 0) {
    await supabaseAdmin.from('items').update({ notified: true }).in('id', successIds)
  }

  return NextResponse.json({ ok: true, notified: notifiedCount })
}

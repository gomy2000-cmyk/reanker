import { requireUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  const user = await requireUser()

  const { data: keywords } = await supabaseAdmin
    .from('pick_keywords')
    .select('*')
    .eq('user_id', user.id)

  const keywordIds = (keywords ?? []).map((k) => k.id)

  // UI のプリセット最大値（30日）に合わせてロード。
  // 「今すぐ取得」で保存された記事は published_at が古い場合があるため、
  // published_at ではなく created_at（DB保存日時）でも過去30日を取得する。
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

  const { data: recentItems } = keywordIds.length > 0
    ? await supabaseAdmin
        .from('items')
        .select('*, pick_keywords(*)')
        .in('pickkw_id', keywordIds)
        .is('deleted_at', null)
        .or(`published_at.gte.${thirtyDaysAgoStr},created_at.gte.${thirtyDaysAgo.toISOString()}`)
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(500)
    : { data: [] }

  return (
    <DashboardClient
      user={user}
      keywords={keywords ?? []}
      items={recentItems ?? []}
    />
  )
}

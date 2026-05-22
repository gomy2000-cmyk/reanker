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

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentItems } = keywordIds.length > 0
    ? await supabaseAdmin
        .from('items')
        .select('*, pick_keywords(*)')
        .in('pickkw_id', keywordIds)
        .is('deleted_at', null)
        .gte('published_at', sevenDaysAgo.toISOString().split('T')[0])
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <DashboardClient
      user={user}
      keywords={keywords ?? []}
      items={recentItems ?? []}
    />
  )
}

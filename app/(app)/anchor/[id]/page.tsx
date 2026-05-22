import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { AnchorClient } from './AnchorClient'

export default async function AnchorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()

  const { data: keyword } = await supabaseAdmin
    .from('pick_keywords')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!keyword) notFound()

  const { data: items } = await supabaseAdmin
    .from('items')
    .select('*')
    .eq('pickkw_id', id)
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(500)

  return <AnchorClient user={user} keyword={keyword} initialItems={items ?? []} />
}

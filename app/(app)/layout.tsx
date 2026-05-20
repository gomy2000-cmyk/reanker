import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { TopNav } from '@/components/TopNav'
import { SideNav } from '@/components/SideNav'
import { supabaseAdmin } from '@/lib/supabase'
import type { PickKeyword } from '@/lib/types'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  if (!session?.user?.email) redirect('/login')

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  let keywords: PickKeyword[] = []
  if (user) {
    const { data } = await supabaseAdmin
      .from('pick_keywords')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    keywords = data ?? []
  }

  return (
    <div className="flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <SideNav keywords={keywords} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

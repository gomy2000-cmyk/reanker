import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from './supabase'
import type { User } from './types'

export async function requireUser(): Promise<User> {
  const session = await getServerSession()
  if (!session?.user?.email) redirect('/login')

  const { data } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', session.user.email)
    .single()

  if (!data) redirect('/login')
  return data as User
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const allowed = ['name', 'email', 'slack_webhook_url', 'notify_email']
  const updates: Record<string, any> = {}
  for (const k of allowed) if (k in body) updates[k] = body[k]

  const { error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('email', session.user.email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

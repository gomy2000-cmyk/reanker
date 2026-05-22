import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from '@/lib/supabase'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return false

      const { data: existing } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('google_id', account.providerAccountId)
        .single()

      if (!existing) {
        await supabaseAdmin.from('users').insert({
          google_id: account.providerAccountId,
          email: user.email!,
          name: user.name ?? null,
        })
        ;(user as { isNewUser?: boolean }).isNewUser = true
      }

      return true
    },
    async session({ session, token }) {
      if (token.sub) {
        const { data } = await supabaseAdmin
          .from('users')
          .select('id, plan')
          .eq('google_id', token.sub)
          .single()

        if (data) {
          session.user.id = data.id
          session.user.plan = data.plan
        }
      }
      // 初回サインイン直後の1セッションだけ true を渡す
      if (token.isNewUser) {
        session.user.isNewUser = true
      }
      return session
    },
    async jwt({ token, user, trigger }) {
      if (user && (user as { isNewUser?: boolean }).isNewUser) {
        token.isNewUser = true
      } else if (trigger === 'update' || !user) {
        // 一度配信したらクリア（クライアント側でセッションが更新された後）
        // ただし最初の数回は維持したいので、ここでは消さない方針にする
      }
      return token
    },
  },
})

export { handler as GET, handler as POST }

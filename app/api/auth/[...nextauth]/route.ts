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
      return session
    },
    async jwt({ token }) {
      return token
    },
  },
})

export { handler as GET, handler as POST }

import { getServerSession } from 'next-auth'
import { MarketingHeader } from './MarketingHeader'
import { Footer } from './Footer'

interface Props {
  title: string
  updatedAt: string
  children: React.ReactNode
}

export async function LegalLayout({ title, updatedAt, children }: Props) {
  const session = await getServerSession()
  const isAuthenticated = !!session?.user

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MarketingHeader isAuthenticated={isAuthenticated} />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-xs text-gray-500 mb-10">最終改定日：{updatedAt}</p>

          <div className="prose-reanker">{children}</div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

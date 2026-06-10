import { MarketingHeader } from './MarketingHeader'
import { Footer } from './Footer'

interface Props {
  title: string
  updatedAt: string
  children: React.ReactNode
}

/**
 * 料金・規約・問い合わせ等の共通レイアウト。
 * ログイン状態の出し分けは MarketingHeader（クライアント側）が行うため、
 * ここでは getServerSession を呼ばない（呼ぶとページが動的レンダリングになり静的配信が壊れる）。
 */
export function LegalLayout({ title, updatedAt, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MarketingHeader />

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

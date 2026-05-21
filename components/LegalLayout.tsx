import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Wordmark } from './brand/Wordmark'
import { Footer } from './Footer'

interface Props {
  title: string
  updatedAt: string
  children: React.ReactNode
}

export function LegalLayout({ title, updatedAt, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-900 hover:opacity-80 transition-opacity">
            <Wordmark height={18} />
          </Link>
          <Link href="/" className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
            <ChevronLeft size={14} />
            ホームへ戻る
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-xs text-gray-500 mb-10">最終改定日：{updatedAt}</p>

          <div className="prose-reanker">{children}</div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

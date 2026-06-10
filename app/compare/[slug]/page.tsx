import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, ArrowRight, Check, X, MinusSquare, Sparkles } from 'lucide-react'
import { MarketingHeader } from '@/components/MarketingHeader'
import { AuthCTA } from '@/components/AuthCTA'
import { Footer } from '@/components/Footer'
import {
  INDIVIDUAL_COMPARES, TOOLS, COMPARISON_ROWS, listCompareSlugs,
} from '@/lib/compare'
import { getBlogPost } from '@/lib/blog'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return listCompareSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = INDIVIDUAL_COMPARES[slug]
  if (!data) return { title: 'Not Found' }

  return {
    title: { absolute: `${data.pageTitle}｜ReAnker` },
    description: data.metaDescription,
    alternates: { canonical: `https://reanker.com/compare/${slug}` },
    openGraph: {
      title: data.pageTitle,
      description: data.metaDescription,
      url: `https://reanker.com/compare/${slug}`,
      siteName: 'ReAnker',
      locale: 'ja_JP',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.pageTitle,
      description: data.metaDescription,
    },
  }
}

function CellIcon({ v }: { v: string }) {
  if (v === '○') return <Check size={14} className="text-[#378ADD] inline" />
  if (v === '×') return <X size={14} className="text-gray-300 inline" />
  if (v === '△') return <MinusSquare size={12} className="text-amber-500 inline" />
  return <span className="text-xs text-gray-700">{v}</span>
}

export default async function CompareDetailPage({ params }: Props) {
  const { slug } = await params
  const data = INDIVIDUAL_COMPARES[slug]
  if (!data) notFound()

  const competitor = TOOLS.find((t) => t.id === data.competitorId)!
  const reanker = TOOLS.find((t) => t.id === 'reanker')!

  // 関連記事
  const related = (data.relatedBlogs ?? [])
    .map((s) => getBlogPost(s))
    .filter((p): p is NonNullable<typeof p> => !!p)

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <MarketingHeader />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 pt-8 sm:pt-10 pb-12">
          {/* 戻る */}
          <Link href="/compare" className="text-xs text-gray-500 hover:text-gray-700 inline-flex items-center gap-1 mb-5">
            <ChevronLeft size={13} />
            比較ページ一覧へ戻る
          </Link>

          {/* タイトル */}
          <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">
            VS {competitor.shortName ?? competitor.name}
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-4 leading-tight">
            {data.h1}
          </h1>
          <div
            className="text-sm text-gray-700 leading-relaxed mb-8 pb-8 border-b border-gray-200"
            dangerouslySetInnerHTML={{ __html: data.introHtml }}
          />

          {/* 主な違い */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">主な違い</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-xs text-gray-500">
                    <th className="text-left font-medium px-4 py-3 w-32">観点</th>
                    <th className="text-left font-medium px-4 py-3 bg-[#378ADD]/5 text-[#378ADD]">
                      {reanker.name}
                    </th>
                    <th className="text-left font-medium px-4 py-3">{competitor.shortName ?? competitor.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.keyDifferences.map((d, i) => (
                    <tr key={i} className={i % 2 ? 'bg-gray-50/30' : ''}>
                      <td className="px-4 py-3 text-xs font-medium text-gray-700">{d.axis}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 bg-[#378ADD]/5">{d.reanker}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{d.competitor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* どちらが向くか */}
          <section className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="border border-[#378ADD]/40 bg-[#378ADD]/5 rounded-lg p-5">
              <p className="text-sm font-semibold text-gray-900 mb-3">ReAnker が向いている人</p>
              <ul className="space-y-2">
                {data.reankerSuits.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
                    <Check size={14} className="text-[#378ADD] mt-0.5 shrink-0" strokeWidth={2.5} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                {competitor.shortName ?? competitor.name} が向いている人
              </p>
              <ul className="space-y-2">
                {data.competitorSuits.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
                    <Check size={14} className="text-gray-400 mt-0.5 shrink-0" strokeWidth={2.5} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 詳細スペック表（共通テーブルから ReAnker と当該競合だけ抜粋） */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">主要スペック比較</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-xs text-gray-500">
                    <th className="text-left font-medium px-4 py-3 w-44">項目</th>
                    <th className="text-left font-medium px-4 py-3 bg-[#378ADD]/5 text-[#378ADD]">ReAnker</th>
                    <th className="text-left font-medium px-4 py-3">{competitor.shortName ?? competitor.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={row.key} className={i % 2 ? 'bg-gray-50/30' : ''}>
                      <td className="px-4 py-3 text-xs text-gray-700">{row.label}</td>
                      <td className="px-4 py-3 bg-[#378ADD]/5"><CellIcon v={row.values['reanker']} /></td>
                      <td className="px-4 py-3"><CellIcon v={row.values[competitor.id]} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA */}
          <section className="border border-gray-200 rounded-xl p-6 sm:p-7 bg-gray-50 mb-10">
            <Sparkles size={20} className="text-[#378ADD] mb-2" />
            <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-1">ReAnker を試す</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              PR TIMES・Google News の競合チェックを自動化
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              監視したい競合を登録するだけ。毎朝9時に、前日の新規リリースだけが Slack・メールに届きます。
              月額300円（税抜）から、無料プランも用意しています。
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <AuthCTA
                className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
              >
                <ArrowRight size={14} />
              </AuthCTA>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-white text-gray-700 text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
              >
                料金プランを見る
              </Link>
            </div>
          </section>

          {/* 関連記事 */}
          {related.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">関連記事</h2>
              <ul className="space-y-2">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-xs text-[#378ADD] uppercase tracking-wide font-medium mb-1">{p.category}</p>
                      <p className="text-sm font-semibold text-gray-900 leading-snug mb-1">{p.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-1">{p.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 他の比較ページへ */}
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">他のツールとの比較</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.values(INDIVIDUAL_COMPARES)
                .filter((c) => c.slug !== slug)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/compare/${c.slug}`}
                    className="text-sm text-gray-700 hover:text-[#378ADD] border border-gray-200 rounded-md px-4 py-3 hover:bg-gray-50"
                  >
                    VS {TOOLS.find((t) => t.id === c.competitorId)?.shortName ?? TOOLS.find((t) => t.id === c.competitorId)?.name}
                    <span className="text-xs text-gray-400 ml-2">→</span>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

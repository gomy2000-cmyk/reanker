import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { Check, X, MinusSquare, ArrowRight, Sparkles } from 'lucide-react'
import { MarketingHeader } from '@/components/MarketingHeader'
import { Footer } from '@/components/Footer'
import {
  TOOLS, COMPARISON_ROWS, REANKER_ADVANTAGES, INDIVIDUAL_COMPARES, FAQS_FOR_COMPARE,
} from '@/lib/compare'

export const metadata: Metadata = {
  title: '競合リリース監視ツール比較',
  description:
    'PR TIMES・Google News・Googleアラート・クリッピングサービスを比較。競合のプレスリリースを毎日自動でチェックし、Slack・メールに通知できる競合リリース監視ツール ReAnker の特徴を解説します。',
  alternates: { canonical: 'https://reanker.com/compare' },
  openGraph: {
    title: '競合リリース監視ツール比較｜ReAnker',
    description:
      'Googleアラート・PR TIMES Webクリッピング・Feedly・クリッピング代行など主要ツール8種を、用途別に比較しました。',
    url: 'https://reanker.com/compare',
    siteName: 'ReAnker',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '競合リリース監視ツール比較｜ReAnker',
    description: '主要8ツールの機能・料金を一覧化。個人・小規模チーム向けの選び方も解説。',
  },
}

function CellIcon({ v }: { v: string }) {
  if (v === '○') return <Check size={14} className="text-[#378ADD] inline" />
  if (v === '×') return <X size={14} className="text-gray-300 inline" />
  if (v === '△') return <MinusSquare size={12} className="text-amber-500 inline" />
  return <span className="text-xs text-gray-700">{v}</span>
}

export default async function ComparePage() {
  const session = await getServerSession()
  const isAuthenticated = !!session?.user
  const ctaHref = isAuthenticated ? '/dashboard' : '/login'

  // FAQ 構造化データ
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS_FOR_COMPARE.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <MarketingHeader isAuthenticated={isAuthenticated} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main className="flex-1">
        {/* === Hero === */}
        <section className="border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 pt-8 sm:pt-12 pb-8">
            <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">COMPARISON</p>
            <h1 className="text-2xl sm:text-4xl font-semibold text-gray-900 tracking-tight leading-tight mb-3">
              競合プレスリリース・ニュース<br className="sm:hidden" />監視ツール比較
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
              Googleアラート、PR TIMES Webクリッピング、Feedly、クリッピング代行サービスなど主要8ツールを、
              用途・料金・通知方法・対象メディアで比較しました。
              個人・小規模チームに向く ReAnker の位置づけも整理しています。
            </p>
          </div>
        </section>

        {/* === 比較テーブル === */}
        <section className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">主要ツールの機能・料金比較</h2>
            <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-xs text-gray-500">
                    <th className="text-left font-medium px-4 py-3 min-w-[180px] sticky left-0 bg-gray-50 z-10">項目</th>
                    {TOOLS.map((t) => (
                      <th key={t.id} className={`text-left font-medium px-3 py-3 min-w-[120px] ${t.id === 'reanker' ? 'bg-[#378ADD]/5 text-[#378ADD]' : ''}`}>
                        <span className="font-semibold">{t.shortName ?? t.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={row.key} className={i % 2 ? 'bg-gray-50/30' : ''}>
                      <td className="px-4 py-3 text-xs text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-100">
                        {row.label}
                      </td>
                      {TOOLS.map((t) => (
                        <td key={t.id} className={`px-3 py-3 text-xs ${t.id === 'reanker' ? 'bg-[#378ADD]/5 font-medium' : ''}`}>
                          <CellIcon v={row.values[t.id] ?? '—'} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-400 mt-3">
              ※ 各サービスの仕様・料金は公開情報を基にしており、2026年5月時点。最新情報は各社公式をご確認ください。
            </p>
          </div>
        </section>

        {/* === ReAnker の優位ポイント === */}
        <section className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
            <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">WHY REANKER</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
              ReAnker が向いているケース
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-2xl">
              「PR TIMES と Google News を1ツールで、安く、整然と」という用途に絞っているのが ReAnker の特徴です。
              法人クリッピングほどの網羅性は不要、でも Googleアラートだけでは物足りない層に向きます。
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {REANKER_ADVANTAGES.map((adv, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#378ADD]/10 text-[#378ADD] rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-800 leading-snug">{adv}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === 個別比較ページへの導線 === */}
        <section className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">ツール別の詳細比較</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.values(INDIVIDUAL_COMPARES).map((c) => (
                <Link
                  key={c.slug}
                  href={`/compare/${c.slug}`}
                  className="block border border-gray-200 rounded-lg p-5 hover:border-[#378ADD] hover:bg-gray-50/50 transition-colors group"
                >
                  <p className="text-xs text-[#378ADD] font-medium mb-1">VS {TOOLS.find((t) => t.id === c.competitorId)?.shortName ?? TOOLS.find((t) => t.id === c.competitorId)?.name}</p>
                  <p className="text-sm font-semibold text-gray-900 mb-2 leading-snug">
                    {c.h1}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">{c.metaDescription}</p>
                  <span className="text-xs text-[#378ADD] inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    詳細を見る <ArrowRight size={11} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* === FAQ === */}
        <section className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
            <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-4">
              よくあるご質問
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
              {FAQS_FOR_COMPARE.map((f) => (
                <details key={f.q} className="group">
                  <summary className="cursor-pointer px-5 py-4 flex items-start justify-between gap-4 list-none hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900 leading-snug">{f.q}</p>
                    <span className="text-gray-400 group-open:rotate-45 transition-transform shrink-0 mt-0.5 text-lg leading-none">＋</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-700 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* === Final CTA === */}
        <section className="border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 text-center">
            <Sparkles size={24} className="text-[#378ADD] mx-auto mb-3" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
              PR TIMES・Google News の競合チェックを自動化
            </h2>
            <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto leading-relaxed">
              Googleログインで30秒、クレジットカード登録不要。<br />
              無料プランから始められます。
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-6 py-3 rounded-md transition-colors"
              >
                {isAuthenticated ? 'ダッシュボードへ' : '無料ではじめる'}
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-6 py-3 rounded-md transition-colors"
              >
                料金プランを見る
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

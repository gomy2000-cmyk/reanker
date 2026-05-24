import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Mail } from 'lucide-react'
import { LegalLayout } from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: '運営者情報',
  description: 'ReAnker は、商陣 / SYOJIN（代表：小林 豪）が企画・開発・運営する競合リリース監視サービスです。運営者情報・事業内容・お問い合わせ先を掲載しています。',
  alternates: { canonical: 'https://reanker.com/operator' },
  openGraph: {
    title: '運営者情報｜ReAnker',
    description: 'ReAnker の運営元（商陣 / SYOJIN）の情報。',
    url: 'https://reanker.com/operator',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: '運営者情報｜ReAnker' },
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <tr className="border-b border-gray-100 last:border-0">
    <th className="text-left text-xs font-medium text-gray-500 py-4 pr-4 align-top w-40 sm:w-48">{label}</th>
    <td className="text-sm text-gray-800 py-4 leading-relaxed">{children}</td>
  </tr>
)

export default function OperatorPage() {
  return (
    <LegalLayout title="運営者情報" updatedAt="2026年5月24日">
      <p className="text-sm text-gray-700 leading-relaxed mb-10">
        ReAnker は、<strong>商陣 / SYOJIN</strong> が企画・開発・運営する競合リリース監視サービスです。
        企業の広報・マーケティング担当者が、競合企業や関連業界の動きを継続的に把握しやすくすることを目的に提供しています。
      </p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <table className="w-full">
          <tbody>
            <Row label="運営者名">
              <span className="font-medium">商陣</span>
              <span className="text-gray-500 ml-2">／ SYOJIN</span>
            </Row>
            <Row label="代表者">
              小林 豪
            </Row>
            <Row label="所在地">
              神奈川県横浜市
            </Row>
            <Row label="公式サイト">
              <a
                href="https://syojin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#378ADD] hover:underline inline-flex items-center gap-1"
              >
                https://syojin.com/
                <ExternalLink size={12} />
              </a>
            </Row>
            <Row label="事業内容">
              <ul className="space-y-1 list-disc list-inside marker:text-gray-300">
                <li>Webプロダクトの企画・開発・運営</li>
                <li>マーケティング支援</li>
                <li>業務効率化・情報収集支援ツールの提供</li>
              </ul>
            </Row>
            <Row label="運営サービス">
              <Link href="/" className="text-[#378ADD] hover:underline">ReAnker</Link>
              <span className="text-gray-500 ml-2 text-xs">（競合リリース監視ツール）</span>
            </Row>
            <Row label="お問い合わせ">
              <Link
                href="/contact"
                className="text-[#378ADD] hover:underline inline-flex items-center gap-1"
              >
                <Mail size={13} />
                お問い合わせページ
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                ReAnker に関するお問い合わせは、上記の専用ページからお願いいたします。
              </p>
            </Row>
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-2">関連リンク</h2>
        <ul className="text-sm text-gray-700 space-y-1.5">
          <li>
            <Link href="/legal" className="text-[#378ADD] hover:underline">
              特定商取引法に基づく表記
            </Link>
          </li>
          <li>
            <Link href="/terms" className="text-[#378ADD] hover:underline">
              利用規約
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="text-[#378ADD] hover:underline">
              プライバシーポリシー
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-[#378ADD] hover:underline">
              お問い合わせ
            </Link>
          </li>
        </ul>
      </div>
    </LegalLayout>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalLayout } from '@/components/LegalLayout'
import { Check, X } from 'lucide-react'

export const metadata: Metadata = {
  title: '料金プラン',
  description: 'ReAnker の料金プラン。フリープラン（無料）とスタンダードプラン（月額300円・税抜）の機能比較とよくあるご質問。',
  alternates: { canonical: 'https://reanker.com/pricing' },
  openGraph: {
    title: '料金プラン｜ReAnker',
    description: 'フリープラン（無料）とスタンダードプラン（月額300円）の機能比較。',
    url: 'https://reanker.com/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '料金プラン｜ReAnker',
    description: 'フリープラン（無料）とスタンダードプラン（月額300円）。',
  },
}

const features = [
  { label: 'アンカー（監視対象）の登録', free: '3件まで', standard: '無制限' },
  { label: '記事の自動取得頻度', free: '隔日', standard: '毎日' },
  { label: 'メール通知', free: '○', standard: '○' },
  { label: 'Slack通知', free: '×', standard: '○' },
  { label: 'ダッシュボード閲覧', free: '○', standard: '○' },
  { label: 'CSV / PDFエクスポート', free: '×', standard: '○' },
  { label: 'お問い合わせサポート', free: '○', standard: '○（優先対応）' },
]

export default function PricingPage() {
  return (
    <LegalLayout title="料金プラン" updatedAt="2026年5月22日">
      <p className="text-sm text-gray-700 leading-relaxed mb-10">
        ReAnker（リアンカー）はフリープランから無料でご利用いただけます。本格的に競合監視を行いたい方は、月額300円のスタンダードプランをお選びください。プランはいつでも変更・解約できます。
      </p>

      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        {/* フリー */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
          <h2 className="text-base font-bold text-gray-900 mb-1">フリープラン</h2>
          <p className="text-xs text-gray-500 mb-4">まずは試してみたい方に</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">¥0<span className="text-sm font-normal text-gray-500"> / 月</span></p>
          <p className="text-xs text-gray-400 mb-6">クレジットカード登録不要</p>
          <Link
            href="/login"
            className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-lg mt-auto"
          >
            無料ではじめる
          </Link>
        </div>

        {/* スタンダード */}
        <div className="bg-white border-2 border-[#378ADD] rounded-xl p-6 flex flex-col relative">
          <span className="absolute -top-2.5 right-4 bg-[#378ADD] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            おすすめ
          </span>
          <h2 className="text-base font-bold text-gray-900 mb-1">スタンダードプラン</h2>
          <p className="text-xs text-gray-500 mb-4">本格的に競合監視を運用したい方に</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">¥300<span className="text-sm font-normal text-gray-500"> / 月（税抜）</span></p>
          <p className="text-xs text-gray-400 mb-6">クレジットカード決済</p>
          <Link
            href="/login"
            className="block text-center bg-[#378ADD] hover:bg-[#2d6db5] text-white text-sm font-medium py-2.5 rounded-lg mt-auto"
          >
            スタンダードを申し込む
          </Link>
        </div>
      </div>

      <h2 className="text-base font-bold text-gray-900 mb-3">機能比較</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-10">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-xs text-gray-500">
              <th className="text-left py-3 px-4 font-medium">機能</th>
              <th className="text-center py-3 px-4 font-medium w-28">フリー</th>
              <th className="text-center py-3 px-4 font-medium w-32">スタンダード</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.label} className="border-b border-gray-50 last:border-0">
                <td className="py-3 px-4 text-gray-800">{f.label}</td>
                <td className="py-3 px-4 text-center text-gray-600">
                  {f.free === '○' ? <Check size={16} className="inline text-[#378ADD]" /> :
                   f.free === '×' ? <X size={16} className="inline text-gray-300" /> :
                   <span className="text-xs">{f.free}</span>}
                </td>
                <td className="py-3 px-4 text-center text-gray-600">
                  {f.standard === '○' ? <Check size={16} className="inline text-[#378ADD]" /> :
                   <span className="text-xs">{f.standard}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-base font-bold text-gray-900 mb-3">よくあるご質問</h2>
      <div className="space-y-4 mb-10">
        {[
          { q: '途中で解約はできますか？', a: 'はい、設定画面または決済代行事業者のポータルからいつでも解約できます。解約後は当該課金期間の末日までスタンダードの機能を引き続きご利用いただけます。' },
          { q: '支払方法は何が使えますか？', a: 'Stripeを通じたクレジットカード決済（Visa、Mastercard、American Express、JCB、Diners Club、Discover）に対応しています。' },
          { q: '返金は可能ですか？', a: 'デジタルサービスとしての性質上、決済完了後の返金には応じかねます。次回更新を停止することで以降の課金は発生しません。' },
          { q: '請求書は発行できますか？', a: 'はい、設定画面の「請求履歴を見る」からStripeのカスタマーポータルにアクセスし、過去の請求書をPDFでダウンロードいただけます。' },
          { q: 'フリープランからスタンダードへの変更で、登録済のアンカーはどうなりますか？', a: '登録済のアンカー（最大3件）はそのまま引き継がれ、4件目以降を制限なく追加できるようになります。' },
        ].map((item) => (
          <div key={item.q} className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm font-semibold text-gray-900 mb-1.5">Q. {item.q}</p>
            <p className="text-sm text-gray-700 leading-relaxed">A. {item.a}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        料金は予告なく変更される場合があります。詳細は<Link href="/legal" className="text-[#378ADD] hover:underline">特定商取引法に基づく表記</Link>および<Link href="/terms" className="text-[#378ADD] hover:underline">利用規約</Link>をご確認ください。
      </p>
    </LegalLayout>
  )
}

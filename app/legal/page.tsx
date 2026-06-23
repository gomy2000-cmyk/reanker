import type { Metadata } from 'next'
import { LegalLayout } from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記',
  description: 'ReAnker の特定商取引法に基づく表記。事業者情報・販売価格・支払方法・解約・返金ポリシー等を掲載しています。',
  alternates: { canonical: 'https://reanker.com/legal' },
  openGraph: {
    title: '特定商取引法に基づく表記｜ReAnker',
    description: 'ReAnker の特定商取引法に基づく表記。',
    url: 'https://reanker.com/legal',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: '特定商取引法に基づく表記｜ReAnker' },
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <tr className="border-b border-gray-100 last:border-0">
    <th className="text-left text-xs font-medium text-gray-500 py-4 pr-4 align-top w-48 sm:w-56">{label}</th>
    <td className="text-sm text-gray-800 py-4 leading-relaxed">{children}</td>
  </tr>
)

export default function LegalPage() {
  return (
    <LegalLayout title="特定商取引法に基づく表記" updatedAt="2026年5月22日">
      <p className="text-sm text-gray-700 leading-relaxed mb-8">
        「特定商取引に関する法律」第11条（通信販売についての広告）に基づき、本サービスに関する以下の事項を表示します。
      </p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <tbody>
            <Row label="販売事業者名">
              商陣 / SYOJIN（運営サービス：ReAnker）
            </Row>
            <Row label="運営責任者">
              G. Kobayashi
            </Row>
            <Row label="所在地">
              横浜市
              <p className="text-xs text-gray-500 mt-1">詳細な所在地は、請求があり次第、遅滞なく開示いたします。下記お問い合わせ先までご連絡ください。</p>
            </Row>
            <Row label="電話番号">
              請求があり次第、遅滞なく開示いたします。ご希望の方は下記お問い合わせ先までご連絡ください。
            </Row>
            <Row label="お問い合わせ先">
              <a href="mailto:info@syojin.com?subject=%5BReAnker%5D%20%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B&body=%E9%80%81%E4%BF%A1%E5%85%83%3A%20ReAnker%20%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%20(https%3A%2F%2Freanker.com%2Fcontact)%0A%0A" className="text-[#378ADD] hover:underline">info@syojin.com</a>
              <p className="text-xs text-gray-500 mt-1">受付時間：平日 10:00 - 18:00（土日祝・年末年始を除く）</p>
            </Row>
            <Row label="販売価格">
              <ul className="space-y-1">
                <li>フリープラン：無料</li>
                <li>スタンダードプラン：月額 300円（税抜）</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">各プランの機能差異は、料金プラン案内ページに表示するとおりとします。</p>
            </Row>
            <Row label="商品代金以外に発生する料金">
              本サービスのご利用にあたって発生するインターネット接続料金、通信料金等は、ユーザーのご負担となります。
            </Row>
            <Row label="お支払方法">
              クレジットカード決済（Visa / Mastercard / American Express / JCB / Diners Club / Discover）
              <p className="text-xs text-gray-500 mt-1">決済処理はStripe, Inc. が提供する決済システムを通じて行われます。当方は、ユーザーのクレジットカード番号その他の決済情報を保有しません。</p>
            </Row>
            <Row label="お支払時期">
              スタンダードプラン申込日に初回課金を行い、以降は前回課金日から1か月ごとに自動課金されます。
            </Row>
            <Row label="役務の提供時期">
              決済完了後、ただちにスタンダードプランの機能をご利用いただけます。
            </Row>
            <Row label="返品・キャンセル">
              本サービスはデジタルコンテンツとしての性質上、決済完了後の返金には応じかねます。
              <p className="mt-2">解約をご希望の場合は、本サービスの設定画面または決済代行事業者のポータルからいつでもお手続きいただけます。解約手続を行った場合、当月分の役務提供は当該課金期間の末日まで継続し、その後フリープランへ自動的に移行します。日割り精算による返金は行いません。</p>
              <p className="mt-2 text-xs text-gray-500">なお、当方の責めに帰すべき事由により本サービスを提供できない場合は、個別にご相談のうえ対応いたします。</p>
            </Row>
            <Row label="動作環境">
              <ul className="space-y-1">
                <li>Google Chrome（最新版）</li>
                <li>Mozilla Firefox（最新版）</li>
                <li>Apple Safari（最新版）</li>
                <li>Microsoft Edge（最新版）</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">上記以外のブラウザでも基本機能はご利用いただけますが、表示や挙動について保証いたしかねます。</p>
            </Row>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-8">本表記は予告なく変更することがあります。最新の内容は本ページにてご確認ください。</p>
    </LegalLayout>
  )
}

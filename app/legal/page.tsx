import type { Metadata } from 'next'
import { LegalLayout } from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 — リアンカー',
  description: '特定商取引法に基づく表記を掲載しています。',
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
              {/* TODO: 個人事業主の場合は屋号ではなく本名を記載するのが原則。法人化後は法人名 */}
              Reanker（運営者：[氏名を入力してください]）
            </Row>
            <Row label="運営責任者">
              [氏名を入力してください]
            </Row>
            <Row label="所在地">
              請求があり次第、遅滞なく開示いたします。ご希望の方は下記お問い合わせ先までご連絡ください。
            </Row>
            <Row label="電話番号">
              請求があり次第、遅滞なく開示いたします。ご希望の方は下記お問い合わせ先までご連絡ください。
            </Row>
            <Row label="お問い合わせ先">
              <a href="mailto:support@reanker.com" className="text-[#378ADD] hover:underline">support@reanker.com</a>
              <p className="text-xs text-gray-500 mt-1">受付時間：平日 10:00 - 18:00（土日祝・年末年始を除く）</p>
            </Row>
            <Row label="販売価格">
              <ul className="space-y-1">
                <li>フリープラン：無料</li>
                <li>スタンダードプラン：月額 300円（消費税込）</li>
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

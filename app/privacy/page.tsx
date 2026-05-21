import type { Metadata } from 'next'
import { LegalLayout } from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: 'プライバシーポリシー — リアンカー',
  description: 'リアンカー（reanker.com）における個人情報の取扱いについてご説明します。',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-base font-bold text-gray-900 mb-3">{title}</h2>
    <div className="text-sm text-gray-700 leading-relaxed space-y-3">{children}</div>
  </section>
)

export default function PrivacyPage() {
  return (
    <LegalLayout title="プライバシーポリシー" updatedAt="2026年5月22日">
      <p className="text-sm text-gray-700 leading-relaxed mb-8">
        Reanker（以下「当方」といいます）は、競合監視SaaS「リアンカー」（以下「本サービス」といいます）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
      </p>

      <Section title="1. 取得する情報">
        <p>当方は、本サービスの提供にあたり以下の情報を取得します。</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>アカウント情報</strong>：Googleアカウントによる認証時に提供される、メールアドレス、表示名、プロフィール画像のURL、Google上のユーザーID</li>
          <li><strong>利用設定情報</strong>：監視対象として登録したキーワード、サービス名、ドメイン、通知先（Slack Webhook URL、通知メールアドレス）、通知設定</li>
          <li><strong>利用ログ</strong>：本サービスにおける操作履歴、既読/未読の状態、最終ログイン日時、利用しているブラウザ・OS情報</li>
          <li><strong>決済関連情報</strong>：有料プラン申込時のStripe顧客ID、サブスクリプションID、決済ステータス（クレジットカード番号等の決済情報は当方では保有せず、決済代行事業者であるStripe社が保有します）</li>
        </ul>
      </Section>

      <Section title="2. 利用目的">
        <p>取得した情報は、以下の目的で利用します。</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>本サービスの提供および機能改善のため</li>
          <li>ユーザーの認証、本人確認、アカウント管理のため</li>
          <li>登録されたキーワード等に基づく記事の取得・配信、通知の送信のため</li>
          <li>料金請求、決済処理、課金状況の管理のため</li>
          <li>本サービスに関するお知らせ、重要な変更の通知のため</li>
          <li>不正利用の防止、本サービスの安全な運営のため</li>
          <li>お問い合わせ対応のため</li>
          <li>利用状況の分析、サービス改善・新機能開発のための統計データの作成（個人を識別できない形に加工したうえで利用します）</li>
        </ul>
      </Section>

      <Section title="3. 第三者提供">
        <p>当方は、以下の場合を除き、取得した個人情報を第三者に提供しません。</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>ユーザーの同意がある場合</li>
          <li>法令に基づく場合</li>
          <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
          <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
          <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
        </ul>
      </Section>

      <Section title="4. 業務委託先（サブプロセッサー）">
        <p>当方は、本サービスを提供するために、以下の事業者へ個人情報の取扱いを委託しています。各事業者は、それぞれが定めるプライバシーポリシーに基づき情報を取り扱います。</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Google LLC</strong>（米国）— OAuth認証（Googleログイン）に利用しています。</li>
          <li><strong>Supabase Inc.</strong>（米国／データはアジア太平洋（東京）リージョン）— アカウント情報、利用設定情報、取得記事メタデータのデータベースとして利用しています。</li>
          <li><strong>Vercel Inc.</strong>（米国）— 本サービスのホスティングおよびサーバー実行環境として利用しています。</li>
          <li><strong>Stripe, Inc.</strong>（米国／日本拠点：Stripe Japan株式会社）— 決済処理および決済情報の管理に利用しています。</li>
          <li><strong>Resend, Inc.</strong>（米国）— メール通知の送信に利用する場合があります。</li>
          <li><strong>SerpApi, LLC</strong>（米国）— Google News情報の取得に利用しています（個人情報は送信しません）。</li>
        </ul>
        <p>これらの委託先のうち海外に所在するものについては、ユーザーの個人情報が国外に移転されることをご了承いただきます。各国の個人情報保護制度については各社のプライバシーポリシーまたは個人情報保護委員会の公表情報をご参照ください。</p>
      </Section>

      <Section title="5. 個人情報の保存期間">
        <p>取得した個人情報は、利用目的の達成に必要な期間に限り保存します。アカウント削除をご希望の場合は、お問い合わせ窓口までご連絡いただくか、本サービスの設定画面から削除を行ってください。アカウント削除後、関連する個人情報は速やかに削除します。ただし、法令により保存が義務付けられている情報（取引記録等）については、当該期間中保存します。</p>
      </Section>

      <Section title="6. ユーザーの権利">
        <p>ユーザーは、個人情報の保護に関する法律に基づき、ご自身の個人情報について、開示、訂正、追加、削除、利用停止、消去、第三者提供の停止を請求することができます。請求はお問い合わせ窓口までご連絡ください。本人確認のうえ、合理的な期間内に対応します。</p>
      </Section>

      <Section title="7. Cookie等の利用">
        <p>本サービスでは、ユーザーの認証状態の維持および利用状況の分析のためにCookieおよび類似技術を利用します。Cookieはブラウザの設定により無効化することが可能ですが、その場合、本サービスの一部機能がご利用いただけなくなる場合があります。</p>
      </Section>

      <Section title="8. セキュリティ">
        <p>当方は、個人情報の漏えい、滅失または毀損を防止するため、業界標準に準拠した安全管理措置を講じます。具体的には、通信のSSL/TLS暗号化、データベースアクセスの最小権限管理、決済情報の非保有等を実施しています。ただし、技術的・運営的に完全なセキュリティを保証するものではありません。</p>
      </Section>

      <Section title="9. 本ポリシーの変更">
        <p>当方は、必要に応じて本ポリシーを変更することがあります。重要な変更を行う場合は、本サービス内または登録メールアドレスへの通知により事前にお知らせします。</p>
      </Section>

      <Section title="10. お問い合わせ窓口">
        <p>個人情報の取扱いに関するお問い合わせは、以下までご連絡ください。</p>
        <p className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
          メールアドレス：<a href="mailto:support@reanker.com" className="text-[#378ADD] hover:underline">support@reanker.com</a>
        </p>
      </Section>

      <p className="text-xs text-gray-500 mt-12">以上</p>
    </LegalLayout>
  )
}

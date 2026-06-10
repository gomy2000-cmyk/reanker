import type { Metadata } from 'next'
import { LegalLayout } from '@/components/LegalLayout'
import { Mail, Clock, HelpCircle } from 'lucide-react'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'ReAnker へのお問い合わせはこちらから。サポート対応・解約手続き・個人情報開示請求・その他ご質問にご返信します。',
  alternates: { canonical: 'https://reanker.com/contact' },
  openGraph: {
    title: 'お問い合わせ｜ReAnker',
    description: 'ReAnker へのお問い合わせ窓口です。',
    url: 'https://reanker.com/contact',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'お問い合わせ｜ReAnker' },
}

export default function ContactPage() {
  return (
    <LegalLayout title="お問い合わせ" updatedAt="2026年5月22日">
      <p className="text-sm text-gray-700 leading-relaxed mb-8">
        ReAnker（リアンカー）をご利用いただきありがとうございます。本サービスに関するお問い合わせは、以下のフォームまたはメールでお寄せください。返信までに通常2〜3営業日いただいております。
      </p>

      <ContactForm />

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Mail className="text-[#378ADD] shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs text-gray-500 mb-1">メールアドレス</p>
            <a href="mailto:support@reanker.com" className="text-base text-gray-900 font-medium hover:text-[#378ADD]">
              support@reanker.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="text-[#378ADD] shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs text-gray-500 mb-1">受付時間</p>
            <p className="text-sm text-gray-800">平日 10:00 - 18:00（土日祝・年末年始を除く）</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle size={16} className="text-gray-500" />
          <h2 className="text-sm font-bold text-gray-900">お問い合わせ前にご確認ください</h2>
        </div>
        <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
          <li>
            <strong>サービスの不具合・記事が取得されない</strong>
            <p className="text-xs text-gray-500 mt-0.5">PR TIMESおよびGoogle News側の仕様変更や一時的な障害が原因の可能性があります。ご連絡の際は、対象のアンカー名・想定する記事のURL等を添えていただくとスムーズです。</p>
          </li>
          <li className="pt-2 border-t border-gray-200">
            <strong>解約・プラン変更</strong>
            <p className="text-xs text-gray-500 mt-0.5">設定画面の「決済情報」セクションから、いつでもご自身でお手続きいただけます。</p>
          </li>
          <li className="pt-2 border-t border-gray-200">
            <strong>請求書の発行・経理関連</strong>
            <p className="text-xs text-gray-500 mt-0.5">設定画面の「請求履歴を見る」からStripeのカスタマーポータルにアクセスし、過去の請求書をダウンロードいただけます。</p>
          </li>
          <li className="pt-2 border-t border-gray-200">
            <strong>個人情報の開示・削除請求</strong>
            <p className="text-xs text-gray-500 mt-0.5">プライバシーポリシーに基づき、お問い合わせ窓口までご連絡ください。本人確認のうえ対応いたします。</p>
          </li>
        </ul>
      </div>
    </LegalLayout>
  )
}

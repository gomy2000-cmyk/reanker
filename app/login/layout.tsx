import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ログイン',
  description: 'Googleアカウントで ReAnker にログイン。30秒で競合監視を開始できます。',
  alternates: { canonical: 'https://reanker.com/login' },
  robots: { index: false, follow: true }, // ログインページは検索結果に出さない
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}

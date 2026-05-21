'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Bell, BarChart2, FileDown } from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Wordmark } from '@/components/brand/Wordmark'
import { AnchorMark } from '@/components/brand/AnchorMark'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push('/dashboard')
  }, [session, router])

  if (status === 'loading') return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md p-8">
        {/* ロゴ */}
        <Link href="/" className="text-gray-900 mb-3 inline-block hover:opacity-80 transition-opacity">
          <Wordmark height={28} />
        </Link>
        <p className="text-gray-500 text-sm mb-1">
          競合のプレスリリース・ニュースを自動監視。
        </p>
        <p className="text-gray-500 text-xs mb-6">
          PR TIMES・Google Newsから競合の動きを自動取得・通知するBtoB向けSaaS。
        </p>

        {/* 機能リスト */}
        <ul className="space-y-3 mb-8">
          {[
            { icon: Bell, text: 'PR TIMES・Google Newsの記事を自動取得' },
            { icon: AnchorMark, text: 'アンカー登録で複数競合を同時監視' },
            { icon: Bell, text: '毎朝9時にSlack・メールで通知' },
            { icon: BarChart2, text: 'ダッシュボードで発信トレンドを可視化' },
            { icon: FileDown, text: 'CSV・PDFエクスポート（スタンダード）' },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-gray-600">
              <Icon size={16} className="text-[#378ADD] shrink-0" />
              {text}
            </li>
          ))}
        </ul>

        {/* Googleログイン */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full flex items-center justify-center gap-3 bg-[#378ADD] hover:bg-[#2d6db5] text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#fff" fillOpacity=".9"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#fff" fillOpacity=".7"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#fff" fillOpacity=".5"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#fff" fillOpacity=".3"/>
          </svg>
          Googleでログイン
        </button>

        {/* プラン比較 */}
        <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <p className="font-semibold text-gray-700 mb-1">フリー（無料）</p>
            <p>アンカー3件まで</p>
            <p>隔日更新・メール通知</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">スタンダード（¥300/月）</p>
            <p>アンカー無制限</p>
            <p>毎日更新・Slack対応</p>
            <p>CSV・PDFエクスポート</p>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-6">
          ログインすることで、<Link href="/terms" className="underline hover:text-gray-600">利用規約</Link>と<Link href="/privacy" className="underline hover:text-gray-600">プライバシーポリシー</Link>に同意したものとみなされます。
          <br />
          <Link href="/pricing" className="underline hover:text-gray-600">料金プラン詳細</Link>
        </p>
      </div>
    </div>
    <Footer />
  </div>
  )
}

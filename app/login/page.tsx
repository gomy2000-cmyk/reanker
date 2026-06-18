'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { Newspaper, Radar, Bell, FileDown, AlertCircle, Globe } from 'lucide-react'
import { Wordmark } from '@/components/brand/Wordmark'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('error')) {
      setError('ログインに失敗しました。時間をおいて再度お試しください。')
    }
  }, [searchParams])

  useEffect(() => {
    if (session) router.push('/dashboard')
  }, [session, router])

  if (status === 'loading') return null

  const handleLogin = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (e) {
      setError('ログインに失敗しました。時間をおいて再度お試しください。')
      setSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg, #F8FBFF 0%, #EEF5FF 100%)' }}
    >
      {/* === ヘッダー === */}
      <header
        className="h-[72px] flex items-center justify-between px-6 sm:px-10 border-b border-gray-200/80"
        style={{ background: 'rgba(255, 255, 255, 0.72)', backdropFilter: 'blur(12px)' }}
      >
        <Link href="/" className="flex items-center text-gray-900 hover:opacity-80 transition-opacity">
          <Wordmark height={40} />
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-[14px] text-gray-600">
          <Link href="/pricing" className="hover:text-[#378ADD] transition-colors">料金プラン</Link>
          <Link href="/blog" className="hover:text-[#378ADD] transition-colors">使い方</Link>
          <Link href="/contact" className="hover:text-[#378ADD] transition-colors">お問い合わせ</Link>
        </nav>
      </header>

      {/* === メイン === */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-14">
        <div className="w-full max-w-6xl grid lg:grid-cols-[42%_1fr] gap-8 lg:gap-14 items-center">

          {/* === 左：ログインカード === */}
          <section className="order-1 w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_8px_24px_-12px_rgba(31,75,140,0.12)] p-7 sm:p-9">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight mb-2">
                ReAnkerにログイン
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Googleアカウントでログインして、競合監視を開始します。
              </p>

              <button
                onClick={handleLogin}
                disabled={submitting}
                className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100 text-gray-800 text-[15px] font-medium rounded-lg transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[#378ADD]/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <GoogleIcon />
                {submitting ? 'ログイン中...' : 'Googleでログイン'}
              </button>

              {error && (
                <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-[11px] text-gray-500 leading-relaxed mt-5">
                ログインすることで、
                <Link href="/terms" className="text-[#378ADD] hover:underline">利用規約</Link>
                と
                <Link href="/privacy" className="text-[#378ADD] hover:underline">プライバシーポリシー</Link>
                に同意したものとみなします。
              </p>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <Link
                  href="/pricing"
                  className="text-xs text-gray-600 hover:text-[#378ADD] transition-colors"
                >
                  料金プランを見る →
                </Link>
              </div>
            </div>
          </section>

          {/* === 右：サービス訴求エリア === */}
          <section className="order-2 lg:px-2">
            <span className="inline-block text-[12px] font-medium text-[#378ADD] bg-[#378ADD]/10 px-2.5 py-1 rounded-full mb-5">
              競合リリース監視ツール
            </span>

            <h2 className="text-[28px] sm:text-[36px] lg:text-[40px] font-bold text-gray-900 leading-[1.25] tracking-tight mb-5">
              競合のリリースに、<br />
              アンカーを。
            </h2>

            <p className="text-[15px] sm:text-[16px] text-gray-700 leading-[1.85] mb-8 max-w-lg">
              PR TIMES・Google Newsから競合情報を自動取得。
              重要な動きをSlack・メールで通知し、競合の発信トレンドを見逃さないBtoB向け競合監視ツールです。
            </p>

            {/* 機能リスト */}
            <ul className="space-y-3 mb-9 max-w-lg">
              {[
                { icon: Newspaper, text: 'PR TIMES・Google Newsの記事を自動取得', mobile: true },
                { icon: Globe, text: '@Press・ValuePress・共同通信PRワイヤーにも対応（Standard）', mobile: false },
                { icon: Radar, text: '登録した企業・キーワードを毎日監視', mobile: true },
                { icon: Bell, text: '新着情報をSlack・メールで通知', mobile: true },
                { icon: FileDown, text: 'CSV・PDFエクスポートに対応', mobile: false },
              ].map(({ icon: Icon, text, mobile }) => (
                <li
                  key={text}
                  className={`flex items-start gap-3 text-[14px] sm:text-[15px] text-gray-800 ${
                    !mobile ? 'hidden sm:flex' : ''
                  }`}
                >
                  <span className="w-7 h-7 rounded-md bg-[#378ADD]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} className="text-[#378ADD]" />
                  </span>
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>

            {/* プラン概要 */}
            <div className="max-w-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">料金プラン</h3>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                まずは無料で利用開始できます。必要に応じて、スタンダードプランに切り替えられます。
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/70 border border-gray-200 rounded-lg p-3.5">
                  <p className="text-[13px] font-semibold text-gray-900 mb-2">フリー</p>
                  <ul className="text-[11px] text-gray-600 space-y-1 leading-relaxed">
                    <li>アンカー3件まで</li>
                    <li>週3回更新（月・水・金）</li>
                    <li>メール通知</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-300 rounded-lg p-3.5">
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="text-[13px] font-semibold text-gray-900">スタンダード</p>
                    <p className="text-[11px] font-semibold text-gray-700">月額300円（税抜）</p>
                  </div>
                  <ul className="text-[11px] text-gray-600 space-y-1 leading-relaxed">
                    <li>アンカー無制限</li>
                    <li>毎日更新 &amp; 週次・月次サマリ</li>
                    <li>Slack通知</li>
                    <li>CSV・PDF出力</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

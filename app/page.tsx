import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import {
  Anchor, Bell, Search, BarChart3, MessageSquare, Mail,
  ArrowRight, Check, Clock, Target, Sparkles, Radio,
  TrendingUp, Briefcase, Megaphone, Building2,
} from 'lucide-react'
import { MarketingHeader } from '@/components/MarketingHeader'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'リアンカー — 競合のリリースに、アンカーを。',
  description: 'PR TIMES・Google Newsから競合企業の動きを自動取得し、毎朝Slackやメールで通知するBtoB向け競合監視SaaS。月額300円から。',
  openGraph: {
    title: 'リアンカー — 競合のリリースに、アンカーを。',
    description: 'PR TIMES・Google Newsから競合企業の動きを自動取得・通知するBtoB向け競合監視SaaS。',
    url: 'https://reanker.com',
    siteName: 'リアンカー',
    locale: 'ja_JP',
    type: 'website',
  },
}

export default async function HomePage() {
  const session = await getServerSession()
  const isAuthenticated = !!session?.user

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingHeader isAuthenticated={isAuthenticated} />

      {/* === Hero === */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#378ADD]/5 via-white to-white pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#378ADD]/10 text-[#378ADD] text-[11px] font-medium px-2.5 py-1 rounded-full mb-5">
                <Sparkles size={11} />
                BtoB競合監視SaaS β版公開中
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-[1.2] tracking-tight mb-5">
                競合のリリースに、<br />
                <span className="text-[#378ADD]">アンカー</span>を。
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                PR TIMES・Google Newsから競合企業の動きを毎日自動取得。
                毎朝Slackやメールで届く、競合監視の新しい習慣。
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  href={isAuthenticated ? '/dashboard' : '/login'}
                  className="flex items-center justify-center gap-2 bg-[#378ADD] hover:bg-[#2d6db5] text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  {isAuthenticated ? 'ダッシュボードへ' : '無料で始める'}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/demo"
                  className="flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-sm font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  デモを見る
                </Link>
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                {['3件まで無料', 'クレジットカード登録不要', '30秒で開始'].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check size={13} className="text-[#378ADD]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* ビジュアル：通知プレビューモック */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#378ADD]/20 to-transparent rounded-3xl blur-2xl" />
              <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl p-5 max-w-md mx-auto">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <div className="w-7 h-7 bg-[#378ADD] rounded-md flex items-center justify-center">
                    <Anchor size={14} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900">リアンカー</p>
                    <p className="text-[10px] text-gray-400">9:00 AM · 毎朝の競合チェック</p>
                  </div>
                </div>

                <p className="text-xs text-gray-700 mb-3">
                  <strong className="text-gray-900">【リアンカー】Salesforce</strong>
                  <br />
                  昨日の新規リリース <span className="text-[#378ADD] font-semibold">3件</span>
                </p>

                <div className="space-y-2.5">
                  {[
                    { source: 'PR TIMES', title: 'Salesforce、生成AI機能「Agentforce」を国内提供開始', color: 'bg-blue-100 text-blue-700' },
                    { source: 'Google News', title: 'セールスフォース・ジャパン、製造業向け新ソリューション発表', color: 'bg-gray-100 text-gray-600' },
                    { source: 'PR TIMES', title: 'Salesforce World Tour Tokyo 2026開催決定', color: 'bg-blue-100 text-blue-700' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${n.color} shrink-0 mt-0.5`}>
                        {n.source}
                      </span>
                      <p className="text-[11px] text-gray-700 leading-snug">{n.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Problem === */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-20">
          <p className="text-xs text-[#378ADD] font-semibold tracking-wider uppercase mb-3 text-center">Problem</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12 tracking-tight">
            こんな悩み、ありませんか？
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Clock, title: '毎朝のPR TIMES巡回が時間泥棒', desc: '気になる競合をひとつずつ検索して開いて…の繰り返しで、本来の仕事に時間が回らない。' },
              { icon: TrendingUp, title: '競合の発表を見落として気まずい', desc: '上司から「あの会社のリリース見た？」と聞かれて初めて知る、というのを繰り返してしまう。' },
              { icon: Briefcase, title: '既存ツールは月数万円で手が出ない', desc: 'PR TIMESウェブクリッピングなどの専門ツールは、個人や小規模チームには予算が厳しい。' },
              { icon: Megaphone, title: '社内共有が毎回手作業', desc: '見つけた情報をSlackに貼り付けて要約して…の作業が、毎日地味に積み重なる。' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-200 rounded-xl p-6">
                <Icon size={20} className="text-gray-400 mb-3" />
                <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Solution: 3 ステップ === */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <p className="text-xs text-[#378ADD] font-semibold tracking-wider uppercase mb-3 text-center">Solution</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3 tracking-tight">
          リアンカーが、競合の動きを自動で捕まえます
        </h2>
        <p className="text-sm text-gray-500 text-center mb-12 max-w-xl mx-auto">
          登録は30秒。あとは毎朝、Slackやメールに届く通知を眺めるだけ。
        </p>

        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { step: '01', icon: Target, title: '監視対象を登録', desc: 'サービス名・キーワード・ドメインで、追いたい競合を3軸から指定。' },
            { step: '02', icon: Radio, title: '毎日自動で巡回', desc: 'PR TIMESとGoogle Newsを自動でスキャン。新しいリリースだけを抽出。' },
            { step: '03', icon: Bell, title: '毎朝9時に通知', desc: 'Slack・メールにまとめて配信。ダッシュボードでトレンドも一目で把握。' },
          ].map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="relative bg-white border border-gray-200 rounded-xl p-6">
              <span className="absolute -top-2.5 left-5 bg-[#378ADD] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{step}</span>
              <Icon size={22} className="text-[#378ADD] mb-3 mt-1" />
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === Features === */}
      <section id="features" className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
          <p className="text-xs text-[#378ADD] font-semibold tracking-wider uppercase mb-3 text-center">Features</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12 tracking-tight">
            主な機能
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Search,
                title: 'ピンポイント監視',
                desc: 'サービス名・任意キーワード・ドメインの3つの切り口で監視対象を登録。同一企業を異なる角度から追跡することも可能。',
              },
              {
                icon: Radio,
                title: 'PR TIMES + Google News',
                desc: '公式プレスリリース（PR TIMES）と、第三者報道（Google News）の両方をカバー。漏れなく競合の発信を把握。',
              },
              {
                icon: MessageSquare,
                title: 'Slack 通知',
                desc: 'Incoming Webhook を設定するだけで、チームのSlackチャンネルに毎朝まとめて配信。情報共有がそのまま完了。',
              },
              {
                icon: Mail,
                title: 'メール通知',
                desc: '個人での運用にも対応。設定したメールアドレス宛に、日次まとめを自動送信。',
              },
              {
                icon: BarChart3,
                title: 'ダッシュボード分析',
                desc: '曜日別の取得件数、投稿時間帯の分布、アンカー別のサマリーをグラフで可視化。競合の発信パターンを把握。',
              },
              {
                icon: TrendingUp,
                title: 'CSV / PDF エクスポート',
                desc: 'スタンダードプラン限定。レポート作成や社内共有のために、絞り込んだ結果をそのまま出力。',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-200 rounded-xl p-6 flex gap-4">
                <div className="w-10 h-10 bg-[#378ADD]/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#378ADD]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === UseCases === */}
      <section id="usecases" className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <p className="text-xs text-[#378ADD] font-semibold tracking-wider uppercase mb-3 text-center">Use Cases</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12 tracking-tight">
          こんな方が使っています
        </h2>

        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: Megaphone,
              role: 'マーケティング担当者',
              desc: '競合のキャンペーン発表をいち早くキャッチ。自社施策のタイミングを被らせない、もしくは便乗する戦略立案に。',
            },
            {
              icon: Building2,
              role: '広報・PR担当者',
              desc: '他社のプレスリリースから、自社の発信ヒントやベンチマークを発見。業界全体の話題傾向を朝のうちに把握。',
            },
            {
              icon: Briefcase,
              role: '経営企画・事業開発',
              desc: '注目市場・競合企業の動向を毎朝チェック。新規参入や撤退、提携など重要シグナルを見逃さない。',
            },
          ].map(({ icon: Icon, role, desc }) => (
            <div key={role} className="bg-white border border-gray-200 rounded-xl p-6">
              <Icon size={22} className="text-[#378ADD] mb-3" />
              <h3 className="text-sm font-bold text-gray-900 mb-2">{role}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === Pricing === */}
      <section id="pricing" className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <p className="text-xs text-[#378ADD] font-semibold tracking-wider uppercase mb-3 text-center">Pricing</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3 tracking-tight">
            シンプルな2プラン
          </h2>
          <p className="text-sm text-gray-500 text-center mb-12">
            まずは無料で。物足りなくなったら月300円で全機能を。
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-base font-bold text-gray-900 mb-1">フリー</h3>
              <p className="text-xs text-gray-500 mb-4">試してみたい方に</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">¥0<span className="text-sm font-normal text-gray-500"> / 月</span></p>
              <p className="text-xs text-gray-400 mb-6">クレジットカード登録不要</p>
              <ul className="space-y-2 text-xs text-gray-600 mb-6">
                <li className="flex items-center gap-2"><Check size={13} className="text-[#378ADD]" />アンカー3件まで</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-[#378ADD]" />隔日更新</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-[#378ADD]" />メール通知</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-[#378ADD]" />ダッシュボード</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-[#378ADD] rounded-xl p-6 relative">
              <span className="absolute -top-2.5 right-5 bg-[#378ADD] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">おすすめ</span>
              <h3 className="text-base font-bold text-gray-900 mb-1">スタンダード</h3>
              <p className="text-xs text-gray-500 mb-4">本格的に運用したい方に</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">¥300<span className="text-sm font-normal text-gray-500"> / 月（税込）</span></p>
              <p className="text-xs text-gray-400 mb-6">いつでも解約可</p>
              <ul className="space-y-2 text-xs text-gray-600 mb-6">
                <li className="flex items-center gap-2"><Check size={13} className="text-[#378ADD]" />アンカー無制限</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-[#378ADD]" />毎日更新</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-[#378ADD]" />Slack + メール通知</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-[#378ADD]" />CSV / PDFエクスポート</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-[#378ADD]" />優先サポート</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500">
            <Link href="/pricing" className="text-[#378ADD] hover:underline">プラン詳細・FAQを見る →</Link>
          </p>
        </div>
      </section>

      {/* === Final CTA === */}
      <section className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
          今すぐ、競合の動きを掴もう。
        </h2>
        <p className="text-sm text-gray-600 mb-8 max-w-lg mx-auto">
          Googleアカウントがあれば30秒で始められます。
          無料プランから、本気の競合監視を。
        </p>
        <Link
          href={isAuthenticated ? '/dashboard' : '/login'}
          className="inline-flex items-center justify-center gap-2 bg-[#378ADD] hover:bg-[#2d6db5] text-white text-sm font-medium px-8 py-3.5 rounded-lg transition-colors"
        >
          {isAuthenticated ? 'ダッシュボードへ' : '無料で始める'}
          <ArrowRight size={16} />
        </Link>
      </section>

      <Footer />
    </div>
  )
}

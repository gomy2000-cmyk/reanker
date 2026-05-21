import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import {
  Anchor, Bell, Search, BarChart3, MessageSquare, Mail,
  ArrowRight, Check, Clock, Target, Radio,
  TrendingUp, Briefcase, Megaphone, Building2,
  Zap, Heart, Award, Quote, Plus,
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
  const ctaHref = isAuthenticated ? '/dashboard' : '/login'
  const ctaText = isAuthenticated ? 'ダッシュボードへ' : '無料ではじめる'

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingHeader isAuthenticated={isAuthenticated} />

      {/* ============================================ */}
      {/* HERO                                          */}
      {/* ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FF] via-white to-white">
        {/* 装飾的な背景円 */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-[#378ADD]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -right-20 w-80 h-80 bg-yellow-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 pt-16 sm:pt-24 pb-16 sm:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 bg-white border border-[#378ADD]/30 text-[#378ADD] text-xs font-bold px-3 py-1.5 rounded-full mb-6 shadow-sm">
                <Zap size={12} fill="currentColor" />
                BtoB競合監視SaaS β版公開中
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.15] tracking-tight mb-6">
                競合のリリースに、<br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#378ADD]">アンカー</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 sm:h-4 bg-yellow-300/60 -z-0" />
                </span>を。
              </h1>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8 max-w-xl">
                PR TIMES・Google Newsから競合企業の動きを毎日自動取得。<br />
                毎朝Slackやメールに届く、競合監視の新しい習慣。
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href={ctaHref}
                  className="group flex items-center justify-center gap-2 bg-[#378ADD] hover:bg-[#2d6db5] text-white text-base font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-[#378ADD]/30 hover:shadow-xl hover:shadow-[#378ADD]/40 hover:-translate-y-0.5"
                >
                  {ctaText}
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/demo"
                  className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-[#378ADD] text-gray-700 text-base font-bold px-8 py-4 rounded-full transition-all"
                >
                  デモを見てみる
                </Link>
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-600">
                {['3件まで無料', 'クレジットカード登録不要', '30秒で開始'].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check size={14} className="text-[#378ADD]" strokeWidth={3} />
                    <span className="font-medium">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 通知プレビューモック */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-300 rounded-full opacity-80 blur-sm" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#FF8A65]/40 rounded-full blur-2xl" />

              <div className="relative bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 max-w-md mx-auto transform sm:rotate-1 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#378ADD] to-[#2d6db5] rounded-xl flex items-center justify-center shadow-md">
                    <Anchor size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">リアンカー</p>
                    <p className="text-[10px] text-gray-400">9:00 AM · #競合チェック</p>
                  </div>
                  <Bell size={14} className="text-gray-300" />
                </div>

                <p className="text-sm text-gray-700 mb-4 font-medium">
                  <strong className="text-gray-900">【リアンカー】Salesforce</strong>
                  <br />
                  昨日の新規リリース <span className="text-[#378ADD] font-bold text-base">3件</span>
                </p>

                <div className="space-y-2">
                  {[
                    { source: 'PR TIMES', title: 'Salesforce、生成AI「Agentforce」を国内提供開始', color: 'bg-blue-100 text-blue-700' },
                    { source: 'Google News', title: 'セールスフォース、製造業向け新ソリューション発表', color: 'bg-gray-100 text-gray-600' },
                    { source: 'PR TIMES', title: 'Salesforce World Tour Tokyo 2026開催決定', color: 'bg-blue-100 text-blue-700' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${n.color} shrink-0 mt-0.5`}>
                        {n.source}
                      </span>
                      <p className="text-xs text-gray-700 leading-snug">{n.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* STATS BAR                                     */}
      {/* ============================================ */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
          <p className="text-center text-xs text-gray-500 font-medium mb-6">数字で見るリアンカー</p>
          <div className="grid grid-cols-3 gap-6 sm:gap-12 text-center">
            {[
              { num: '2', unit: 'メディア', label: 'PR TIMES + Google News' },
              { num: '3', unit: '軸', label: 'サービス / キーワード / ドメイン' },
              { num: '¥300', unit: '/月〜', label: '本格運用も低コスト' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl sm:text-5xl font-black text-[#378ADD] tracking-tight">
                  {s.num}<span className="text-base sm:text-xl text-gray-500 font-bold ml-0.5">{s.unit}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PROBLEM                                       */}
      {/* ============================================ */}
      <section className="bg-[#FFF9E6] py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs text-[#F59E0B] font-black tracking-widest uppercase mb-3">Problem</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              こんな悩み、<br className="sm:hidden" />
              ありませんか？
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              { icon: Clock, title: '毎朝のPR TIMES巡回が時間泥棒', desc: '気になる競合をひとつずつ検索して開いて…の繰り返しで、本来の仕事に時間が回らない。' },
              { icon: TrendingUp, title: '競合の発表を見落として気まずい', desc: '上司から「あの会社のリリース見た？」と聞かれて初めて知る、を繰り返してしまう。' },
              { icon: Briefcase, title: '既存ツールは月数万円で手が出ない', desc: 'PR TIMESウェブクリッピングなどの専門ツールは、個人や小規模チームには予算が厳しい。' },
              { icon: Megaphone, title: '社内共有が毎回手作業', desc: '見つけた情報をSlackに貼り付けて要約して…の作業が、毎日地味に積み重なる。' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-7 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#F59E0B]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SOLUTION — 3 STEP                             */}
      {/* ============================================ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs text-[#378ADD] font-black tracking-widest uppercase mb-3">Solution</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
              リアンカーが、競合の動きを<br />
              <span className="text-[#378ADD]">自動で捕まえます</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              登録は30秒。あとは毎朝、Slackやメールに届く通知を眺めるだけ。
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 sm:gap-7">
            {[
              { num: '1', icon: Target, title: '監視対象を登録', desc: 'サービス名・キーワード・ドメインで、追いたい競合を3軸から指定。' },
              { num: '2', icon: Radio, title: '毎日自動で巡回', desc: 'PR TIMESとGoogle Newsを自動でスキャン。新しいリリースだけを抽出。' },
              { num: '3', icon: Bell, title: '毎朝9時に通知', desc: 'Slack・メールにまとめて配信。ダッシュボードでトレンドも一目で把握。' },
            ].map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="text-center relative">
                <div className="relative inline-block mb-5">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#378ADD] to-[#2d6db5] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#378ADD]/30">
                    <Icon size={32} className="text-white" strokeWidth={2} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-black text-gray-900 shadow-md">
                    {num}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* REASONS WHY                                   */}
      {/* ============================================ */}
      <section id="reasons" className="bg-[#F0F7FF] py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs text-[#378ADD] font-black tracking-widest uppercase mb-3">Why Reanker</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              選ばれる<span className="text-[#378ADD]">3つの理由</span>
            </h2>
          </div>

          <div className="space-y-5 sm:space-y-7">
            {[
              {
                num: '01',
                icon: Heart,
                title: '個人・小規模チームでも始められる価格',
                desc: '月額300円から。専門ツールは月数万円が当たり前のなか、コーヒー1杯分で本格的な競合監視を実現。フリープランから試せて、合わなければいつでも解約OK。',
              },
              {
                num: '02',
                icon: Zap,
                title: '設定30秒、運用は完全自動',
                desc: 'Googleアカウントでログイン → 競合を3件登録 → 通知先を選ぶだけ。あとは毎朝、自動でまとめが届きます。複雑な設定や運用工数はゼロ。',
              },
              {
                num: '03',
                icon: Award,
                title: 'PR TIMES と Google News の組み合わせ',
                desc: '公式リリース（PR TIMES）と、第三者報道（Google News）の両方を一気通貫でカバー。「自社が発信していない動き」まで含めて競合の全体像を把握できます。',
              },
            ].map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-5 sm:gap-7 items-start hover:shadow-xl transition-shadow">
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3 shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#378ADD] to-[#2d6db5] rounded-2xl flex items-center justify-center shadow-lg shadow-[#378ADD]/30">
                    <Icon size={26} className="text-white" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-black text-[#378ADD]/30 tracking-tighter">{num}</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FEATURES                                      */}
      {/* ============================================ */}
      <section id="features" className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs text-[#378ADD] font-black tracking-widest uppercase mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              競合監視に必要な機能を<br className="sm:hidden" />
              ぜんぶ。
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Search, title: 'ピンポイント監視', desc: 'サービス名・キーワード・ドメインの3軸で、追いたい競合を自在に設定。', color: 'bg-blue-100 text-[#378ADD]' },
              { icon: Radio, title: 'PR TIMES + Google News', desc: '公式リリースも第三者報道も、両方カバーで漏れなし。', color: 'bg-purple-100 text-purple-600' },
              { icon: MessageSquare, title: 'Slack 通知', desc: 'Incoming Webhook 設定だけで、チームのチャンネルに自動配信。', color: 'bg-green-100 text-green-600' },
              { icon: Mail, title: 'メール通知', desc: '個人運用にも対応。設定したメールアドレスに日次まとめを送信。', color: 'bg-pink-100 text-pink-600' },
              { icon: BarChart3, title: 'ダッシュボード分析', desc: '曜日別件数・時間帯分布・アンカー別サマリーをグラフで可視化。', color: 'bg-orange-100 text-orange-600' },
              { icon: TrendingUp, title: 'CSV / PDF エクスポート', desc: 'レポートや社内共有に。絞り込み結果をそのまま出力。', color: 'bg-yellow-100 text-yellow-700' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#378ADD]/30 hover:shadow-lg transition-all">
                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* USE CASES                                     */}
      {/* ============================================ */}
      <section id="usecases" className="bg-[#F0F7FF] py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs text-[#378ADD] font-black tracking-widest uppercase mb-3">Use Cases</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              こんな方が使っています
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Megaphone, role: 'マーケティング担当者', desc: '競合のキャンペーン発表をいち早くキャッチ。施策タイミングの被り回避や、便乗戦略立案に活用。' },
              { icon: Building2, role: '広報・PR担当者', desc: '他社プレスリリースから自社の発信ヒントを発見。業界全体の話題傾向を朝のうちに把握。' },
              { icon: Briefcase, role: '経営企画・事業開発', desc: '注目市場の動向を毎朝チェック。新規参入や撤退・提携など重要シグナルを見逃さない。' },
            ].map(({ icon: Icon, role, desc }) => (
              <div key={role} className="bg-white border border-gray-100 rounded-3xl p-7 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-[#378ADD] to-[#2d6db5] rounded-2xl flex items-center justify-center mb-5 shadow-md shadow-[#378ADD]/20">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{role}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* VOICES (β testers placeholder)                */}
      {/* ============================================ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs text-[#378ADD] font-black tracking-widest uppercase mb-3">Voices</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              β版利用者の声
            </h2>
            <p className="text-xs text-gray-400 mt-3">※ β版モニター企業様のご感想</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { quote: '毎朝の業界チェックが10分から1分に。マーケミーティングで「あ、あれね」と言える率が劇的に上がりました。', role: 'SaaS企業 / マーケ責任者' },
              { quote: '個人事業で月数万円のツールは無理だったので、300円で同じことができるのは正直ありがたい。Slack通知も助かる。', role: 'フリーランス / 広報PR' },
              { quote: '競合5社を登録してから、社長から「最近よく知ってるね」と言われるように。情報源として地味に効いてる。', role: '中小企業 / 事業開発' },
            ].map((v, i) => (
              <div key={i} className="bg-[#F0F7FF] border border-blue-100 rounded-3xl p-6 sm:p-7 relative">
                <Quote size={28} className="text-[#378ADD]/30 mb-3" />
                <p className="text-sm text-gray-800 leading-relaxed mb-5 font-medium">「{v.quote}」</p>
                <div className="flex items-center gap-3 pt-4 border-t border-blue-200/50">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#378ADD] to-[#2d6db5] rounded-full" />
                  <p className="text-xs text-gray-600 font-medium">{v.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRICING                                       */}
      {/* ============================================ */}
      <section id="pricing" className="bg-[#FFF9E6] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs text-[#F59E0B] font-black tracking-widest uppercase mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-3">
              シンプルな<span className="text-[#378ADD]">2プラン</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              まずは無料で。物足りなくなったら月300円で全機能を。
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-7 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-1">フリー</h3>
              <p className="text-xs text-gray-500 mb-5">試してみたい方に</p>
              <p className="text-4xl font-black text-gray-900 mb-1">¥0<span className="text-sm font-bold text-gray-500"> / 月</span></p>
              <p className="text-xs text-gray-400 mb-6">クレジットカード登録不要</p>
              <ul className="space-y-2.5 text-sm text-gray-700 mb-6">
                <li className="flex items-center gap-2"><Check size={15} className="text-[#378ADD] shrink-0" strokeWidth={3} />アンカー3件まで</li>
                <li className="flex items-center gap-2"><Check size={15} className="text-[#378ADD] shrink-0" strokeWidth={3} />隔日更新</li>
                <li className="flex items-center gap-2"><Check size={15} className="text-[#378ADD] shrink-0" strokeWidth={3} />メール通知</li>
                <li className="flex items-center gap-2"><Check size={15} className="text-[#378ADD] shrink-0" strokeWidth={3} />ダッシュボード</li>
              </ul>
              <Link
                href={ctaHref}
                className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold py-3 rounded-full transition-colors"
              >
                無料ではじめる
              </Link>
            </div>

            <div className="bg-white border-2 border-[#378ADD] rounded-3xl p-7 sm:p-8 relative shadow-lg shadow-[#378ADD]/10">
              <span className="absolute -top-3 right-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs px-3 py-1 rounded-full font-black shadow-md">⭐ おすすめ</span>
              <h3 className="text-xl font-bold text-gray-900 mb-1">スタンダード</h3>
              <p className="text-xs text-gray-500 mb-5">本格運用したい方に</p>
              <p className="text-4xl font-black text-gray-900 mb-1">¥300<span className="text-sm font-bold text-gray-500"> / 月（税込）</span></p>
              <p className="text-xs text-gray-400 mb-6">いつでも解約可</p>
              <ul className="space-y-2.5 text-sm text-gray-700 mb-6">
                <li className="flex items-center gap-2"><Check size={15} className="text-[#378ADD] shrink-0" strokeWidth={3} />アンカー無制限</li>
                <li className="flex items-center gap-2"><Check size={15} className="text-[#378ADD] shrink-0" strokeWidth={3} />毎日更新</li>
                <li className="flex items-center gap-2"><Check size={15} className="text-[#378ADD] shrink-0" strokeWidth={3} />Slack + メール通知</li>
                <li className="flex items-center gap-2"><Check size={15} className="text-[#378ADD] shrink-0" strokeWidth={3} />CSV / PDFエクスポート</li>
                <li className="flex items-center gap-2"><Check size={15} className="text-[#378ADD] shrink-0" strokeWidth={3} />優先サポート</li>
              </ul>
              <Link
                href={ctaHref}
                className="block text-center bg-[#378ADD] hover:bg-[#2d6db5] text-white text-sm font-bold py-3 rounded-full transition-colors shadow-md"
              >
                スタンダードを申し込む
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500">
            <Link href="/pricing" className="text-[#378ADD] hover:underline font-medium">プラン詳細・FAQを見る →</Link>
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* FAQ                                           */}
      {/* ============================================ */}
      <section id="faq" className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs text-[#378ADD] font-black tracking-widest uppercase mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              よくあるご質問
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: '本当に無料で使えますか？', a: 'はい。フリープランはクレジットカード登録不要で、無料のまま無期限でご利用いただけます。アンカー3件まで・隔日更新・メール通知が含まれます。' },
              { q: '途中で解約はできますか？', a: '設定画面または決済代行事業者（Stripe）のポータルから、いつでも解約できます。解約後は当該課金期間の末日までスタンダード機能を継続利用できます。' },
              { q: 'PR TIMES や Google News に掲載されていない情報も取得できますか？', a: '現在は PR TIMES と Google News の2ソースに限定しています。今後、Twitter / X や独自RSS、他のニュースサイト等への対応を予定しています。' },
              { q: 'チームで複数人利用できますか？', a: 'MVP版では個人アカウント単位での提供となります。Slack通知をチームのチャンネルに飛ばすことで、実質的な情報共有は可能です。チームプランは順次検討中です。' },
              { q: '請求書は発行できますか？', a: '設定画面の「請求履歴を見る」から Stripe のカスタマーポータルにアクセスし、過去の請求書をPDFでダウンロードいただけます。' },
            ].map((item) => (
              <details key={item.q} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#378ADD]/40 transition-colors">
                <summary className="cursor-pointer px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 list-none">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-start gap-2">
                    <span className="text-[#378ADD] font-black">Q.</span>
                    {item.q}
                  </h3>
                  <Plus size={18} className="text-gray-400 group-open:rotate-45 transition-transform shrink-0" />
                </summary>
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-sm text-gray-700 leading-relaxed border-t border-gray-100">
                  <p className="pt-4"><span className="text-[#378ADD] font-bold">A.</span> {item.a}</p>
                </div>
              </details>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500 mt-8">
            その他のご質問は<Link href="/contact" className="text-[#378ADD] hover:underline font-medium">お問い合わせフォーム</Link>からお気軽にどうぞ。
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA                                     */}
      {/* ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#378ADD] to-[#2d6db5] py-20 sm:py-28">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <Anchor size={48} className="text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
            今すぐ、<br className="sm:hidden" />
            競合の動きを掴もう。
          </h2>
          <p className="text-sm sm:text-base text-white/90 mb-10 max-w-xl mx-auto leading-relaxed">
            Googleアカウントがあれば30秒で始められます。<br />
            無料プランから、本気の競合監視を。
          </p>
          <Link
            href={ctaHref}
            className="group inline-flex items-center justify-center gap-2 bg-white hover:bg-yellow-50 text-[#378ADD] text-base sm:text-lg font-black px-10 py-4 rounded-full transition-all shadow-2xl hover:-translate-y-0.5"
          >
            {ctaText}
            <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-xs text-white/70 mt-5">クレジットカード登録不要 / いつでも解約OK</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

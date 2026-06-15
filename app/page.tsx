import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import {
  Bell, Search, BarChart3, MessageSquare, Mail,
  ArrowRight, Check, X, Plus, ExternalLink, Circle, ChevronRight,
} from 'lucide-react'
import { MarketingHeader } from '@/components/MarketingHeader'
import { Footer } from '@/components/Footer'
import { AnchorMark } from '@/components/brand/AnchorMark'

export const metadata: Metadata = {
  title: {
    absolute: 'リアンカー（ReAnker）｜競合情報収集・プレスリリース監視ツール',
  },
  description: 'リアンカー（ReAnker）は、競合企業のプレスリリースを毎日自動でチェックし、新着リリースだけをSlack・メールで通知する競合情報収集ツールです。PR TIMES と Google News のプレス・リリースをまとめて把握できます。',
  openGraph: {
    title: 'リアンカー（ReAnker）｜競合情報収集・プレスリリース監視ツール',
    description: 'リアンカー（ReAnker）は、競合企業のプレスリリースを毎日自動でチェックし、新着リリースだけをSlack・メールで通知する競合情報収集ツールです。PR TIMES と Google News のプレス・リリースをまとめて把握できます。',
    url: 'https://reanker.com',
    siteName: 'リアンカー（ReAnker）',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'リアンカー（ReAnker）｜競合情報収集・プレスリリース監視ツール',
    description: 'リアンカー（ReAnker）は競合のプレスリリースを毎日自動チェック・通知する競合情報収集ツール。',
  },
  alternates: {
    canonical: 'https://reanker.com',
  },
}

export default async function HomePage() {
  const session = await getServerSession()
  const isAuthenticated = !!session?.user
  const ctaHref = isAuthenticated ? '/dashboard' : '/login'
  const ctaText = isAuthenticated ? 'ダッシュボードへ' : '無料ではじめる'

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <MarketingHeader isAuthenticated={isAuthenticated} />

      {/* ============================================ */}
      {/* HERO + Product screenshot                     */}
      {/* ============================================ */}
      <section className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 pt-6 sm:pt-10 pb-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded mb-3">
              <span className="w-1.5 h-1.5 bg-[#378ADD] rounded-full" />
              競合リリース監視ツール · β版公開中
            </div>

            <h1 className="text-[28px] sm:text-[40px] font-semibold text-gray-900 tracking-tight leading-[1.2] mb-3">
              競合のリリースを、<br />
              毎日自動でチェック。
            </h1>

            <p className="text-[14px] sm:text-[15px] text-gray-600 leading-relaxed mb-4 max-w-2xl">
              リアンカー（ReAnker）は、監視したい競合企業を登録するだけで競合情報収集を自動化できるツールです。毎朝9時、前日に出た新着リリースだけをSlack・メールへ自動配信します。
              PR TIMES と Google News のプレス・リリースを1ツールでまとめて把握。月額300円から、個人や小規模チームでも本格的な競合リリース監視を始められます。
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
              >
                {ctaText}
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
              >
                デモを見る
              </Link>
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-500">
              {['Googleログインで30秒', 'クレジットカード登録不要', 'いつでも解約可'].map((t) => (
                <li key={t} className="flex items-center gap-1">
                  <Check size={12} className="text-[#378ADD]" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* === ヒーロー直下の実画面プレビュー === */}
        <div className="max-w-6xl mx-auto px-4 pb-6 sm:pb-8">
          <DashboardPreview />
        </div>
      </section>

      {/* ============================================ */}
      {/* PAIN POINTS（課題訴求）                         */}
      {/* ============================================ */}
      <section id="pains" className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
          <div className="max-w-2xl mb-8">
            <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">PAIN POINTS</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
              競合の新サービス発表、<br />顧客に聞かれてから知っていませんか？
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              PR TIMES や Google News を毎日チェックする運用は続きません。
              ReAnker（リアンカー）は、その手作業を置き換えるツールです。
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Googleアラートでは追いつかない',
                desc: 'ノイズが多くて読まなくなる。配信時刻も不定で、朝の業務に組み込みづらい。',
              },
              {
                title: 'PR TIMES を毎日巡回する運用は続かない',
                desc: '気づけば見落とし。「あの会社のリリース見た？」と聞かれて初めて知る、を繰り返す。',
              },
              {
                title: '上司・顧客に聞かれてから把握する',
                desc: '商談や定例で「ご存じですか？」と切り出され、後手に回る瞬間が積み重なる。',
              },
              {
                title: '社内共有が毎回手作業',
                desc: 'リンクを Slack に貼って要約を書いて…の繰り返しで、本来の仕事に時間が回らない。',
              },
            ].map((p) => (
              <div key={p.title} className="bg-white border border-gray-200 rounded-lg p-5">
                <p className="text-sm font-semibold text-gray-900 mb-2">{p.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white border border-[#378ADD]/30 rounded-lg p-5 flex items-start gap-4">
            <div className="w-9 h-9 bg-[#378ADD]/10 rounded-lg flex items-center justify-center shrink-0">
              <Bell size={16} className="text-[#378ADD]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                PR TIMES・Google News を毎日チェックする作業を、ReAnker が代わりに行います。
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                競合の新サービス、導入事例、資金調達、業務提携、キャンペーン発表を、毎朝まとめて確認できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRODUCT WALKTHROUGH                           */}
      {/* ============================================ */}
      <section id="product" className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="max-w-2xl mb-8">
            <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">PRODUCT</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
              競合監視の3ステップを完全自動化
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              監視対象を登録すると、その翌日から毎日PR TIMESとGoogle Newsを巡回し、新しいリリースを自動取得。
              毎朝9時に未読分だけをまとめてSlackとメールへ配信します。
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {/* Step 1: 監視対象を登録 */}
            <FeatureRow
              num="01"
              title="監視対象を3軸で登録"
              desc="サービス名・キーワード・ドメインの3軸からアンカー（監視対象）を登録。同じ競合を複数の切り口から追跡することも可能です。フリープランは3件まで、スタンダードは無制限。"
              points={['サービス名で監視（例：Salesforce）', 'キーワードで監視（例：AI受発注）', 'ドメインで監視（例：sansan.com）']}
              visual={<AnchorListPreview />}
            />

            {/* Step 2: 自動取得 */}
            <FeatureRow
              num="02"
              title="毎日PR TIMESとGoogle Newsを巡回"
              desc="サーバが日次でPR TIMESとGoogle Newsを自動スキャン。前日に公開された新規記事だけを抽出し、ストックします。スクレイピング知識ゼロでOK。"
              points={['PR TIMES のキーワード検索結果を取得', 'Google News（SerpAPI経由）を取得', 'URL重複は自動で除外']}
              visual={<ArticleListPreview />}
              reverse
            />

            {/* Step 3: 通知 */}
            <FeatureRow
              num="03"
              title="毎朝9時にSlack・メールへ自動配信"
              desc="アンカーごとにグルーピングして、Slack Incoming Webhookとメールへまとめて配信。チーム共有はSlackチャンネルへ通知するだけで完了します。"
              points={['Slack Incoming Webhookに対応', 'メール通知も同時設定可', '通知開始は登録翌朝9時から']}
              visual={<SlackNotifyPreview />}
            />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* COMPARISON TABLE                              */}
      {/* ============================================ */}
      <section id="comparison" className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="max-w-2xl mb-10">
            <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">COMPARISON</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
              既存のクリッピングサービスと比べて
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              既存の Web クリッピングサービスは法人向けの月額数千〜数万円が中心で、
              個人事業主・小規模チームには予算面で導入しづらい現状があります。
              ReAnker（リアンカー）は同様の用途を月額300円から提供します。
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-xs text-gray-500">
                  <th className="text-left font-medium px-5 py-3 min-w-[180px]">項目</th>
                  <th className="text-left font-medium px-5 py-3 min-w-[140px]">
                    <span className="text-gray-900 font-semibold">ReAnker</span>
                  </th>
                  <th className="text-left font-medium px-5 py-3 min-w-[180px]">PR TIMES Webクリッピング</th>
                  <th className="text-left font-medium px-5 py-3 min-w-[140px]">大手クリッピング各社</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {[
                  { k: '月額（最小プラン）', r: '¥0 / ¥300', p: '¥5,500（5キーワード）', e: '月数万円〜' },
                  { k: 'キーワード数', r: '無制限（スタンダード）', p: '5キーワード', e: 'プラン依存' },
                  { k: '対象メディア', r: 'PR TIMES + Google News', p: '約2,900媒体', e: '新聞・雑誌・Web' },
                  { k: '通知頻度', r: '毎日 9:00 JST', p: '日次', e: '日次（朝刊7時等）' },
                  { k: 'Slack通知', r: '○（Incoming Webhook）', p: '○', e: '△（要相談）' },
                  { k: 'メール通知', r: '○', p: '○', e: '○' },
                  { k: '契約形態', r: '月額・解約自由', p: '月単位継続', e: '年間契約が多い' },
                  { k: 'クレジットカード決済', r: '○（Stripe）', p: '○', e: '請求書払い中心' },
                  { k: '対象', r: '個人 / 小規模チーム', p: '法人広報', e: '法人広報' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 ? 'bg-gray-50/30' : ''}>
                    <td className="px-5 py-3 text-gray-600 text-xs">{row.k}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{row.r}</td>
                    <td className="px-5 py-3 text-gray-600">{row.p}</td>
                    <td className="px-5 py-3 text-gray-600">{row.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-gray-400 mt-3">
            ※ PR TIMES Webクリッピングの料金は2026年5月時点の公開情報。各社の最新料金は公式サイトをご確認ください。
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* FEATURES (compact grid)                       */}
      {/* ============================================ */}
      <section className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="max-w-2xl mb-10">
            <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">FEATURES</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
              業務で使う機能だけを、揃えています
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              余計な機能は載せず、競合監視に直接効くものに絞っています。
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {[
              { icon: Search, title: '3軸での監視登録', desc: 'サービス名 / 任意キーワード / ドメインから自由に登録。同一企業を異なる角度から追跡可。' },
              { icon: Bell, title: 'PR TIMES 自動取得', desc: 'PR TIMES のキーワード検索結果を毎日スキャン。前日公開分だけを抽出。' },
              { icon: Search, title: 'Google News 取得', desc: 'SerpAPI 経由で Google News（tbm=nws）を取得。第三者報道もカバー。' },
              { icon: MessageSquare, title: 'Slack 通知', desc: 'Incoming Webhook URL を設定するだけ。アンカーごとにグルーピングして配信。' },
              { icon: Mail, title: 'メール通知', desc: '個人運用にも対応。設定したメールアドレスに日次まとめを送信。' },
              { icon: BarChart3, title: 'ダッシュボード', desc: '曜日別件数・時間帯分布・アンカー別サマリーをグラフで可視化。' },
              { icon: Check, title: '既読/未読管理', desc: '記事ごとに既読フラグを管理。チェック漏れを防止。' },
              { icon: ExternalLink, title: 'CSV / PDF 出力', desc: 'スタンダードプラン限定。社内レポート用に絞り込み結果を出力可。' },
              { icon: AnchorMark, title: 'Warmup機能', desc: 'アンカー登録の翌朝9時から通知開始。過去記事の大量配信を防止。' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-5 sm:p-6 hover:bg-gray-50 transition-colors">
                <Icon size={16} className="text-[#378ADD] mb-3" strokeWidth={2.25} />
                <h3 className="text-[13px] font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* USE CASES                                     */}
      {/* ============================================ */}
      <section id="usecases" className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="max-w-2xl mb-10">
            <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">USE CASES</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
              実際の業務で、こう使われています
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                role: 'BtoBマーケター',
                situation: '競合のセミナー・ホワイトペーパー・キャンペーン発表を毎朝確認',
                detail: '自社施策の企画やメールマガジンのネタとして活用。被り回避や便乗のタイミング判断にも。',
              },
              {
                role: '広報担当',
                situation: '同業他社のリリース見出し・配信タイミング・カテゴリを把握',
                detail: '自社プレスリリースの構成や訴求の改善材料に。業界全体の話題傾向を朝のうちに把握。',
              },
              {
                role: '営業責任者',
                situation: '競合の導入事例・提携・新サービスを商談前にチェック',
                detail: '顧客から聞かれる前に把握。提案トークや競合切り替えの切り口に反映。',
              },
              {
                role: '経営企画 / 事業開発',
                situation: '注目市場の資金調達・業務提携・新規参入・撤退情報を追跡',
                detail: '週次レポートや役員定例で「最近の市場動向」として添付。意思決定を高速化。',
              },
              {
                role: '広告代理店・支援会社',
                situation: '複数クライアントの競合ニュースをまとめて監視',
                detail: '提案・定例報告の情報収集を効率化。「先週の競合の動き」を毎朝の集約で把握。',
              },
            ].map((c) => (
              <div key={c.role} className="bg-white border border-gray-200 rounded-lg p-5">
                <p className="text-[11px] text-gray-500 font-medium mb-2">{c.role}</p>
                <p className="text-[14px] font-semibold text-gray-900 mb-2 leading-snug">{c.situation}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRICING                                       */}
      {/* ============================================ */}
      <section id="pricing" className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
          <div className="max-w-2xl mb-10">
            <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">PRICING</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
              3つのプランから選べる
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              まずはフリーで動作確認。本格運用は1日10円のスタンダードへ。
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <PlanCard
              name="フリー"
              price="¥0"
              priceSuffix="/月"
              note="クレジットカード登録不要"
              features={[
                'アンカー 3件まで',
                '記事取得：週3回（月・水・金）',
                'メール通知',
                'ダッシュボード',
              ]}
              cta="無料ではじめる"
              ctaHref={ctaHref}
              variant="default"
            />
            <PlanCard
              name="スタンダード"
              price="¥300"
              priceSuffix="/月（税抜）"
              note="いつでも解約可"
              subNote="1日10円で本格監視！"
              features={[
                'アンカー 無制限',
                '記事取得：毎日',
                '週次・月次サマリ',
                'Slack + メール通知',
                'CSV / PDF エクスポート',
                '優先サポート',
              ]}
              cta="スタンダードを申し込む"
              ctaHref={ctaHref}
              variant="accent"
            />
            <PlanCard
              name="PRO"
              price="¥1,000"
              priceSuffix="/月（税抜）"
              note="高度な競合分析機能を準備中"
              badge="開発中"
              features={[
                'スタンダードの全機能',
                '高度な競合分析レポート',
                '複数ユーザー管理',
              ]}
              cta="近日公開"
              ctaHref=""
              variant="pro"
            />
          </div>

          <p className="text-xs text-gray-500">
            <Link href="/pricing" className="text-[#378ADD] hover:underline">プラン詳細・FAQを見る</Link>
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* FAQ                                           */}
      {/* ============================================ */}
      <section id="faq" className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
          <div className="mb-10">
            <p className="text-xs text-[#378ADD] font-semibold tracking-wide mb-2">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              よくあるご質問
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
            {[
              { q: 'Googleアラートとの違いは何ですか？', a: 'Googleアラートは無料で便利ですが、配信タイミングが読めず、ブログや関連サイト含めノイズが多めです。ReAnker は PR TIMES と Google News に絞り、毎朝9時に「前日分だけ」を Slack/メールへまとめて配信します。既読・未読・クリップなど管理機能もあります。詳しくは比較ページをご覧ください。' },
              { q: 'PR TIMES Webクリッピングとの違いは何ですか？', a: 'PR TIMES Webクリッピングは法人広報向けの純正サービスで、約2,900媒体を月額5,500円〜で網羅します。ReAnker は PR TIMES + Google News に絞り月額300円（税抜）から提供。個人・小規模チームでも導入しやすい構成です。' },
              { q: '競合のプレスリリースを自動で監視できますか？', a: 'はい。サービス名・キーワード・ドメインの3軸でアンカーを登録すると、毎日 PR TIMES の検索結果から新着リリースを取得し、翌朝9時に Slack やメールへ通知します。' },
              { q: 'Google News も監視できますか？', a: 'はい。同じアンカー登録で PR TIMES と Google News の両方をまとめて監視できます。アンカー設定でソースを選べます。' },
              { q: 'Slack に通知できますか？', a: 'はい。Slack の Incoming Webhook URL を設定するだけで、指定したチャンネルに毎朝9時の集約通知が届きます。Standard プランで利用可能です。' },
              { q: '無料プランでは何ができますか？', a: 'アンカー3件まで・週3回（月・水・金）の取得・メール通知・記事一覧/既読/クリップ管理が利用できます。クレジットカード登録は不要です。' },
              { q: '個人でも利用できますか？', a: 'はい。Googleログインで30秒で開始でき、Stripe 経由でクレジットカード決済します。個人・フリーランス・小規模チームを主な想定としています。' },
              { q: '法人の経費精算に使えますか？', a: 'はい。設定画面の「請求履歴を見る」から Stripe のカスタマーポータルにアクセスし、月次の請求書 PDF をダウンロードできます。' },
              { q: '登録した翌日から通知されますか？', a: 'アンカー登録後、翌朝9時のサイクルから通知が始まります（warmup 仕様）。当日にバックログがまとめて飛んで埋もれる事故を防ぐためです。' },
              { q: 'どんなキーワードを登録すればよいですか？', a: '競合企業のサービス名（例：Salesforce）、業界トピック（例：AI受発注）、ドメイン名（例：sansan.com）など。3軸を組み合わせると見落としが減ります。' },
              { q: '途中で解約はできますか？', a: '設定画面、または Stripe のカスタマーポータルからいつでも解約できます。解約後は当該課金期間の末日までスタンダード機能を引き続きご利用いただけます。日割り精算はありません。' },
              { q: 'PR TIMES の仕様変更で取得が止まる可能性はありますか？', a: 'スクレイピング元のサイト仕様変更に依存するため、可能性はあります。検知次第すぐに復旧対応します。Google News側はSerpAPIを利用しているため安定性は高めです。' },
            ].map((item) => (
              <details key={item.q} className="group">
                <summary className="cursor-pointer px-5 py-4 flex items-start justify-between gap-4 list-none hover:bg-gray-50 transition-colors">
                  <p className="text-sm font-medium text-gray-900 leading-snug">{item.q}</p>
                  <Plus size={16} className="text-gray-400 group-open:rotate-45 transition-transform shrink-0 mt-0.5" />
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-6">
            その他のご質問は<Link href="/contact" className="text-[#378ADD] hover:underline">お問い合わせフォーム</Link>からどうぞ。
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA                                     */}
      {/* ============================================ */}
      <section className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
            毎朝の競合チェックを、自動化する。
          </h2>
          <p className="text-sm text-gray-600 mb-7 max-w-lg mx-auto leading-relaxed">
            Googleアカウントで30秒、クレジットカード登録不要。
            まずは無料プランでお試しください。
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-6 py-3 rounded-md transition-colors"
            >
              {ctaText}
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-6 py-3 rounded-md transition-colors"
            >
              料金を見る
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/* ========================================
   小コンポーネント
   ======================================== */

function FeatureRow({
  num, title, desc, points, visual, reverse = false,
}: {
  num: string
  title: string
  desc: string
  points: string[]
  visual: React.ReactNode
  reverse?: boolean
}) {
  return (
    <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div>
        <p className="text-xs font-mono text-gray-400 mb-2">{num}</p>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight mb-3">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{desc}</p>
        <ul className="space-y-1.5">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
              <Check size={14} className="text-[#378ADD] mt-0.5 shrink-0" strokeWidth={2.5} />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div>{visual}</div>
    </div>
  )
}

function PlanCard({
  name, price, priceSuffix, note, subNote, badge, features, cta, ctaHref, variant,
}: {
  name: string
  price: string
  priceSuffix: string
  note: string
  subNote?: string
  badge?: string
  features: string[]
  cta: string
  ctaHref: string
  variant: 'default' | 'accent' | 'pro'
}) {
  const isPro = variant === 'pro'
  return (
    <div className={`border rounded-lg p-6 sm:p-7 bg-white relative ${
      variant === 'accent' ? 'border-gray-900 ring-1 ring-gray-900/5' :
      isPro ? 'border-gray-200 opacity-75' : 'border-gray-200'
    }`}>
      {badge && (
        <span className="absolute -top-2.5 right-4 bg-gray-400 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
          {badge}
        </span>
      )}
      <p className="text-sm font-semibold text-gray-900 mb-1">{name}</p>
      <p className="text-xs text-gray-500 mb-1">{note}</p>
      {subNote && (
        <p className="text-[11px] text-[#378ADD] font-semibold mb-4">{subNote}</p>
      )}
      {!subNote && <div className="mb-4" />}
      <p className="mb-1">
        <span className="text-3xl font-semibold text-gray-900 tracking-tight">{price}</span>
        <span className="text-xs text-gray-500 ml-1">{priceSuffix}</span>
      </p>
      {isPro ? (
        <span className="block text-center text-sm font-medium py-2.5 rounded-md mt-5 mb-6 bg-gray-100 text-gray-400 cursor-not-allowed select-none">
          {cta}
        </span>
      ) : (
        <Link
          href={ctaHref}
          className={`block text-center text-sm font-medium py-2.5 rounded-md mt-5 mb-6 transition-colors ${
            variant === 'accent'
              ? 'bg-gray-900 hover:bg-gray-700 text-white'
              : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
          }`}
        >
          {cta}
        </Link>
      )}
      <ul className="space-y-2 text-sm text-gray-700">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check size={14} className={`mt-0.5 shrink-0 ${isPro ? 'text-gray-300' : 'text-[#378ADD]'}`} strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ========================================
   実画面プレビュー(モック)
   ======================================== */

function DashboardPreview() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 px-4 py-2 flex items-center gap-2 bg-gray-50">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
        </div>
        <span className="text-[11px] text-gray-500 ml-3">reanker.com / dashboard</span>
      </div>

      <div className="flex min-h-[360px]">
        {/* Sidebar */}
        <div className="w-[180px] border-r border-gray-200 bg-gray-50/40 p-2 text-[11px]">
          <div className="px-2 py-1.5 rounded bg-[#378ADD]/10 text-[#378ADD] font-medium flex items-center gap-1.5 mb-3">
            <BarChart3 size={11} />
            ダッシュボード
          </div>
          <div className="px-2 py-1 text-gray-500 font-medium mb-1">アンカー</div>
          <div className="ml-2 space-y-0.5 mb-3">
            <p className="text-[9px] text-gray-400 px-1 mt-1">サービス名</p>
            <div className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded cursor-default">Salesforce</div>
            <div className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded cursor-default">kintone</div>
            <p className="text-[9px] text-gray-400 px-1 mt-1">キーワード</p>
            <div className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded cursor-default">AI受発注</div>
            <p className="text-[9px] text-gray-400 px-1 mt-1">ドメイン</p>
            <div className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded cursor-default">sansan.com</div>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="px-2 py-1 text-gray-600 flex items-center gap-1.5">
              <Plus size={10} />
              アンカー登録
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">ダッシュボード</p>
              <p className="text-[10px] text-gray-500 mt-0.5">過去7日間 · 24件の記事</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex border border-gray-200 rounded-md text-[10px] overflow-hidden">
                <span className="px-2 py-0.5 text-gray-600">今日</span>
                <span className="px-2 py-0.5 bg-gray-900 text-white">7日</span>
                <span className="px-2 py-0.5 text-gray-600">30日</span>
              </div>
            </div>
          </div>

          {/* Unread list */}
          <div className="bg-white border border-gray-200 rounded-md p-3 mb-3">
            <p className="text-[10px] text-gray-500 font-semibold mb-2">未読の新規記事</p>
            <div className="space-y-1.5">
              {[
                { kw: 'Salesforce', src: 'PR TIMES', title: 'Salesforce、生成AI機能「Agentforce」を国内提供開始', srcColor: 'bg-blue-50 text-blue-700' },
                { kw: 'kintone', src: 'PR TIMES', title: 'kintone、月間利用社数3万社を突破', srcColor: 'bg-blue-50 text-blue-700' },
                { kw: 'sansan.com', src: 'Google News', title: 'Sansan、名刺管理から営業DBプラットフォームへ', srcColor: 'bg-gray-100 text-gray-600' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px]">
                  <Circle size={5} className="fill-[#378ADD] text-[#378ADD] shrink-0" />
                  <span className="text-gray-500 w-16 truncate shrink-0">{r.kw}</span>
                  <span className={`text-[8px] px-1 py-0.5 rounded font-medium shrink-0 ${r.srcColor}`}>{r.src}</span>
                  <span className="text-gray-800 truncate">{r.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini chart */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-md p-3">
              <p className="text-[10px] text-gray-500 font-semibold mb-2">取得件数（曜日別）</p>
              <div className="flex items-end gap-1 h-16">
                {[40, 65, 50, 80, 70, 30, 25].map((h, i) => (
                  <div key={i} className="flex-1 bg-gray-100 rounded-t-sm relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-[#378ADD]" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[8px] text-gray-400 mt-1">
                <span>日</span><span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-3">
              <p className="text-[10px] text-gray-500 font-semibold mb-2">アンカー別件数</p>
              <table className="w-full text-[10px]">
                <tbody className="text-gray-700">
                  <tr><td className="py-0.5">Salesforce</td><td className="text-right text-[#378ADD] font-medium">8</td></tr>
                  <tr><td className="py-0.5">kintone</td><td className="text-right text-[#378ADD] font-medium">6</td></tr>
                  <tr><td className="py-0.5">AI受発注</td><td className="text-right text-[#378ADD] font-medium">4</td></tr>
                  <tr><td className="py-0.5">sansan.com</td><td className="text-right text-[#378ADD] font-medium">6</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnchorListPreview() {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white">
      <p className="text-[11px] text-gray-500 font-semibold mb-3">登録中のアンカー · 4件</p>
      <div className="space-y-2">
        {[
          { type: 'サービス名', name: 'Salesforce', q: 'Salesforce', sources: 'PR TIMES + Google News' },
          { type: 'サービス名', name: 'kintone', q: 'kintone', sources: 'PR TIMES + Google News' },
          { type: 'キーワード', name: 'AI受発注', q: 'AI受発注', sources: 'PR TIMES のみ' },
          { type: 'ドメイン', name: 'sansan.com', q: 'sansan.com', sources: 'Google News のみ' },
        ].map((a) => (
          <div key={a.name} className="border border-gray-200 rounded-md px-3.5 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">{a.type}</span>
                <span className="text-sm font-medium text-gray-900">{a.name}</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono">{a.q}</p>
            </div>
            <p className="text-[10px] text-gray-500 hidden sm:block">{a.sources}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ArticleListPreview() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="px-4 py-2.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <p className="text-xs font-semibold text-gray-900">Salesforce · 取得記事</p>
        <p className="text-[10px] text-gray-500">12件 / 未読 3</p>
      </div>
      <div className="divide-y divide-gray-100">
        {[
          { unread: true, src: 'PR TIMES', srcColor: 'bg-blue-50 text-blue-700', title: 'Salesforce、生成AI機能「Agentforce」を国内提供開始', date: '5/19' },
          { unread: true, src: 'Google News', srcColor: 'bg-gray-100 text-gray-600', title: 'セールスフォース・ジャパン、製造業向け新ソリューション発表', date: '5/19' },
          { unread: true, src: 'PR TIMES', srcColor: 'bg-blue-50 text-blue-700', title: 'Salesforce World Tour Tokyo 2026開催決定', date: '5/18' },
          { unread: false, src: 'Google News', srcColor: 'bg-gray-100 text-gray-600', title: 'セールスフォース決算、ARR前年比18%増', date: '5/17' },
          { unread: false, src: 'PR TIMES', srcColor: 'bg-blue-50 text-blue-700', title: '【参考】昨年実施イベントの記事', date: '5/15' },
        ].map((a, i) => (
          <div key={i} className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-1.5">
              {a.unread && <Circle size={6} className="fill-[#378ADD] text-[#378ADD]" />}
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ${a.srcColor}`}>{a.src}</span>
            <p className={`text-xs flex-1 truncate ${a.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{a.title}</p>
            <p className="text-[10px] text-gray-400 shrink-0">{a.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlackNotifyPreview() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Slack header */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
        <span className="text-xs text-gray-500"># 競合チェック</span>
        <span className="text-[10px] text-gray-400">· 5月20日 9:00</span>
      </div>
      <div className="p-4 text-xs">
        <div className="flex gap-2.5">
          <div className="w-8 h-8 bg-[#0a0a0a] rounded flex items-center justify-center shrink-0 text-white">
            <AnchorMark size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="font-semibold text-gray-900 text-[13px]">ReAnker</span>
              <span className="text-[10px] text-gray-400">APP</span>
              <span className="text-[10px] text-gray-400">9:00 AM</span>
            </div>
            <p className="text-gray-800 mb-1.5">
              <strong>【Reanker】Salesforce</strong>
            </p>
            <p className="text-gray-700 mb-2">昨日の新規リリース <strong className="text-gray-900">3件</strong></p>
            <ul className="space-y-1.5 text-gray-700">
              <li className="flex gap-1.5">
                <span className="text-gray-400">·</span>
                <div>
                  Salesforce、生成AI機能「Agentforce」を国内提供開始<br />
                  <a className="text-[#378ADD] text-[11px] hover:underline" href="#">https://prtimes.jp/main/html/rd/p/000000123.000000456.html</a>
                </div>
              </li>
              <li className="flex gap-1.5">
                <span className="text-gray-400">·</span>
                <div>
                  セールスフォース・ジャパン、製造業向け新ソリューション発表<br />
                  <a className="text-[#378ADD] text-[11px] hover:underline" href="#">https://news.google.com/articles/...</a>
                </div>
              </li>
              <li className="flex gap-1.5">
                <span className="text-gray-400">·</span>
                <div>
                  Salesforce World Tour Tokyo 2026開催決定<br />
                  <a className="text-[#378ADD] text-[11px] hover:underline" href="#">https://prtimes.jp/main/html/rd/p/000000789.000000456.html</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

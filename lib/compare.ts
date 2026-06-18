/**
 * 比較ページ用のデータ定義。
 * 8 ツール × 主要比較項目をここに集約し、/compare と /compare/[slug] で再利用する。
 *
 * 注意:
 *  - 競合製品の機能記述は公式公開情報・一般的に知られた事実ベースに留める
 *  - 「劣る/優れる」の主観的断定を避け、用途軸での差を示す
 */

export type CellValue = '○' | '△' | '×' | string

export interface ComparisonRow {
  key: string
  label: string
  /** ツールID → セル値 */
  values: Record<string, CellValue>
}

export interface CompareTool {
  id: string
  name: string
  shortName?: string
  /** ナビ・カードで使う1行説明 */
  oneLiner: string
}

export const TOOLS: CompareTool[] = [
  { id: 'reanker', name: 'ReAnker', oneLiner: 'PR TIMES・Google News＋他PR配信サイト特化、月額300円〜' },
  { id: 'google-alerts', name: 'Googleアラート', shortName: 'Googleアラート', oneLiner: '無料・全Web対象、シンプル' },
  { id: 'prtimes-clipping', name: 'PR TIMES Webクリッピング', shortName: 'PR TIMESクリッピング', oneLiner: 'PR TIMES 配信元の純正、約2,900媒体' },
  { id: 'google-news', name: 'Google ニュース検索', shortName: 'Googleニュース', oneLiner: '無料・手動巡回が前提' },
  { id: 'talkwalker', name: 'Talkwalker Alerts', oneLiner: '無料アラート（旧Googleアラート代替）' },
  { id: 'feedly', name: 'Feedly', oneLiner: 'RSS リーダー、情報収集向け' },
  { id: 'nikkei-telecom', name: '日経テレコン', oneLiner: '新聞・記事DB、法人プラン中心' },
  { id: 'clipping-agency', name: 'クリッピング代行サービス', shortName: 'クリッピング代行', oneLiner: '@クリッピング・ELNET 等、法人向け' },
]

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    key: 'prtimes',
    label: 'PR TIMES の監視',
    values: {
      reanker: '○',
      'google-alerts': '△',
      'prtimes-clipping': '○',
      'google-news': '△',
      talkwalker: '△',
      feedly: '△',
      'nikkei-telecom': '×',
      'clipping-agency': '○',
    },
  },
  {
    key: 'google-news',
    label: 'Google News の監視',
    values: {
      reanker: '○',
      'google-alerts': '○',
      'prtimes-clipping': '×',
      'google-news': '○',
      talkwalker: '○',
      feedly: '○',
      'nikkei-telecom': '×',
      'clipping-agency': '△',
    },
  },
  {
    key: 'other-prsites',
    label: '他のPR配信サイト監視（@Press 等）',
    values: {
      reanker: '○（Standard）',
      'google-alerts': '△',
      'prtimes-clipping': '×',
      'google-news': '△',
      talkwalker: '△',
      feedly: '△',
      'nikkei-telecom': '×',
      'clipping-agency': '○',
    },
  },
  {
    key: 'keyword',
    label: '競合キーワード/ドメインの登録',
    values: {
      reanker: '○（3軸）',
      'google-alerts': '○',
      'prtimes-clipping': '○（最大5）',
      'google-news': '△（毎回手動）',
      talkwalker: '○',
      feedly: '○',
      'nikkei-telecom': '○',
      'clipping-agency': '○',
    },
  },
  {
    key: 'slack',
    label: 'Slack 通知',
    values: {
      reanker: '○',
      'google-alerts': '△（RSS 経由で要設定）',
      'prtimes-clipping': '○',
      'google-news': '×',
      talkwalker: '×',
      feedly: '○（連携アプリ）',
      'nikkei-telecom': '×',
      'clipping-agency': '△（要相談）',
    },
  },
  {
    key: 'email',
    label: 'メール通知',
    values: {
      reanker: '○',
      'google-alerts': '○',
      'prtimes-clipping': '○',
      'google-news': '×',
      talkwalker: '○',
      feedly: '○',
      'nikkei-telecom': '○',
      'clipping-agency': '○',
    },
  },
  {
    key: 'daily',
    label: '毎日の自動チェック',
    values: {
      reanker: '○',
      'google-alerts': '○',
      'prtimes-clipping': '○',
      'google-news': '×',
      talkwalker: '○',
      feedly: '○',
      'nikkei-telecom': '○',
      'clipping-agency': '○',
    },
  },
  {
    key: 'read-status',
    label: '既読 / 未読 / クリップ管理',
    values: {
      reanker: '○',
      'google-alerts': '×',
      'prtimes-clipping': '△',
      'google-news': '×',
      talkwalker: '×',
      feedly: '○',
      'nikkei-telecom': '△',
      'clipping-agency': '△',
    },
  },
  {
    key: 'dashboard',
    label: 'ダッシュボード集計',
    values: {
      reanker: '○',
      'google-alerts': '×',
      'prtimes-clipping': '○',
      'google-news': '×',
      talkwalker: '△',
      feedly: '△',
      'nikkei-telecom': '○',
      'clipping-agency': '○',
    },
  },
  {
    key: 'small-team',
    label: '個人・小規模チーム向け',
    values: {
      reanker: '○',
      'google-alerts': '○',
      'prtimes-clipping': '△',
      'google-news': '○',
      talkwalker: '○',
      feedly: '○',
      'nikkei-telecom': '×',
      'clipping-agency': '×',
    },
  },
  {
    key: 'monthly-price',
    label: '月額料金',
    values: {
      reanker: '¥0 / ¥300（税抜）',
      'google-alerts': '無料',
      'prtimes-clipping': '¥5,500〜',
      'google-news': '無料',
      talkwalker: '無料',
      feedly: '無料〜$6/月〜',
      'nikkei-telecom': '要問合せ（数万円〜）',
      'clipping-agency': '数万円〜',
    },
  },
  {
    key: 'initial-cost',
    label: '初期費用',
    values: {
      reanker: '無料',
      'google-alerts': '無料',
      'prtimes-clipping': '無料',
      'google-news': '無料',
      talkwalker: '無料',
      feedly: '無料',
      'nikkei-telecom': '要問合せ',
      'clipping-agency': '要問合せ',
    },
  },
  {
    key: 'no-cc',
    label: 'クレカ登録不要の無料利用',
    values: {
      reanker: '○',
      'google-alerts': '○',
      'prtimes-clipping': '×',
      'google-news': '○',
      talkwalker: '○',
      feedly: '○',
      'nikkei-telecom': '×',
      'clipping-agency': '×',
    },
  },
]

/** ReAnker の優位ポイント（複数ページで再利用） */
export const REANKER_ADVANTAGES = [
  'PR TIMES と Google News を1ツールでまとめて監視できる',
  '毎朝9時に「前日の新規記事だけ」をまとめて通知',
  'Slack・メールの両方に対応',
  '月額300円（税抜）から、無料プランも用意',
  '個人事業主・小規模チームでも導入しやすい',
  '競合・キーワード・ドメインの3軸で登録できる',
]

/** 個別比較ページのコンテンツ */
export interface IndividualCompare {
  slug: string
  competitorId: string
  pageTitle: string
  metaDescription: string
  h1: string
  introHtml: string
  /** ReAnker 向き */
  reankerSuits: string[]
  /** 競合向き */
  competitorSuits: string[]
  /** 主な違い（3〜5項目） */
  keyDifferences: { axis: string; reanker: string; competitor: string }[]
  /** 末尾の関連記事 slugs */
  relatedBlogs?: string[]
}

export const INDIVIDUAL_COMPARES: Record<string, IndividualCompare> = {
  'google-alerts': {
    slug: 'google-alerts',
    competitorId: 'google-alerts',
    pageTitle: 'ReAnkerとGoogleアラートの違い｜競合プレスリリース監視に向いているのは？',
    metaDescription:
      'Googleアラートは無料で便利な反面、競合のプレスリリース管理には弱点があります。ReAnkerとの違いを実務目線で整理しました。',
    h1: 'ReAnker と Googleアラート、競合プレスリリース監視に向いているのは？',
    introHtml:
      '<p>Googleアラートは無料で誰でも使える便利なツールです。一方で、競合のプレスリリースをきっちり追いたいシーンでは、配信時刻が読めなかったり、ノイズが多くてSlackで埋もれる、といった限界が見えてきます。このページでは、ReAnker と Googleアラートを用途別に整理します。</p>',
    reankerSuits: [
      '競合の PR TIMES リリースを毎朝9時にまとめて確認したい',
      'Slack のチャンネルに整然と通知したい',
      '既読/未読/クリップで運用したい',
      '記事をカテゴリ別に集計してレポート化したい',
    ],
    competitorSuits: [
      '完全無料で済ませたい',
      'PR TIMES に限らず、ブログ・SNS 含めて広く拾いたい',
      'ノイズが多くてもいいので、検索インデックス全体を浴びたい',
    ],
    keyDifferences: [
      {
        axis: '配信タイミング',
        reanker: '毎朝9時 JST 固定（前日分をまとめて）',
        competitor: 'その都度 / 1日1回 / 週次から選択（時刻は不定）',
      },
      {
        axis: 'PR TIMES の取得精度',
        reanker: 'PR TIMES の検索結果ページを直接巡回',
        competitor: 'Googleがインデックスしたタイミングに依存（遅延あり）',
      },
      {
        axis: 'ノイズフィルタ',
        reanker: 'PR TIMES + Google News に絞り、既読・削除でさらにクリーン化',
        competitor: 'ブログや関連記事を含め多めに通知される',
      },
      {
        axis: '管理機能',
        reanker: 'ダッシュボード、既読/未読、クリップ、削除、エクスポート',
        competitor: '通知を流すのみ。集計・既読管理は別ツール任せ',
      },
      {
        axis: '料金',
        reanker: '無料プラン or 月額300円（税抜）',
        competitor: '完全無料',
      },
    ],
    relatedBlogs: ['google-alerts-competitor-limits', 'slack-press-release-auto-notify'],
  },
  'prtimes-web-clipping': {
    slug: 'prtimes-web-clipping',
    competitorId: 'prtimes-clipping',
    pageTitle: 'ReAnkerとPR TIMES Webクリッピングの違い｜小規模チーム向けの競合監視なら？',
    metaDescription:
      'PR TIMES Webクリッピングは法人広報向けの純正ツール。個人や小規模チームには ReAnker が現実的な選択肢になります。違いを整理しました。',
    h1: 'ReAnker と PR TIMES Webクリッピング、どちらを選ぶべきか？',
    introHtml:
      '<p>PR TIMES Webクリッピングは、PR TIMES 社が提供する純正のクリッピングサービスです。一方 ReAnker は、PR TIMES + Google News に用途を絞り、月額300円（税抜）から個人・小規模チームでも使えるようにしたツールです。どちらが向いているかは、必要な網羅性と予算で変わります。</p>',
    reankerSuits: [
      '監視対象が3〜10社で、PR TIMES + Google News で十分',
      '月額の固定費を最小化したい個人 / フリーランス / 小規模チーム',
      'Slackチャンネルに毎朝まとめて流したい',
      'クレジットカードで自分で契約・解約したい',
    ],
    competitorSuits: [
      '法人広報として、約2,900媒体を網羅的にカバーしたい',
      '5キーワードでも問題ない、もしくは追加で増やす予算がある',
      '請求書払い、年間契約に対応できる',
    ],
    keyDifferences: [
      {
        axis: '監視対象メディア',
        reanker: 'PR TIMES + Google News（BtoB の主要ソース）',
        competitor: 'PR TIMES 経由 約2,900媒体',
      },
      {
        axis: '料金',
        reanker: '月額300円（税抜）/ 無料プランあり',
        competitor: '月額5,500円〜（5キーワード）',
      },
      {
        axis: '契約・解約',
        reanker: 'Stripe でカード自動更新、いつでも解約',
        competitor: '月単位の継続/停止、PR TIMES 管理画面から操作',
      },
      {
        axis: 'キーワード上限',
        reanker: 'スタンダードプランは無制限',
        competitor: 'プランの上限あり',
      },
      {
        axis: 'ターゲット',
        reanker: '個人・小規模チーム・スタートアップ広報',
        competitor: '法人広報（中堅〜大企業）',
      },
    ],
    relatedBlogs: ['prtimes-webclipping-alternative', 'prtimes-webclipping-price-detail'],
  },
  'news-clipping-services': {
    slug: 'news-clipping-services',
    competitorId: 'clipping-agency',
    pageTitle: 'ReAnkerとクリッピングサービスの違い｜競合ニュース監視を低コストで始める方法',
    metaDescription:
      '@クリッピング・ELNET 等の大手クリッピングサービスと ReAnker の違いを整理。月数万円〜の法人プランと月額300円のセルフサーブを比較します。',
    h1: 'クリッピングサービスと ReAnker、競合ニュース監視を低コストで始めるなら？',
    introHtml:
      '<p>@クリッピング、ELNET、日経スマートクリップ、ジャパン通信社など、いわゆる「クリッピングサービス」は、新聞・雑誌・Web・SNS を横断する法人向けの強力なサービスです。一方、ReAnker は対象を「PR TIMES + Google News」に絞り、個人・小規模チームでも月額300円（税抜）で運用できる軽量ツールです。</p>',
    reankerSuits: [
      '監視対象は競合企業の Web リリースで十分',
      '個人・フリーランス・スタートアップなど、年間予算が小さい',
      '社内稟議を通さずに、自分のクレカで即契約・即解約したい',
      'Slack・メール通知でチームに即共有したい',
    ],
    competitorSuits: [
      '新聞・雑誌・TV まで含めて漏れなく把握したい中堅以上の法人広報',
      '専門スタッフによる目視併用、運用コンサル込みのサポートが必要',
      '月数万円〜十数万円の予算が確保できる',
    ],
    keyDifferences: [
      {
        axis: '対象媒体',
        reanker: 'PR TIMES + Google News',
        competitor: '新聞約100紙・雑誌約30誌・Web約1,500サイト・TV / SNS（プラン依存）',
      },
      {
        axis: '料金',
        reanker: '月額300円（税抜）/ 無料プランあり',
        competitor: '月3〜10万円〜（年間契約が一般的）',
      },
      {
        axis: '契約形態',
        reanker: 'クレカ決済、月単位の継続・即解約',
        competitor: '法人契約・年間契約・与信審査が前提',
      },
      {
        axis: '導入スピード',
        reanker: 'Googleログインで30秒',
        competitor: '見積〜契約〜運用開始まで1〜数ヶ月',
      },
    ],
    relatedBlogs: ['elnet-personal-alternative', 'clipping-service-pricing-comparison'],
  },
  feedly: {
    slug: 'feedly',
    competitorId: 'feedly',
    pageTitle: 'ReAnkerとFeedlyの違い｜競合ニュースを自動通知するなら？',
    metaDescription:
      'Feedly は RSS リーダーの定番。一方 ReAnker は競合キーワード単位で PR TIMES・Google News を毎朝まとめて通知する用途に特化しています。',
    h1: 'ReAnker と Feedly、競合ニュース監視で使い分けるなら？',
    introHtml:
      '<p>Feedly は「自分が読みたいサイトのRSSをまとめる」用途に強い、定番の情報収集ツールです。一方 ReAnker は「競合キーワードで PR TIMES と Google News を毎朝チェックし、Slack/メールに通知する」用途に絞っています。両者の役割分担を整理します。</p>',
    reankerSuits: [
      'キーワードで競合リリースを追いたい（RSS が無いソースを含む）',
      '毎朝9時に「前日分のまとめ」が欲しい',
      'Slack 通知をデフォルトで使いたい',
      '既読・未読・クリップで運用したい',
    ],
    competitorSuits: [
      'お気に入りメディアの RSS をリーダー形式で消費したい',
      'AI による要約・トピック分類などの編集機能を使いたい',
      '英語圏のメディアまで広く拾いたい',
    ],
    keyDifferences: [
      {
        axis: '基本コンセプト',
        reanker: '競合キーワード × PR TIMES + Google News の通知',
        competitor: 'RSS / Atom フィードのリーダー',
      },
      {
        axis: '取得元',
        reanker: 'PR TIMES 検索結果 + Google News',
        competitor: 'ユーザーが追加した任意の RSS / フィード',
      },
      {
        axis: '通知',
        reanker: '毎朝9時に Slack / メールへ集約',
        competitor: 'リーダー画面で読む（メール通知は別途）',
      },
      {
        axis: '料金',
        reanker: '無料 / 月額300円（税抜）',
        competitor: '無料プラン / Pro $6〜/月〜',
      },
    ],
    relatedBlogs: ['slack-press-release-auto-notify', 'prtimes-and-google-news-monitoring'],
  },
}

export function listCompareSlugs(): string[] {
  return Object.keys(INDIVIDUAL_COMPARES)
}

/** トップFAQ / 比較ページFAQ の共通定義 */
export interface FAQItem {
  q: string
  a: string
}

export const FAQS_FOR_COMPARE: FAQItem[] = [
  {
    q: 'Googleアラートとの違いは何ですか？',
    a: 'Googleアラートは検索インデックスをベースに通知するため、配信タイミングが不定でノイズも多めです。ReAnker は PR TIMES と Google News に絞り、毎朝9時に前日分だけをまとめて Slack / メールへ配信します。既読・未読・クリップで運用できるのも違いです。',
  },
  {
    q: 'PR TIMES Webクリッピングとの違いは何ですか？',
    a: 'PR TIMES Webクリッピングは月額5,500円〜の法人広報向けサービスで、約2,900媒体を網羅します。ReAnker は PR TIMES + Google News に用途を絞った月額300円（税抜）のセルフサーブツールで、個人・小規模チームが導入しやすい構成です。',
  },
  {
    q: '競合のプレスリリースを自動で監視できますか？',
    a: 'はい。サービス名・キーワード・ドメインの3軸で監視対象（アンカー）を登録すると、毎日 PR TIMES の検索結果から新着リリースを取得し、翌朝9時に Slack やメールへ通知します。',
  },
  {
    q: 'Google News も監視できますか？',
    a: 'はい。同じアンカー登録で PR TIMES と Google News の両方をまとめて監視できます。アンカー設定でソースを選べます。',
  },
  {
    q: 'Slack に通知できますか？',
    a: 'はい。Slack の Incoming Webhook URL を設定するだけで、指定チャンネルに毎朝9時の集約通知が届きます。Standard プランで利用可能です。',
  },
  {
    q: '無料プランでは何ができますか？',
    a: 'アンカー3件まで・週3回（月・水・金）の取得・メール通知・記事一覧/既読/クリップ管理が利用できます。クレジットカード登録は不要です。',
  },
  {
    q: '個人でも利用できますか？',
    a: 'はい。Googleログインで30秒で開始でき、Stripe 経由でクレジットカード決済します。個人・フリーランス・小規模チームを主な想定としています。',
  },
  {
    q: '法人の経費精算に使えますか？',
    a: 'はい。設定画面の「請求履歴を見る」から Stripe のカスタマーポータルにアクセスし、月次の請求書 PDF をダウンロードできます。',
  },
  {
    q: '登録した翌日から通知されますか？',
    a: 'アンカー登録後、翌朝9時のサイクルから通知が始まります（warmup 仕様）。当日にバックログがまとめて飛んで埋もれる事故を防ぐためです。',
  },
  {
    q: 'どんなキーワードを登録すればよいですか？',
    a: '競合企業のサービス名（例：Salesforce）、業界トピック（例：AI受発注）、ドメイン名（例：sansan.com）など。3軸を組み合わせると見落としが減ります。',
  },
]

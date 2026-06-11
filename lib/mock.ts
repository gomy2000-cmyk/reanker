import type { User, PickKeyword, ItemWithKeyword, Source } from './types'

// /demo 専用のサンプルデータ。
// 実データに近い見た目になるよう、直近30日に分散した記事を手書きで用意している。

export const mockUser: User = {
  id: 'demo-user',
  google_id: 'demo',
  email: 'demo@reanker.com',
  name: 'デモユーザー',
  plan: 'standard',
  slack_webhook_url: null,
  notify_email: null,
  stripe_customer_id: null,
  stripe_subscription_id: null,
  created_at: new Date().toISOString(),
}

export const mockKeywords: PickKeyword[] = [
  { id: 'kw1', user_id: 'demo-user', name: 'Salesforce', type: 'service', query_value: 'Salesforce', sources: ['prtimes', 'googlenews'], notify_slack: true, notify_email: false, warmup_until: new Date().toISOString(), created_at: '' },
  { id: 'kw2', user_id: 'demo-user', name: 'kintone', type: 'service', query_value: 'kintone', sources: ['prtimes', 'googlenews'], notify_slack: true, notify_email: true, warmup_until: new Date().toISOString(), created_at: '' },
  { id: 'kw3', user_id: 'demo-user', name: 'AI受発注', type: 'keyword', query_value: 'AI受発注', sources: ['prtimes'], notify_slack: true, notify_email: false, warmup_until: new Date().toISOString(), created_at: '' },
  { id: 'kw4', user_id: 'demo-user', name: 'sansan.com', type: 'domain', query_value: 'sansan.com', sources: ['googlenews'], notify_slack: false, notify_email: true, warmup_until: new Date().toISOString(), created_at: '' },
]

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

// [kwId, source, daysAgo, hour, title, category, importance, read, clip, summary]
type Row = [string, Source, number, number, string, string, string, 0 | 1, 0 | 1, string]

const rows: Row[] = [
  // ── Salesforce ──────────────────────────────────────────────
  ['kw1', 'prtimes', 0, 10, 'Salesforce、Agentforce 3.0を発表 自律型AIエージェントが商談メモを自動生成', '新製品・新機能', '高', 0, 0,
    '自律型AIエージェント基盤の最新版を発表。商談メモの自動生成やフォローアップ提案など、営業担当者の事務作業を大幅に削減する機能が追加された。'],
  ['kw1', 'googlenews', 0, 14, '生成AI活用の最前線 セールスフォースが語る「営業DXの次の一手」', '調査・レポート', '中', 0, 0,
    '国内企業の生成AI活用状況と営業部門での実践例を紹介。データ基盤の整備が成果を分けるポイントだと指摘している。'],
  ['kw1', 'prtimes', 1, 11, 'Salesforce、中堅企業向け「Starter Suite」を強化 月額3,000円から', '新製品・新機能', '高', 0, 0,
    '中堅・中小企業向けのオールインワンCRMを刷新。セットアップの簡素化と低価格プランで、これまで未開拓だった企業層の取り込みを狙う。'],
  ['kw1', 'prtimes', 2, 13, '【導入事例】地方銀行がSalesforceで法人営業を刷新、商談化率1.8倍に', '導入事例', '中', 0, 1,
    '地方銀行が法人営業の案件管理をSalesforceに統合。訪問記録のデータ化により商談化率が1.8倍に向上した事例を公開。'],
  ['kw1', 'googlenews', 3, 15, 'セールスフォース・ジャパン、パートナー企業向け認定制度を刷新', '提携・協業', '低', 1, 0,
    'パートナー認定制度を改定し、AI関連の実装スキルを評価軸に追加。エコシステム全体でのAI対応力強化を進める。'],
  ['kw1', 'prtimes', 5, 9, 'Salesforce World Tour Tokyo 2026、6月開催決定 基調講演にCEO登壇', 'イベント', '中', 1, 1,
    '年次イベントの開催が決定。基調講演ではグローバルCEOが登壇し、Agentforceの国内ロードマップを発表する予定。'],
  ['kw1', 'prtimes', 7, 12, 'SlackとSalesforceの連携強化、商談アラートをチャンネルに自動配信', '新製品・新機能', '高', 1, 0,
    '商談ステータスの変化をSlackチャンネルへリアルタイム配信する新機能。営業チームの情報共有のタイムラグ解消を狙う。'],
  ['kw1', 'googlenews', 9, 8, '国内CRM市場シェア調査、Salesforceが12年連続首位', '調査・レポート', '中', 1, 0,
    '調査会社による国内CRM市場レポート。Salesforceがシェア首位を維持する一方、国産ツールの追い上げも指摘されている。'],
  ['kw1', 'googlenews', 12, 16, 'Salesforce、医療業界向けソリューションで地域医療DXを支援', '導入事例', '低', 1, 0,
    '地域医療連携ネットワークでの活用事例。患者情報の共有基盤として導入され、紹介状のやり取りが電子化された。'],
  ['kw1', 'prtimes', 15, 10, 'セールスフォース、国内データセンターを増強 生成AI需要に対応', '経営・人事', '高', 1, 1,
    '生成AI機能の国内データ処理需要に対応するため、データセンター容量を増強。金融・公共分野の規制要件にも対応する。'],
  ['kw1', 'googlenews', 18, 14, '製造業のサービタイゼーション、Salesforce活用企業の事例に学ぶ', '導入事例', '低', 1, 0,
    '製造業がモノ売りからコト売りへ転換する際のCRM活用法を解説。保守契約の更新率改善などの実例を取り上げている。'],
  ['kw1', 'prtimes', 21, 11, 'Salesforce、年次調査「State of Sales」第7版を公開', '調査・レポート', '中', 1, 0,
    '世界の営業担当者5,500人への調査結果。営業時間のうち顧客対応に使えているのは3割未満という課題が浮き彫りに。'],
  ['kw1', 'googlenews', 25, 9, 'セールスフォース・ジャパン、新社長就任を発表', '経営・人事', '高', 1, 0,
    '日本法人の新社長就任を発表。エンタープライズ領域の拡大とAI製品群の国内展開加速をミッションに掲げる。'],
  ['kw1', 'prtimes', 28, 13, 'TableauとAgentforceの統合で「会話するダッシュボード」実現へ', '新製品・新機能', '中', 1, 0,
    'BIツールTableauにAIエージェントを統合。自然言語での質問にダッシュボードが回答する新しい分析体験を提供する。'],

  // ── kintone ─────────────────────────────────────────────────
  ['kw2', 'prtimes', 0, 10, 'kintone、AIアシスタント機能をベータ提供開始 アプリ作成を対話で支援', '新製品・新機能', '高', 0, 0,
    '「こんな業務アプリが欲しい」と入力するとフォームやプロセスを自動生成するAIアシスタントのベータ版を公開。'],
  ['kw2', 'prtimes', 1, 13, 'サイボウズ、kintone月間利用社数が3.5万社を突破', '経営・人事', '高', 0, 0,
    'kintoneの月間利用社数が3.5万社を突破。非IT部門による内製開発の広がりが成長を牽引していると分析。'],
  ['kw2', 'googlenews', 1, 15, '【自治体DX】窓口業務をkintoneで電子化、申請処理を6割短縮', '導入事例', '中', 0, 0,
    '人口10万人規模の自治体が窓口申請をkintoneで電子化。紙の往復がなくなり、処理時間を6割短縮した。'],
  ['kw2', 'prtimes', 2, 11, 'kintone hive 2026、全国6都市で開催 事例登壇企業の募集開始', 'イベント', '中', 0, 0,
    'ユーザー事例イベント「kintone hive」の開催が決定。今年は全国6都市で実施し、登壇企業の公募を開始した。'],
  ['kw2', 'googlenews', 4, 17, 'プラグイン開発各社、kintone新ストアへの対応を表明', '提携・協業', '低', 1, 0,
    '新しいプラグインストアの公開を受け、主要な開発ベンダー各社が対応方針を発表。課金体系の変更が焦点に。'],
  ['kw2', 'googlenews', 6, 14, '建設業のDX、現場帳票のkintone化で月40時間の残業削減', '導入事例', '中', 1, 1,
    '中堅建設会社が紙の現場帳票をkintoneアプリに置き換え。事務所への持ち帰り作業がなくなり残業を大幅削減。'],
  ['kw2', 'prtimes', 8, 12, 'サイボウズ、kintone APIのレート制限を緩和 大規模連携を後押し', '新製品・新機能', '中', 1, 0,
    'APIリクエストの上限を引き上げ、基幹システムとの大規模データ連携を想定したアーキテクチャ変更を実施。'],
  ['kw2', 'prtimes', 11, 10, 'kintone×生成AI連携プラグイン、リリースから3カ月で導入500社', '新製品・新機能', '高', 1, 0,
    'レコード内容をAIが要約・分類するプラグインが3カ月で500社に導入。問い合わせ管理での利用が最多という。'],
  ['kw2', 'googlenews', 14, 9, '非IT部門でも作れる業務アプリ、kintoneが中小企業に広がる理由', '調査・レポート', '低', 1, 0,
    'ノーコード開発ツールの中小企業への浸透を分析した記事。現場主導の改善サイクルが定着の鍵と解説。'],
  ['kw2', 'prtimes', 17, 11, 'サイボウズ、kintoneの新料金プランを発表 ライトコース刷新', '経営・人事', '高', 1, 1,
    '料金体系を改定し、小規模チーム向けのライトコースを刷新。既存ユーザーの移行スケジュールも公開された。'],
  ['kw2', 'googlenews', 20, 18, '【イベントレポート】kintone devCamp 2026春、開発者600人が参加', 'イベント', '低', 1, 0,
    '開発者向けイベントのレポート。プラグイン開発のハンズオンやAPI活用事例のセッションが盛況だった。'],
  ['kw2', 'prtimes', 23, 13, 'kintone、ISMAP登録を更新 政府調達要件に継続対応', 'その他', '中', 1, 0,
    '政府情報システムのセキュリティ評価制度ISMAPの登録を更新。公共分野での採用拡大を継続して狙う。'],
  ['kw2', 'prtimes', 26, 15, '人材業界向けkintoneテンプレート、求職者管理を一元化', '新製品・新機能', '低', 1, 0,
    '人材紹介会社向けの業務テンプレートを公開。求職者・求人・マッチング進捗を1つのアプリ群で管理できる。'],
  ['kw2', 'googlenews', 29, 10, 'サイボウズ青野氏が語る「業務アプリの民主化」これからの10年', '調査・レポート', '中', 1, 0,
    'サイボウズ社長へのインタビュー記事。現場の業務改善を現場自身が担う「民主化」の次の展望を語った。'],

  // ── AI受発注 ────────────────────────────────────────────────
  ['kw3', 'prtimes', 0, 9, 'AI受発注クラウド「OrderFlow」、FAX注文書の自動データ化精度99%を達成', '新製品・新機能', '高', 0, 0,
    'FAXで届く手書き注文書をAI-OCRでデータ化する精度が99%に到達。目視チェック工程の廃止が視野に入った。'],
  ['kw3', 'prtimes', 2, 11, '食品卸向けAI受発注システム、導入企業が前年比3倍に', '経営・人事', '中', 0, 0,
    '食品卸業界に特化したAI受発注サービスの導入社数が前年比3倍に拡大。人手不足が追い風になっている。'],
  ['kw3', 'prtimes', 5, 10, 'AI受発注スタートアップ、シリーズBで12億円を調達', '資金調達', '高', 1, 1,
    '受発注業務の自動化SaaSを手がけるスタートアップが12億円を調達。営業体制の強化と多言語対応に投資する。'],
  ['kw3', 'prtimes', 9, 14, '【導入事例】老舗酒販店がAI受発注で属人化を解消、欠品率を半減', '導入事例', '中', 1, 0,
    'ベテラン担当者の頭の中にあった発注ノウハウをAIが学習。担当者不在時の欠品率が半分以下に改善した。'],
  ['kw3', 'prtimes', 13, 13, 'AI受発注システム導入で受注処理時間を80%削減 製造業の実証結果', '導入事例', '中', 1, 0,
    '部品メーカーでの実証実験の結果を公開。電話・FAX・メールに分散していた受注処理の時間を80%削減した。'],
  ['kw3', 'prtimes', 17, 12, '電話注文をAIが自動テキスト化、受発注DXの新サービス開始', '新製品・新機能', '中', 1, 0,
    '電話での注文内容を音声認識でテキスト化し、受注データとして自動登録する新サービスの提供を開始。'],
  ['kw3', 'prtimes', 22, 10, 'AI受発注市場、2030年に1,200億円規模へ 調査レポート公開', '調査・レポート', '低', 1, 0,
    '市場調査レポートによると、AI受発注関連市場は年率20%超で成長し、2030年に1,200億円規模に達する見込み。'],
  ['kw3', 'prtimes', 27, 16, '受発注業務のペーパーレス化セミナー、AI活用事例を紹介', 'イベント', '低', 1, 0,
    '卸・小売業向けのオンラインセミナーを開催。AI-OCRと自動発注の組み合わせによる実例を紹介する。'],

  // ── sansan.com ──────────────────────────────────────────────
  ['kw4', 'googlenews', 0, 8, 'Sansan、営業DBプラットフォーム構想を発表 名刺管理の先へ', '経営・人事', '高', 0, 0,
    '名刺管理で蓄積した企業データを軸に、営業データベースプラットフォームへの進化を打ち出した戦略発表。'],
  ['kw4', 'googlenews', 1, 15, 'Sansan決算、ARR前年比25%増 インボイス管理「Bill One」が牽引', '経営・人事', '高', 0, 0,
    '四半期決算を発表。ARRは前年比25%増で、請求書受領サービスBill Oneの成長が全体を牽引した。'],
  ['kw4', 'googlenews', 3, 11, 'Sansan、契約データベース「Contract One」にAI条文チェック機能', '新製品・新機能', '中', 1, 0,
    '契約書管理サービスにAIによる条文チェック機能を追加。リスク条項の検出を自動化し法務部門を支援する。'],
  ['kw4', 'googlenews', 6, 13, '「出会いからイノベーションを」Sansan、地方創生プロジェクト始動', 'その他', '低', 1, 0,
    '自治体と連携した地方創生プロジェクトを開始。地域企業の人脈データ活用による販路開拓を支援する。'],
  ['kw4', 'googlenews', 10, 9, 'Bill One、月間請求書処理枚数が1,000万枚を突破', '経営・人事', '中', 1, 1,
    '請求書受領サービスBill Oneの月間処理枚数が1,000万枚を突破。インボイス制度対応の需要が継続している。'],
  ['kw4', 'googlenews', 14, 16, 'Sansan、研究開発拠点を関西に新設 データ化技術を強化', '経営・人事', '中', 1, 0,
    '関西に新たな研究開発拠点を開設。画像認識とLLMを組み合わせたデータ化技術の研究体制を強化する。'],
  ['kw4', 'googlenews', 19, 12, 'Sansan Evolution Week 2026開催、ビジネスインフラの未来を議論', 'イベント', '低', 1, 0,
    '年次カンファレンスの開催を発表。営業DX・経理DX・契約DXの3トラックで事例セッションを実施する。'],
  ['kw4', 'googlenews', 24, 10, 'Sansanの名刺データ化、99.9%の精度を支える技術とは', '調査・レポート', '低', 1, 0,
    '名刺データ化の精度を支えるAIと人力のハイブリッド体制を解説した技術記事。'],
  ['kw4', 'googlenews', 29, 14, 'Sansan、海外展開を加速 シンガポール拠点を増強', '経営・人事', '中', 1, 0,
    'アジア展開の中核となるシンガポール拠点の人員を倍増。現地企業のデータ整備需要を取り込む。'],
]

export const mockItems: ItemWithKeyword[] = rows
  .map(([kwId, source, days, hour, title, category, importance, read, clip, summary], i) => {
    const kw = mockKeywords.find((k) => k.id === kwId)!
    return {
      id: `item-${i}`,
      pickkw_id: kwId,
      source,
      title,
      url: source === 'prtimes' ? 'https://prtimes.jp/' : 'https://news.google.com/',
      summary,
      published_at: daysAgo(days),
      published_hour: hour,
      is_read: read === 1,
      is_clipped: clip === 1,
      notified: true,
      deleted_at: null,
      category,
      importance,
      ai_summary: summary,
      importance_reason: null,
      created_at: '',
      pick_keywords: kw,
    }
  })
  .sort((a, b) => (a.published_at === b.published_at ? (b.published_hour ?? 0) - (a.published_hour ?? 0) : a.published_at < b.published_at ? 1 : -1))

// 「今すぐ取得」シミュレーション用。アンカーごとに1回だけ新着として注入する。
export interface MockFetchSeed {
  title: string
  source: Source
  category: string
  importance: string
  summary: string
}

export const mockFetchPool: Record<string, MockFetchSeed[]> = {
  kw1: [
    { title: '【速報】Agentforce、日本語の音声対応を年内提供へ', source: 'prtimes', category: '新製品・新機能', importance: '高', summary: 'AIエージェントの日本語音声対応を年内に提供すると発表。電話応対業務の自動化ユースケースを想定する。' },
    { title: 'Salesforce、Data Cloudの無償利用枠を拡大', source: 'googlenews', category: '新製品・新機能', importance: '中', summary: '顧客データ基盤Data Cloudの無償枠を拡大。まずデータを統合してもらい、AI活用へ繋げる戦略とみられる。' },
  ],
  kw2: [
    { title: 'kintone、モバイルアプリを全面刷新 オフライン入力に対応', source: 'prtimes', category: '新製品・新機能', importance: '高', summary: 'モバイルアプリをリニューアル。電波の届かない現場でも入力できるオフラインモードが追加された。' },
    { title: 'サイボウズ、教育機関向け無償プログラムを拡充', source: 'googlenews', category: 'その他', importance: '低', summary: '大学・専門学校向けの無償提供プログラムを拡充。情報系学部での教材採用が進んでいる。' },
  ],
  kw3: [
    { title: 'AI受発注「うけとりくん」、LINE経由の注文に対応', source: 'prtimes', category: '新製品・新機能', importance: '中', summary: '飲食店向けAI受発注サービスがLINEからの注文取り込みに対応。FAX・電話に続く第3のチャネルとなる。' },
  ],
  kw4: [
    { title: 'Sansan、名刺アプリ「Eight」にキャリア機能を追加', source: 'googlenews', category: '新製品・新機能', importance: '中', summary: '個人向け名刺アプリEightに転職・キャリア関連の新機能を追加。ビジネスSNSとしての色を強める。' },
  ],
}

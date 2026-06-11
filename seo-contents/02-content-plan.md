# Step 2｜記事企画一覧（competitor-monitoring 新規18本）

Step 1 のKW設計を、執筆可能な単位に落とした企画書。各記事の `slug` / タイトル / 主KW / meta（description・ogTitle）/ tags / 内部リンク / 想定文字数 / 公開予定日を定義する。
すべて `category: "competitor-monitoring"`。アウトライン詳細は [`03-outlines/<slug>.md`](./03-outlines/) を参照。

## 公開スケジュール（P1先行 → P2 → P3、3日間隔）

| # | 公開予定日 | slug | タイトル案 | 主KW | 意図 | 想定文字数 | 優先 |
|---|---|---|---|---|---|---|---|
| 1 | 2026-07-01 | `competitor-sns-monitoring` | 競合のSNS（X・LinkedIn）を監視する方法｜BtoBの実務ガイド | 競合 SNS 監視 | Do | 3,200 | P1 |
| 2 | 2026-07-04 | `competitor-website-change-monitoring` | 競合サイト・LPの更新を自動検知する方法｜変更監視ツールと運用 | 競合サイト 更新 監視 | Do | 3,200 | P1 |
| 3 | 2026-07-07 | `competitor-monitoring-with-rss-feedly` | RSS・Feedlyで競合監視を組む実務ガイド｜設定から運用まで | Feedly 競合監視 | Do | 3,000 | P1 |
| 4 | 2026-07-10 | `nocode-competitor-monitoring-zapier` | Zapier・Makeで競合監視を自動化する方法｜ノーコード連携レシピ | Zapier 競合監視 | Do | 3,000 | P1 |
| 5 | 2026-07-13 | `competitor-hiring-monitoring` | 競合の採用・求人動向から戦略を読む方法｜BtoB企業の競合監視 | 競合 採用 動向 | Know | 3,000 | P1 |
| 6 | 2026-07-16 | `competitor-seo-monitoring` | 競合のSEO・流入キーワードを監視する方法｜無料〜有料ツール比較 | 競合 SEO 分析 | Do | 3,600 | P1 |
| 7 | 2026-07-19 | `competitor-monitoring-tool-selection` | 競合監視ツールの選び方｜失敗しない比較軸7つ【2026年版】 | 競合監視ツール 選び方 | Buy | 3,600 | P1 |
| 8 | 2026-07-22 | `competitor-ad-monitoring` | 競合の広告出稿を調べる方法｜Meta広告ライブラリ・Google広告の見方 | 競合 広告 調査 | Do | 3,000 | P2 |
| 9 | 2026-07-25 | `competitor-price-change-monitoring` | 競合の値上げ・価格改定を察知する方法｜監視の仕組みと対応 | 競合 価格改定 監視 | Know/Do | 2,800 | P2 |
| 10 | 2026-07-28 | `competitor-product-launch-monitoring` | 競合の新機能・新製品リリースを追う方法｜プロダクト競合監視 | 競合 新機能 監視 | Do | 2,800 | P2 |
| 11 | 2026-07-31 | `competitor-watchlist-template` | 競合監視シートの作り方｜ウォッチリストのテンプレートと項目例 | 競合監視 テンプレート | Know/Do | 2,800 | P2 |
| 12 | 2026-08-03 | `how-many-competitors-to-monitor` | 監視する競合の選び方｜直接・間接・代替の3層と適正社数 | 競合 選定 監視 | Know | 2,600 | P2 |
| 13 | 2026-08-06 | `competitor-monitoring-team-workflow` | 競合情報をチームで蓄積・共有する仕組み｜Notion・Slack運用 | 競合情報 共有 | Do | 2,800 | P2 |
| 14 | 2026-08-09 | `competitor-case-study-monitoring` | 競合の導入事例から顧客・勝ち筋を読む方法｜事例監視の実務 | 競合 導入事例 分析 | Know | 2,600 | P2 |
| 15 | 2026-08-12 | `competitor-webinar-event-tracking` | 競合のセミナー・ウェビナー情報を追う方法｜BtoBの競合監視 | 競合 セミナー 情報 | Know/Do | 2,400 | P3 |
| 16 | 2026-08-15 | `overseas-competitor-monitoring` | 海外競合の動向を日本語で効率よく追う方法｜情報源と自動翻訳 | 海外競合 監視 | Know/Do | 2,600 | P3 |
| 17 | 2026-08-18 | `competitor-monitoring-frequency` | 競合監視の適切な頻度｜毎日・週次・月次の使い分け | 競合監視 頻度 | Know | 2,400 | P3 |
| 18 | 2026-08-21 | `similarweb-competitor-traffic` | 競合サイトのアクセス数を推定する方法｜SimilarWeb等の使い方と限界 | 競合 アクセス数 調べる | Do | 2,600 | P3 |

> 公開日は予約投稿の目安。`lib/blog.ts` が未来日付を一覧・sitemap から自動除外し、直接URLでは閲覧可（内部リンク先として常に有効）。

---

## 記事別企画詳細（meta / tags / 内部リンク / CTA）

CTA 凡例: **強** = ReAnker の自動監視を明確に提案（自動化・通知・ツール文脈）/ **弱** = 文末で関連としてソフトに紹介。

### 1. competitor-sns-monitoring
- **description**: 競合のSNS（X・LinkedIn・Facebook）を監視する実務的な方法を解説。ソーシャルリスニングの始め方、無料〜有料ツール、毎日続く運用設計、リリース監視との組み合わせまでBtoB担当者向けに整理します。
- **ogTitle**: 競合のSNSを監視する方法｜X・LinkedIn
- **tags**: ["競合監視", "SNS", "ソーシャルリスニング", "X", "LinkedIn"]
- **内部リンク**: `/blog/sns-pr-operations`、`/blog/competitor-press-release-monitoring`、`/blog/btob-marketer-competitor-research`、`/blog/news-alert-comparison`、（新規）`/blog/nocode-competitor-monitoring-zapier`
- **CTA**: 強（SNS+リリースを1か所に集約する文脈で ReAnker）

### 2. competitor-website-change-monitoring
- **description**: 競合サイト・LP・料金ページの更新を自動検知する方法を解説。Webページの差分監視ツールの選び方と設定、何を監視すべきか、運用のコツ、リリース監視との使い分けまで実務目線で整理します。
- **ogTitle**: 競合サイトの更新を自動検知する方法
- **tags**: ["競合監視", "サイト監視", "変更検知", "LP", "ツール"]
- **内部リンク**: （新規）`/blog/competitor-price-change-monitoring`、（新規）`/blog/competitor-product-launch-monitoring`、`/blog/automate-competitor-research`、`/blog/competitor-monitoring-complete-guide`
- **CTA**: 強（更新検知＋リリース監視の併用で ReAnker）

### 3. competitor-monitoring-with-rss-feedly
- **description**: RSS・Feedly で競合監視を組む手順を、フィード収集・整理・通知の3ステップで解説。PR TIMES や企業ブログのRSS取得、Feedlyの設定、限界と自動化への移行ポイントまで実務的にまとめます。
- **ogTitle**: RSS・Feedlyで競合監視を組む方法
- **tags**: ["競合監視", "RSS", "Feedly", "自動化", "情報収集"]
- **内部リンク**: `/blog/slack-competitor-news-notification`、`/blog/google-alerts-competitor-monitoring`、`/blog/automate-competitor-research`、`/blog/prtimes-and-google-news-monitoring`
- **CTA**: 強（RSS運用の限界 → 専用SaaSへ）

### 4. nocode-competitor-monitoring-zapier
- **description**: Zapier・Make を使って競合監視を自動化するノーコードのレシピを解説。RSS→Slack通知、フォーム→スプレッドシート蓄積などの具体的な組み方、無料枠の限界、専用SaaSとの使い分けまで整理します。
- **ogTitle**: Zapier・Makeで競合監視を自動化する
- **tags**: ["競合監視", "Zapier", "Make", "ノーコード", "自動化"]
- **内部リンク**: `/blog/slack-competitor-news-notification`、（新規）`/blog/competitor-monitoring-with-rss-feedly`、`/blog/automate-competitor-research`、`/blog/slack-press-release-auto-notify`
- **CTA**: 強（自作の保守コスト → 専用SaaS）

### 5. competitor-hiring-monitoring
- **description**: 競合の採用・求人動向から事業戦略を読む方法を解説。求人媒体・採用ページ・Wantedly のチェックポイント、職種構成から投資領域を推測する見方、継続監視の仕組み化まで実務目線でまとめます。
- **ogTitle**: 競合の採用動向から戦略を読む方法
- **tags**: ["競合監視", "採用", "求人", "競合分析", "組織"]
- **内部リンク**: `/blog/btob-marketer-competitor-research`、`/blog/competitor-analysis-framework`、`/blog/industry-trend-monitoring`、`/blog/sales-competitive-research`
- **CTA**: 弱

### 6. competitor-seo-monitoring
- **description**: 競合のSEO（流入キーワード・被リンク・順位）を監視する方法を、無料〜有料ツール別に解説。何を見れば自社施策に活きるか、定点観測の頻度、競合コンテンツの追い方まで実務目線で整理します。
- **ogTitle**: 競合のSEO・流入KWを監視する方法
- **tags**: ["競合監視", "SEO", "キーワード", "被リンク", "ツール"]
- **内部リンク**: `/blog/btob-seo-basics`、`/blog/btob-content-marketing-starter`、`/blog/competitor-analysis-framework`、`/blog/automate-competitor-research`、（新規）`/blog/similarweb-competitor-traffic`
- **CTA**: 弱

### 7. competitor-monitoring-tool-selection
- **description**: 競合監視ツールの選び方を、カバー範囲・通知・精度・料金・運用負荷など7つの比較軸で解説。目的別の選定手順、無料/有料の境界、失敗例と回避策まで、導入前にチェックすべき点を整理します。
- **ogTitle**: 競合監視ツールの選び方｜比較軸7つ
- **tags**: ["競合監視", "ツール", "選び方", "比較", "SaaS"]
- **内部リンク**: `/blog/pr-monitoring-tools-comparison`、`/blog/news-alert-comparison`、`/blog/clipping-service-smb-checklist`、`/blog/competitor-monitoring-300yen`、`/blog/prtimes-webclipping-alternative`、`/compare`
- **CTA**: 強（比較軸を満たす実例として ReAnker）

### 8. competitor-ad-monitoring
- **description**: 競合の広告出稿を調べる方法を、Meta広告ライブラリ・Google広告の透明性センター・各種ツールで解説。出稿クリエイティブ・訴求・LPの読み取り方、自社施策への活かし方まで実務目線で整理します。
- **ogTitle**: 競合の広告出稿を調べる方法
- **tags**: ["競合監視", "広告", "Meta広告ライブラリ", "リスティング", "競合分析"]
- **内部リンク**: `/blog/btob-marketer-competitor-research`、`/blog/competitor-analysis-framework`、（新規）`/blog/competitor-seo-monitoring`
- **CTA**: 弱

### 9. competitor-price-change-monitoring
- **description**: 競合の値上げ・価格改定をいち早く察知する方法を解説。価格ページの変更監視、プレスリリース・IRからの兆候の読み方、自社の価格戦略への活かし方、通知の自動化まで実務目線で整理します。
- **ogTitle**: 競合の価格改定を察知する方法
- **tags**: ["競合監視", "価格改定", "値上げ", "プライシング", "監視"]
- **内部リンク**: （新規）`/blog/competitor-website-change-monitoring`、`/blog/competitor-press-release-monitoring`、`/blog/sales-competitive-research`、`/blog/competitor-monitoring-complete-guide`
- **CTA**: 強

### 10. competitor-product-launch-monitoring
- **description**: 競合の新製品・新機能リリースを追う方法を解説。リリースノート・changelog・プレスリリース・SNSの監視ポイント、SaaS競合のアップデート追跡、自社ロードマップへの反映まで実務目線で整理します。
- **ogTitle**: 競合の新機能リリースを追う方法
- **tags**: ["競合監視", "新機能", "プロダクト", "リリースノート", "SaaS"]
- **内部リンク**: `/blog/competitor-press-release-monitoring`、（新規）`/blog/competitor-website-change-monitoring`、`/blog/prtimes-and-google-news-monitoring`、`/blog/btob-marketer-competitor-research`
- **CTA**: 強

### 11. competitor-watchlist-template
- **description**: 競合監視シート（ウォッチリスト）の作り方を、監視項目・情報源・更新頻度・担当の4要素で解説。そのまま使える項目テンプレート、スプレッドシート運用のコツ、形骸化を防ぐ工夫まで整理します。
- **ogTitle**: 競合監視シートの作り方｜テンプレート
- **tags**: ["競合監視", "テンプレート", "ウォッチリスト", "運用", "スプレッドシート"]
- **内部リンク**: `/blog/competitor-analysis-framework`、（新規）`/blog/competitor-monitoring-team-workflow`、（新規）`/blog/how-many-competitors-to-monitor`、`/blog/pr-team-competitor-info-basics`
- **CTA**: 弱

### 12. how-many-competitors-to-monitor
- **description**: 監視する競合の選び方を、直接・間接・代替・潜在の4分類と適正社数で解説。優先順位の付け方、層ごとの監視深度の変え方、増やしすぎて形骸化しないための絞り込み基準まで実務目線で整理します。
- **ogTitle**: 監視する競合の選び方｜何社が適正か
- **tags**: ["競合監視", "競合選定", "直接競合", "間接競合", "競合分析"]
- **内部リンク**: `/blog/competitor-press-release-monitoring`、`/blog/competitor-analysis-framework`、（新規）`/blog/competitor-watchlist-template`、（新規）`/blog/competitor-monitoring-frequency`
- **CTA**: 弱

### 13. competitor-monitoring-team-workflow
- **description**: 競合情報をチームで蓄積・共有する仕組みを解説。Notion・Slack・スプレッドシートを使った情報ストック設計、収集→整理→共有→活用のフロー、属人化と形骸化を防ぐ運用ルールまで実務目線でまとめます。
- **ogTitle**: 競合情報をチームで共有する仕組み
- **tags**: ["競合監視", "情報共有", "Notion", "Slack", "チーム運用"]
- **内部リンク**: （新規）`/blog/competitor-watchlist-template`、`/blog/industry-trend-monitoring`、`/blog/competitive-intelligence-basics`、`/blog/slack-competitor-news-notification`
- **CTA**: 強（収集の自動化部分で ReAnker）

### 14. competitor-case-study-monitoring
- **description**: 競合の導入事例ページから顧客・勝ち筋・ターゲットを読む方法を解説。事例の更新監視、業種や規模の傾向分析、自社の競合切り返しや営業資料への活かし方まで、BtoB担当者向けに整理します。
- **ogTitle**: 競合の導入事例から勝ち筋を読む方法
- **tags**: ["競合監視", "導入事例", "競合分析", "営業", "BtoB"]
- **内部リンク**: `/blog/sales-competitive-research`、`/blog/btob-marketer-competitor-research`、（新規）`/blog/competitor-website-change-monitoring`、`/blog/competitor-analysis-framework`
- **CTA**: 弱

### 15. competitor-webinar-event-tracking
- **description**: 競合のセミナー・ウェビナー・展示会情報を継続的に追う方法を解説。告知の情報源、申込んで中身を観察する際の注意点、テーマから競合の注力領域を読む見方、収集の効率化まで実務目線で整理します。
- **ogTitle**: 競合のセミナー・ウェビナーを追う方法
- **tags**: ["競合監視", "ウェビナー", "セミナー", "イベント", "競合分析"]
- **内部リンク**: `/blog/btob-marketer-competitor-research`、`/blog/webinar-marketing-basics`、`/blog/industry-trend-monitoring`、`/blog/competitor-monitoring-complete-guide`
- **CTA**: 弱

### 16. overseas-competitor-monitoring
- **description**: 海外競合の動向を日本語で効率よく追う方法を解説。英語ニュース・プロダクト情報の情報源、自動翻訳と要約の活用、時差や情報量の壁への対処、国内監視との組み合わせまで実務目線で整理します。
- **ogTitle**: 海外競合の動向を日本語で追う方法
- **tags**: ["競合監視", "海外競合", "情報収集", "翻訳", "グローバル"]
- **内部リンク**: `/blog/industry-trend-monitoring`、`/blog/marketing-intelligence-smb`、（新規）`/blog/competitor-product-launch-monitoring`、`/blog/news-alert-comparison`
- **CTA**: 弱

### 17. competitor-monitoring-frequency
- **description**: 競合監視の適切な頻度を、毎日・週次・月次の使い分けで解説。監視対象ごとに頻度を変える設計、見すぎ・見なさすぎの弊害、続けるための自動化と通知設計まで、形骸化を防ぐ視点で整理します。
- **ogTitle**: 競合監視の頻度｜毎日・週次・月次
- **tags**: ["競合監視", "頻度", "運用設計", "モニタリング", "自動化"]
- **内部リンク**: `/blog/competitor-monitoring-for-startups`、（新規）`/blog/how-many-competitors-to-monitor`、`/blog/automate-competitor-research`、`/blog/competitor-monitoring-complete-guide`
- **CTA**: 強（毎日チェックの負担 → 通知自動化で ReAnker）

### 18. similarweb-competitor-traffic
- **description**: 競合サイトのアクセス数を推定する方法を、SimilarWeb など主要ツールの使い方と限界で解説。数値の読み方と精度の注意点、流入チャネルの見方、無料でできる範囲、他の競合監視との組み合わせまで整理します。
- **ogTitle**: 競合サイトのアクセス数を推定する方法
- **tags**: ["競合監視", "SimilarWeb", "トラフィック", "アクセス解析", "競合分析"]
- **内部リンク**: （新規）`/blog/competitor-seo-monitoring`、`/blog/competitor-analysis-framework`、`/blog/marketing-intelligence-smb`、`/blog/automate-competitor-research`
- **CTA**: 弱

---

## 内部リンク戦略（ハブ&スポーク）

- **ハブ（受け）**: `competitor-monitoring-complete-guide` / `competitor-analysis-framework` / `automate-competitor-research` を主要ハブとし、新規18本から張る。
- **スポーク間**: 新規18本は関連トピック同士を相互リンク（例: サイト更新 ⇄ 価格改定 ⇄ 新機能、RSS ⇄ ノーコード、テンプレート ⇄ チーム共有 ⇄ 選定 ⇄ 頻度）。
- **Buy への送客**: 各記事の CTA／関連から、既存の比較・代替記事（`prtimes-webclipping-alternative`・`clipping-service-pricing-comparison`・`competitor-monitoring-300yen`）と `tool-selection`（新規）へ集約。
- **CTA 一貫性**: 自動化・通知・ツール文脈の記事（強CTA）で ReAnker を明確に提案。情報収集系（弱CTA）は文末で関連紹介に留め、押し売り感を避ける。

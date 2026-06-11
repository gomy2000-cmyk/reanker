# 50記事 SEOコンテンツ制作プラン（全カテゴリ横断）

承認済みタスク: **5,000字級・検索上位を狙う完成記事を最大50本**、`content/blog/<slug>.md` として作成する。

## 制作規約（全記事共通）

- **言語/トーン**: 日本語・実務目線。断定しすぎず、箇条書きと小見出しを多用（既存記事に準拠）。
- **文字数**: 本文 約4,500〜5,500字。
- **frontmatter**: `title` / `description`(110〜130字) / `ogTitle` / `publishedAt` / `updatedAt` / `category` / `tags`。本文先頭は段落（H1は置かない）。
- **構成**: 導入（課題提起）→ H2×6〜8（H3・箇条書き）→ まとめ → 関連記事 → CTA。
- **カテゴリ**: `competitor-monitoring` / `pr-and-publicity` / `btob-marketing` の3つのみ。
- **内部リンク**: 既存53本＋本バッチ50本へ実在slugで `/blog/<slug>`。1記事あたり3〜6本。
- **CTA**: ReAnker（PR TIMES + Google News を月額300円で自動監視・毎朝1通／無料プランあり）。リンク `[ReAnker](/)`。監視・自動化系は強め、純マーケ/広報系は文末でソフトに。
- **公開日**: 2026-07-01 から2日間隔で予約投稿（`lib/blog.ts` が未来日付を一覧/sitemapから自動除外）。

## 進捗の確認方法

`content/blog/<slug>.md` の有無 ＋ `git log` で判定（このプランは静的な索引）。5本ごとにコミット。

## 記事一覧（50本）

### competitor-monitoring（1〜18）※既存アウトラインを完全執筆
| # | 公開日 | slug | タイトル | 主KW |
|---|---|---|---|---|
| 1 | 2026-07-01 | competitor-sns-monitoring | 競合のSNS（X・LinkedIn）を監視する方法 | 競合 SNS 監視 |
| 2 | 2026-07-03 | competitor-website-change-monitoring | 競合サイト・LPの更新を自動検知する方法 | 競合サイト 更新 監視 |
| 3 | 2026-07-05 | competitor-monitoring-with-rss-feedly | RSS・Feedlyで競合監視を組む実務ガイド | Feedly 競合監視 |
| 4 | 2026-07-07 | nocode-competitor-monitoring-zapier | Zapier・Makeで競合監視を自動化する方法 | Zapier 競合監視 |
| 5 | 2026-07-09 | competitor-hiring-monitoring | 競合の採用・求人動向から戦略を読む方法 | 競合 採用 動向 |
| 6 | 2026-07-11 | competitor-seo-monitoring | 競合のSEO・流入キーワードを監視する方法 | 競合 SEO 分析 |
| 7 | 2026-07-13 | competitor-monitoring-tool-selection | 競合監視ツールの選び方｜比較軸7つ | 競合監視ツール 選び方 |
| 8 | 2026-07-15 | competitor-ad-monitoring | 競合の広告出稿を調べる方法 | 競合 広告 調査 |
| 9 | 2026-07-17 | competitor-price-change-monitoring | 競合の値上げ・価格改定を察知する方法 | 競合 価格改定 監視 |
| 10 | 2026-07-19 | competitor-product-launch-monitoring | 競合の新機能・新製品リリースを追う方法 | 競合 新機能 監視 |
| 11 | 2026-07-21 | competitor-watchlist-template | 競合監視シートの作り方｜テンプレート | 競合監視 テンプレート |
| 12 | 2026-07-23 | how-many-competitors-to-monitor | 監視する競合の選び方｜3層と適正社数 | 競合 選定 監視 |
| 13 | 2026-07-25 | competitor-monitoring-team-workflow | 競合情報をチームで蓄積・共有する仕組み | 競合情報 共有 |
| 14 | 2026-07-27 | competitor-case-study-monitoring | 競合の導入事例から勝ち筋を読む方法 | 競合 導入事例 分析 |
| 15 | 2026-07-29 | competitor-webinar-event-tracking | 競合のセミナー・ウェビナー情報を追う方法 | 競合 セミナー 情報 |
| 16 | 2026-07-31 | overseas-competitor-monitoring | 海外競合の動向を日本語で追う方法 | 海外競合 監視 |
| 17 | 2026-08-02 | competitor-monitoring-frequency | 競合監視の適切な頻度 | 競合監視 頻度 |
| 18 | 2026-08-04 | similarweb-competitor-traffic | 競合サイトのアクセス数を推定する方法 | 競合 アクセス数 調べる |

### pr-and-publicity（19〜34）
| # | 公開日 | slug | タイトル | 主KW |
|---|---|---|---|---|
| 19 | 2026-08-06 | press-kit-how-to-make | プレスキット（メディアキット）の作り方 | プレスキット 作り方 |
| 20 | 2026-08-08 | pr-agency-selection | 広報代行・PR会社の選び方｜費用相場 | 広報代行 選び方 |
| 21 | 2026-08-10 | startup-pr-hitori | ひとり広報の始め方 | ひとり広報 |
| 22 | 2026-08-12 | press-release-distribution-comparison | プレスリリース配信サービスの選び方 | プレスリリース 配信 比較 |
| 23 | 2026-08-14 | embargo-press-release | エンバーゴとは？使い方と実務マナー | エンバーゴ プレスリリース |
| 24 | 2026-08-16 | pr-annual-plan | 広報の年間計画の立て方 | 広報 年間計画 |
| 25 | 2026-08-18 | recruiting-pr-guide | 採用広報の進め方 | 採用広報 |
| 26 | 2026-08-20 | founder-personal-branding | 経営者の個人ブランディング | 経営者 ブランディング |
| 27 | 2026-08-22 | media-list-building | メディアリストの作り方 | メディアリスト 作り方 |
| 28 | 2026-08-24 | press-conference-how-to | 記者会見・発表会の開き方 | 記者会見 開き方 |
| 29 | 2026-08-26 | award-pr-strategy | 受賞・アワードを広報に活かす方法 | 受賞 広報 |
| 30 | 2026-08-28 | pr-photo-visual-guide | 広報用の写真・ビジュアルの作り方 | 広報 写真 |
| 31 | 2026-08-30 | b2b-pr-strategy | BtoB広報の戦略設計 | BtoB広報 戦略 |
| 32 | 2026-09-01 | owned-earned-paid-media | トリプルメディア戦略 | トリプルメディア |
| 33 | 2026-09-03 | pr-budget-planning | 広報予算の立て方 | 広報予算 |
| 34 | 2026-09-05 | funding-announcement-pr | 資金調達を広報で最大化する方法 | 資金調達 広報 |

### btob-marketing（35〜50）
| # | 公開日 | slug | タイトル | 主KW |
|---|---|---|---|---|
| 35 | 2026-09-07 | btob-email-marketing | BtoBメールマーケティングの基本 | BtoB メールマーケティング |
| 36 | 2026-09-09 | sales-marketing-alignment | 営業とマーケの連携（セールスイネーブルメント） | 営業 マーケ 連携 |
| 37 | 2026-09-11 | case-study-content-creation | 導入事例コンテンツの作り方 | 導入事例 作り方 |
| 38 | 2026-09-13 | whitepaper-creation-guide | ホワイトペーパーの作り方 | ホワイトペーパー 作り方 |
| 39 | 2026-09-15 | inside-sales-setup | インサイドセールスの立ち上げ | インサイドセールス 立ち上げ |
| 40 | 2026-09-17 | btob-website-cvr | BtoBサイトのCVR改善 | BtoB サイト CVR |
| 41 | 2026-09-19 | btob-paid-ads | BtoB広告運用の基本 | BtoB 広告運用 |
| 42 | 2026-09-21 | demand-generation-basics | デマンドジェネレーション入門 | デマンドジェネレーション |
| 43 | 2026-09-23 | btob-persona-journey | BtoBペルソナ・カスタマージャーニー設計 | BtoB ペルソナ |
| 44 | 2026-09-25 | martech-stack-selection | BtoBマーケのツール選定（MarTech） | MarTech 選定 |
| 45 | 2026-09-27 | btob-marketing-roi | BtoBマーケのROI測定・アトリビューション | BtoB マーケ ROI |
| 46 | 2026-09-29 | btob-referral-marketing | 紹介・リファラルマーケの設計 | リファラルマーケティング |
| 47 | 2026-10-01 | pricing-page-optimization | 料金ページの作り方｜CVを高める設計 | 料金ページ 作り方 |
| 48 | 2026-10-03 | btob-video-marketing | BtoB動画マーケティングの始め方 | BtoB 動画マーケティング |
| 49 | 2026-10-05 | btob-marketing-team-building | BtoBマーケ組織の作り方 | BtoB マーケ 組織 |
| 50 | 2026-10-07 | btob-marketing-budget | BtoBマーケ予算の立て方 | BtoB マーケ 予算 |

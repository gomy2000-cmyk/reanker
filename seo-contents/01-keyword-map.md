# Step 1｜キーワード設計（competitor-monitoring 新規18本）

## 目的とスコープ

ReAnker の製品コアである **競合監視** クラスタを、既存31本と重複しない未開拓KWで18本拡張する。
狙いは「PR TIMES/Google News のリリース監視」から一歩広げ、**監視対象の多様化**と**運用設計**の検索需要を取りに行くこと。

## 設計方針

- 既存がカバー済みの領域（PR TIMES監視 / クリッピング料金比較 / Google アラート / Slack通知 / 競合監視の入門・料金）は**避ける**。
- 検索意図は **Know（情報収集）/ Do（実践・how-to）/ Buy（比較・導入検討）** の3分類で判定。Buy は既存で飽和のため Know/Do 中心。
- すべて `category: competitor-monitoring`。各記事は既存ハブ記事へ内部リンクし、トピッククラスタを補強する。
- **需要・難易度は外部ツール未接続のため相対推定**（需要 ★1〜3 / 難易度 低・中・高）。着手前に Ahrefs・ラッコキーワード等で実数確認が必要。

## サブクラスタ構成（3群 / 18本）

1. **監視対象の拡張**（10本）— 競合の「何を」見るかを増やす
2. **運用・自動化**（4本）— 競合監視を「どう回すか」を深掘り
3. **選定・戦略**（4本）— 「どこまで・どう選ぶか」の意思決定

---

## サブクラスタ1: 監視対象の拡張（10本）

| # | slug | 主KW | 副KW | 意図 | 優先 | 需要 | 難易度 | 差別化メモ（vs 既存） |
|---|---|---|---|---|---|---|---|---|
| 1 | `competitor-hiring-monitoring` | 競合 採用 動向 | 求人 競合分析 / 競合 組織変化 / Wantedly 競合 | Know | P1 | ★★☆ | 中 | 採用・求人から競合の投資領域と拡大を読む。専用記事は既存になし（`btob-marketer-competitor-research` が軽く触れる程度） |
| 2 | `competitor-price-change-monitoring` | 競合 価格改定 監視 | 競合 値上げ 察知 / 競合 料金 変更 / 価格 ウォッチ | Know/Do | P2 | ★☆☆ | 低 | 価格ページ監視＋リリース監視の合わせ技。新規領域 |
| 3 | `competitor-sns-monitoring` | 競合 SNS 監視 | X 競合 モニタリング / LinkedIn 競合 / ソーシャルリスニング | Do | P1 | ★★☆ | 中 | 自社SNS運用（`sns-pr-operations`）とは別軸。競合のSNS発信を追う実務 |
| 4 | `competitor-website-change-monitoring` | 競合サイト 更新 監視 | Webページ 変更 検知 / 競合LP 監視 / visualping 代替 | Do | P1 | ★★☆ | 中 | サイト差分監視ツール＋運用。新規領域 |
| 5 | `competitor-product-launch-monitoring` | 競合 新機能 監視 | プロダクト 競合監視 / リリースノート 追う / 競合 アップデート | Do | P2 | ★☆☆ | 中 | SaaS競合の changelog/リリースノート監視。新規 |
| 6 | `competitor-ad-monitoring` | 競合 広告 調査 | Meta広告ライブラリ 競合 / Google広告 競合 / 競合 出稿 調べる | Do | P2 | ★★☆ | 中 | 広告ライブラリの使い方と出稿傾向の読み方。新規 |
| 7 | `competitor-seo-monitoring` | 競合 SEO 分析 | 競合 キーワード 調査 / 競合 被リンク / 競合サイト 流入 | Do | P1 | ★★★ | 高 | 競合SEO監視（無料〜有料）。需要高・難易度高。`btob-seo-basics` は自社SEOで別軸 |
| 8 | `competitor-webinar-event-tracking` | 競合 セミナー 情報 | 競合 ウェビナー 監視 / 競合 イベント 追う | Know/Do | P3 | ★☆☆ | 低 | セミナー/ウェビナー情報の継続収集。新規 |
| 9 | `competitor-case-study-monitoring` | 競合 導入事例 分析 | 競合 顧客 調べる / 導入事例 監視 / 競合 受注 | Know | P2 | ★☆☆ | 中 | 事例ページから顧客・勝ち筋・ターゲットを読む。新規 |
| 10 | `overseas-competitor-monitoring` | 海外競合 監視 | 海外 競合 情報収集 / 海外スタートアップ 動向 / 競合 英語ニュース | Know/Do | P3 | ★☆☆ | 中 | 海外情報源＋自動翻訳での効率化。新規 |

## サブクラスタ2: 運用・自動化（4本）

| # | slug | 主KW | 副KW | 意図 | 優先 | 需要 | 難易度 | 差別化メモ（vs 既存） |
|---|---|---|---|---|---|---|---|---|
| 11 | `competitor-monitoring-with-rss-feedly` | Feedly 競合監視 | RSS 競合 監視 / 競合 RSS まとめ / Feedly 使い方 競合 | Do | P1 | ★★☆ | 中 | RSS/Feedly構築の専用ガイド。既存はSlack/Googleアラート文脈で断片的に触れる程度 |
| 12 | `nocode-competitor-monitoring-zapier` | Zapier 競合監視 | Make 競合 自動化 / ノーコード 競合監視 / RSS Slack 通知 | Do | P1 | ★★☆ | 中 | Zapier/Makeのレシピ集。`slack-competitor-news-notification` の深掘り版（手順特化） |
| 13 | `competitor-monitoring-team-workflow` | 競合情報 共有 | 競合 情報 ストック / Notion 競合 / 競合情報 ナレッジ | Do | P2 | ★☆☆ | 中 | チームでの蓄積・共有・更新の仕組み化。新規 |
| 14 | `competitor-watchlist-template` | 競合監視 テンプレート | 競合 ウォッチリスト / 競合監視 シート / 競合 チェック項目 | Know/Do | P2 | ★★☆ | 低 | 監視項目テンプレ。`competitor-analysis-framework` より実務テンプレ寄りで差別化 |

## サブクラスタ3: 選定・戦略（4本）

| # | slug | 主KW | 副KW | 意図 | 優先 | 需要 | 難易度 | 差別化メモ（vs 既存） |
|---|---|---|---|---|---|---|---|---|
| 15 | `how-many-competitors-to-monitor` | 競合 選定 監視 | 監視 競合 何社 / 直接競合 間接競合 / 競合 絞り込み | Know | P2 | ★☆☆ | 低 | 直接/間接/代替/潜在の3〜4層分類＋適正社数。`competitor-press-release-monitoring` の選定論を独立深掘り |
| 16 | `competitor-monitoring-frequency` | 競合監視 頻度 | 競合 チェック 頻度 / 競合監視 毎日 / モニタリング 頻度 | Know | P3 | ★☆☆ | 低 | 毎日/週次/月次の使い分け設計。新規 |
| 17 | `competitor-monitoring-tool-selection` | 競合監視ツール 選び方 | 競合監視 SaaS 比較 / 競合監視 ツール おすすめ | Buy | P1 | ★★★ | 高 | 比較軸7つの「選び方」購入ガイド。`pr-monitoring-tools-comparison`（一覧）とは判断軸で差別化 |
| 18 | `similarweb-competitor-traffic` | 競合 アクセス数 調べる | SimilarWeb 競合 / 競合サイト 流入数 / 競合 トラフィック 推定 | Do | P3 | ★★☆ | 中 | トラフィック推定ツールの使い方と限界。新規 |

---

## 検索意図ミックス（バランス確認）

- **Know（情報収集）**: 1, 2, 8, 9, 10, 14, 15, 16 … 認知〜比較検討の入口。SEO流入の母数を作る。
- **Do（実践・how-to）**: 3, 4, 5, 6, 7, 11, 12, 13, 18 … 手を動かす読者。ReAnker の「自動化で解決」CTA と相性◎。
- **Buy（比較・導入検討）**: 17 … CVに最も近い。既存 Buy 記事群（料金比較・代替）から内部リンクを集約。

> Buy が手薄に見えるが、既存31本に料金比較・ツール代替（`clipping-service-pricing-comparison` 他多数）が充実しているため、本バッチは **Know/Do で母数を作り、既存 Buy 記事へ送客** する設計が合理的。

## 優先度サマリ

- **P1（先行7本）**: 3, 4, 7, 11, 12, 1, 17 — 需要・CV貢献が高い、または運用ニーズが明確。
- **P2（中位7本）**: 2, 5, 6, 9, 13, 14, 15
- **P3（後位4本）**: 8, 10, 16, 18 — ニッチだがロングテールで確実に取りに行く。

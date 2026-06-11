# seo-contents — 競合監視クラスタ 新規記事の企画・設計

ReAnker ブログ（`content/blog/`）に追加する **`competitor-monitoring` カテゴリの新規記事18本** の企画・設計ドキュメントです。
本文ドラフトはまだ着手せず、**Step 1〜3（KW設計・記事企画・アウトライン）まで** を格納しています（`drafts/` は意図的に空）。

## ワークフロー

| Step | 成果物 | ファイル |
|---|---|---|
| Step 1 | キーワード設計（クラスタ・検索意図・優先度・差別化） | [`01-keyword-map.md`](./01-keyword-map.md) |
| Step 2 | 記事企画一覧（slug / タイトル / KW / meta / 内部リンク / 公開予定日） | [`02-content-plan.md`](./02-content-plan.md) |
| Step 3 | 記事別アウトライン（提案 frontmatter + H2/H3 + 要点） | [`03-outlines/<slug>.md`](./03-outlines/) |
| Step 4〜 | 本文ドラフト（**未着手**） | `drafts/`（空） |

## 前提・方針

- **テーマ**: `competitor-monitoring`（製品コア）。既存31本と重複しない未開拓KWを狙う。
- **言語 / フォーマット**: 日本語。既存 `content/blog/*.md` の frontmatter スキーマに準拠
  （`title` / `description` / `ogTitle` / `publishedAt` / `updatedAt` / `category` / `tags`）。
- **内部リンク**: 既存53記事へ実在 slug でリンク（`/blog/<slug>`）。新規18本同士もクラスタ内でリンク。
- **CTA**: ReAnker（PR TIMES + Google News を月額300円で自動監視・毎朝1通の通知）。リンクは `[ReAnker](/)`。
- **検索ボリューム / 難易度**: 外部KWツール未接続のため **相対推定**（需要 ★1〜3、難易度 低/中/高）。
  本文着手前に Ahrefs・ラッコキーワード等で実数を要確認。

## 既存カバー状況と本バッチの差別化

既存の `competitor-monitoring`（約31本）は **「PR TIMES / Google News のリリース監視・クリッピング比較・
Google アラート・Slack通知・競合監視の入門/料金」** が手厚い。
そこで本バッチは手薄な2領域を狙う:

1. **監視「対象」の拡張** — 採用・価格・SNS・サイト更新・新機能・広告・SEO・セミナー・導入事例・海外（10本）
2. **監視「運用・自動化・選定」の深掘り** — RSS/Feedly・ノーコード・チーム共有・テンプレート・選び方・頻度・ツール選定・トラフィック推定（8本）

## 本文ドラフトの作り方（Step 4 以降）

1. `03-outlines/<slug>.md` の「提案 frontmatter」をコピーし、`content/blog/<slug>.md` を新規作成。
2. アウトラインの H2/H3 と要点に沿って執筆（既存記事のトーン = 実務目線・断定しすぎない・箇条書き多用）。
3. 内部リンクを Markdown で挿入（`[アンカー](/blog/<slug>)`、CTA は `[ReAnker](/)`）。
4. `publishedAt` に予約投稿日（未来日付）を設定。`lib/blog.ts` が未来日付を一覧・sitemap から自動除外する
   （詳細URLでは閲覧可 = 内部リンク先として常に有効）。
5. `npm run build` で確認後、公開日に合わせて反映。

## 公開スケジュール（提案）

18本を **2026-07-01 から3日間隔** で予約投稿する想定（最終 2026-08-21）。
日付は [`02-content-plan.md`](./02-content-plan.md) の「公開予定日」列を参照（調整可）。

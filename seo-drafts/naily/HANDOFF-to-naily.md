# 依頼文：nAIly SEO記事15本を nAIly リポのブログに統合・公開

> このファイルの「==== ここから依頼文 ====」以下を、**nAIlyリポ（gomy2000-cmyk/nAIly）で開いたClaudeセッションにそのまま貼り付け**てください。
> 素材（記事15本）は別リポ `gomy2000-cmyk/reanker` のブランチ `claude/jolly-bell-bA38s` の `seo-drafts/naily/` にあります。

---

==== ここから依頼文 ====

あなたは **nAIly（ナイリー）** の開発リポジトリ（gomy2000-cmyk/nAIly）で作業しています。
すでに別リポで作成済みの「**nAIly SEO記事制作パック（全15記事）**」を、このnAIlyリポの実際のブログに統合し、公開できる状態にしてください。新規ブログ記事の追加が中心で、既存の公開ページ・デザインは壊さないでください。

## 0. 素材（記事パック）の入手

SEOパックは別リポにあります。まずこれを入手してください。

- リポジトリ：`gomy2000-cmyk/reanker`
- ブランチ：`claude/jolly-bell-bA38s`
- パス：`seo-drafts/naily/`

入手方法（どちらか）：
1. **このセッションに `gomy2000-cmyk/reanker` を追加**し、`seo-drafts/naily/` を読む（推奨）
2. 上記ブランチを取得して `seo-drafts/naily/` をコピー
   例：`git clone --branch claude/jolly-bell-bA38s <reankerのURL>` → `seo-drafts/naily/` を参照

パックの構成：
```
seo-drafts/naily/
  README.md                  … 作業概要・保存先判断・注意点
  STYLE-GUIDE.md             … 執筆共通ルール（最重要。先に読む）
  keyword-map.csv            … 50KWの台帳
  keyword-clusters.json      … クラスタ＋カニバリ注意点
  article-production-plan.md … 15記事の計画・内部リンク設計・CTA方針
  drafts/001〜015-*.md       … 本文（各 約4,000〜6,000字、frontmatter付き）
  metadata/001〜015-*.json   … title/meta_title/meta_description/slug/category/tags/funnel_stage/cta_type 等
  image-prompts/001〜015-*.md… 画像案・生成プロンプト（共通仕様は001に集約）
```

**最初に `STYLE-GUIDE.md` と `README.md` を必ず読んでください**（nAIlyのサービス立ち位置・トーン・禁止表現・CTA/画像/メタの規約が全部あります）。

## 1. nAIly側の現状確認（変更を加える前に）

このnAIlyリポのブログ実装を調べてください：
- ブログ記事の格納場所と **frontmatter形式**（キー名）
- ルーティング（例：`/blog/[slug]`）、一覧ページ、**sitemap / canonical / OG** の生成方法
- **CTAコンポーネント**の有無と使い方、LP/CV導線の実URL
- **公開日（publishedAt等）/ 予約投稿**の仕組み
- ブランドカラー・トンマナ・記事用CSS

## 2. 統合作業（15本）

各記事について、以下を行ってください：

1. **frontmatter変換**：`metadata/0NN-*.json` の `title / meta_title / meta_description / slug / category / tags / funnel_stage` を、**nAIlyのブログfrontmatterキーにマッピング**（例：description←meta_description、ogTitle←meta_title 等。nAIlyの実形式に合わせる）。`drafts/` 側のfrontmatter（primary_kw 等）は制作管理用なので、公開用には不要なら落としてよい。
2. **仮LP URLの置換**：本文・CTA中の `https://naily.example.jp/`（仮）を **nAIlyの実LP/CV URL**へ全置換。
3. **内部リンクの実経路化**：本文の `/blog/<slug>`（15本の相互リンク）を nAIlyの実ブログ経路に合わせる。**15本が相互に正しく繋がる**ように（404を出さない）。slug一覧は本文末の「記事一覧」を参照。
4. **CTAの差し替え**：本文中の `> 💬 CTA（上部/セクション/中盤/下部）` ブロックを、**nAIlyの実CTAコンポーネント or LP導線**に置き換え（各記事4箇所）。文面のトーンは維持（手軽さ訴求・過剰約束なし）。
5. **画像**：本文の `<!-- 🖼 IMAGE img-Axx-NN ... -->` は**未生成のプレースホルダ**。`image-prompts/` のプロンプトを元に生成するか、暫定のシンプル図解を用意。**日本語ラベルはAI生成で崩れやすいのでデザインツールで後載せ推奨**。ブランドカラーはnAIly本物に。
6. **公開日の分散**：全15本を同日一括公開せず、**数日〜数週でスタガー**（SEO上自然）。CVに近いA01/A05/A06/A11/A12 を先行、各AI別(A07-A10)や認知系(A03/A04/A14)を後続、等。具体案は本文末参照。

## 3. nAIlyのポジション・トーン（厳守。詳細は STYLE-GUIDE.md）

- nAIly＝**会社名・サービス名・ブランド名・相談窓口名など好きな名前でAIチャット環境を持てるサービス**。専用URL・ロゴ設定可。自社専用風に見せられる。「○○相談窓口」を作れる。最短5営業日程度・低コスト・中小企業向け。
- **前面に出しすぎない**：RAG／高度な社内文書検索／複雑なAI開発／大企業向け重厚システム／完全自動対応／全問い合わせAI解決。
- **避ける語**：革新的／最先端／圧倒的／完全自動化／爆速／すべて解決／DXを加速／次世代AIソリューション。
- 過剰な自動化・万能感を出さない。競合（ChatGPT/Claude/Gemini 等）の断定的批判をしない。各AIの価格・機能は断定しない。

## 4. 安全に進める

- **既存の公開ページ・ルーティング・デザインを壊さない**。追加が中心。
- 作業は**開発ブランチ**で（例：`claude/...`）。レビュー後に本番マージ。
- 公開は、**ブランド・実URL・CTAがnAIly本物に揃ってから**。仮URLが残ったまま公開しない。

## 5. 統合後のQA（全15本・機械チェック推奨）

- nAIly形式のfrontmatter必須キーが全記事で揃っているか
- CTA（各記事4箇所）が**nAIlyのLP/コンポーネント**を指しているか（`naily.example.jp` 等の仮URL残存ゼロ）
- 内部リンクが**実経路で繋がる**か（404なし、相互リンク成立）
- 避ける語ゼロ／本文 約4,000〜6,000字／画像の扱い
- sitemap・canonical・OG が **nAIlyドメイン**になっているか
- **ビルドが通る**か（next build 等）

## 6. 記事一覧（15本｜slugは仮。nAIlyの実経路に合わせて調整可）

| ID | slug | 対策KW | タイトル |
|---|---|---|---|
| A01 | company-dedicated-ai-chat | 自社専用 AIチャット | 自社専用AIチャットとは？中小企業が手軽に持つ方法と費用の考え方 |
| A02 | original-ai | オリジナルAI | オリジナルAIとは？作り方の3パターンと、手軽に始める方法 |
| A03 | ai-how-to-start | AI 何から始める | 会社のAI、何から始める？迷わないための最初の一歩 |
| A04 | ai-setup-troublesome | AI導入 めんどくさい | AI導入が「めんどくさい」で止まる理由と、手間を減らす始め方 |
| A05 | ai-consultation-desk | AI相談窓口 | AI相談窓口の作り方｜「○○相談窓口」を専用URLで用意する方法 |
| A06 | branded-ai-chat | 会社名 AIチャット | 会社名・ロゴ・専用URLで使えるAIチャットの作り方 |
| A07 | chatgpt-for-company | ChatGPT 自社専用 | ChatGPTを自社専用のように会社で使う方法と注意点 |
| A08 | chatgpt-business-use | ChatGPT 法人利用 | ChatGPTの法人利用・社内利用で押さえる基本と進め方 |
| A09 | claude-for-company | Claude 会社で使う | Claudeを会社で使うには？自社専用のように使う方法 |
| A10 | gemini-for-company | Gemini 会社で使う | Geminiを会社で使うには？自社専用のように使う方法 |
| A11 | ai-chat-easy-setup | AIチャット 簡単導入 | AIチャットを簡単に導入する方法｜難しい設定なしで始める |
| A12 | ai-chat-low-cost | AIチャット 低コスト | AIチャットの費用はいくら？低コストで小さく始める考え方 |
| A13 | inquiry-handling-ai | AI問い合わせ対応 | 問い合わせ対応をAIで楽にする方法｜一次対応から始める |
| A14 | too-many-ai-tools | AIツール 多すぎる | AIツールが多すぎて選べない人へ｜まず1つに絞る考え方 |
| A15 | internal-helpdesk-ai | 社内相談窓口 AI | 社内相談窓口をAIにする方法｜総務・情シスのよくある質問を一次対応 |

### 内部リンクのハブ構造（参考）
- A01(自社専用) ⇄ A02(オリジナル) を中核に、A06(ブランド)・A03(何から)・各AI別(A07-A10)へ展開
- A04(めんどくさい)→A11(簡単)・A12(費用)、A05(相談窓口)→A06・A13・A15
- 全記事 → nAIly LP（CV）

### 公開スケジュール案（同日一括を避ける・例）
1. 第1陣（CV近接）：A01 / A05 / A06
2. 第2陣（簡単・費用・問い合わせ）：A11 / A12 / A13
3. 第3陣（各AI別）：A07 / A09 / A10 / A08
4. 第4陣（認知・基礎）：A02 / A03 / A04 / A14 / A15
※1〜3日おき、または週数本ペースで。`article-production-plan.md` の優先度(S/A/B)も参考に。

## 7. 成果物

- nAIlyのブログに**15本を統合した開発ブランチ**（既存破壊なし・ビルド通過）
- **公開日スケジュール**（スタガー設定済み）
- **残課題リスト**（画像生成・実LP URL確定・ブランドカラー反映 など）
- 統合後の**QA結果**

不明点（nAIlyの実frontmatter形式・実LP URL・ブランドカラー）は、勝手に断定せず確認してください。

==== ここまで依頼文 ====

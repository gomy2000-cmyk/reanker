# 画像案・生成プロンプト｜A15 社内相談窓口をAIにする

対象記事：`drafts/015-internal-helpdesk-ai.md`
画像枚数：4枚（本文 約1,500字あたり1枚の目安）

---

## 共通デザイン仕様（全画像に適用）

> ⚠️ **ブランドカラー要確認**：このリポジトリは別サービス（ReAnker）のものです。ナイリー（nAIly）の正式なブランドカラーが未確定のため、下記は「落ち着いたトーン」の安全な仮指定です。**正式なブランドカラー確定後に色を差し替えてください。**

共通のデザイン仕様（背景・余白・色数・テイスト・文字の扱いなど）は、**`image-prompts/001-company-dedicated-ai-chat.md` を参照**してください。本ファイルでは要点のみ再掲します。

- **背景**：オフホワイト（目安 #F7F7F5）または白。フラットな単色。
- **余白**：要素の外周に十分な余白（キャンバスの5〜8%以上）。詰め込みすぎない。
- **色数**：3〜4色以内（ベース＋文字＋アクセント1〜2色）。
  - 文字色：ダークグレー（目安 #333333）
  - アクセント：落ち着いたブルー／ネイビー（仮 #2F5D8A）
  - 補助アクセント：控えめな黄色（薄い黄色アンダーライン用、仮 #F2D680）
- **デザインテイスト**：フラットイラスト／シンプルな図解／カード型／UIモック風。落ち着いた業務的トーン。
- **禁止表現（共通・必須）**：グラデーション／3D表現／ネオン／サイバーパンク／近未来風／過剰な光・粒子・ホログラム／青紫の派手な発光／いかにもAI生成っぽい質感／人物の強い登場。
- **文字について**：AI画像生成は日本語テキストが崩れやすいため、**図中の日本語ラベルは Figma / Canva 等で後から載せる**ことを推奨。生成プロンプトは「テキストなしの土台」を作る用途と考える。

---

## img-A15-01｜記事冒頭アイキャッチ（社内相談窓口の概念図）

- **用途**：記事トップのアイキャッチ（OGP兼用）。「社内向けの相談窓口」であることを一目で伝える。
- **画像サイズ**：1200×630px
- **比率**：1.91:1
- **背景**：オフホワイト単色
- **余白**：中央寄せ、外周に広めの余白
- **色数**：3色（ベース＋ダークグレー＋ブルー）
- **デザインテイスト**：シンプルなフラット図解。中央にチャットウィンドウのアイコン、その周りを社内を示すシンプルな建物（オフィスビル）の輪郭がやさしく囲む構図。「社内だけ」を示す控えめな囲い線。
- **入れる要素**：チャット吹き出しの簡易アイコン／社内を示すオフィスビルの簡易シルエット枠／専用URLを示すアドレスバー風の細長い角丸。
- **入れない要素**：写実的な人物、実在ロゴ、複雑な背景、社外を連想させる派手な要素。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・テキストなしの土台用）**：
  > Flat minimal vector illustration of a simple chat window placed inside a calm outline of an office building, on an off-white background, suggesting an internal-only help desk. A thin rounded address-bar shape suggests a custom URL, and a subtle enclosing frame implies "internal use only". Calm navy blue and dark gray, 3 colors max, generous white space, business-like, no gradients, no 3D, no neon, no people, no glow or particles. Leave space for Japanese text to be added later.

## img-A15-02｜総務・情シス・人事の社内相談窓口マップ（担当別カード）

- **用途**：社内で向いている用途を、総務・情シス・人事の担当別カードで整理して示す。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：3〜4枚のカード間に十分な間隔、外周余白
- **色数**：3〜4色
- **デザインテイスト**：横並び（または2×2）のカード型。各カードに担当（総務／情シス／人事／全社共通）を示す小さなアイコン枠と、質問例を置く行プレースホルダ。
- **入れる要素**：3〜4枚のフラットカード／各カード上部に小見出し枠／担当を示す控えめなアイコン枠（書類・歯車・人のシルエット記号など、簡素なもの）／質問例の行。
- **入れない要素**：実在サービス名・実在ロゴ、写実的な人物、にぎやかな装飾。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > Three to four side-by-side flat cards on a white background, representing internal help-desk categories (general affairs, IT, HR, common). Each card has a small simple icon placeholder at top and blank lines for question examples. Minimal, flat, calm navy accents, 3-4 colors, lots of white space, no gradients, no 3D, no neon, no people. Leave blank areas for Japanese labels.

## img-A15-03｜AIに任せる範囲／人が対応する範囲の役割分担図（社内向け）

- **用途**：社内相談窓口で「AIに任せること」と「人が対応すること」の役割分担を整理した2カラム図。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：オフホワイト
- **余白**：2カラム間に間隔
- **色数**：3色（＋AI側＝ブルー、人側＝控えめなアンバー）
- **デザインテイスト**：2カラムの対比図。左＝AIに任せる（チャット／吹き出しの簡易アイコン）、右＝人が対応（人のシルエットを連想させる控えめな記号）。中央にやさしい仕切り線。
- **入れる要素**：左カラムにチャット系アイコンと箇条書き行／右カラムに担当者を示す控えめな記号と箇条書き行／中央の仕切り。
- **入れない要素**：×印の強い赤、警告的な派手色、写実的な人物。
- **禁止表現**：共通仕様に準拠（特にグラデーション禁止）。
- **生成プロンプト（英語・土台用）**：
  > A clean two-column flat layout on off-white showing a division of roles. Left column with a simple chat/AI icon and blank bullet lines, right column with a subtle person-style symbol in muted amber and blank bullet lines, divided by a thin calm line. Navy and dark gray accents, 3 colors, flat, lots of spacing, no gradients, no 3D, no neon, no realistic people. Leave blank lines for Japanese text.

## img-A15-04｜記事下部CTA用カード（社内向け・公開範囲は社内）

- **用途**：記事下部CTA横のイメージ。社内向けの相談窓口を、専用URL・ロゴで“社内の窓口”として用意できることを示す。公開範囲が社内であることを控えめに表現。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：中央のチャットカードの周囲に余白
- **色数**：3色
- **デザインテイスト**：UIモック風のチャットカード1枚。ヘッダーにロゴ枠＋窓口名スペース、上部に専用URLバー。カードの隅に「社内のみ」を示す控えめな鍵（ロック）アイコンの小枠。
- **入れる要素**：角丸のチャットウィンドウ／ロゴ枠／窓口名のテキストスペース／URLバー風要素／送信ボタン風の角丸ボタン／控えめな鍵アイコンの小枠。
- **入れない要素**：実在ロゴ・実在URL、写実的な人物、にぎやかな装飾、派手な警告色。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > A single flat UI mockup of a chat window on white, rounded corners, header area with a square logo placeholder and a blank space for a help-desk name, a thin custom-URL bar at top, a simple rounded send button, and a small subtle lock icon in a corner implying internal-only access. Calm navy and dark gray, 3 colors, minimal, no gradients, no 3D, no neon, no people, no glow. Leave blank areas for Japanese text.

# 画像案・生成プロンプト｜A08 ChatGPTの法人利用・社内利用

対象記事：`drafts/008-chatgpt-business-use.md`
画像枚数：4枚（本文 約1,500字あたり1枚の目安）

---

## 共通デザイン仕様（全画像に適用）

> ⚠️ **ブランドカラー要確認**：このリポジトリは別サービス（ReAnker）のものです。ナイリー（nAIly）の正式なブランドカラーが未確定のため、下記は「落ち着いたトーン」の安全な仮指定です。**正式なブランドカラー確定後に色を差し替えてください。**

**共通デザイン仕様の詳細は `image-prompts/001-company-dedicated-ai-chat.md` を参照してください。** 以下はその要点の再掲です。

- **背景**：オフホワイト（目安 #F7F7F5）または白。フラットな単色。
- **余白**：要素の外周に十分な余白（キャンバスの5〜8%以上）。詰め込みすぎない。
- **色数**：3〜4色以内（ベース＋文字＋アクセント1〜2色）。
  - 文字色：ダークグレー（目安 #333333）
  - アクセント：落ち着いたブルー／ネイビー（仮 #2F5D8A）
  - 補助アクセント：控えめな黄色（薄い黄色アンダーライン用、仮 #F2D680）／注意表現には控えめなアンバー
- **デザインテイスト**：フラットイラスト／シンプルな図解／カード型／UIモック風。落ち着いた業務的トーン。
- **入れない要素（共通）**：写実的な人物、ブランドと無関係なアイコンの大量使用、意味のない装飾、実在サービス名・実在ロゴ（ChatGPT/OpenAI等のロゴは入れない）。
- **禁止表現（共通・必須）**：グラデーション／3D表現／ネオン／サイバーパンク／近未来風／過剰な光・粒子・ホログラム／青紫の派手な発光／いかにもAI生成っぽい質感。
- **文字について**：AI画像生成は日本語テキストが崩れやすいため、**図中の日本語ラベルは Figma / Canva 等で後から載せる**ことを推奨。生成プロンプトは「テキストなしの土台」を作る用途と考える。

---

## img-A08-01｜記事冒頭アイキャッチ

- **用途**：記事トップのアイキャッチ（OGP兼用）。「個人利用」と「法人・社内利用」の分かれ道＝会社で使うと気にすることが増える、という概念を一目で伝える。
- **画像サイズ**：1200×630px
- **比率**：1.91:1
- **背景**：オフホワイト単色
- **余白**：中央寄せ、外周に広めの余白
- **色数**：3色（ベース＋ダークグレー＋ブルー）
- **デザインテイスト**：シンプルなフラット図解。中央にチャット吹き出しのアイコンを置き、そこから2方向に分かれる細い経路（個人／会社）を示す。会社側にビル風アイコンとチェック項目の枠を添える。
- **入れる要素**：チャット吹き出しの簡易アイコン／二股に分かれる細い経路（分かれ道）／片方にビル（会社）を示す簡易アイコン／確認項目を示す小さなチェック枠。
- **入れない要素**：人物、実在ロゴ（ChatGPT/OpenAIロゴ）、複雑な背景。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・テキストなしの土台用）**：
  > Flat minimal vector illustration on an off-white background showing a simple chat speech-bubble icon at the center, with a thin path splitting into two directions, one side marked by a small office building icon and a tiny checklist box. Calm navy blue and dark gray, 3 colors max, generous white space, business-like, no gradients, no 3D, no neon, no people, no glow or particles, no brand logos. Leave space for Japanese text to be added later.

## img-A08-02｜個人利用 vs 法人・社内利用（左右比較カード）

- **用途**：「個人利用」と「法人・社内利用」で、決めごと・確認すべきことが増える違いを左右で比較。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：2カード間に十分な間隔、外周余白
- **色数**：3〜4色
- **デザインテイスト**：カード型の左右比較。左＝個人利用（グレー基調・シンプル）、右＝法人・社内利用（ブルーの細い枠で強調・チェック項目が多い）。
- **入れる要素**：2枚のカード／各カード上部に小見出し枠／右カードに複数のチェック行（確認項目が増えるイメージ）と小さな鍵アイコン1つ。
- **入れない要素**：実在サービス名・実在ロゴ、人物、派手な警告色。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > Two side-by-side flat cards on a white background comparing two usage modes. Left card neutral gray and simple, right card highlighted with a thin navy outline containing several checklist rows and one small lock icon to suggest more things to confirm. Minimal, flat, 3-4 colors, lots of white space, no gradients, no 3D, no neon, no people, no brand logos. Leave blank areas for Japanese labels.

## img-A08-03｜社内利用で最初に決める3つ（チェックリスト図）

- **用途**：社内利用でまず決める「①入力してよい情報の範囲 ②利用のルール ③誰がどう使うか」を3項目のチェックリストとして整理。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：オフホワイト
- **余白**：3項目間に均等な間隔
- **色数**：3色（＋チェック＝ブルー、注意＝控えめなアンバー）
- **デザインテイスト**：縦または横並びの3カード／3行のチェックリスト。番号（1・2・3）と各項目の見出し枠、チェックマーク。①に小さな仕切り（入力してよい／しないの線引き）を示すアイコンを添える。
- **入れる要素**：①②③の番号バッジ／各項目の見出し枠と本文行プレースホルダ／チェックマーク（✓）／①に「区切り・線引き」を示す簡易アイコン。
- **入れない要素**：×印の強い赤、警告的な派手色、人物、実在ロゴ。
- **禁止表現**：共通仕様に準拠（特にグラデーション禁止）。
- **生成プロンプト（英語・土台用）**：
  > A clean flat layout on off-white showing three numbered cards or three checklist rows, each with a number badge (1, 2, 3), a heading box, body placeholder lines, and a simple check icon. The first item includes a small divider icon suggesting a boundary between allowed and not-allowed. Calm navy accents with muted amber for caution, 3 colors, flat, lots of spacing, no gradients, no 3D, no neon, no people, no brand logos. Leave blank lines for Japanese text.

## img-A08-04｜記事下部CTA用カード（会社名・ロゴ・専用URLで使える入口）

- **用途**：記事下部CTA横のイメージ。会社名・ロゴ・専用URLで“自社専用のような”入口を1つ持つことを示す。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：中央のチャットカードの周囲に余白
- **色数**：3色
- **デザインテイスト**：UIモック風のチャットカード1枚。ヘッダーにロゴ枠＋会社名スペース、上部に専用URLバー。社員が同じ入口から使うイメージとして、入口を指す小さな矢印を添えてもよい。
- **入れる要素**：角丸のチャットウィンドウ／ロゴ枠／会社名のテキストスペース／URLバー風要素／送信ボタン風の角丸ボタン。
- **入れない要素**：実在ロゴ・実在URL（ChatGPT/OpenAI等）、人物、にぎやかな装飾。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > A single flat UI mockup of a chat window on white, rounded corners, header area with a square logo placeholder and a blank space for a company name, a thin custom-URL bar at top, and a simple rounded send button. Optionally a small arrow pointing to the entry. Calm navy and dark gray, 3 colors, minimal, no gradients, no 3D, no neon, no people, no glow, no brand logos. Leave blank areas for Japanese text.

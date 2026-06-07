# 画像案・生成プロンプト｜A01 自社専用AIチャット

対象記事：`drafts/001-company-dedicated-ai-chat.md`
画像枚数：4枚（本文 約1,500字あたり1枚の目安）

---

## 共通デザイン仕様（全画像に適用）

> ⚠️ **ブランドカラー要確認**：このリポジトリは別サービス（ReAnker）のものです。ナイリー（nAIly）の正式なブランドカラーが未確定のため、下記は「落ち着いたトーン」の安全な仮指定です。**正式なブランドカラー確定後に色を差し替えてください。**

- **背景**：オフホワイト（目安 #F7F7F5）または白。フラットな単色。
- **余白**：要素の外周に十分な余白（キャンバスの5〜8%以上）。詰め込みすぎない。
- **色数**：3〜4色以内（ベース＋文字＋アクセント1〜2色）。
  - 文字色：ダークグレー（目安 #333333）
  - アクセント：落ち着いたブルー／ネイビー（仮 #2F5D8A）
  - 補助アクセント：控えめな黄色（薄い黄色アンダーライン用、仮 #F2D680）
- **デザインテイスト**：フラットイラスト／シンプルな図解／カード型／UIモック風。落ち着いた業務的トーン。
- **入れない要素（共通）**：写実的な人物、ブランドと無関係なアイコンの大量使用、意味のない装飾。
- **禁止表現（共通・必須）**：グラデーション／3D表現／ネオン／サイバーパンク／近未来風／過剰な光・粒子・ホログラム／青紫の派手な発光／いかにもAI生成っぽい質感。
- **文字について**：AI画像生成は日本語テキストが崩れやすいため、**図中の日本語ラベルは Figma / Canva 等で後から載せる**ことを推奨。生成プロンプトは「テキストなしの土台」を作る用途と考える。

---

## img-A01-01｜記事冒頭アイキャッチ

- **用途**：記事トップのアイキャッチ（OGP兼用）。「自社専用AIチャット」の概念を一目で伝える。
- **画像サイズ**：1200×630px
- **比率**：1.91:1
- **背景**：オフホワイト単色
- **余白**：中央寄せ、外周に広めの余白
- **色数**：3色（ベース＋ダークグレー＋ブルー）
- **デザインテイスト**：シンプルなフラット図解。中央にチャットウィンドウのアイコン、その中に「会社のロゴ枠」を示す四角プレースホルダ。
- **入れる要素**：チャット吹き出しの簡易アイコン／会社ロゴを置く四角い枠／専用URLを示すアドレスバー風の細長い角丸。
- **入れない要素**：人物、実在ロゴ、複雑な背景。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・テキストなしの土台用）**：
  > Flat minimal vector illustration of a simple chat window on an off-white background, with an empty square placeholder for a company logo inside the chat header, and a thin rounded address-bar shape suggesting a custom URL. Calm navy blue and dark gray, 3 colors max, generous white space, business-like, no gradients, no 3D, no neon, no people, no glow or particles. Leave space for Japanese text to be added later.

## img-A01-02｜一般AIチャット vs 自社専用AIチャット（左右比較カード）

- **用途**：「ふつうのAIチャット」と「自社専用AIチャット」の違いを左右で比較。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：2カード間に十分な間隔、外周余白
- **色数**：3〜4色
- **デザインテイスト**：カード型の左右比較。左＝一般（グレー基調）、右＝自社専用（ブルーの細い枠で強調）。
- **入れる要素**：2枚のカード／各カード上部に小見出し枠／右カードにロゴ枠・URLバー風要素。
- **入れない要素**：実在サービス名・実在ロゴ、人物。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > Two side-by-side flat cards on a white background comparing two chat interfaces. Left card neutral gray, right card highlighted with a thin navy outline and a small logo placeholder and custom-URL bar. Minimal, flat, 3-4 colors, lots of white space, no gradients, no 3D, no neon, no people. Leave blank areas for Japanese labels.

## img-A01-03｜できること／できないこと チェックリスト

- **用途**：自社専用AIチャットの「得意」「過度な期待は禁物」を整理したチェックリスト図。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：オフホワイト
- **余白**：2カラム間に間隔
- **色数**：3色（＋チェック＝ブルー、注意＝控えめなアンバー）
- **デザインテイスト**：2カラムのチェックリスト。左にチェックマーク、右に控えめな「！」マーク。
- **入れる要素**：チェックマーク（✓）アイコン／注意（！）アイコン／箇条書きの行プレースホルダ。
- **入れない要素**：×印の強い赤、警告的な派手色、人物。
- **禁止表現**：共通仕様に準拠（特にグラデーション禁止）。
- **生成プロンプト（英語・土台用）**：
  > A clean two-column flat checklist layout on off-white. Left column with simple check icons, right column with subtle exclamation icons in muted amber. Thin lines, calm navy accents, 3 colors, flat, lots of spacing, no gradients, no 3D, no neon, no people. Leave blank lines for Japanese text.

## img-A01-04｜記事下部CTA用カード（会社名・ロゴ・専用URL）

- **用途**：記事下部CTA横のイメージ。会社名・ロゴ・専用URLで“自社専用風”になることを示す。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：中央のチャットカードの周囲に余白
- **色数**：3色
- **デザインテイスト**：UIモック風のチャットカード1枚。ヘッダーにロゴ枠＋会社名スペース、上部に専用URLバー。
- **入れる要素**：角丸のチャットウィンドウ／ロゴ枠／会社名のテキストスペース／URLバー風要素／送信ボタン風の角丸ボタン。
- **入れない要素**：実在ロゴ・実在URL、人物、にぎやかな装飾。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > A single flat UI mockup of a chat window on white, rounded corners, header area with a square logo placeholder and a blank space for a company name, a thin custom-URL bar at top, and a simple rounded send button. Calm navy and dark gray, 3 colors, minimal, no gradients, no 3D, no neon, no people, no glow. Leave blank areas for Japanese text.

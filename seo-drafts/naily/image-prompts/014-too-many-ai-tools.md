# 画像案・生成プロンプト｜A14 AIツールが多すぎて選べない

対象記事：`drafts/014-too-many-ai-tools.md`
画像枚数：4枚（本文 約1,500字あたり1枚の目安。フロントマターの image_count と一致）

---

## 共通デザイン仕様（全画像に適用）

> ⚠️ **ブランドカラー要確認**：このリポジトリは別サービス（ReAnker）のものです。ナイリー（nAIly）の正式なブランドカラーが未確定のため、下記は「落ち着いたトーン」の安全な仮指定です。**正式なブランドカラー確定後に色を差し替えてください。**

**共通デザイン仕様は `image-prompts/001-company-dedicated-ai-chat.md` を参照してください。** 要点を以下に再掲します。

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

## img-A14-01｜記事冒頭アイキャッチ

- **用途**：記事トップのアイキャッチ（OGP兼用）。「AIツールが多すぎて選べない」状態を一目で伝える。
- **画像サイズ**：1200×630px
- **比率**：1.91:1
- **背景**：オフホワイト単色
- **余白**：中央寄せ、外周に広めの余白
- **色数**：3色（ベース＋ダークグレー＋ブルー）
- **デザインテイスト**：シンプルなフラット図解。たくさんの同じような四角いカード（ツールに見立てた無地のカード）が並び、その前で1人分の小さなクエスチョンマークが浮かぶ程度の控えめな表現。混乱を「散らかり」ではなく「整然と多い」で示す。
- **入れる要素**：同じ形の無地カードを多数（6〜9枚程度）格子状に／そのうち1枚だけ細いネイビー枠で軽く強調／小さなクエスチョンマーク1つ。
- **入れない要素**：実在サービス名・実在ロゴ、人物、雑然とした装飾、矢印の多用。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・テキストなしの土台用）**：
  > Flat minimal vector illustration on an off-white background showing many identical blank rounded cards arranged in a neat grid, suggesting too many similar tools, with exactly one card softly highlighted by a thin navy outline, and a single small question mark above. Calm navy blue and dark gray, 3 colors max, generous white space, business-like, no gradients, no 3D, no neon, no people, no glow or particles. Leave space for Japanese text to be added later.

## img-A14-02｜「選べない」3つの原因の整理図

- **用途**：「情報が多すぎる／どれも似て見える／比較が終わらない」という3つの原因を整理した図。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：3要素の間に十分な間隔、外周余白
- **色数**：3色
- **デザインテイスト**：横3分割の3カラム図解。各カラムにシンプルなアイコン（積み重なった四角＝情報過多／そっくりな2枚のカード＝似て見える／円環状の矢印＝終わらない比較）と、下に短いラベル枠。
- **入れる要素**：3カラムの区切り／各カラム上部にシンプルな線アイコン／各カラム下にラベル用の空き枠。
- **入れない要素**：人物、警告色の派手な赤、実在ロゴ。
- **禁止表現**：共通仕様に準拠（特にグラデーション禁止）。
- **生成プロンプト（英語・土台用）**：
  > A clean three-column flat infographic on white. Column one: a small stack of papers icon (information overload). Column two: two nearly identical card shapes side by side (look-alike tools). Column three: a simple circular arrow loop (never-ending comparison). Thin lines, calm navy accents, dark gray, 3 colors, flat, lots of spacing, no gradients, no 3D, no neon, no people. Leave blank label areas for Japanese text.

## img-A14-03｜絞るための3つの基準（チェックリスト図）

- **用途**：「目的に合うか／始めやすいか／続けやすいか」の3基準を整理したチェックリスト図。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：オフホワイト
- **余白**：各行の間に間隔、外周余白
- **色数**：3色（＋チェック＝ブルー）
- **デザインテイスト**：縦に3行のチェックリスト。各行の左に控えめなチェックマーク、右にラベル用の細長い空き枠。落ち着いた業務的トーン。
- **入れる要素**：チェックマーク（✓）アイコン3つ／3行の空きラベル枠／全体を囲む細い角丸ボックス（任意）。
- **入れない要素**：×印の強い赤、点数やスコア表示、人物、にぎやかな装飾。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > A clean vertical flat checklist on off-white with three rows, each row starting with a simple muted navy check icon followed by a blank rounded label bar. Optional thin rounded container around all rows. Minimal, flat, 3 colors, calm navy and dark gray, lots of spacing, no gradients, no 3D, no neon, no people, no glow. Leave blank lines for Japanese text.

## img-A14-04｜記事下部CTA用カード（まず1つに絞って試す）

- **用途**：記事下部CTA横のイメージ。「たくさんの選択肢から1つに絞って試す」ことを示す。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：中央のカードの周囲に余白
- **色数**：3色
- **デザインテイスト**：複数の無地カードが薄く背景に並ぶ中、手前に1枚だけチャットウィンドウ風のカードがはっきり立ち上がる構図。「多くの中から1つを選んで試す」を静かに表現。手前のカードのヘッダーにロゴ枠＋会社名スペース、上部に専用URLバー風要素。
- **入れる要素**：背景に淡い無地カード数枚（控えめ）／手前に角丸のチャットウィンドウ1枚／ロゴ枠／会社名のテキストスペース／URLバー風要素／送信ボタン風の角丸ボタン。
- **入れない要素**：実在ロゴ・実在URL、人物、にぎやかな装飾、背景カードを目立たせすぎる強い色。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > A flat illustration on white where several faint blank rounded cards sit softly in the background, and one chat-window card stands clearly in the foreground with rounded corners, a square logo placeholder and blank company-name space in its header, a thin custom-URL bar at top, and a simple rounded send button. Suggesting picking one to try out of many. Calm navy and dark gray, 3 colors, minimal, no gradients, no 3D, no neon, no people, no glow. Leave blank areas for Japanese text.

# 画像案・生成プロンプト｜A12 AIチャット 低コスト

対象記事：`drafts/012-ai-chat-low-cost.md`
画像枚数：4枚（本文 約1,500字あたり1枚の目安）

---

## 共通デザイン仕様（全画像に適用）

> 共通デザイン仕様は `image-prompts/001-company-dedicated-ai-chat.md` を参照してください（背景・余白・色数・テイスト・禁止表現の詳細はそちらに集約しています）。本ファイルでは要点のみ再掲します。

> ⚠️ **ブランドカラー要確認**：このリポジトリは別サービス（ReAnker）のものです。ナイリー（nAIly）の正式なブランドカラーが未確定のため、下記は「落ち着いたトーン」の安全な仮指定です。**正式なブランドカラー確定後に色を差し替えてください。**

- **背景**：オフホワイト（目安 #F7F7F5）または白。フラットな単色。
- **余白**：要素の外周に十分な余白（キャンバスの5〜8%以上）。詰め込みすぎない。
- **色数**：3〜4色以内（ベース＋文字＋アクセント1〜2色）。
  - 文字色：ダークグレー（目安 #333333）
  - アクセント：落ち着いたブルー／ネイビー（仮 #2F5D8A）
  - 補助アクセント：控えめな黄色（薄い黄色アンダーライン用、仮 #F2D680）
- **デザインテイスト**：フラットイラスト／シンプルな図解／カード型／UIモック風。落ち着いた業務的トーン。
- **禁止表現（共通・必須）**：グラデーション／3D表現／ネオン／サイバーパンク／近未来風／過剰な光・粒子・ホログラム／青紫の派手な発光／いかにもAI生成っぽい質感。
- **入れない要素（共通）**：写実的な人物、ブランドと無関係なアイコンの大量使用、意味のない装飾、実在サービス名・実在ロゴ、具体的な金額・通貨記号での価格表示（誤解防止のため数値は載せない）。
- **文字について**：AI画像生成は日本語テキストが崩れやすいため、**図中の日本語ラベルは Figma / Canva 等で後から載せる**ことを推奨。生成プロンプトは「テキストなしの土台」を作る用途と考える。

---

## img-A12-01｜記事冒頭アイキャッチ

- **用途**：記事トップのアイキャッチ（OGP兼用）。「AIチャットの費用は何で決まる？」という問いをやさしく示す。
- **画像サイズ**：1200×630px
- **比率**：1.91:1
- **背景**：オフホワイト単色
- **余白**：中央寄せ、外周に広めの余白
- **色数**：3色（ベース＋ダークグレー＋ブルー）
- **デザインテイスト**：シンプルなフラット図解。中央にチャット吹き出しのアイコン、その横に「？」を示す円と、大小の積み木（コスト＝大きさの比喩）を控えめに配置。
- **入れる要素**：チャット吹き出しの簡易アイコン／クエスチョンマーク（？）の円／大小のシンプルなブロック（費用の大きさを暗示）。
- **入れない要素**：人物、実在ロゴ、複雑な背景、具体的な金額・通貨記号（¥や数字）。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・テキストなしの土台用）**：
  > Flat minimal vector illustration on an off-white background showing a simple chat bubble icon next to a small question-mark circle and a few plain blocks of different sizes suggesting variable cost. Calm navy blue and dark gray, 3 colors max, generous white space, business-like, no gradients, no 3D, no neon, no people, no glow or particles, no currency symbols or numbers. Leave space for Japanese text to be added later.

## img-A12-02｜費用を左右する要素（つまみ）カード図

- **用途**：費用が変わる要素（作り込み・使う範囲・機能の多さ・運用の手間・任せる範囲）を整理したカード図。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：カード間に十分な間隔、外周余白
- **色数**：3〜4色
- **デザインテイスト**：横並びの小カード5枚（またはスライダー／つまみ風アイコンを並べた図）。各カードに小さなアイコン枠と、ラベル用の空きスペース。
- **入れる要素**：5つの並んだカード、または上下に動くスライダー（つまみ）風の図／各項目の簡易アイコン枠（歯車・人・チェックなどシンプルなもの）。
- **入れない要素**：実在サービス名・実在ロゴ、人物の写実表現、具体的な金額。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > A clean row of five flat cards (or simple vertical sliders/knobs) on a white background, each card with a small simple icon area and blank space for a label, representing factors that affect cost. Minimal, flat, 3-4 colors, calm navy accents, lots of white space, no gradients, no 3D, no neon, no people, no numbers. Leave blank areas for Japanese labels.

## img-A12-03｜低コストで始める3つのコツ チェックリスト

- **用途**：「用途を絞る／小さく始める／作り込みすぎない」の3つのコツを整理したチェックリスト図。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：オフホワイト
- **余白**：各項目の間に間隔
- **色数**：3色（＋チェック＝ブルー）
- **デザインテイスト**：3項目の縦並びチェックリスト。各行に控えめなチェックマークと、テキスト用の空き行。
- **入れる要素**：チェックマーク（✓）アイコン3つ／各行のラベル用プレースホルダ／必要に応じて「小さく→大きく」を示す控えめな矢印。
- **入れない要素**：×印の強い赤、警告的な派手色、人物、具体的な金額。
- **禁止表現**：共通仕様に準拠（特にグラデーション禁止）。
- **生成プロンプト（英語・土台用）**：
  > A clean vertical three-item checklist on off-white, each row with a simple check icon in calm navy and a blank line for Japanese text. Optional subtle small-to-large arrow suggesting starting small. Thin lines, 3 colors, flat, lots of spacing, no gradients, no 3D, no neon, no people, no numbers. Leave blank lines for Japanese labels.

## img-A12-04｜記事下部CTA用カード（小さく始めて広げるイメージ）

- **用途**：記事下部CTA横のイメージ。「小さく始めて、必要な分だけ広げる」AIチャットを低コストで持つ様子を示す。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：中央のチャットカードの周囲に余白
- **色数**：3色
- **デザインテイスト**：UIモック風のチャットカード1枚。ヘッダーにロゴ枠＋会社名スペース、上部に専用URLバー。横に「小さく始める」を示す控えめなステップ表現（小→中の段階）。
- **入れる要素**：角丸のチャットウィンドウ／ロゴ枠／会社名のテキストスペース／URLバー風要素／送信ボタン風の角丸ボタン／段階を示す控えめな小ブロック。
- **入れない要素**：実在ロゴ・実在URL、人物、にぎやかな装飾、具体的な金額・通貨記号。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > A single flat UI mockup of a chat window on white, rounded corners, header area with a square logo placeholder and a blank space for a company name, a thin custom-URL bar at top, and a simple rounded send button. Beside it, a subtle small-to-medium step shape suggesting starting small and growing. Calm navy and dark gray, 3 colors, minimal, no gradients, no 3D, no neon, no people, no glow, no numbers or currency symbols. Leave blank areas for Japanese text.

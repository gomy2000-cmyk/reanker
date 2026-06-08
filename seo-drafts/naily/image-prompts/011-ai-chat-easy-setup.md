# 画像案・生成プロンプト｜A11 AIチャット簡単導入

対象記事：`drafts/011-ai-chat-easy-setup.md`
画像枚数：4枚（本文 約1,500字あたり1枚の目安）

---

## 共通デザイン仕様（全画像に適用）

> ⚠️ **ブランドカラー要確認**：このリポジトリは別サービス（ReAnker）のものです。ナイリー（nAIly）の正式なブランドカラーが未確定のため、下記は「落ち着いたトーン」の安全な仮指定です。**正式なブランドカラー確定後に色を差し替えてください。**

**共通デザイン仕様は `image-prompts/001-company-dedicated-ai-chat.md` を参照してください。** 以下に要点を再掲します。

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

## img-A11-01｜記事冒頭アイキャッチ

- **用途**：記事トップのアイキャッチ（OGP兼用）。「難しい設定なしで、AIチャットを簡単に始める」を一目で伝える。
- **画像サイズ**：1200×630px
- **比率**：1.91:1
- **背景**：オフホワイト単色
- **余白**：中央寄せ、外周に広めの余白
- **色数**：3色（ベース＋ダークグレー＋ブルー）
- **デザインテイスト**：シンプルなフラット図解。チャット吹き出しのアイコンと、その手前に大きなチェックマーク（＝かんたん・OKのイメージ）。複雑な歯車やコードは置かない。
- **入れる要素**：チャット吹き出しの簡易アイコン／大きめのチェックマーク（✓）／軽さを示す短い角丸ライン2〜3本。
- **入れない要素**：人物、実在ロゴ、複雑な配線・歯車の山、難しそうな設定画面。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・テキストなしの土台用）**：
  > Flat minimal vector illustration on an off-white background showing a simple chat bubble icon with a large friendly checkmark in front of it, suggesting easy and ready-to-use. Calm navy blue and dark gray, 3 colors max, generous white space, business-like and reassuring, no gradients, no 3D, no neon, no gears clutter, no people, no glow or particles. Leave space for Japanese text to be added later.

## img-A11-02｜「簡単」の3要素（設定・開始・利用）カード図

- **用途**：AIチャット導入における「簡単」が、設定・開始・利用の3つに分かれることを整理したカード図。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：3カード間に均等な間隔、外周余白
- **色数**：3〜4色
- **デザインテイスト**：横並び3枚のフラットカード。各カードに小さなアイコン枠＋見出し枠＋短い本文行。3枚とも同じトーンで、難しさを感じさせない。
- **入れる要素**：3枚の角丸カード／各カード上部にシンプルなアイコン枠（設定＝シンプルな歯車1個、開始＝右向き矢印、利用＝チャット吹き出し）／見出しと本文のプレースホルダ行。
- **入れない要素**：実在サービス名・実在ロゴ、人物、複雑なフローチャート。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > Three side-by-side flat cards on a white background, each with a simple icon area at the top (a single minimal gear, a right arrow, a chat bubble) and blank lines below for a heading and short text. Calm navy and dark gray, 3-4 colors, equal spacing, lots of white space, flat and tidy, no gradients, no 3D, no neon, no people. Leave blank areas for Japanese labels.

## img-A11-03｜すぐ使うための3つのコツ チェックリスト

- **用途**：「用途を1つに絞る／小さく始める／完璧を目指さない」の3つのコツを並べたチェックリスト図。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：オフホワイト
- **余白**：各行の間に余白、外周余白
- **色数**：3色（＋チェック＝ブルー）
- **デザインテイスト**：縦に3行のシンプルなチェックリスト。各行の先頭に控えめなチェックマーク、右側に見出し行のプレースホルダ。落ち着いた印象。
- **入れる要素**：チェックマーク（✓）アイコン3つ／各行の見出し・補足のプレースホルダ行／全体を囲む細い角丸枠（任意）。
- **入れない要素**：×印の強い赤、警告色、人物、にぎやかな装飾。
- **禁止表現**：共通仕様に準拠（特にグラデーション禁止）。
- **生成プロンプト（英語・土台用）**：
  > A clean vertical checklist of three rows on an off-white background, each row starting with a subtle navy check icon and blank lines for a heading and short note. Optional thin rounded frame around the list. Calm navy and dark gray, 3 colors, generous spacing, flat, no gradients, no 3D, no neon, no people, no warning colors. Leave blank lines for Japanese text.

## img-A11-04｜記事下部CTA用カード（「決めるだけ」で始められるチャットUIモック）

- **用途**：記事下部CTA横のイメージ。「決めて、伝える」だけで始められる手軽さを、チャットUIモックで示す。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：中央のチャットカードの周囲に余白
- **色数**：3色
- **デザインテイスト**：UIモック風のチャットカード1枚。ヘッダーにロゴ枠＋会社名スペース、上部に専用URLバー、入力欄の横にシンプルな送信ボタン。複雑な設定項目は描かない（＝簡単さの表現）。
- **入れる要素**：角丸のチャットウィンドウ／ロゴ枠／会社名のテキストスペース／専用URLバー風要素／送信ボタン風の角丸ボタン。
- **入れない要素**：実在ロゴ・実在URL、人物、難しそうな設定パネル、にぎやかな装飾。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > A single flat UI mockup of a simple chat window on white, rounded corners, header area with a square logo placeholder and a blank space for a company name, a thin custom-URL bar at top, an input field with a simple rounded send button, and no complex settings panels. Calm navy and dark gray, 3 colors, minimal and easy-looking, no gradients, no 3D, no neon, no people, no glow. Leave blank areas for Japanese text.

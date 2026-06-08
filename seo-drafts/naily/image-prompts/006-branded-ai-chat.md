# 画像案・生成プロンプト｜A06 会社名・ブランドで使うAIチャット

対象記事：`drafts/006-branded-ai-chat.md`
画像枚数：4枚（本文 約1,500字あたり1枚の目安）

---

## 共通デザイン仕様（全画像に適用）

> ⚠️ **ブランドカラー要確認**：このリポジトリは別サービス（ReAnker）のものです。ナイリー（nAIly）の正式なブランドカラーが未確定のため、下記は「落ち着いたトーン」の安全な仮指定です。**正式なブランドカラー確定後に色を差し替えてください。**

**共通デザイン仕様は `image-prompts/001-company-dedicated-ai-chat.md` を参照してください。**（背景・余白・色数・テイスト・文字の扱いは001と統一）

再掲（重要なポイント）：

- **背景**：オフホワイト（目安 #F7F7F5）または白。フラットな単色。
- **余白**：要素の外周に十分な余白（キャンバスの5〜8%以上）。詰め込みすぎない。
- **色数**：3〜4色以内（ベース＋文字＋アクセント1〜2色）。
  - 文字色：ダークグレー（目安 #333333）
  - アクセント：落ち着いたブルー／ネイビー（仮 #2F5D8A）
  - 補助アクセント：控えめな黄色（薄い黄色アンダーライン用、仮 #F2D680）
- **デザインテイスト**：フラットイラスト／シンプルな図解／カード型／UIモック風。落ち着いた業務的トーン。
- **禁止表現（共通・必須）**：グラデーション／3D表現／ネオン／サイバーパンク／近未来風／過剰な光・粒子・ホログラム／青紫の派手な発光／いかにもAI生成っぽい質感。
- **入れない要素（共通）**：写実的な人物、実在ロゴ・実在サービス名・実在URL、ブランドと無関係なアイコンの大量使用、意味のない装飾。
- **文字について**：AI画像生成は日本語テキストが崩れやすいため、**図中の日本語ラベルは Figma / Canva 等で後から載せる**ことを推奨。生成プロンプトは「テキストなしの土台」を作る用途と考える。

---

## img-A06-01｜記事冒頭アイキャッチ

- **用途**：記事トップのアイキャッチ（OGP兼用）。「会社名・ロゴ入りのAIチャット」を一目で伝える。
- **画像サイズ**：1200×630px
- **比率**：1.91:1
- **背景**：オフホワイト単色
- **余白**：中央寄せ、外周に広めの余白
- **色数**：3色（ベース＋ダークグレー＋ブルー）
- **デザインテイスト**：シンプルなフラット図解。中央に角丸のチャットウィンドウ1枚、ヘッダーに会社ロゴを置く四角枠と会社名のテキストスペース、上部に専用URLを示すアドレスバー風の角丸。
- **入れる要素**：角丸チャットウィンドウ／ロゴを置く四角い枠／会社名用の空きスペース／専用URLを示す細長い角丸のアドレスバー。
- **入れない要素**：人物、実在ロゴ、実在URL、複雑な背景。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・テキストなしの土台用）**：
  > Flat minimal vector illustration of a single rounded chat window on an off-white background. The header has an empty square placeholder for a company logo and a blank space for a company name, with a thin rounded address-bar shape at the top suggesting a custom URL. Calm navy blue and dark gray, 3 colors max, generous white space, business-like, no gradients, no 3D, no neon, no people, no glow or particles. Leave space for Japanese text to be added later.

## img-A06-02｜ふつうのAIチャット vs 会社名・ブランド版（左右比較カード）

- **用途**：「ふつうのAIチャット」と「会社名・ブランドで使うAIチャット」の“見え方”の違いを左右で比較。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：2カード間に十分な間隔、外周余白
- **色数**：3〜4色
- **デザインテイスト**：カード型の左右比較。左＝ふつう（グレー基調、ロゴ枠なし）、右＝会社名・ブランド版（ブルーの細い枠で強調、ロゴ枠＋会社名スペース＋専用URLバー）。
- **入れる要素**：2枚のチャットカード／各カード上部に小見出し枠／右カードにロゴ枠・会社名スペース・URLバー風要素。
- **入れない要素**：実在サービス名・実在ロゴ・実在URL、人物。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > Two side-by-side flat cards on a white background comparing two chat interfaces. Left card neutral gray with a generic header and no logo. Right card highlighted with a thin navy outline, a small square logo placeholder, a blank company-name space, and a custom-URL bar. Minimal, flat, 3-4 colors, lots of white space, no gradients, no 3D, no neon, no people. Leave blank areas for Japanese labels.

## img-A06-03｜自社らしく見せる3つの効果（社内定着・顧客の安心・ブランド一貫性）

- **用途**：会社名・ロゴ・専用URLにすると変わる3つの効果を整理した図。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：オフホワイト
- **余白**：3要素の間に均等な間隔
- **色数**：3色（ベース＋ダークグレー＋ブルー）
- **デザインテイスト**：3つの横並びカード（または3カラム）。それぞれにシンプルな線アイコン1つ（社内定着＝建物や人の集まりを抽象化した簡易アイコン／顧客の安心＝チェック付きの吹き出し／ブランド一貫性＝そろった四角の並び）。各カードの下に説明テキスト用の空き行。
- **入れる要素**：3つの均等なカード／各カードに控えめな線アイコン1つ／説明テキスト用の空き行プレースホルダ。
- **入れない要素**：にぎやかな多色アイコン、人物の写実表現、過剰な装飾。
- **禁止表現**：共通仕様に準拠（特にグラデーション・3D禁止）。
- **生成プロンプト（英語・土台用）**：
  > A clean flat layout on off-white with three equal cards in a row. Each card has one simple thin-line icon: an abstract building/group icon, a speech bubble with a small check, and a set of aligned squares suggesting consistency. Calm navy accents and dark gray, 3 colors, flat, generous spacing, no gradients, no 3D, no neon, no people. Leave blank lines under each icon for Japanese text.

## img-A06-04｜業種別・名前の付け方の例（カード一覧）

- **用途**：業種別の名前の付け方の例を並べたカード図。本文の表を視覚的に補助。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：カード間・外周に十分な余白
- **色数**：3色
- **デザインテイスト**：複数の小さなカード（6枚程度）をグリッドで配置。各カードはロゴ枠（小さな四角）＋名前テキスト用の空きスペースのシンプルな構成。業種を示す控えめな線アイコンを各カードに1つ。
- **入れる要素**：6枚程度のグリッドカード／各カードに小さなロゴ枠＋名前用空きスペース／業種を示す控えめな線アイコン。
- **入れない要素**：実在ロゴ・実在社名、人物、派手な色分け。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > A flat grid of about six small cards on a white background. Each card has a small square logo placeholder and a blank space for a name, plus one subtle thin-line industry icon (shop, factory, document, building, fork-and-spoon, headset). Calm navy and dark gray, 3 colors, minimal, even spacing, no gradients, no 3D, no neon, no people, no glow. Leave blank areas for Japanese text.

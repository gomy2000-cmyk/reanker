# 画像案・生成プロンプト｜A10 Geminiを会社で使う

対象記事：`drafts/010-gemini-for-company.md`
画像枚数：4枚（本文 約1,500字あたり1枚の目安）

> **共通デザイン仕様は `image-prompts/001-company-dedicated-ai-chat.md` の「共通デザイン仕様」を参照。**
> 要点：背景はオフホワイト／白・フラット、色数3〜4色、ダークグレー文字＋落ち着いたブルー＋控えめな黄色、十分な余白。
> 禁止（必須）：グラデーション／3D／ネオン／サイバーパンク／近未来／過剰な光・粒子・ホログラム／青紫の派手な発光／人物の強い登場／いかにもAI生成っぽい質感。
> ⚠️ ナイリーの正式ブランドカラー確定後に色を差し替えること。日本語ラベルは後載せ推奨。
> ⚠️ Gemini・Google など実在サービス名／実在ロゴ／公式カラーは画像に入れない（無関係な汎用チャットUIの土台として作る）。

---

## img-A10-01｜記事冒頭アイキャッチ（Geminiを会社で使うイメージ図）

- **用途**：記事トップのアイキャッチ（OGP兼用）。「身近なAIチャットを会社の入口にまとめる」イメージを一目で伝える。
- **画像サイズ**：1200×630px
- **比率**：1.91:1
- **背景**：オフホワイト単色
- **余白**：中央寄せ、外周に広めの余白
- **色数**：3色（ベース＋ダークグレー＋ブルー）
- **デザインテイスト**：シンプルなフラット図解。中央にチャットウィンドウのアイコン、ヘッダーに会社ロゴを置く四角プレースホルダ、上部に専用URL風の細長い角丸バー。
- **入れる要素**：チャット吹き出しの簡易アイコン／会社ロゴを置く四角い枠／専用URLを示すアドレスバー風の角丸。
- **入れない要素**：人物、実在ロゴ、実在サービス名、複雑な背景。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・テキストなしの土台用）**：
  > Flat minimal vector illustration of a simple generic chat window on an off-white background, with an empty square placeholder for a company logo in the chat header and a thin rounded address-bar shape suggesting a custom URL. Calm navy blue and dark gray, 3 colors max, generous white space, business-like, no gradients, no 3D, no neon, no people, no glow or particles, no brand logos. Leave space for Japanese text to be added later.

## img-A10-02｜個人利用と会社利用の違い（左右比較カード）

- **用途**：「個人で使う場合」と「会社で使う場合」の違いを左右で比較。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：2カード間に十分な間隔、外周余白
- **色数**：3〜4色
- **デザインテイスト**：カード型の左右比較。左＝個人（グレー基調・単独の小さなアイコン）、右＝会社（ブルーの細い枠で強調・複数アイコンと共通の入口）。
- **入れる要素**：2枚のカード／各カード上部に小見出し枠／左カードに1人分の簡易アイコン／右カードに複数の簡易アイコンと共通入口を示す角丸枠。
- **入れない要素**：写実的な人物、実在サービス名・実在ロゴ。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > Two side-by-side flat cards on a white background comparing personal use and company use of a chat tool. Left card neutral gray with a single simple user glyph, right card highlighted with a thin navy outline showing several simple user glyphs sharing one common rounded entry box. Minimal, flat, 3-4 colors, lots of white space, no gradients, no 3D, no neon, no realistic people, no brand logos. Leave blank areas for Japanese labels.

## img-A10-03｜自社専用風にする利点チェックリスト図

- **用途**：自社専用のように使う利点（入口がそろう／案内しやすい／うちのAIに見える／名前で呼べる）を整理したチェックリスト図。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：オフホワイト
- **余白**：行間・外周に余白
- **色数**：3色（＋チェック＝ブルー）
- **デザインテイスト**：1カラムのチェックリスト。各行の左にシンプルなチェックマーク、右に短いラベル枠。
- **入れる要素**：チェックマーク（✓）アイコン／4行程度の箇条書き行プレースホルダ／控えめなロゴ枠を1つ添える。
- **入れない要素**：×印の強い赤、警告的な派手色、人物。
- **禁止表現**：共通仕様に準拠（特にグラデーション禁止）。
- **生成プロンプト（英語・土台用）**：
  > A clean single-column flat checklist layout on off-white with about four rows, each row starting with a simple check icon and a short blank label bar, plus one small logo placeholder as a subtle accent. Thin lines, calm navy accents, 3 colors, flat, lots of spacing, no gradients, no 3D, no neon, no people, no brand logos. Leave blank lines for Japanese text.

## img-A10-04｜ChatGPT/Claude/Geminiを中立に並べた比較イメージ＋ナイリー導線

- **用途**：3つの代表的AIを優劣なく中立に横並びで示し、その下に「どれを土台にしても自社専用風にできる」というナイリーへの導線（共通の入口カード）を置く。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：3カード間・上下に余白
- **色数**：3〜4色（3カードはすべて同じトーンで、優劣を感じさせない）
- **デザインテイスト**：上段に同じ大きさ・同じ配色の3カードを横並び（実名は入れず①②③のような無記名枠）。下段に1枚の共通入口カード（ロゴ枠＋専用URLバー）を置き、上の3カードから下のカードへ細い線でゆるくまとめる。
- **入れる要素**：同サイズ・同配色の3枚の無記名カード／下段の共通入口カード（ロゴ枠・URLバー・送信ボタン風角丸）／3→1へまとめる細い線。
- **入れない要素**：実在サービス名・実在ロゴ・公式カラー、優劣を示すランキングや順位、人物。
- **禁止表現**：共通仕様に準拠。どれかを大きく強調して優劣に見せないこと。
- **生成プロンプト（英語・土台用）**：
  > A neutral flat comparison layout on white. Top row: three equally sized, equally colored unlabeled cards placed side by side with no ranking or emphasis. Bottom: a single shared entry card with a square logo placeholder, a thin custom-URL bar and a simple rounded send button, connected from the three cards above by thin calm lines. Minimal, flat, 3-4 colors, lots of white space, no gradients, no 3D, no neon, no people, no brand logos, no ranking. Leave blank areas for Japanese labels.

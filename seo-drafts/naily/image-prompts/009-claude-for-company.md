# 画像案・生成プロンプト｜A09 Claudeを会社で使う

対象記事：`drafts/009-claude-for-company.md`
画像枚数：4枚（本文 約1,500字あたり1枚の目安）

---

## 共通デザイン仕様（全画像に適用）

> ⚠️ **ブランドカラー要確認**：このリポジトリは別サービス（ReAnker）のものです。ナイリー（nAIly）の正式なブランドカラーが未確定のため、下記は「落ち着いたトーン」の安全な仮指定です。**正式なブランドカラー確定後に色を差し替えてください。**

共通のデザイン仕様（背景・余白・色数・テイスト・文字の扱いなど）は、**`image-prompts/001-company-dedicated-ai-chat.md` を参照**してください。本ファイルでは各画像の個別指定のみを記載します。下記の禁止リストとブランドカラー要確認は再掲です。

- **禁止表現（共通・必須）**：グラデーション／3D表現／ネオン／サイバーパンク／近未来風／過剰な光・粒子・ホログラム／青紫の派手な発光／いかにもAI生成っぽい質感／人物の強い登場。
- **許容**：薄い黄色アンダーライン／控えめなボックス／比較表／チェックリスト／シンプルカード／UIモック風／フラット図解。
- **仮配色**：オフホワイト背景（目安 #F7F7F5）＋ダークグレー文字（目安 #333333）＋落ち着いたブルー／ネイビー（仮 #2F5D8A）＋控えめな黄色（仮 #F2D680）。3〜4色以内。
- **文字について**：AI画像生成は日本語が崩れやすいため、**図中の日本語ラベルは Figma / Canva 等で後載せ**を推奨。生成プロンプトは「テキストなしの土台」を作る用途。
- **入れない要素（共通）**：実在ロゴ・実在サービス名・実在URL、写実的な人物、意味のない装飾。

---

## img-A09-01｜記事冒頭アイキャッチ（Claudeを会社で使うイメージ）

- **用途**：記事トップのアイキャッチ（OGP兼用）。「気に入ったAIを会社で／自社専用のように使う」概念を一目で伝える。
- **画像サイズ**：1200×630px
- **比率**：1.91:1
- **背景**：オフホワイト単色
- **余白**：中央寄せ、外周に広めの余白
- **色数**：3色（ベース＋ダークグレー＋ネイビー）
- **デザインテイスト**：シンプルなフラット図解。中央にチャットウィンドウのアイコン、ヘッダーに「会社のロゴ枠」を示す四角プレースホルダ、上部に専用URL風の細長い角丸バー。
- **入れる要素**：チャット吹き出しの簡易アイコン／ロゴを置く四角い枠／専用URLを示すアドレスバー風の角丸。落ち着いた印象の余白多めレイアウト。
- **入れない要素**：人物、実在ロゴ、複雑な背景、にぎやかな装飾。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・テキストなしの土台用）**：
  > Flat minimal vector illustration of a single chat window on an off-white background, with an empty square placeholder for a company logo in the chat header and a thin rounded address-bar shape suggesting a custom URL. Calm navy blue and dark gray, 3 colors max, generous white space, quiet and business-like. No gradients, no 3D, no neon, no people, no glow or particles. Leave space for Japanese text to be added later.

## img-A09-02｜個人利用 vs 会社利用（左右比較カード）

- **用途**：「個人で使う場合」と「会社で使う場合」の違いを左右で比較。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：2カード間に十分な間隔、外周余白
- **色数**：3〜4色
- **デザインテイスト**：カード型の左右比較。左＝個人利用（グレー基調、ユーザー1人分のシンプルな吹き出し）、右＝会社利用（ネイビーの細い枠で強調、複数人を示す吹き出し＋ロゴ枠・URLバー風要素）。
- **入れる要素**：2枚のカード／各カード上部に小見出し枠／右カードにロゴ枠・専用URLバー風要素・複数の吹き出し。
- **入れない要素**：実在サービス名・実在ロゴ、写実的な人物。
- **禁止表現**：共通仕様に準拠。
- **生成プロンプト（英語・土台用）**：
  > Two side-by-side flat cards on a white background comparing personal vs company use of a chat tool. Left card neutral gray with a single speech bubble; right card highlighted with a thin navy outline, several small speech bubbles, a small logo placeholder and a custom-URL bar. Minimal, flat, 3-4 colors, lots of white space. No gradients, no 3D, no neon, no people. Leave blank areas for Japanese labels.

## img-A09-03｜自社専用風にする利点 チェックリスト

- **用途**：自社専用風にする良さ（入口がそろう／案内しやすい／うちのAIに見える／名前で呼べる）を整理したチェックリスト図。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：オフホワイト
- **余白**：各項目の行間にゆとり
- **色数**：3色（チェック＝ネイビー）
- **デザインテイスト**：1〜2カラムのチェックリスト。各行にシンプルなチェックマーク（✓）と、項目テキスト用の空きスペース。落ち着いた業務的トーン。
- **入れる要素**：チェックマーク（✓）アイコン／4行ほどの項目プレースホルダ／控えめな見出し枠。
- **入れない要素**：×印の強い赤、警告的な派手色、人物。
- **禁止表現**：共通仕様に準拠（特にグラデーション禁止）。
- **生成プロンプト（英語・土台用）**：
  > A clean checklist layout on off-white listing four benefits, each row starting with a simple navy check icon and a blank space for a short label. Thin lines, calm navy accents, 3 colors, flat, generous spacing. No gradients, no 3D, no neon, no people. Leave blank lines for Japanese text.

## img-A09-04｜ChatGPT/Claude/Geminiを中立に並べた比較＋ナイリー導線

- **用途**：「どれが一番ではなく、どれを土台にしても自社専用風にできる」という中立メッセージを示す図。3つを横並びにし、その下に1つの「自社専用風の入口」へ集約するイメージ。
- **画像サイズ**：1200×675px
- **比率**：16:9
- **背景**：白
- **余白**：3カード間に等間隔、下部要素との間にも余白
- **色数**：3〜4色（3カードは同格・同サイズで優劣を感じさせない配色）
- **デザインテイスト**：上段に同じ大きさ・同じトーンの無地カード3枚（ラベルは後載せ前提で空欄、優劣をつけない均等デザイン）。下段にロゴ枠＋専用URLバー付きの「自社専用風チャットカード」を1枚置き、3カードから下のカードへ細い線でゆるくつなぐ。
- **入れる要素**：均等な3枚の無地カード／中央下に1枚のチャットカード（ロゴ枠・URLバー風要素）／3→1へ向かう控えめな接続線。
- **入れない要素**：実在ロゴ・実在サービス名、順位・ランキングを示す数字や王冠、矢印で優劣を示す表現、人物。
- **禁止表現**：共通仕様に準拠。どれかを強調して「一番」に見せないこと。
- **生成プロンプト（英語・土台用）**：
  > A neutral flat diagram on a white background: three identical blank cards in a row at the top, all the same size and tone so none looks superior, and one chat-window card below them with a small logo placeholder and a thin custom-URL bar. Thin quiet connector lines from the three cards down to the single card. Calm navy and dark gray, 3-4 colors, minimal, lots of white space. No ranking, no crowns, no numbers, no gradients, no 3D, no neon, no people. Leave blank areas for Japanese labels.

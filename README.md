# ReAnker (reanker.com)

> 競合のリリースに、アンカーを。

PR TIMES・Google Newsから競合企業の記事を自動取得・通知するBtoB向け競合監視SaaS。

## 機能

- Google SSOログイン（NextAuth）
- アンカー登録（サービス名／キーワード／ドメイン）
- PR TIMESスクレイピング + Google News（SerpAPI）
- Vercel Cronで毎日自動取得・通知（Slack・メール）
- ダッシュボード（曜日別／時間帯別グラフ・サマリーテーブル）
- 記事一覧（既読切替・プレビューペイン）
- Stripe決済（フリー／スタンダード）
- CSVエクスポート

## セットアップ

### 1. 依存インストール

```bash
cd raisuto
npm install
```

### 2. 環境変数

`.env.local` を編集：

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=（openssl rand -base64 32）
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SERPAPI_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_STANDARD_PRICE_ID=...
RESEND_API_KEY=...
CRON_SECRET=（任意の文字列）
```

### 3. Supabaseセットアップ

`supabase/schema.sql` をSupabase SQL Editorで実行。

### 4. 起動

```bash
npm run dev
```

http://localhost:3000

## ディレクトリ構成

```
app/
  (app)/                認証必須ページ群（共通レイアウト）
    dashboard/
    anchor/[id]/      記事一覧
    anchor/edit/      登録/編集
    settings/
  api/
    auth/[...nextauth]/ NextAuth
    anchor/           CRUD
    items/              既読更新
    user/               プロフィール更新
    cron/fetch/         01:00 JST 記事取得
    cron/notify/        09:00 JST 通知
    stripe/             checkout・portal・webhook
  login/
components/             TopNav, SideNav
lib/
  supabase.ts           Supabaseクライアント
  auth.ts               requireUser
  scraper.ts            PR TIMES, Google News取得
  notify.ts             Slack, メール送信
  stripe.ts             Stripe SDK
  types.ts              型定義
supabase/schema.sql     DB定義
vercel.json             Cron定義
```

## Vercel Cron

- 01:00 JST (16:00 UTC) `/api/cron/fetch` — 前日分の記事取得
- 09:00 JST (00:00 UTC) `/api/cron/notify` — 未通知分をSlack・メール送信

Cron実行時は `Authorization: Bearer $CRON_SECRET` ヘッダーで認証。

## プラン

| | フリー | スタンダード（¥300/月） |
|---|---|---|
| アンカー登録 | 3件まで | 無制限 |
| 更新頻度 | 隔日 | 毎日 |
| 通知 | メールのみ | Slack + メール |
| エクスポート | × | CSV |

## Founder's note

**リスク**: PR TIMESのスクレイピングは規約・構造変更リスク。RSS／公式API化が次の検証ポイント。SerpAPIは月$50〜と原価が重い。MVPで黒字化を確認できたら自前のGoogle News実装を検討。

**次の検証ステップ**: ローンチ前にLPテストで「PR TIMESウェブクリッピングを使えない層が月300円で来るか」を検証。3週間で30名サインアップが取れなければICP・価格を再検討。

**Kill or Double down**: 月30名以上のサインアップ × 月次解約率5%未満 → ダブルダウン（他サイト連携・チーム機能）。それ以下なら個人向けはピボットしBtoB企業向け年契約モデルへ。

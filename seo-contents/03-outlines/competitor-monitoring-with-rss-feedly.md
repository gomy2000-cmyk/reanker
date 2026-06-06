# アウトライン｜RSS・Feedlyで競合監視を組む実務ガイド

`content/blog/competitor-monitoring-with-rss-feedly.md` 用のアウトライン（Step 3）。本文は未着手。

## 提案 frontmatter

```yaml
---
title: "RSS・Feedlyで競合監視を組む実務ガイド｜設定から運用まで"
description: "RSS・Feedly で競合監視を組む手順を、フィード収集・整理・通知の3ステップで解説。PR TIMES や企業ブログのRSS取得、Feedlyの設定、限界と自動化への移行ポイントまで実務的にまとめます。"
ogTitle: "RSS・Feedlyで競合監視を組む方法"
publishedAt: "2026-07-07"
updatedAt: "2026-07-07"
category: "competitor-monitoring"
tags: ["競合監視", "RSS", "Feedly", "自動化", "情報収集"]
---
```

## 記事メタ
- **検索意図**: Do（RSS/Feedlyで競合監視を具体的に構築したい）
- **想定読者**: 無料〜低コストで競合監視を始めたい個人・小規模チーム。
- **主KW**: Feedly 競合監視 / **副KW**: RSS 競合 監視、競合 RSS まとめ、Feedly 使い方 競合
- **想定文字数**: 約3,000字
- **差別化（vs 既存）**: 既存はSlack通知やGoogleアラートの文脈で断片的にRSSへ言及する程度。本記事はRSS/Feedly構築の専用手順ガイド。

## リード（導入）方針
- 「無料で競合監視を始めるならまずRSS」。ただしRSSが廃止・非提供のサイトも増えている現実から入る。
- Feedlyで集約 → 整理 → 通知までを手順化し、限界も正直に書くと予告。

## 本文アウトライン

### H2: RSSで競合監視ができる範囲・できない範囲
- できる: 企業ブログ・ニュースサイト・一部プレスリリース・Googleニュースの検索RSS
- できない/弱い: RSS非提供サイト、SNS、JS描画ページ、料金ページの変更
- 「RSSは万能ではない」を最初に明示

### H2: 競合の情報源からRSSを集める
#### H3: 企業ブログ・オウンドメディア
- `/feed` `/rss` を試す、フィード検出の方法
#### H3: Googleニュースを検索RSSにする
- 検索クエリをRSS化して競合名・キーワードで取得（→ 既存記事に接続）
#### H3: PR TIMESなどリリース系
- 取得可否と遅延・ノイズの注意（→ 既存のGoogleアラート限界記事に接続）

### H2: Feedlyでの整理術
- フォルダ分け（直接競合／業界／キーワード）
- 既読管理・お気に入り・ミュート
- 無料プランの上限（フィード数・機能制限）と有料の損益分岐

### H2: 通知に変える（埋もれさせない）
- Feedly単体だと「見に行く」運用になり続かない
- メール/Slackへ流す方法（→ 新規nocode-zapierに接続）
- 「毎朝まとめて1通」に寄せる設計

### H2: RSS/Feedly運用の限界と次の一手
- RSS非提供・SNS・サイト変更は別手段が必要（→ サイト更新監視へ）
- 取りこぼし・ノイズ・属人化が溜まったら専用SaaSへ移行 → ReAnker CTA

### H2: まとめ
- まずRSS/Feedlyで無料スタート。続かない/取りこぼすなら自動化へ段階的に移行

## 内部リンク配置
- 本文中: [競合ニュースをSlackに自動通知する方法](/blog/slack-competitor-news-notification)、[Googleアラートで競合監視はできるか](/blog/google-alerts-competitor-monitoring)、[PR TIMESとGoogle Newsを1ツールで監視](/blog/prtimes-and-google-news-monitoring)
- 関連（末尾）: [競合調査を自動化する方法](/blog/automate-competitor-research)、（新規）[Zapier・Makeで競合監視を自動化](/blog/nocode-competitor-monitoring-zapier)

## CTA
- **強**。RSS/Feedlyの限界（取りこぼし・属人化）→「PR TIMES + Google News をまとめて毎朝1通」の [ReAnker](/) へ移行を提案。

// Description を 120-160字に拡張・統一する
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'content', 'blog')

// slug -> 新 description（120-160字を目安に、KW と具体ベネフィットを含める）
const desc = {
  // === BtoB マーケ ===
  'abm-starter-guide':
    'ABM（アカウントベースドマーケティング）の基本概念と、中小企業でも3ヶ月で立ち上げられる実務フローを解説。ターゲットアカウント選定、3階層のチャネル設計、営業連携、効果測定までを整理します。',
  'btob-content-marketing-starter':
    'BtoB コンテンツマーケティングを6ヶ月で立ち上げる実務フローを解説。KW 選定の3層構造、編集体制、CV 導線、効果測定、競合観察まで、現場で使える進め方をまとめました。',
  'btob-customer-success-marketing':
    'BtoB カスタマーサクセス（CS）とマーケティングの連携で、LTV・解約率・アップセル率を改善する実務フローを解説。CS が持つ顧客知見をマーケに還流させる分業設計を整理します。',
  'btob-kpi-design':
    'BtoB マーケの KPI を、事業貢献・質・量の3層構造で設計する実務的な方法を解説。リード数だけに偏らず、商談化率・受注金額・チャネル別 KPI まで踏み込んだ指標設計をまとめます。',
  'btob-lead-generation-methods':
    'BtoB のリード獲得手法10種類を、コスト・成果スピード・運用負荷で比較。SEO・広告・展示会・ウェビナー・ABM・アウトバウンドまで、自社に合う打ち手の選び方を整理します。',
  'btob-lead-nurturing-design':
    'BtoB のリードナーチャリング（リード育成）を、ステージ分け・コンテンツ設計・配信頻度・営業引き渡しまで6ステップで解説。MA 運用と組み合わせた実務的なフローを整理します。',
  'btob-marketer-competitor-research':
    'BtoB マーケターが日常的に押さえるべき競合情報を整理。プレスリリース・導入事例・セミナー・採用・価格改定など5領域の情報源と、自動化のコツを実務目線で解説します。',
  'btob-marketing-basics':
    'BtoB マーケティングの全体像を、実務担当者の視点で整理。BtoC との違い、リード獲得から商談化までの基本ファネル、押さえるべき主要5施策と失敗パターンまで一気通貫で解説します。',
  'btob-saas-funnel-design':
    'BtoB SaaS のマーケファネル設計を、AIDA・AARRR・PLG の3モデルで整理。プロダクト特性に応じた選び方と、各ステージの KPI、離脱率改善のコツまで解説します。',
  'btob-seo-basics':
    'BtoB SEO で成果を出す基本を、検索意図の3分類・KW 選定の3層構造・E-E-A-T 対応・内部リンク設計の4軸で実務目線に解説。流入から商談化までのトラッキング設計も整理します。',
  'exhibition-marketing-roi':
    'BtoB 展示会の費用対効果を最大化する実務フローを、出展前の設計・当日のリード獲得・出展後の追客の3フェーズで解説。名刺1枚あたりのCPA を3,000円台に抑えるコツも整理します。',
  'ma-tool-introduction-guide':
    'BtoB の MA（マーケティングオートメーション）ツール導入を、選定3軸・運用体制・初期設定の優先順位で整理。HubSpot・Marketo・SATORI など主要ツールの向き不向きも解説します。',
  'webinar-marketing-basics':
    'BtoB ウェビナーを継続運用して成果を出す実務フローを、テーマ選定・集客・当日運営・追客の4フェーズで解説。月1回開催のリズム、申込→参加率の目安、定着のコツまで整理します。',

  // === 広報・PR ===
  'crisis-communication-basics':
    '企業のクライシスコミュニケーション（危機広報）を、初動・対外発信・継続対応・再発防止の4フェーズで詳細に解説。3類型ごとの対応フロー、第一報の文例、業界別の留意点まで網羅します。',
  'internal-communication-basics':
    '社内広報（インターナルコミュニケーション）を、全社MTG・社内報・1on1・社内SNS の組み合わせで設計する実務フローを解説。エンゲージメント測定と離職予防まで整理します。',
  'ir-communication-basics':
    'IR（Investor Relations）広報の基本を、法定開示・適時開示・任意開示の3類型と決算説明会・個人投資家向け発信で解説。上場準備中の企業が押さえるべき体制構築も整理します。',
  'media-interview-preparation':
    'メディア取材を受ける際の準備と当日の振る舞いを解説。事前準備7項目、想定QA、メッセージ3本柱、答えにくい質問への対応、撮影対応、取材後フォローまでの実務フローを整理します。',
  'media-relations-basics':
    'BtoB 広報のメディアリレーション構築を、記者リスト作成・初回アプローチ・継続フォロー・取材化までの流れで詳細に解説。メール文例、業界別の注意点、属人化を避ける運用設計まで網羅します。',
  'pr-effectiveness-measurement':
    'PR・広報の効果を、露出本数・広告換算費・認知率・行動と事業貢献の4段階で測定する実務フローを解説。SOV 算出、月次レポートの作り方、採用効果まで含めた指標設計を整理します。',
  'pr-kpi-design':
    '広報・PR の成果を定量的に評価する KPI 設計を、事業貢献・質・量の3層構造で詳細に解説。SOV・好意的記事比率・採用貢献まで含めた現場で使える指標と運用フローを整理します。',
  'press-release-timing':
    'プレスリリースの配信曜日・時刻の選び方を、メディア閲覧の傾向と業界別の傾向で解説。火・水・木の10〜11時が定番である理由、避けるべき日時、エンバーゴ活用まで実務目線で整理します。',
  'press-release-writing-guide':
    'プレスリリースの書き方を、6類型ごとのテンプレート・タイトル設計・本文構成・配信前チェック・配信後フォローまで一気通貫で解説。メディアに取り上げられやすくする実務的な書き方を網羅します。',
  'prtimes-vs-atpress':
    'PR TIMES・@Press・共同通信PRワイヤー・Dream News・valuepress の5社を、料金・配信先メディア・SEO 効果・操作性・サポートの5軸で徹底比較。業種・規模・用途別の選び方を解説します。',
  'sns-pr-operations':
    'BtoB 企業の SNS 広報運用を、媒体選定・投稿設計・運用体制・効果測定の4軸で整理。X・LinkedIn・Facebook の使い分け、投稿ミックス、炎上防止の3原則まで実務的に解説します。',

  // === 競合監視（既存 + 一部新規）===
  'automate-competitor-research':
    '競合調査を自動化するための実務的な手順を解説。手動チェックの限界、自動化に向く領域・向かない領域、最小構成のツール選定、ありがちな失敗まで個人・小規模チーム向けに整理します。',
  'clipping-service-alternatives':
    '新聞・雑誌・Web を網羅するクリッピングサービスの基本と料金感、個人・小規模チーム向けの現実的な代替手段（Googleアラート・ReAnker・PR TIMES Webクリッピング）を整理します。',
  'clipping-service-freelance':
    'フリーランス・個人事業主が使えるクリッピングサービス・競合監視ツールを比較。月数百円から始められる小規模向けの選択肢と、無料運用の現実、ReAnker の活用法を解説します。',
  'clipping-service-pricing-comparison':
    '主要クリッピングサービスの料金を、Web・新聞・雑誌・テレビのカバー範囲別に比較。月数千円〜数十万円までのレンジで、企業規模に合った選択肢の見つけ方を整理します。',
  'clipping-service-smb-checklist':
    '中小企業・スタートアップがクリッピングサービスを選ぶ際の実務チェックリスト。予算感・カバー媒体・通知方法・運用負荷の4軸で、失敗しない選び方を解説します。',
  'compato-review-alternative':
    'Compato（コンパート）の料金・機能・代替ツールをレビュー。プレスリリース監視 SaaS としての強みと、個人・小規模チームに合う ReAnker などの代替候補を整理して比較します。',
  'cervn-review-alternative':
    'cervn（サーブン）の料金・機能・代替ツールをレビュー。クリッピング SaaS としての位置付けと、月数百円から使える ReAnker など個人・小規模向けの代替候補を比較解説します。',
  'competitor-monitoring-300yen':
    '月額300円から始められる競合監視 SaaS「ReAnker」の使い方を実例で解説。PR TIMES と Google News を1ツールで監視し、毎朝1通の通知で競合動向を把握できる仕組みを紹介します。',
  'competitor-monitoring-complete-guide':
    '個人・小規模チーム向けの競合監視を、無料の手動運用から月300円の SaaS まで規模・予算別に整理した完全ガイド。情報源・通知設計・自動化の判断まで実務目線で解説します。',
  'competitor-press-release-monitoring':
    '競合のプレスリリースを毎日漏れなくチェックする実務的な仕組みを解説。PR TIMES と Google News の特徴、手動運用の限界、5〜8社に絞る選定基準と自動化までのステップを整理します。',
  'elnet-personal-alternative':
    'エルネット（ELNET）の個人向け料金・機能を整理し、より安価な代替ツールを比較。月数十万円のクリッピングサービスではオーバースペックな個人・小規模向けの選択肢を解説します。',
  'google-alerts-competitor-limits':
    'Google アラートで競合監視する際の3つの限界（PR TIMES の取得遅延・ノイズ・Slack 連携の弱さ）を実運用ベースで解説。月数百円から使える代替手段との使い分けも整理します。',
  'google-alerts-competitor-monitoring':
    'Google アラートを使った競合監視の現実を解説。無料の強み、実運用で詰まる5つのポイント、代替手段（PR TIMES Webクリッピング・ReAnker・Feedly・代行）との使い分けを整理します。',
  'pr-team-competitor-info-basics':
    '広報・PR 担当者向けに、競合情報の見方とプレスリリース分析の基本を解説。リリース頻度・タイプ構成・タイミング・メディア・文体の5軸で、業界トレンドの読み取り方を整理します。',
  'prtimes-and-google-news-monitoring':
    'PR TIMES と Google News を1ツールで監視する実務的な方法を解説。手動運用の限界、両者のカバー範囲の違い、5社以下に絞る選定基準と毎朝1通の通知フローを整理します。',
  'prtimes-competitor-monitoring':
    'PR TIMES を使った競合監視の実務的なやり方を解説。企業ページ・キーワード検索・RSS の使い分け、巡回が続かない3つの理由、月額300円から使える自動化ツールの選択肢を整理します。',
  'prtimes-webclipping-alternative':
    'PR TIMES Webクリッピングの月10万円超という料金が合わない個人・小規模チーム向けに、月数百円〜数千円の代替ツールを比較解説。ReAnker など現実解となる選択肢を整理します。',
  'prtimes-webclipping-price-detail':
    'PR TIMES Webクリッピングの料金プランを詳細解説。基本料金・オプション・最低契約期間・解約条件まで、契約前に確認すべきポイントと予算が合わない場合の代替候補を整理します。',
  'slack-competitor-news-notification':
    '競合のプレスリリース・ニュースを Slack に自動で流す方法を、RSS 連携・Zapier・専用 SaaS・クリッピング代行の4選択肢で比較。運用が定着する通知設計のコツも解説します。',
  'slack-press-release-auto-notify':
    '競合プレスリリースを Slack に自動通知する実務的な仕組みを、PR TIMES の RSS 連携と専用ツール（ReAnker）で解説。毎朝1通で前日の新着だけを Slack に流す設計のコツを整理します。',
}

let updated = 0
let skipped = 0
for (const [slug, newDesc] of Object.entries(desc)) {
  const fp = path.join(dir, slug + '.md')
  if (!fs.existsSync(fp)) {
    console.log('MISSING', slug)
    skipped++
    continue
  }
  const c = fs.readFileSync(fp, 'utf8')
  const newC = c.replace(/^(description:\s*)"[^"]*"/m, `$1"${newDesc}"`)
  if (newC === c) {
    console.log('NO CHANGE', slug)
    skipped++
    continue
  }
  fs.writeFileSync(fp, newC)
  console.log('  ' + newDesc.length + ' ' + slug)
  updated++
}
console.log('')
console.log('Updated:', updated, '/ Skipped:', skipped)

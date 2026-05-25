/**
 * ルールベースの記事分類器。
 * タイトルのキーワードマッチで category / importance / importance_reason を返す。
 * AI APIは使わない（コスト0、レイテンシ0、cronの中でも安全に動く）。
 */

export type Category =
  | '新製品・サービス'
  | '資金調達'
  | 'M&A・提携'
  | '人事・採用'
  | 'IR・決算'
  | 'マーケティング'
  | 'その他'

export type Importance = '高' | '中' | '低'

export interface ClassifyResult {
  category: Category
  importance: Importance
  importance_reason: string
}

// --- ルール定義（上から順に評価、最初にマッチしたルールを採用）---
const RULES: Array<{
  category: Category
  importance: Importance
  reason: string
  pattern: RegExp
}> = [
  // 資金調達（インパクト大 → 高）
  {
    category: '資金調達',
    importance: '高',
    reason: '資金調達を実施',
    pattern: /資金調達|シリーズ[A-Za-zＡ-Ｚ]|億円調達|億ドル調達|出資を受け|エクイティ|ラウンド完了/,
  },
  // M&A・買収（インパクト大 → 高）
  {
    category: 'M&A・提携',
    importance: '高',
    reason: 'M&A・買収・合併を発表',
    pattern: /買収|M&A|合併|子会社化|グループ入り|TOB|株式交換|経営統合/,
  },
  // 上場・IPO（インパクト大 → 高）
  {
    category: 'IR・決算',
    importance: '高',
    reason: '上場・IPO情報',
    pattern: /上場|IPO|株式公開|東証|マザーズ|グロース市場|新規上場/,
  },
  // 提携・パートナー（影響中 → 中）
  {
    category: 'M&A・提携',
    importance: '中',
    reason: '業務提携・パートナーシップを締結',
    pattern: /業務提携|パートナーシップ|協業|MOU|戦略的提携|共同開発|アライアンス/,
  },
  // 新製品・サービスローンチ（影響中 → 中）
  {
    category: '新製品・サービス',
    importance: '中',
    reason: '新サービス・新機能をリリース',
    pattern:
      /新サービス|新機能|リリース|ローンチ|提供開始|販売開始|正式公開|β版|ベータ版|新ブランド|新商品|新製品/,
  },
  // 決算・業績（影響中 → 中）
  {
    category: 'IR・決算',
    importance: '中',
    reason: '業績・財務情報',
    pattern: /決算|業績|売上|営業利益|経常利益|純利益|黒字|赤字|通期|四半期|財務/,
  },
  // 人事（影響低 → 低）
  {
    category: '人事・採用',
    importance: '低',
    reason: '人事・採用情報',
    pattern: /採用|求人|入社|就任|代表取締役|CEO|CTO|CFO|COO|役員|退任|異動/,
  },
  // マーケティング施策（影響低 → 低）
  {
    category: 'マーケティング',
    importance: '低',
    reason: 'マーケティング施策・PR',
    pattern:
      /キャンペーン|セール|割引|プレゼント|クーポン|タイアップ|コラボ|限定|イベント|セミナー|展示会|アンバサダー/,
  },
]

/**
 * 記事タイトルを受け取り、category / importance / importance_reason を返す。
 * どのルールにもマッチしない場合は「その他 / 中」を返す。
 */
export function classifyArticle(title: string): ClassifyResult {
  for (const rule of RULES) {
    if (rule.pattern.test(title)) {
      return {
        category: rule.category,
        importance: rule.importance,
        importance_reason: rule.reason,
      }
    }
  }
  return {
    category: 'その他',
    importance: '中',
    importance_reason: '',
  }
}

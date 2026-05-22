/**
 * 記事のカテゴリ・重要度をルールベースで判定する。
 *
 * 将来的にはAIによる分類に置き換え可能。判定結果は items テーブルの
 * category / importance / importance_reason カラムに保存する。
 */

export const CATEGORIES = [
  '新サービス・新機能',
  '導入事例',
  'セミナー・イベント',
  '提携・アライアンス',
  '資金調達・IR',
  '採用・組織',
  'キャンペーン',
  'メディア掲載',
  '価格・プラン変更',
  'その他',
] as const

export type Category = (typeof CATEGORIES)[number]

export type Importance = '高' | '中' | '低'

interface CategoryRule {
  category: Category
  keywords: string[]
}

// 上から順に評価して、最初にマッチしたカテゴリを採用する
const CATEGORY_RULES: CategoryRule[] = [
  { category: '価格・プラン変更', keywords: ['料金', '価格', 'プラン変更', '値上げ', '値下げ', '無料化'] },
  { category: '資金調達・IR', keywords: ['資金調達', '上場', 'IPO', 'IR', '決算', '株主', '配当'] },
  { category: '提携・アライアンス', keywords: ['提携', '連携', '協業', 'パートナー', 'アライアンス', '業務提携'] },
  { category: '新サービス・新機能', keywords: ['新機能', '新サービス', 'リリース', '提供開始', '発表', 'ローンチ', '新製品', '新商品', 'リニューアル'] },
  { category: '導入事例', keywords: ['導入事例', '導入', '採用事例', '活用事例', '事例', '導入決定'] },
  { category: 'セミナー・イベント', keywords: ['セミナー', 'ウェビナー', 'イベント', 'カンファレンス', '勉強会', 'ミートアップ', '展示会', 'EXPO'] },
  { category: 'キャンペーン', keywords: ['キャンペーン', 'プレゼント', '抽選', '無料体験', 'トライアル'] },
  { category: 'メディア掲載', keywords: ['メディア掲載', '掲載', '取材', '紹介', '特集'] },
  { category: '採用・組織', keywords: ['採用', '人事', '組織変更', '組織', '入社', '就任', '退任'] },
]

const HIGH_IMPORTANCE_KEYWORDS = [
  '発表', '提供開始', 'リリース', '提携', '資金調達', '価格', '料金', '上場', 'IPO', '買収',
]

const HIGH_IMPORTANCE_CATEGORIES: Category[] = [
  '新サービス・新機能',
  '提携・アライアンス',
  '資金調達・IR',
  '価格・プラン変更',
]

const MEDIUM_IMPORTANCE_CATEGORIES: Category[] = [
  '導入事例',
  'セミナー・イベント',
  'キャンペーン',
  'メディア掲載',
]

export function classifyCategory(title: string): Category {
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => title.includes(kw))) {
      return rule.category
    }
  }
  return 'その他'
}

export function classifyImportance(
  title: string,
  category: Category
): { importance: Importance; reason: string } {
  // 1. カテゴリ判定が優先
  if (HIGH_IMPORTANCE_CATEGORIES.includes(category)) {
    return { importance: '高', reason: `カテゴリ「${category}」` }
  }

  // 2. 重要キーワード判定（カテゴリで拾えないケース）
  const matchedKeyword = HIGH_IMPORTANCE_KEYWORDS.find((kw) => title.includes(kw))
  if (matchedKeyword) {
    return { importance: '高', reason: `重要キーワード「${matchedKeyword}」を含む` }
  }

  if (MEDIUM_IMPORTANCE_CATEGORIES.includes(category)) {
    return { importance: '中', reason: `カテゴリ「${category}」` }
  }

  return { importance: '低', reason: 'カテゴリ「その他」または明確な重要語なし' }
}

/** 一括分類ヘルパー */
export function classifyArticle(title: string): {
  category: Category
  importance: Importance
  importance_reason: string
} {
  const category = classifyCategory(title)
  const { importance, reason } = classifyImportance(title, category)
  return { category, importance, importance_reason: reason }
}

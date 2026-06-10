/**
 * ルールベースの記事分類器。
 * タイトル＋要約のキーワードマッチで category / importance / importance_reason を返す。
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
    pattern: /資金調達|シリーズ[A-Za-zＡ-Ｚ]|[0-9０-９]+億円(?:を|の)?(?:調達|資金)|億ドル調達|出資を受け|第三者割当|エクイティ|ラウンド(?:完了|実施)|プレシード|シード期|ベンチャーキャピタル|VC(?:から|より)/,
  },
  // M&A・買収（インパクト大 → 高）
  {
    category: 'M&A・提携',
    importance: '高',
    reason: 'M&A・買収・合併を発表',
    pattern: /買収|M&A|合併|子会社化|グループ入り|TOB|株式交換|株式取得|経営統合|事業譲渡|完全子会社/,
  },
  // 上場・IPO（インパクト大 → 高）
  {
    category: 'IR・決算',
    importance: '高',
    reason: '上場・IPO情報',
    pattern: /上場|IPO|株式公開|東証|マザーズ|グロース市場|プライム市場|スタンダード市場|新規上場|Nasdaq|ナスダック/,
  },
  // 提携・パートナー（影響中 → 中）
  {
    category: 'M&A・提携',
    importance: '中',
    reason: '業務提携・パートナーシップを締結',
    pattern: /業務提携|資本提携|パートナーシップ|パートナー契約|協業|連携を開始|MOU|基本合意|戦略的提携|共同開発|共同研究|アライアンス|タッグ/,
  },
  // 新製品・サービスローンチ（影響中 → 中）
  {
    category: '新製品・サービス',
    importance: '中',
    reason: '新サービス・新機能をリリース',
    // 「プレスリリース」「ニュースリリース」の“リリース”は新製品の意味ではないので除外する
    //（PR TIMES の記事文面に頻出し、誤って新製品に分類されるのを防ぐ）。
    pattern:
      /新サービス|新機能|新たに(?:提供|搭載|追加)|(?<!プレス)(?<!ニュース)リリース|ローンチ|提供(?:開始|を開始)|販売開始|発売|提供を始め|正式公開|一般提供|β版|ベータ版|新ブランド|新商品|新製品|アップデート|リニューアル|機能を追加|対応を開始/,
  },
  // 決算・業績（影響中 → 中）
  {
    category: 'IR・決算',
    importance: '中',
    reason: '業績・財務情報',
    pattern: /決算|業績|売上(?:高)?|営業利益|経常利益|純利益|増収|増益|減収|減益|黒字|赤字|通期|四半期|上半期|下半期|財務|配当|自己株式|業績予想/,
  },
  // 受賞・認定（影響中 → 中）
  {
    category: 'その他',
    importance: '中',
    reason: '受賞・認定・ランキング',
    pattern: /受賞|表彰|認定を取得|認証を取得|グランプリ|大賞|最優秀|ランキング(?:1位|第1位|首位)|No\.?1|シェア(?:No|1位|首位)|選出|ISO[0-9０-９]/,
  },
  // 人事（影響低 → 低）
  {
    category: '人事・採用',
    importance: '低',
    reason: '人事・採用情報',
    pattern: /採用|求人|入社|新卒|中途|就任|代表取締役|社長交代|CEO|CTO|CFO|COO|CxO|役員(?:人事|就任|変更)|取締役(?:就任|選任)|退任|異動|組織変更/,
  },
  // マーケティング施策（影響低 → 低）
  {
    category: 'マーケティング',
    importance: '低',
    reason: 'マーケティング施策・PR',
    pattern:
      /キャンペーン|セール|割引|プレゼント|クーポン|タイアップ|コラボ(?:レーション)?|限定(?:発売|販売|商品)|フェア|ポップアップ|イベント(?:を|開催)|出展|セミナー|ウェビナー|展示会|アンバサダー|起用|周年|ノベルティ/,
  },
]

/**
 * 記事タイトル（＋要約）を受け取り、category / importance / importance_reason を返す。
 * タイトル優先でマッチを試み、タイトルで決まらなければ要約も含めて再判定する。
 * どのルールにもマッチしない場合は「その他 / 中」を返す。
 */
export function classifyArticle(title: string, summary?: string | null): ClassifyResult {
  // 1) まずタイトルだけで判定（見出しは要約より情報の密度が高く、誤検知が少ない）。
  for (const rule of RULES) {
    if (rule.pattern.test(title)) {
      return {
        category: rule.category,
        importance: rule.importance,
        importance_reason: rule.reason,
      }
    }
  }
  // 2) タイトルで決まらなければ要約も含めて再判定（取りこぼしを減らす）。
  if (summary) {
    const haystack = `${title} ${summary}`
    for (const rule of RULES) {
      if (rule.pattern.test(haystack)) {
        return {
          category: rule.category,
          importance: rule.importance,
          importance_reason: rule.reason,
        }
      }
    }
  }
  return {
    category: 'その他',
    importance: '中',
    importance_reason: '',
  }
}

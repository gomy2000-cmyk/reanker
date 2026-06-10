import type { User, PickKeyword, ItemWithKeyword } from './types'

export const mockUser: User = {
  id: 'demo-user',
  google_id: 'demo',
  email: 'demo@reanker.com',
  name: 'デモユーザー',
  plan: 'standard',
  slack_webhook_url: null,
  notify_email: null,
  stripe_customer_id: null,
  stripe_subscription_id: null,
  created_at: new Date().toISOString(),
}

export const mockKeywords: PickKeyword[] = [
  { id: 'kw1', user_id: 'demo-user', name: 'Salesforce', type: 'service', query_value: 'Salesforce', sources: ['prtimes', 'googlenews'], exclude_keywords: [], notify_slack: true, notify_email: false, warmup_until: new Date().toISOString(), created_at: '' },
  { id: 'kw2', user_id: 'demo-user', name: 'kintone', type: 'service', query_value: 'kintone', sources: ['prtimes', 'googlenews'], exclude_keywords: [], notify_slack: true, notify_email: true, warmup_until: new Date().toISOString(), created_at: '' },
  { id: 'kw3', user_id: 'demo-user', name: 'AI受発注', type: 'keyword', query_value: 'AI受発注', sources: ['prtimes'], exclude_keywords: [], notify_slack: true, notify_email: false, warmup_until: new Date().toISOString(), created_at: '' },
  { id: 'kw4', user_id: 'demo-user', name: 'sansan.com', type: 'domain', query_value: 'sansan.com', sources: ['googlenews'], exclude_keywords: [], notify_slack: false, notify_email: true, warmup_until: new Date().toISOString(), created_at: '' },
]

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

const titles = [
  ['Salesforce、生成AI機能「Agentforce」を国内提供開始', 'kw1', 'prtimes', 10],
  ['セールスフォース・ジャパン、製造業向け新ソリューション発表', 'kw1', 'googlenews', 14],
  ['kintone、月間利用社数3万社を突破', 'kw2', 'prtimes', 9],
  ['サイボウズ、kintoneの新プラグインストアを開設', 'kw2', 'prtimes', 11],
  ['kintone活用事例：建設業のDX推進', 'kw2', 'googlenews', 16],
  ['AI受発注システム導入で受注処理時間を80%削減', 'kw3', 'prtimes', 13],
  ['Sansan、名刺管理から営業DBプラットフォームへ', 'kw4', 'googlenews', 8],
  ['Sansan決算、ARR前年比25%増', 'kw4', 'googlenews', 15],
  ['Salesforce World Tour Tokyo 2026開催決定', 'kw1', 'prtimes', 9],
  ['kintone hive 2026、全国6都市で開催', 'kw2', 'prtimes', 18],
] as const

export const mockItems: ItemWithKeyword[] = titles.map(([title, kwId, source, hour], i) => {
  const kw = mockKeywords.find((k) => k.id === kwId)!
  return {
    id: `item-${i}`,
    pickkw_id: kwId,
    source: source as 'prtimes' | 'googlenews',
    title,
    url: `https://example.com/news/${i}`,
    summary: 'これはデモ用のサンプル要約文です。実際の運用では記事冒頭の文章が自動取得されます。競合の動向把握にご活用ください。',
    published_at: daysAgo(i % 7),
    published_hour: hour as number,
    is_read: i % 3 === 0,
    is_clipped: i % 5 === 0,
    notified: true,
    deleted_at: null,
    category: 'その他',
    importance: '中',
    ai_summary: null,
    importance_reason: null,
    created_at: '',
    pick_keywords: kw,
  }
})

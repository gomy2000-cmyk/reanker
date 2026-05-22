export type Plan = 'free' | 'standard'
export type AnchorType = 'service' | 'keyword' | 'domain'
export type Source = 'prtimes' | 'googlenews'

export interface User {
  id: string
  google_id: string
  email: string
  name: string | null
  plan: Plan
  slack_webhook_url: string | null
  notify_email: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export interface PickKeyword {
  id: string
  user_id: string
  name: string
  type: AnchorType
  query_value: string
  sources: Source[]
  notify_slack: boolean
  notify_email: boolean
  warmup_until: string
  created_at: string
}

export interface Item {
  id: string
  pickkw_id: string
  source: Source
  title: string
  url: string
  summary: string | null
  published_at: string
  published_hour: number | null
  is_read: boolean
  is_clipped: boolean
  notified: boolean
  deleted_at: string | null
  category: string
  importance: string
  ai_summary: string | null
  importance_reason: string | null
  created_at: string
}

export interface Report {
  id: string
  user_id: string
  type: 'weekly' | 'monthly'
  period_start: string
  period_end: string
  title: string
  summary: string | null
  total_items: number
  unread_items: number
  top_anchor_name: string | null
  top_category: string | null
  highlights: ReportHighlight[]
  anchor_summaries: ReportAnchorSummary[]
  category_counts: Record<string, number>
  notable_items: ReportNotableItem[]
  created_at: string
}

export interface ReportHighlight {
  text: string
  anchor_name?: string
  reason?: string
}

export interface ReportAnchorSummary {
  anchor_id: string
  anchor_name: string
  total: number
  main_categories: string[]
  notable_titles: { title: string; url: string }[]
}

export interface ReportNotableItem {
  id: string
  title: string
  url: string
  importance: '高' | '中' | '低'
  category: string
  published_at: string
  anchor_name: string
  source: Source
}

export interface ItemWithKeyword extends Item {
  pick_keywords: PickKeyword
}

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
  created_at: string
}

export interface ItemWithKeyword extends Item {
  pick_keywords: PickKeyword
}

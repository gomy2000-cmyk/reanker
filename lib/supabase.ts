import { createClient } from '@supabase/supabase-js'

// 未設定でもモジュール読込時にクラッシュしないよう、形式上有効なプレースホルダにフォールバック。
// 実際のクエリは失敗するが、ログイン画面など非DBページのプレビューは可能になる。
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : 'https://placeholder.supabase.co'

const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

export const supabase = createClient(url, anonKey)

export const supabaseAdmin = createClient(url, serviceKey)

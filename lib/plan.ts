/**
 * プラン制御ロジック。
 * Free / Standard / Pro の違いをここに集約する。
 *
 * Free    : アンカー3件まで、月・水・金のみ取得、Slack通知不可、レポート閲覧不可
 * Standard: アンカー無制限、毎日取得、Slack + メール両対応、レポート閲覧可
 * Pro     : Standard と同等（機能開発中）
 */

import type { Plan } from './types'

export type { Plan }

// ---------- プラン上限定義 ----------

export const PLAN_LIMITS: Record<Plan, {
  maxAnchors: number       // 登録できるアンカー数（-1 = 無制限）
  fetchDaysPerWeek: number // 週に何日取得するか
  slackNotify: boolean     // Slack通知の可否
  emailNotify: boolean     // メール通知の可否
  reports: boolean         // レポート機能の可否
}> = {
  free: {
    maxAnchors: 3,
    fetchDaysPerWeek: 3,
    slackNotify: false,
    emailNotify: true,
    reports: false,
  },
  standard: {
    maxAnchors: -1,
    fetchDaysPerWeek: 7,
    slackNotify: true,
    emailNotify: true,
    reports: true,
  },
  pro: {
    maxAnchors: -1,
    fetchDaysPerWeek: 7,
    slackNotify: true,
    emailNotify: true,
    reports: true,
  },
}

// ---------- ユーティリティ ----------

/**
 * DB の plan 文字列を型安全な Plan に正規化する。
 * 未知の値や null は 'free' として扱う。
 */
export function normalizePlan(plan: string | null | undefined): Plan {
  if (plan === 'standard') return 'standard'
  if (plan === 'pro') return 'pro'
  return 'free'
}

export function isStandardPlan(plan: Plan): boolean {
  return plan === 'standard' || plan === 'pro'
}

/**
 * そのプランで今日（JST基準）取得を実行すべきか判定する。
 * - Standard: 毎日 true
 * - Free    : 月(1) / 水(3) / 金(5) のみ true
 *
 * @param now UTC の Date オブジェクト（Vercel サーバー時刻）
 */
export function isFetchDayJST(plan: Plan, now: Date): boolean {
  if (plan === 'standard' || plan === 'pro') return true

  // UTC → JST (+9h) に変換して曜日を取得
  const jstMs = now.getTime() + 9 * 60 * 60 * 1000
  const jst = new Date(jstMs)
  const dow = jst.getUTCDay() // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

  // Free は月(1)・水(3)・金(5) のみ
  return dow === 1 || dow === 3 || dow === 5
}

/**
 * そのプランで Slack 通知を送れるか。
 * Free は Slack 不可（メールのみ）。
 */
export function canUseSlackNotification(plan: Plan): boolean {
  return PLAN_LIMITS[plan].slackNotify
}

/**
 * そのプランで新しいアンカーを作成できるか。
 * Free は上限3件。Standard は無制限（-1）。
 */
export function canCreateAnchor(plan: Plan, currentCount: number): boolean {
  const max = PLAN_LIMITS[plan].maxAnchors
  if (max === -1) return true
  return currentCount < max
}

/**
 * そのプランでレポート機能を使えるか。
 * Standard のみ。
 */
export function canUseReports(plan: Plan): boolean {
  return PLAN_LIMITS[plan].reports
}

/**
 * プラン制限エラーのレスポンスボディを生成する。
 * API ルートで `return NextResponse.json(planLimitErrorBody('slack'), { status: 403 })` のように使う。
 *
 * @param reason  どの制限に引っかかったかのキー（ログ・デバッグ用）
 */
export function planLimitErrorBody(reason: 'anchor_limit' | 'slack' | 'reports' | string): {
  error: string
  reason: string
  upgrade: boolean
} {
  const messages: Record<string, string> = {
    anchor_limit: 'アンカーの登録数が上限に達しています。スタンダードプランにアップグレードすると無制限に登録できます。',
    slack: 'Slack通知はスタンダードプランでご利用いただけます。',
    reports: 'レポート機能はスタンダードプランでご利用いただけます。',
  }
  return {
    error: messages[reason] ?? 'この機能はスタンダードプランでご利用いただけます。',
    reason,
    upgrade: true,
  }
}

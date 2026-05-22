/**
 * プラン制御の共通ロジック。
 *
 * 重要: UI 表示制御だけでなく、API ルートと Cron 内でも必ずこのモジュールで判定すること。
 * フロントだけで隠しても curl/Postman で叩かれたら破られる。
 */

export type Plan = 'free' | 'standard'

export interface PlanLimits {
  /** 同時登録可能なアンカー数 */
  maxAnchors: number
  /** JST 基準で取得を実行する曜日（0=日 〜 6=土） */
  fetchDays: readonly number[]
  /** UI 表示用の頻度ラベル */
  fetchFrequencyLabel: string
  /** Slack 通知が使えるか */
  slackNotification: boolean
  /** メール通知が使えるか */
  emailNotification: boolean
  /** CSV/PDF エクスポートが使えるか */
  export: boolean
  /** /reports（週次/月次サマリ）の詳細閲覧が可能か */
  reports: boolean
  /** Markdown コピーが使えるか */
  reportCopy: boolean
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxAnchors: 3,
    // JS Date.getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    fetchDays: [1, 3, 5], // 月・水・金
    fetchFrequencyLabel: '週3回（月・水・金）',
    slackNotification: false,
    emailNotification: true,
    export: false,
    reports: false,
    reportCopy: false,
  },
  standard: {
    maxAnchors: Number.POSITIVE_INFINITY,
    fetchDays: [0, 1, 2, 3, 4, 5, 6],
    fetchFrequencyLabel: '毎日',
    slackNotification: true,
    emailNotification: true,
    export: true,
    reports: true,
    reportCopy: true,
  },
} as const

/** plan 文字列を安全に Plan 型に正規化（DBの想定外値に備える） */
export function normalizePlan(plan: string | null | undefined): Plan {
  return plan === 'standard' ? 'standard' : 'free'
}

export function isStandardPlan(plan: string | null | undefined): boolean {
  return normalizePlan(plan) === 'standard'
}

/** アンカーをさらに登録できるか */
export function canCreateAnchor(plan: Plan, currentCount: number): boolean {
  return currentCount < PLAN_LIMITS[plan].maxAnchors
}

export function canUseSlackNotification(plan: Plan): boolean {
  return PLAN_LIMITS[plan].slackNotification
}

export function canUseExport(plan: Plan): boolean {
  return PLAN_LIMITS[plan].export
}

export function canUseReports(plan: Plan): boolean {
  return PLAN_LIMITS[plan].reports
}

export function canUseReportCopy(plan: Plan): boolean {
  return PLAN_LIMITS[plan].reportCopy
}

/**
 * 「今日（JST基準）」が、与えられたプランの取得対象曜日か。
 * Vercel Cron は UTC で動くので、今を JST に変換してから判定する。
 */
export function isFetchDayJST(plan: Plan, now: Date = new Date()): boolean {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const day = jst.getUTCDay() // 0..6
  return PLAN_LIMITS[plan].fetchDays.includes(day)
}

/** JST の現在日付の曜日（0..6）を返す */
export function getJSTDay(now: Date = new Date()): number {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return jst.getUTCDay()
}

/** プラン制限エラーのレスポンス body 生成（API側で共通使用） */
export function planLimitErrorBody(reason: 'anchor_limit' | 'slack' | 'export' | 'reports') {
  const messages: Record<typeof reason, string> = {
    anchor_limit:
      'Freeプランで登録できるアンカーは3件までです。Standardプランにアップグレードすると、アンカーを無制限に登録できます。',
    slack: 'Slack通知はStandardプランで利用できます。',
    export: 'エクスポート機能はStandardプランで利用できます。',
    reports: '週次・月次サマリはStandardプランで利用できます。',
  }
  return {
    error: 'PLAN_LIMIT',
    reason,
    message: messages[reason],
  }
}

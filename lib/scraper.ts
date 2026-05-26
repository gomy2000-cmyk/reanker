/**
 * 日付ユーティリティ（JST基準）。
 *
 * スクレイピング本体は lib/sources/ に移動済み。
 * このファイルは互換性のためにユーティリティ関数のみ残す。
 */

/** 昨日のJST日付（YYYY-MM-DD）を返す */
export function yesterdayJST(): string {
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  jst.setUTCDate(jst.getUTCDate() - 1)
  return jst.toISOString().split('T')[0]
}

/** 今日のJST日付（YYYY-MM-DD）を返す */
export function todayJST(): string {
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().split('T')[0]
}

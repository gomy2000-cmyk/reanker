/**
 * 日付ユーティリティ（JST基準）。
 *
 * スクレイピング本体は lib/sources/ に移動済み。
 * このファイルは互換性のためにユーティリティ関数のみ残す。
 */

/** 今日のJST日付（YYYY-MM-DD）を返す */
export function todayJST(): string {
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().split('T')[0]
}

/** N日前のJST日付（YYYY-MM-DD）を返す。取得の下限日（これ以降を採用）に使う。 */
export function daysAgoJST(n: number): string {
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  jst.setUTCDate(jst.getUTCDate() - n)
  return jst.toISOString().split('T')[0]
}

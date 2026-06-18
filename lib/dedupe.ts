/**
 * 記事のタイトル重複統合ロジック。
 *
 * 同じプレスリリースが PR TIMES と Google News の両方から取得されると、
 * URL が異なるため UNIQUE 制約では弾けず、同じタイトルが2行並んでしまう。
 * ここでは「正規化したタイトルの一致」を重複とみなし、優先ソース
 * （PR TIMES）の記事1件に統合して sources 配列へ取得元を併記する。
 */
import type { Source } from './types'

/** ソースの優先順位。同一記事が複数ソースで取得された場合、先頭に近いソースを正とする。 */
export const SOURCE_PRIORITY: Source[] = ['prtimes', 'googlenews', 'atpress', 'valuepress', 'kyodo']

/** 重複を除きつつ優先順位順に並べる。 */
export function sortSources(sources: Iterable<Source>): Source[] {
  return [...new Set(sources)].sort(
    (a, b) => SOURCE_PRIORITY.indexOf(a) - SOURCE_PRIORITY.indexOf(b)
  )
}

/**
 * タイトル重複判定用の正規化。
 * - Google News のタイトルは「記事タイトル - 媒体名」形式なので末尾の媒体名を除去
 *   （本文側が10文字未満になる場合は誤除去とみなして除去しない）
 * - NFKC 正規化で全角英数・記号の揺れを吸収
 * - 大文字小文字・空白の差を無視
 */
export function normalizeTitle(title: string): string {
  let t = title.normalize('NFKC').trim()
  const m = t.match(/^(.{10,})\s*[-–—|｜]\s*[^-–—|｜]{1,40}$/)
  if (m) t = m[1].trim()
  return t.toLowerCase().replace(/\s+/g, '')
}

/**
 * 表示用: 記事の取得元一覧を返す。
 * sources 列がある新形式はそれを、無い既存行は従来の source 単体を使う。
 */
export function itemSourceList(item: { source: Source; sources?: Source[] | null }): Source[] {
  return item.sources && item.sources.length > 0 ? sortSources(item.sources) : [item.source]
}

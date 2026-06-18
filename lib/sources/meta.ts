/**
 * ソースの表示メタデータと利用区分を1か所に集約する。
 * バッジ表示（ダッシュボード・記事一覧・レポート）と編集UI・プラン判定が
 * すべてここを参照することで、ソース追加時の修正漏れを防ぐ。
 */
import type { SourceName } from './types'

export interface SourceMeta {
  /** 表示名 */
  label: string
  /** バッジの Tailwind クラス */
  badgeClass: string
  /** 有料プラン限定ソースか（true なら free では選択不可） */
  premium: boolean
}

export const SOURCE_META: Record<SourceName, SourceMeta> = {
  prtimes: { label: 'PR TIMES', badgeClass: 'bg-blue-100 text-blue-700', premium: false },
  googlenews: { label: 'Google News', badgeClass: 'bg-gray-100 text-gray-600', premium: false },
  atpress: { label: '@Press', badgeClass: 'bg-emerald-100 text-emerald-700', premium: true },
  valuepress: { label: 'ValuePress', badgeClass: 'bg-amber-100 text-amber-700', premium: true },
  kyodo: { label: '共同通信PRワイヤー', badgeClass: 'bg-purple-100 text-purple-700', premium: true },
}

/** 編集UIに表示する順序（全プラン共通ソース → 有料ソース）。 */
export const SOURCE_ORDER: SourceName[] = ['prtimes', 'googlenews', 'atpress', 'valuepress', 'kyodo']

/** 全プランで使えるソース。 */
export const BASE_SOURCES: SourceName[] = SOURCE_ORDER.filter((s) => !SOURCE_META[s].premium)

/** 有料プラン限定のソース。 */
export const PREMIUM_SOURCES: SourceName[] = SOURCE_ORDER.filter((s) => SOURCE_META[s].premium)

/** 表示名を引く（未知のソースはキーをそのまま返す）。 */
export function sourceLabel(name: SourceName | string): string {
  return SOURCE_META[name as SourceName]?.label ?? String(name)
}

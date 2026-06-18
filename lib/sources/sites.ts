/**
 * 有料プラン限定の追加トラッキング先ソース。
 *
 * @Press / ValuePress / 共同通信PRワイヤー は
 *   - @Press      : bot アクセスを遮断（直接スクレイプ不可）
 *   - ValuePress  : 検索結果が JS レンダリング（HTML に記事リンクが出ない）
 *   - 共同通信PRワイヤー : 検索クエリがサーバー HTML に反映されない（JS レンダリング）
 * のため、いずれも素の HTTP 取得では安定して記事を拾えない。
 *
 * そこで Google News をこれらのドメインに `site:` で絞って取得する方式を採る。
 * 既存の堅牢な RSS パイプライン（lib/sources/googlenews.ts）を再利用するため、
 * ヘッドレスブラウザ不要で Vercel Cron 上でも安定して動く。
 */
import { createSiteFilteredGoogleNewsSource } from './googlenews'

export const atpressSource = createSiteFilteredGoogleNewsSource('atpress', 'atpress.ne.jp')
export const valuepressSource = createSiteFilteredGoogleNewsSource('valuepress', 'value-press.com')
export const kyodoSource = createSiteFilteredGoogleNewsSource('kyodo', 'kyodonewsprwire.jp')

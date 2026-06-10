/**
 * APIルートの入力検証スキーマ（Zod）。
 * クライアントから届く JSON は信頼せず、ここで形式・値域を確定させてから DB に渡す。
 * 各ルートでは parseBody() を使い、失敗時は 400 + 日本語メッセージを返す。
 */
import { z } from 'zod'

export const ANCHOR_TYPES = ['service', 'keyword', 'domain'] as const
export const SOURCE_NAMES = ['prtimes', 'googlenews'] as const

/** 除外キーワード: 1〜50文字 × 最大20件。前後空白は除去し、空要素・重複は捨てる。 */
const excludeKeywordsSchema = z
  .array(z.string().trim().max(50, '除外キーワードは1件50文字以内で入力してください'))
  .max(20, '除外キーワードは20件までです')
  .transform((arr) => [...new Set(arr.filter((s) => s.length > 0))])

const anchorFields = {
  name: z.string().trim().min(1, 'アンカー名は必須です').max(100, 'アンカー名は100文字以内で入力してください'),
  type: z.enum(ANCHOR_TYPES),
  query_value: z.string().trim().min(1, '検索クエリは必須です').max(200, '検索クエリは200文字以内で入力してください'),
  sources: z.array(z.enum(SOURCE_NAMES)).min(1, '取得ソースを1つ以上選択してください'),
  exclude_keywords: excludeKeywordsSchema.optional(),
  notify_slack: z.boolean().optional(),
  notify_email: z.boolean().optional(),
}

export const anchorCreateSchema = z.object({
  ...anchorFields,
  sources: anchorFields.sources.optional(),
})

export const anchorUpdateSchema = z.object({
  id: z.uuid(),
  ...anchorFields,
})

export const anchorDeleteSchema = z.object({ id: z.uuid() })

export const itemPatchSchema = z.object({
  id: z.uuid(),
  is_read: z.boolean().optional(),
  is_clipped: z.boolean().optional(),
})

/** 設定画面のプロフィール更新。未指定フィールドは更新しない。 */
export const userPatchSchema = z.object({
  name: z.string().trim().max(100, '名前は100文字以内で入力してください').optional(),
  // 空文字はクリア扱い。設定する場合は Slack Incoming Webhook の URL のみ許可
  //（任意URLを許すと通知送信を踏み台に外部へ POST できてしまう）。
  slack_webhook_url: z
    .union([
      z.null(),
      z.string().trim().refine((v) => v === '' || v.startsWith('https://hooks.slack.com/'), {
        message: 'Slack Webhook URLは https://hooks.slack.com/ で始まるURLを入力してください',
      }),
    ])
    .optional(),
  // 空文字はクリア扱い（送信時はログインメールにフォールバック）
  notify_email: z
    .union([z.null(), z.string().trim().refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: 'メールアドレスの形式が正しくありません。',
    })])
    .optional(),
})

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'お名前は必須です').max(100),
  email: z.email('メールアドレスの形式が正しくありません'),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10, 'お問い合わせ内容は10文字以上で入力してください').max(2000, 'お問い合わせ内容は2000文字以内で入力してください'),
  consent: z.literal(true, { error: 'プライバシーポリシーへの同意が必要です' }),
  // honeypot: 人間には見えないフィールド。値が入っていたら bot とみなす。
  website: z.string().max(0).optional(),
})

/** Zodエラーから最初のメッセージを取り出す（UIにそのまま表示できる日本語）。 */
export function firstErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? '入力内容が正しくありません'
}

/**
 * リクエストボディを安全にパースする共通ヘルパー。
 * JSONとして不正・スキーマ違反なら { ok: false, message } を返す。
 */
export async function parseBody<T extends z.ZodType>(
  req: Request,
  schema: T
): Promise<{ ok: true; data: z.output<T> } | { ok: false; message: string }> {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return { ok: false, message: 'リクエストボディが不正です' }
  }
  const result = schema.safeParse(json)
  if (!result.success) {
    return { ok: false, message: firstErrorMessage(result.error) }
  }
  return { ok: true, data: result.data }
}

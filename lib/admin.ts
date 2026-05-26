/**
 * 管理画面の認可ヘルパー。
 * ADMIN_EMAILS 環境変数（カンマ区切り）に含まれるメアドのみ admin 扱い。
 */
import { getServerSession } from 'next-auth'

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export async function isAdminSession(): Promise<{ ok: true; email: string } | { ok: false }> {
  const session = await getServerSession()
  const email = session?.user?.email?.toLowerCase()
  if (!email) return { ok: false }
  const admins = getAdminEmails()
  return admins.includes(email) ? { ok: true, email } : { ok: false }
}

/**
 * UUID を匿名化された短いIDに変換。
 * 06d88d52-... → user_06d88d
 */
export function anonymizeUserId(uuid: string): string {
  return `user_${uuid.slice(0, 6)}`
}

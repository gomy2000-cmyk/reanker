import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { canUseSlackNotification, normalizePlan, planLimitErrorBody } from '@/lib/plan'
import { isValidSlackWebhookUrl, sendSlackTest } from '@/lib/notify'

export const maxDuration = 30

/**
 * POST /api/user/slack-test
 * 設定画面の「テスト送信」ボタン用。指定された Slack Webhook へ接続確認メッセージを送る。
 *
 * - 入力欄の値（body.slack_webhook_url）を優先する。保存前でも疎通確認できるようにするため。
 *   未指定なら保存済みの URL を使う。
 * - Slack 通知は Standard 限定機能なので、Free プランは 403 で弾く。
 * - 形式不正・送信失敗はそれぞれ 400 / 502 で理由を返し、UI 側で表示する。
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, plan, slack_webhook_url')
    .eq('email', session.user.email)
    .single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const plan = normalizePlan(user.plan)
  if (!canUseSlackNotification(plan)) {
    return NextResponse.json(planLimitErrorBody('slack'), { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const fromBody =
    typeof body.slack_webhook_url === 'string' ? body.slack_webhook_url.trim() : ''
  const candidate = fromBody || (user.slack_webhook_url ?? '')

  if (!candidate) {
    return NextResponse.json(
      { error: 'Slack Webhook URL が設定されていません。' },
      { status: 400 }
    )
  }
  if (!isValidSlackWebhookUrl(candidate)) {
    return NextResponse.json(
      {
        error:
          'Slack Webhook URL の形式が正しくありません。「https://hooks.slack.com/」で始まるURLを入力してください。',
      },
      { status: 400 }
    )
  }

  const result = await sendSlackTest(candidate)
  if (result.status !== 'success') {
    return NextResponse.json(
      {
        error:
          'テスト送信に失敗しました。URLが正しいか、チャンネルが存在するかをご確認ください。',
        detail: result.error,
      },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}

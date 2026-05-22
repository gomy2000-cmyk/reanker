import type { Item } from './types'

export async function sendSlack(webhookUrl: string, anchorName: string, items: Item[]) {
  const lines = items.map((i) => `- ${i.title}\n  ${i.url}`).join('\n')
  const text = `【ReAnker】${anchorName}\n\n昨日の新規リリース ${items.length}件\n\n${lines}`

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

export async function sendEmail(to: string, anchorName: string, items: Item[]) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set, skipping email')
    return
  }
  const html = `
    <h2>【ReAnker】${anchorName}</h2>
    <p>昨日の新規リリース ${items.length}件</p>
    <ul>
      ${items.map((i) => `<li><a href="${i.url}">${i.title}</a></li>`).join('')}
    </ul>
  `
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'ReAnker <noreply@reanker.com>',
      to,
      subject: `【ReAnker】${anchorName} - 昨日の新着 ${items.length}件`,
      html,
    }),
  })
}

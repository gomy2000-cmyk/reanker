import { describe, it, expect, vi, beforeEach } from 'vitest'

// RESEND_API_KEY の BOM 除去が正しく機能するかテスト。
// sendEmailDigest は fetch を呼ぶためモックする。

const BOM = '﻿'

describe('sendEmailDigest - RESEND_API_KEY BOM stripping', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('BOM 付き API キーでも Resend に正しいキーで送信する', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    vi.stubGlobal('fetch', mockFetch)

    process.env.RESEND_API_KEY = `${BOM}test_api_key_123`
    process.env.RESEND_FROM_EMAIL = 'ReAnker <reanker@syojin.com>'

    const { sendEmailDigest } = await import('../notify')

    const result = await sendEmailDigest('test@example.com', [
      { anchorName: 'テストアンカー', items: [{ id: '1', title: 'テスト記事', url: 'https://example.com' }] },
    ])

    expect(result.status).toBe('success')

    const [, init] = mockFetch.mock.calls[0]
    const authHeader = (init as RequestInit).headers as Record<string, string>
    // BOM が除去されて正しい Bearer トークンになっていること
    expect(authHeader['Authorization']).toBe('Bearer test_api_key_123')
  })

  it('BOM なし API キーでも正常に送信できる', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    vi.stubGlobal('fetch', mockFetch)

    process.env.RESEND_API_KEY = 'clean_api_key_456'
    process.env.RESEND_FROM_EMAIL = 'ReAnker <reanker@syojin.com>'

    const { sendEmailDigest } = await import('../notify')

    const result = await sendEmailDigest('test@example.com', [
      { anchorName: 'テストアンカー', items: [{ id: '1', title: 'テスト記事', url: 'https://example.com' }] },
    ])

    expect(result.status).toBe('success')

    const [, init] = mockFetch.mock.calls[0]
    const authHeader = (init as RequestInit).headers as Record<string, string>
    expect(authHeader['Authorization']).toBe('Bearer clean_api_key_456')
  })

  it('API キー未設定なら skipped を返す', async () => {
    delete process.env.RESEND_API_KEY

    const { sendEmailDigest } = await import('../notify')

    const result = await sendEmailDigest('test@example.com', [
      { anchorName: 'テストアンカー', items: [{ id: '1', title: 'テスト記事', url: 'https://example.com' }] },
    ])

    expect(result.status).toBe('skipped')
  })

  it('Resend が 400 エラーを返したら failed を返す', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => 'Bad Request',
    })
    vi.stubGlobal('fetch', mockFetch)

    process.env.RESEND_API_KEY = 'valid_key'

    const { sendEmailDigest } = await import('../notify')

    const result = await sendEmailDigest('test@example.com', [
      { anchorName: 'テストアンカー', items: [{ id: '1', title: 'テスト記事', url: 'https://example.com' }] },
    ])

    expect(result.status).toBe('failed')
  })
})

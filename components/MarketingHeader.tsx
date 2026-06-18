"use client";

import { useState } from "react";
import Link from 'next/link'
import { Wordmark } from './brand/Wordmark'

interface Props {
  isAuthenticated?: boolean
}

export function MarketingHeader({ isAuthenticated = false }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-[80px] flex items-center justify-between">
        <Link href="/" className="flex items-center text-gray-900 hover:opacity-80 transition-opacity">
          <Wordmark height={64} />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[13px] text-gray-600">
          <a href="#product" className="hover:text-gray-900 transition-colors">プロダクト</a>
          <a href="#comparison" className="hover:text-gray-900 transition-colors">比較</a>
          <Link href="/pricing" className="hover:text-gray-900 transition-colors">料金</Link>
          <Link href="/blog" className="hover:text-gray-900 transition-colors">ブログ</Link>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">お問い合わせ</Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="text-[13px] bg-gray-900 hover:bg-gray-700 text-white px-3.5 py-1.5 rounded-md font-medium transition-colors"
            >
              ダッシュボードへ
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] text-gray-700 hover:text-gray-900 hidden sm:inline"
              >
                ログイン
              </Link>
              <Link
                href="/login"
                className="text-[13px] bg-gray-900 hover:bg-gray-700 text-white px-3.5 py-1.5 rounded-md font-medium transition-colors hidden sm:block"
              >
                無料ではじめる
              </Link>
            </>
          )}
          <button
            type="button"
            aria-label="メニューを開く"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-gray-100 bg-white md:hidden">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1 text-[14px] text-gray-700">
            <a href="#product" onClick={() => setOpen(false)} className="py-2.5 border-b border-gray-50 hover:text-gray-900">プロダクト</a>
            <a href="#comparison" onClick={() => setOpen(false)} className="py-2.5 border-b border-gray-50 hover:text-gray-900">比較</a>
            <Link href="/pricing" onClick={() => setOpen(false)} className="py-2.5 border-b border-gray-50 hover:text-gray-900">料金</Link>
            <Link href="/blog" onClick={() => setOpen(false)} className="py-2.5 border-b border-gray-50 hover:text-gray-900">ブログ</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="py-2.5 border-b border-gray-50 hover:text-gray-900">お問い合わせ</Link>
            {isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="mt-2 block text-center bg-gray-900 text-white px-4 py-2.5 rounded-md font-medium">
                ダッシュボードへ
              </Link>
            ) : (
              <div className="flex gap-2 mt-2">
                <Link href="/login" onClick={() => setOpen(false)} className="flex-1 text-center border border-gray-200 text-gray-700 px-4 py-2.5 rounded-md font-medium hover:bg-gray-50">
                  ログイン
                </Link>
                <Link href="/login" onClick={() => setOpen(false)} className="flex-1 text-center bg-gray-900 text-white px-4 py-2.5 rounded-md font-medium hover:bg-gray-700">
                  無料ではじめる
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

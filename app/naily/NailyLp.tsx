'use client'

import { useState } from 'react'
import {
  MessageCircle,
  Settings,
  AtSign,
  Link2,
  Image,
  Smartphone,
  Monitor,
  BarChart2,
  Building2,
  Headphones,
  UserCheck,
  MessageSquare,
  FileText,
  FileSearch,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Send,
  Check,
  Upload,
  Info,
  Users,
} from 'lucide-react'

/* ─────────────────────────────────────────
   Colors
   accent:        #C9151E
   accent-dark:   #9F1118
   accent-soft:   #FFF1F2
   accent-border: #F3C6CA
   bg:            #ffffff
   bg2:           #F7F7F7
   bg3:           #EFEFED
   txt:           #0A0A0A
   txt2:          #555
   txt3:          #999
   bdr:           #E0E0E0
   bdr2:          #C8C8C8
───────────────────────────────────────── */

// ──────────────────────────────────────────────
// Tiny shared sub-components
// ──────────────────────────────────────────────

function BrandMark({ large = false }: { large?: boolean }) {
  if (large) {
    return (
      <div className="flex flex-col gap-1 leading-none text-center">
        <span className="text-[28px] font-medium tracking-[0.08em]">ナイリー</span>
        <span className="text-[14px] text-[#999] tracking-[0.05em]">
          [n<b className="font-bold text-[#555]">AI</b>ly]
        </span>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-px leading-none">
      <span className="text-[16px] font-medium tracking-[0.05em] text-[#0A0A0A]">ナイリー</span>
      <span className="text-[11px] text-[#999] tracking-[0.03em]">
        [n<b className="font-bold text-[#555]">AI</b>ly]
      </span>
    </div>
  )
}

function Divider() {
  return (
    <div className="max-w-[960px] mx-auto">
      <hr className="border-none border-t border-[#E0E0E0]" />
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] text-[#999] tracking-[1px] uppercase mb-2.5 font-medium">
      {children}
    </p>
  )
}

function SecTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-medium tracking-tight mb-2.5">{children}</h2>
  )
}

function SecSub({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] text-[#555] mb-9 leading-relaxed">{children}</p>
  )
}

// ──────────────────────────────────────────────
// Mock browser widget
// ──────────────────────────────────────────────

function MockBrowser({
  url,
  avBg,
  avText,
  title,
  children,
  round = false,
}: {
  url: string
  avBg: string
  avText: string
  title: string
  children: React.ReactNode
  round?: boolean
}) {
  return (
    <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">
      <div className="bg-[#F7F7F7] px-2.5 py-1.5 border-b border-[#E0E0E0] flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#C8C8C8]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C8C8C8]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C8C8C8]" />
        <div className="flex-1 bg-white border-[0.5px] border-[#E0E0E0] rounded-sm px-2 py-0.5 text-[10px] text-[#999] overflow-hidden whitespace-nowrap text-ellipsis">
          {url}
        </div>
      </div>
      <div className="px-3 py-2 border-b border-[#E0E0E0] flex items-center gap-2">
        <div
          className={`w-5 h-5 flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0 ${round ? 'rounded-full' : 'rounded'}`}
          style={{ background: avBg }}
        >
          {avText}
        </div>
        <span className="text-[11px] font-medium flex-1">{title}</span>
        <div className="w-[5px] h-[5px] rounded-full bg-[#22C55E]" />
      </div>
      <div className="px-3 py-2.5 flex flex-col gap-1.5">{children}</div>
    </div>
  )
}

function BubbleUser({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="self-end bg-[#0A0A0A] text-white px-2.5 py-1.5 text-[10px] max-w-[78%]"
      style={{ borderRadius: '9px 9px 2px 9px' }}
    >
      {children}
    </div>
  )
}

function BubbleAi({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="self-start bg-[#F7F7F7] px-2.5 py-1.5 text-[10px] max-w-[88%] border-[0.5px] border-[#E0E0E0] text-[#0A0A0A]"
      style={{ borderRadius: '9px 9px 9px 2px' }}
    >
      {children}
    </div>
  )
}

// ──────────────────────────────────────────────
// Flow step
// ──────────────────────────────────────────────

function FlowStep({
  num,
  title,
  desc,
  icon,
}: {
  num: string
  title: string
  desc: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-2xl px-4 py-6 text-center">
      <div className="w-12 h-12 rounded-[13px] bg-[#0A0A0A] flex items-center justify-center mx-auto mb-3 text-white">
        {icon}
      </div>
      <div className="text-[10px] font-medium text-[#999] tracking-[1px] mb-1.5 uppercase">
        {num}
      </div>
      <div className="text-[14px] font-medium mb-1.5">{title}</div>
      <div className="text-[12px] text-[#555] leading-relaxed">{desc}</div>
    </div>
  )
}

// ──────────────────────────────────────────────
// Plan card
// ──────────────────────────────────────────────

function PlanCard({
  name,
  initFee,
  price,
  cycle,
  accounts,
  items,
  note,
  featured = false,
  onConsult,
}: {
  name: string
  initFee: string
  price: string
  cycle: string
  accounts: string
  items: string[]
  note: string
  featured?: boolean
  onConsult: () => void
}) {
  return (
    <div
      className={`border rounded-[13px] p-6 bg-white flex flex-col ${
        featured ? 'border-[1.5px] border-[#0A0A0A]' : 'border-[#E0E0E0]'
      }`}
    >
      {featured && (
        <div className="inline-block bg-[#C9151E] text-white text-[10px] px-2.5 py-0.5 rounded-full mb-3 font-medium w-fit">
          おすすめ
        </div>
      )}
      <div className="text-base font-medium mb-1">{name}</div>
      <div className="text-[12px] text-[#999] mb-0.5">{initFee}</div>
      <div className={`font-medium mb-0.5 ${price === '要相談' ? 'text-lg' : 'text-2xl'}`}>
        {price}
      </div>
      <div className="text-[12px] text-[#999] mb-1">{cycle || ' '}</div>
      <div className="inline-flex items-center gap-1 text-[11px] text-[#555] bg-[#F7F7F7] border border-[#E0E0E0] rounded px-2 py-0.5 mb-3.5 w-fit">
        <Users size={11} />
        {accounts}
      </div>
      <hr className="border-none border-t border-[#E0E0E0] mb-3.5" />
      <ul className="flex flex-col gap-1.5 flex-1">
        {items.map((item) => (
          <li key={item} className="text-[12px] text-[#555] flex items-center gap-1.5">
            <span className="inline-block w-3 h-px bg-[#C8C8C8] flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      {note && (
        <div className="text-[11px] text-[#999] mt-2.5 leading-relaxed whitespace-pre-line">
          {note}
        </div>
      )}
      <button
        className={`mt-4 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer w-full transition-colors ${
          featured
            ? 'bg-[#0A0A0A] text-white hover:bg-[#9F1118]'
            : 'border border-[#C8C8C8] bg-white text-[#0A0A0A] hover:bg-[#F7F7F7]'
        }`}
        onClick={onConsult}
      >
        相談する
      </button>
    </div>
  )
}

// ──────────────────────────────────────────────
// FAQ section (client — needs open state)
// ──────────────────────────────────────────────

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const faqs = [
    {
      q: '好きな名前なら何でも使えますか？',
      a: '会社名、サービス名、ブランド名、相談窓口名など、基本的に希望する名前でご利用いただけます。ご相談の際にお知らせください。',
    },
    {
      q: 'アプリですか？',
      a: 'ブラウザで利用できるWebアプリです。スマートフォンのホーム画面に追加することで、アプリのように起動できます。',
    },
    {
      q: 'ChatGPTとの違いは何ですか？',
      a: '機能面は大手AIツールと同等ですが、好きな名前・ロゴ・専用URLで利用できる点が違います。汎用サービスではなく、自分の名前を冠したAIチャット環境として使えます。',
    },
    {
      q: 'どれくらいで使えますか？',
      a: '最短5営業日で利用開始できます。',
    },
    {
      q: '専門知識がなくても使えますか？',
      a: 'はい。初期設定はすべてこちらで対応します。ご利用開始後は、URLにアクセスするだけで使えます。',
    },
    {
      q: 'スタンダードの月額はなぜ変動するのですか？',
      a: '月額19,800円に加え、AI利用量（トークン消費量）に応じた従量課金が加算されます。利用量が少ない月は最低額に近くなります。',
    },
    {
      q: '社内データとの連携はできますか？',
      a: 'スタンダードプラン以上で対応しています。カスタムプランでは外部API・社内システムとの直接連携も可能です。詳細はお気軽にご相談ください。',
    },
  ]

  return (
    <section className="py-16 px-10 max-w-[960px] mx-auto sm:px-10 px-6">
      <Eyebrow>FAQ</Eyebrow>
      <SecTitle>よくある質問</SecTitle>
      <div>
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border-b border-[#E0E0E0] py-4 cursor-pointer select-none"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            <div className="text-[14px] font-medium flex justify-between items-center gap-3">
              {faq.q}
              <ChevronDown
                size={16}
                className={`text-[#999] flex-shrink-0 transition-transform duration-200 ${
                  openIdx === i ? 'rotate-180' : ''
                }`}
              />
            </div>
            {openIdx === i && (
              <div className="text-[13px] text-[#555] mt-2.5 leading-relaxed">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// Survey / form section (client — needs state)
// ──────────────────────────────────────────────

function SurveySection({ id }: { id?: string }) {
  const [company, setCompany] = useState('')
  const [chatname, setChatname] = useState('')
  const [usecase, setUsecase] = useState('')
  const [scale, setScale] = useState('')
  const [email, setEmail] = useState('')
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null)
  const [logoFilename, setLogoFilename] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const previewName =
    chatname || (company ? `${company} AIアシスタント` : '○○ AIアシスタント')
  const previewInitials = company ? company.slice(0, 2) : 'AI'

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setLogoDataUrl(ev.target?.result as string)
      setLogoFilename(file.name)
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLogoDataUrl(null)
    setLogoFilename('')
  }

  const handleSubmit = () => {
    if (!company || !email) {
      alert('会社名とメールアドレスは必須です')
      return
    }
    setSubmitted(true)
  }

  const inputClass =
    'px-3.5 py-2.5 border border-[#C8C8C8] rounded-lg text-[13px] bg-white text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors w-full'

  return (
    <div
      id={id}
      className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-2xl sm:px-10 px-6 sm:py-12 py-8 mb-16"
    >
      {!submitted ? (
        <>
          <h2 className="text-[26px] font-medium tracking-tight mb-2 leading-snug">
            あなたの名前で、<br />デモ環境を無料でお作りします。
          </h2>
          <p className="text-[14px] text-[#555] leading-relaxed mb-7 max-w-[480px]">
            使いたい名前・用途を教えてください。あなたの会社名・ブランド名・ロゴを設定したデモ環境を5営業日以内にお届けします。
          </p>

          {/* Step pills */}
          <div className="flex gap-1 mb-7 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#0A0A0A] text-white">
              STEP 1 名前と用途
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-white border border-[#E0E0E0] text-[#999]">
              STEP 2 規模
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-white border border-[#E0E0E0] text-[#999]">
              STEP 3 送信
            </span>
          </div>

          {/* Form grid */}
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#555]">
                会社名 / サービス名 / ブランド名
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="例：株式会社○○、○○サービス"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#555] flex items-center gap-1.5">
                チャットにつけたい名前
                <span className="text-[10px] text-[#999] bg-white border border-[#E0E0E0] rounded px-1.5 py-px font-normal">
                  任意
                </span>
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="例：○○ AIアシスタント、○○相談窓口"
                value={chatname}
                onChange={(e) => setChatname(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#555]">主な使い方</label>
              <select
                className={inputClass}
                value={usecase}
                onChange={(e) => setUsecase(e.target.value)}
              >
                <option value="">選択してください</option>
                <option>自社ブランドのAIチャットとして</option>
                <option>AI相談窓口として</option>
                <option>採用・問い合わせ対応として</option>
                <option>カスタマーサポートとして</option>
                <option>その他</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#555]">利用規模の目安</label>
              <select
                className={inputClass}
                value={scale}
                onChange={(e) => setScale(e.target.value)}
              >
                <option value="">選択してください</option>
                <option>1〜5名</option>
                <option>6〜20名</option>
                <option>21〜50名</option>
                <option>51名以上</option>
              </select>
            </div>

            {/* Logo upload — full width */}
            <div className="sm:col-span-2 col-span-1 flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#555] flex items-center gap-1.5">
                ロゴ画像
                <span className="text-[10px] text-[#999] bg-white border border-[#E0E0E0] rounded px-1.5 py-px font-normal">
                  任意
                </span>
              </label>
              <div
                className={`relative min-h-[90px] flex items-center justify-center rounded-xl cursor-pointer transition-colors ${
                  logoDataUrl
                    ? 'border border-solid border-[#0A0A0A] bg-[#F7F7F7]'
                    : 'border-[1.5px] border-dashed border-[#C8C8C8] bg-white hover:border-[#0A0A0A]'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={handleLogoUpload}
                />
                {!logoDataUrl ? (
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                    <Upload size={20} className="text-[#999]" />
                    <p className="text-[12px] text-[#999] text-center">
                      クリックしてロゴを選択
                      <br />
                      <span className="text-[11px]">PNG / JPG / SVG · 推奨 200×200px 以上</span>
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 w-full px-4 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoDataUrl}
                      alt=""
                      className="w-9 h-9 rounded-lg object-cover border-[0.5px] border-[#E0E0E0]"
                    />
                    <span className="flex-1 text-[12px] text-[#555]">{logoFilename}</span>
                    <button
                      className="text-[11px] text-[#999] underline cursor-pointer bg-transparent border-none p-0 pointer-events-auto"
                      onClick={removeLogo}
                    >
                      削除
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-[#999]">
                アップロードいただいたロゴはデモ環境の作成にのみ使用します。
              </p>
            </div>

            {/* Email — full width */}
            <div className="sm:col-span-2 col-span-1 flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#555]">
                メールアドレス{' '}
                <span className="text-[11px] text-[#999] font-normal">
                  （デモのURLをお送りします）
                </span>
              </label>
              <input
                type="email"
                className={inputClass}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Live preview */}
          <div className="mt-7">
            <p className="text-[11px] text-[#999] font-medium tracking-[0.5px] uppercase mb-2">
              デモのイメージ（入力するとリアルタイムで変わります）
            </p>
            <div className="border border-[#E0E0E0] rounded-xl bg-white overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#E0E0E0] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[6px] bg-[#1a1a1a] flex items-center justify-center text-[10px] font-bold text-white overflow-hidden flex-shrink-0">
                  {logoDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoDataUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    previewInitials
                  )}
                </div>
                <span className="text-[13px] font-medium flex-1">{previewName}</span>
                <span className="text-[10px] text-[#999] bg-[#F7F7F7] border-[0.5px] border-[#E0E0E0] rounded px-1.5 py-0.5">
                  <span className="text-[#C9151E]">●</span> オンライン
                </span>
              </div>
              <div className="px-4 py-3.5 flex flex-col gap-2">
                <div
                  className="self-end bg-[#0A0A0A] text-white px-3 py-1.5 text-[12px] max-w-[75%]"
                  style={{ borderRadius: '12px 12px 2px 12px' }}
                >
                  サービスについて相談したいです。
                </div>
                <div
                  className="self-start bg-[#F7F7F7] text-[#0A0A0A] px-3 py-1.5 text-[12px] max-w-[85%] border-[0.5px] border-[#E0E0E0]"
                  style={{ borderRadius: '12px 12px 12px 2px' }}
                >
                  ご相談ありがとうございます。内容を整理しながら、次に確認すべきポイントをご案内します。
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-lg mx-4 mb-3.5 px-3 py-2 border-[0.5px] border-[#E0E0E0]">
                <span className="flex-1 text-[11px] text-[#bbb]">メッセージを入力...</span>
                <div className="w-[26px] h-[26px] bg-[#0A0A0A] rounded-[6px] flex items-center justify-center text-white flex-shrink-0">
                  <ArrowUp size={12} />
                </div>
              </div>
            </div>
          </div>

          <button
            className="mt-6 px-7 py-3.5 bg-[#0A0A0A] text-white rounded-[9px] text-[14px] font-medium cursor-pointer hover:bg-[#C9151E] transition-colors inline-flex items-center gap-2"
            onClick={handleSubmit}
          >
            <Send size={14} />
            無料で相談する
          </button>
          <p className="text-[12px] text-[#999] mt-3">
            送信後、5営業日以内にデモ環境のURLをお送りします。費用は一切かかりません。
          </p>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] flex items-center justify-center mx-auto mb-4 text-white">
            <Check size={22} />
          </div>
          <h3 className="text-xl font-medium mb-2">ありがとうございます。</h3>
          <p className="text-[13px] text-[#555] leading-relaxed">
            ご入力いただいた内容をもとに、デモ環境を準備します。
            <br />
            5営業日以内にメールでURLをお送りします。
          </p>
          <div className="mt-5 mx-auto max-w-[360px] px-4 py-4 bg-[#F7F7F7] border border-[#E0E0E0] rounded-xl text-[13px] text-[#555] text-left leading-[1.9]">
            会社名：{company}
            <br />
            チャット名：{chatname || `${company} AIアシスタント`}
            <br />
            使い方：{usecase || '未選択'}
            <br />
            規模：{scale || '未選択'}
            <br />
            ロゴ：{logoDataUrl ? 'あり（アップロード済み）' : 'なし'}
            <br />
            送付先：{email}
          </div>
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────
// Main LP component
// ──────────────────────────────────────────────

export function NailyLp() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] text-[15px] leading-[1.7]">

      {/* ── HEADER ── */}
      <header className="bg-white/95 border-b border-[#E0E0E0] sm:px-8 px-5 h-[54px] flex items-center justify-between sticky top-0 z-40 backdrop-blur-sm">
        <BrandMark />
        <button
          className="px-4 py-1.5 bg-[#0A0A0A] text-white rounded-lg text-[13px] font-medium cursor-pointer hover:bg-[#333] transition-colors"
          onClick={() => scrollTo('survey')}
        >
          無料で相談する
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="py-20 sm:px-10 px-6 max-w-[960px] mx-auto grid sm:grid-cols-2 grid-cols-1 gap-12 items-center sm:py-20 py-12 sm:gap-12 gap-9">
        <div>
          <p className="text-[12px] text-[#999] tracking-[0.5px] mb-4 font-medium">
            好きな名前で使えるAIチャット環境
          </p>
          <h1 className="sm:text-[38px] text-[28px] font-medium leading-[1.2] tracking-tight mb-4">
            あなたの
            <em className="not-italic border-b-[2.5px] border-[#C9151E]">名前</em>で、
            <br />
            AIチャットを。
          </h1>
          <p className="text-[15px] text-[#555] leading-[1.8] mb-7">
            会社名、サービス名、ブランド名、相談窓口名。
            <br />
            好きな名前で利用できるAIチャット環境を、
            <br />
            最短5営業日でご提供します。
          </p>
          <div className="flex gap-2.5 flex-wrap">
            <button
              className="px-6 py-3 bg-[#0A0A0A] text-white rounded-[9px] text-[14px] font-medium cursor-pointer hover:bg-[#C9151E] transition-colors"
              onClick={() => scrollTo('survey')}
            >
              無料で相談する
            </button>
            <button
              className="px-6 py-3 bg-white text-[#0A0A0A] border border-[#C8C8C8] rounded-[9px] text-[14px] cursor-pointer hover:bg-[#F7F7F7] transition-colors"
              onClick={() => scrollTo('features')}
            >
              デモを見る
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <MockBrowser url="chat.○○company.com/ai" avBg="#1a1a1a" avText="株" title="株式会社○○ AIアシスタント">
            <BubbleUser>サービスについて教えてください</BubbleUser>
            <BubbleAi>ご質問ありがとうございます。内容を整理しながらご案内します。</BubbleAi>
          </MockBrowser>
          <MockBrowser url="recruit.○○brand.jp/chat" avBg="#2a2a2a" avText="HR" title="○○採用相談窓口">
            <BubbleUser>選考フローを教えてください</BubbleUser>
            <BubbleAi>書類選考→一次面接→最終面接の3ステップです。</BubbleAi>
          </MockBrowser>
          <MockBrowser url="support.○○service.com" avBg="#404040" avText="CS" title="○○カスタマーサポート" round>
            <BubbleUser>解約方法を教えてください</BubbleUser>
            <BubbleAi>マイページの「ご契約内容」から手続きいただけます。</BubbleAi>
          </MockBrowser>
        </div>
      </section>

      <Divider />

      {/* ── ABOUT ── */}
      <section id="about" className="py-16 sm:px-10 px-6 max-w-[960px] mx-auto">
        <Eyebrow>About</Eyebrow>
        <div className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-2xl p-10 text-center sm:p-10 p-7">
          <div className="flex items-center justify-center gap-5 mb-7 flex-wrap">
            <div className="text-center">
              <div className="text-[10px] text-[#999] font-medium tracking-[0.5px] uppercase mb-1.5">
                命名
              </div>
              <div className="text-[22px] font-medium">名入り</div>
            </div>
            <div className="text-[20px] text-[#999] mt-[18px]">＋</div>
            <div className="text-center">
              <div className="text-[10px] text-[#999] font-medium tracking-[0.5px] uppercase mb-1.5">
                テクノロジー
              </div>
              <div className="text-[22px] font-medium">AI</div>
            </div>
            <div className="text-[20px] text-[#999] mt-[18px]">＝</div>
            <div className="bg-white border border-[#E0E0E0] rounded-xl px-6 py-3.5">
              <div className="text-[10px] text-[#999] font-medium tracking-[0.5px] uppercase mb-1.5">
                サービス名
              </div>
              <BrandMark large />
            </div>
          </div>
          <p className="text-[15px] text-[#555] leading-[1.9]">
            ナイリー（nAIly）は、「名入り」と「AI」を組み合わせたブランドです。
            <br />
            会社名、サービス名、ブランド名、相談窓口名など、
            <br />
            好きな名前で利用できるAIチャット環境を提供しています。
          </p>
        </div>
      </section>

      <Divider />

      {/* ── NAME EXAMPLES ── */}
      <section className="py-16 sm:px-10 px-6 max-w-[960px] mx-auto">
        <Eyebrow>Name Examples</Eyebrow>
        <SecTitle>こんな名前で使えます</SecTitle>
        <SecSub>
          会社名、サービス名、ブランド名、用途に合わせて自由な名前でAIチャット環境を利用できます。
        </SecSub>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(148px,1fr))] gap-2.5">
          {[
            { name: '○○ AIチャット', desc: '社内・社外どちらでも' },
            { name: '○○ AIアシスタント', desc: '自社ブランドで' },
            { name: '○○ 相談窓口', desc: 'AI相談窓口として' },
            { name: '○○ サポートセンター', desc: '問い合わせ対応に' },
            { name: '○○ 採用相談窓口', desc: '採用対応に' },
            { name: '○○ カスタマーサポート', desc: 'サービス向けに' },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-xl px-4 py-3.5"
            >
              <strong className="block text-[13px] font-medium mb-0.5">{item.name}</strong>
              <span className="text-[12px] text-[#999]">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── 3-STEP FLOW ── */}
      <section className="py-16 sm:px-10 px-6 max-w-[960px] mx-auto">
        <Eyebrow>How To Start</Eyebrow>
        <SecTitle>使い始めるまでの流れ</SecTitle>
        <div className="mt-6 grid sm:grid-cols-[1fr_28px_1fr_28px_1fr] grid-cols-1 items-start sm:gap-0 gap-3">
          <FlowStep
            num="STEP 01"
            title="フォームで相談"
            desc="使いたい名前・用途・規模を教えてください。最短3分で完了します"
            icon={<MessageCircle size={22} />}
          />
          <div className="hidden sm:flex items-center justify-center pt-6 text-[#999]">
            <ArrowRight size={18} />
          </div>
          <FlowStep
            num="STEP 02"
            title="5営業日で準備"
            desc="名前・ロゴ・専用URLの設定はすべてこちらで対応します"
            icon={<Settings size={22} />}
          />
          <div className="hidden sm:flex items-center justify-center pt-6 text-[#999]">
            <ArrowRight size={18} />
          </div>
          <FlowStep
            num="STEP 03"
            title="好きな名前で使い始める"
            desc="URLを受け取ったら、すぐに自分の名前を冠したAIチャットとして利用開始"
            icon={<Send size={22} />}
          />
        </div>
      </section>

      <Divider />

      {/* ── FEATURES ── */}
      <section id="features" className="py-16 sm:px-10 px-6 max-w-[960px] mx-auto">
        <Eyebrow>Features</Eyebrow>
        <SecTitle>大手AIツールと同程度の機能を提供</SecTitle>
        <SecSub>
          ChatGPTやClaudeで使われているような機能を、あなたの名前・ロゴを冠した専用環境でそのままご利用いただけます。
        </SecSub>

        {/* Before / After */}
        <div className="grid sm:grid-cols-[1fr_auto_1fr] grid-cols-1 gap-4 items-stretch my-7">
          {/* Before */}
          <div className="border border-[#E0E0E0] rounded-xl overflow-hidden">
            <div className="px-3.5 py-1.5 text-[11px] font-medium border-b border-[#E0E0E0] bg-[#F7F7F7] text-[#999]">
              一般的なAIツール
            </div>
            <div className="bg-[#F7F7F7] px-2.5 py-1.5 border-b border-[#E0E0E0] flex items-center gap-1.5">
              <div className="flex gap-0.5">
                <div className="w-[5px] h-[5px] rounded-full bg-[#C8C8C8]" />
                <div className="w-[5px] h-[5px] rounded-full bg-[#C8C8C8]" />
                <div className="w-[5px] h-[5px] rounded-full bg-[#C8C8C8]" />
              </div>
              <div className="flex-1 bg-white border-[0.5px] border-[#E0E0E0] rounded-sm px-2 py-0.5 text-[9px] text-[#999]">
                chatai.com
              </div>
            </div>
            <div className="px-3 py-2 border-b border-[#E0E0E0] flex items-center gap-2 bg-white">
              <div className="w-[18px] h-[18px] rounded bg-[#E0E0E0] flex-shrink-0" />
              <span className="text-[10px] text-[#999]">Chat AI（汎用サービス名）</span>
            </div>
            <div className="px-3 py-2.5 bg-white flex flex-col gap-1.5">
              <div
                className="self-end bg-[#0A0A0A] text-white px-2.5 py-1.5 text-[10px] max-w-[78%]"
                style={{ borderRadius: '9px 9px 2px 9px' }}
              >
                相談があります
              </div>
              <div
                className="self-start bg-[#F7F7F7] px-2.5 py-1.5 text-[10px] max-w-[88%] border-[0.5px] border-[#E0E0E0]"
                style={{ borderRadius: '9px 9px 9px 2px' }}
              >
                どのようなご質問でしょうか？
              </div>
            </div>
          </div>

          {/* VS */}
          <div className="sm:flex hidden items-center justify-center w-7 flex-shrink-0 mt-[72px]">
            <div className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-full px-1.5 py-1 text-[10px] font-medium text-[#999]">
              →
            </div>
          </div>

          {/* After */}
          <div className="border-[1.5px] border-[#0A0A0A] rounded-xl overflow-hidden">
            <div className="px-3.5 py-1.5 text-[11px] font-medium border-b border-[#0A0A0A] bg-[#0A0A0A] text-white">
              あなた専用のAIチャット
            </div>
            <div className="bg-white px-2.5 py-1.5 border-b border-[#E0E0E0] flex items-center gap-1.5">
              <div className="flex gap-0.5">
                <div className="w-[5px] h-[5px] rounded-full bg-[#C8C8C8]" />
                <div className="w-[5px] h-[5px] rounded-full bg-[#C8C8C8]" />
                <div className="w-[5px] h-[5px] rounded-full bg-[#C8C8C8]" />
              </div>
              <div className="flex-1 bg-white border-[0.5px] border-[#E0E0E0] rounded-sm px-2 py-0.5 text-[9px] text-[#555] font-medium">
                chat.○○company.com/ai
              </div>
            </div>
            <div className="px-3 py-2 border-b border-[#E0E0E0] flex items-center gap-2 bg-white">
              <div className="w-[18px] h-[18px] rounded bg-[#0A0A0A] text-white flex items-center justify-center text-[7px] font-bold flex-shrink-0">
                株
              </div>
              <span className="text-[10px] text-[#0A0A0A] font-medium">
                株式会社○○ AIアシスタント
              </span>
            </div>
            <div className="px-3 py-2.5 bg-white flex flex-col gap-1.5">
              <div
                className="self-end bg-[#0A0A0A] text-white px-2.5 py-1.5 text-[10px] max-w-[78%]"
                style={{ borderRadius: '9px 9px 2px 9px' }}
              >
                相談があります
              </div>
              <div
                className="self-start bg-[#F7F7F7] px-2.5 py-1.5 text-[10px] max-w-[88%] border-[0.5px] border-[#E0E0E0]"
                style={{ borderRadius: '9px 9px 9px 2px' }}
              >
                どのようなご質問でしょうか？
              </div>
            </div>
          </div>
        </div>

        {/* Feature compare cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3 mb-6">
          {[
            {
              title: 'テキスト生成・文章作成',
              desc: 'メール文面、提案書、議事録、SNS投稿など、あらゆる文章を自動生成',
            },
            {
              title: 'ファイル・PDF解析',
              desc: 'アップロードした資料や契約書をAIが読み取り、要点を整理・回答',
            },
            {
              title: '画像の読み取り・解析',
              desc: '写真や図表をアップロードして内容を確認・説明させることが可能',
            },
            {
              title: '会話履歴の保存',
              desc: '過去のやり取りをチャット形式で保存。続きから再開できます',
            },
          ].map((f) => (
            <div key={f.title} className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-xl p-4">
              <strong className="block text-[13px] font-medium mb-1.5">{f.title}</strong>
              <span className="text-[12px] text-[#555] leading-relaxed">{f.desc}</span>
            </div>
          ))}
        </div>

        {/* Feature checklist */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-2.5">
          {[
            { icon: <AtSign size={11} />, label: '好きな名前で使える' },
            { icon: <Link2 size={11} />, label: '専用URLで利用' },
            { icon: <Image size={11} />, label: 'ロゴ設定' },
            { icon: <Smartphone size={11} />, label: 'ホーム画面追加対応' },
            { icon: <Monitor size={11} />, label: 'スマホ・PC対応' },
            { icon: <BarChart2 size={11} />, label: '利用量管理' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 px-3.5 py-3 bg-[#F7F7F7] border border-[#E0E0E0] rounded-[9px] text-[13px] text-[#555]"
            >
              <div className="w-5 h-5 rounded-[5px] bg-[#0A0A0A] flex items-center justify-center flex-shrink-0 text-white">
                {item.icon}
              </div>
              {item.label}
            </div>
          ))}
        </div>

        {/* Device row */}
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-4">
          {/* Phone mock */}
          <div className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-[14px] p-6 flex items-center gap-5">
            <div className="w-[100px] h-[170px] border-[2.5px] border-[#0A0A0A] rounded-[18px] bg-white relative flex-shrink-0 overflow-hidden">
              <div
                className="absolute top-[7px] left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#0A0A0A] rounded-sm"
              />
              <div className="absolute inset-x-0 bottom-0 top-[22px] p-2">
                <div className="bg-[#EFEFED] rounded-[9px] h-full p-2 grid grid-cols-3 gap-1.5 content-start">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-6 rounded-[6px] flex items-center justify-center ${
                        i === 4
                          ? 'bg-[#0A0A0A] text-white text-[6px] font-bold'
                          : 'bg-[#E0E0E0]'
                      }`}
                    >
                      {i === 4 ? 'AI' : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[13px] font-medium mb-1.5">アプリのように使える</h4>
              <p className="text-[12px] text-[#555] leading-relaxed">
                ホーム画面に追加すれば、専用アプリとして起動できます。URLを覚えなくてもOK。
              </p>
            </div>
          </div>

          {/* URL comparison */}
          <div className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-[14px] p-6 flex flex-col gap-3.5 justify-center">
            <div className="bg-white border border-[#E0E0E0] rounded-lg px-3.5 py-2.5">
              <div className="text-[10px] text-[#999] font-medium uppercase tracking-[0.5px] mb-1.5">
                一般的なAIツール
              </div>
              <div className="font-mono text-[12px] text-[#555]">chatgpt.com / claude.ai</div>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#999]">
              <ArrowDown size={14} />
              あなた専用のURLに変わります
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg px-3.5 py-2.5">
              <div className="text-[10px] text-[#999] font-medium uppercase tracking-[0.5px] mb-1.5">
                あなたの専用URL
              </div>
              <div className="font-mono text-[12px] text-[#0A0A0A] font-medium">
                chat.○○company.com/ai
              </div>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2.5 px-4 py-3.5 bg-white border border-[#E0E0E0] rounded-xl text-[13px] text-[#555] mt-4">
          <Info size={16} className="text-[#999] flex-shrink-0 mt-0.5" />
          大手AIツールとの違いは「機能」ではなく「名前・ロゴ・専用URL」です。好きな名前を冠したAIチャット環境として使えることが最大の特徴です。
        </div>
      </section>

      <Divider />

      {/* ── USE CASES ── */}
      <section className="py-16 sm:px-10 px-6 max-w-[960px] mx-auto">
        <Eyebrow>Use Cases</Eyebrow>
        <SecTitle>こんな使い方ができます</SecTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(148px,1fr))] gap-2.5">
          {[
            { num: '01', title: '自社AIアシスタント', desc: '社名入りのAIチャット環境を社内で利用', icon: <Building2 size={26} /> },
            { num: '02', title: 'AI相談窓口', desc: '自社ブランドの相談窓口をAIで設ける', icon: <Headphones size={26} /> },
            { num: '03', title: '採用相談窓口', desc: '「○○採用相談窓口」として24時間対応', icon: <UserCheck size={26} /> },
            { num: '04', title: 'カスタマーサポート', desc: 'ブランド名入りのサポートAIとして活用', icon: <MessageSquare size={26} /> },
            { num: '05', title: '資料・文章作成', desc: '自社名入りのAIチャットでドラフト作成', icon: <FileText size={26} /> },
            { num: '06', title: 'PDF・画像の確認補助', desc: '書類の読み取り・内容整理に', icon: <FileSearch size={26} /> },
          ].map((s) => (
            <div
              key={s.title}
              className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-xl overflow-hidden"
            >
              <div className="h-[60px] flex items-center justify-center bg-[#EFEFED] text-[#0A0A0A]">
                {s.icon}
              </div>
              <div className="px-3.5 py-3">
                <p className="text-[10px] text-[#999] font-medium mb-1">{s.num}</p>
                <strong className="block text-[13px] font-medium mb-0.5">{s.title}</strong>
                <span className="text-[12px] text-[#999]">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── REASONS ── */}
      <section className="py-16 sm:px-10 px-6 max-w-[960px] mx-auto">
        <Eyebrow>Why Naily</Eyebrow>
        <SecTitle>選ばれる理由</SecTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
          {[
            { num: '01', text: '好きな名前・ロゴで使えます' },
            { num: '02', text: '最短5営業日で利用開始できます' },
            { num: '03', text: '専用URLでアプリのように使えます' },
            { num: '04', text: 'ホーム画面からすぐ起動できます' },
            { num: '05', text: '大手AIツールと同等の操作感' },
            { num: '06', text: '必要な分だけ使える従量課金制' },
          ].map((r) => (
            <div
              key={r.num}
              className="px-4 py-4 bg-[#F7F7F7] border border-[#E0E0E0] rounded-xl flex gap-2.5 text-[13px] text-[#555]"
            >
              <span className="text-[11px] font-medium text-[#999] flex-shrink-0 mt-0.5">
                {r.num}
              </span>
              {r.text}
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── PRICING ── */}
      <section id="pricing" className="py-16 sm:px-10 px-6 max-w-[960px] mx-auto">
        <Eyebrow>Pricing</Eyebrow>
        <SecTitle>料金プラン</SecTitle>
        <SecSub>いずれのプランもAI利用料が別途従量課金で発生します。</SecSub>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
          <PlanCard
            name="ライト"
            initFee="初期費用 100,000円〜"
            price="9,800円"
            cycle="/月"
            accounts="利用アカウント 5名まで"
            items={[
              '好きな名前で使えるAIチャット',
              '専用URL',
              'ロゴ設定',
              'ホーム画面アイコン対応',
              'チャット履歴',
            ]}
            note="+ AI利用料（従量課金）"
            onConsult={() => scrollTo('survey')}
          />
          <PlanCard
            name="スタンダード"
            initFee="初期費用 200,000円〜"
            price="19,800円〜"
            cycle="/月（利用量による）"
            accounts="利用アカウント数に応じて変動"
            items={[
              'ライトの内容すべて',
              'ファイル解析',
              '画像解析',
              '利用量管理',
              'テンプレート設定',
              '社内データとの連携',
            ]}
            note={'月額はAI利用料込みで変動します。\n目安：19,800円〜（利用量により増減）'}
            featured
            onConsult={() => scrollTo('survey')}
          />
          <PlanCard
            name="カスタム"
            initFee="ご要望に応じてご提案"
            price="要相談"
            cycle=""
            accounts="アカウント数・機能 制限なし"
            items={[
              '専用機能の開発・追加',
              '独自ドメイン対応',
              '外部サービス・API連携',
              '社内システムとの接続',
              '研修・活用支援',
            ]}
            note="機能要件・規模に合わせて個別見積もり"
            onConsult={() => scrollTo('survey')}
          />
        </div>
      </section>

      <Divider />

      {/* ── FAQ ── */}
      <FaqSection />

      <Divider />

      {/* ── SURVEY ── */}
      <div className="pt-16 sm:px-10 px-6 max-w-[960px] mx-auto">
        <SurveySection id="survey" />
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-[#F7F7F7] border-t border-[#E0E0E0] py-10 px-10 text-center">
        <BrandMark large />
        <p className="text-[12px] text-[#999] mt-3">好きな名前で使えるAIチャット環境</p>
        <p className="text-[12px] text-[#999] mt-2">© 2025 ナイリー</p>
      </footer>
    </div>
  )
}

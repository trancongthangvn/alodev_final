import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/data/projects'
import JsonLd from '@/components/JsonLd'
import QuoteCTA from '@/components/QuoteCTA'
import Icon from '@/components/Icon'
import ScrollEffects from '@/components/ScrollEffects'
import HideGlobalFooter from '@/components/HideGlobalFooter'
// CustomCursor disabled May 2026 - spring physics intentionally laggy
// "mềm như nước" feel made cursor read as delayed. Real pro studios
// (Linear, Vercel, Stripe, Apple, Pentagram) all use native cursor.
// import CustomCursor from '@/components/CustomCursor'
import { faqPageSchema, breadcrumbSchema, organizationSchema, websiteSchema } from '@/lib/schema'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const capabilities = [
  { label: 'Website',           note: 'Landing, doanh nghiệp, e-commerce',    anchor: '/dich-vu#website' },
  { label: 'Ứng dụng di động', note: 'iOS, Android, cross-platform',          anchor: '/dich-vu#mobile' },
  { label: 'Hệ thống quản trị', note: 'CRM, ERP, dashboard nội bộ',            anchor: '/dich-vu#system' },
  { label: 'Tự động hoá & AI',  note: 'Chatbot Zalo, workflow, tích hợp LLM', anchor: '/dich-vu#automation' },
]

const process = [
  { step: 'Khảo sát',  desc: 'Khảo sát nghiệp vụ, đề xuất phạm vi dự án', time: '2–3 ngày' },
  { step: 'Thiết kế',  desc: 'Wireframe, đặc tả kỹ thuật, báo giá chi tiết', time: '1–2 tuần' },
  { step: 'Phát triển',desc: 'Triển khai theo milestone, demo định kỳ',    time: '4–12 tuần' },
  { step: 'Bàn giao',  desc: 'Chuyển giao mã nguồn + hỗ trợ kỹ thuật',     time: '6–12 tháng' },
]

const toc = [
  { num: '01', name: 'Studio',        hash: '#gioi-thieu' },
  { num: '02', name: 'Dịch vụ',       hash: '#dich-vu' },
  { num: '03', name: 'Về Alodev',     hash: '#ve-alodev' },
  { num: '04', name: 'Cách làm việc', hash: '#quy-trinh' },
  { num: '05', name: 'Câu hỏi',       hash: '#cau-hoi' },
  { num: '06', name: 'Liên hệ',       hash: '#lien-he' },
]

const stats = [
  { num: '11+',  label: 'Dự án production đã bàn giao' },
  { num: '6+',   label: 'Ngành dọc đã triển khai' },
  { num: '100%', label: 'Quyền sở hữu mã nguồn thuộc khách hàng' },
  { num: '24h',  label: 'Phản hồi yêu cầu báo giá đầu tiên' },
]

const commitments = [
  'Bàn giao mã nguồn, database, domain dưới tên doanh nghiệp khách hàng',
  'Hỗ trợ kỹ thuật 6–12 tháng sau bàn giao',
  'Báo cáo tiến độ định kỳ theo milestone',
  'Cam kết SLA về tiến độ và chất lượng — quy định cụ thể trong hợp đồng',
  'Không vendor lock-in, không phí license phát sinh',
]

const faq = [
  { q: 'Chi phí thiết kế website doanh nghiệp khoảng bao nhiêu?', a: 'Website giới thiệu từ 8 triệu, e-commerce từ 25 triệu, ứng dụng di động từ 60 triệu, hệ thống quản trị báo giá theo phạm vi dự án. Cấu hình chi tiết tại /bao-gia.' },
  { q: 'Mã nguồn và dữ liệu thuộc sở hữu của ai sau bàn giao?', a: 'Khách hàng. Toàn bộ mã nguồn, database, domain và hosting bàn giao dưới tên doanh nghiệp khách hàng. Không vendor lock-in, không phí license phát sinh.' },
  { q: 'Thời gian triển khai một dự án mất bao lâu?', a: 'Website 3–5 tuần. E-commerce 6–10 tuần. Ứng dụng di động 10–16 tuần. Hệ thống quản trị 8–20 tuần. Báo cáo tiến độ định kỳ.' },
  { q: 'Sau bàn giao có hỗ trợ tiếp không?', a: 'Hỗ trợ kỹ thuật 6–12 tháng tuỳ hợp đồng. Phát triển bổ sung theo gói retainer hoặc tính theo giờ kỹ sư.' },
]

export default function Home() {
  return (
    <>
      <JsonLd data={[
        organizationSchema(),
        websiteSchema(),
        faqPageSchema(faq),
        breadcrumbSchema([{ name: 'Trang chủ', url: '/' }]),
      ]} />

      {/*
        Magazine spread on atmospheric backdrop (v7)
        ─────────────────────────────────────────────────────
        Fixed bg layer fills the viewport → soft blue depth pools.
        Card centered max-w 1400px with elevation → "tạp chí trên bàn".
        Sticky rail still works via overflow:clip (not :hidden).
      */}
      <HideGlobalFooter />
      <ScrollEffects />
      <div className="mag-page-bg" aria-hidden="true" />
      {/* Grain texture overlay - lusion-grade film grain, z-index 9998 */}
      <div className="mag-grain" aria-hidden="true" />

      <div className="mag-wrap">
        {/* ── IDENTITY COLUMN ── */}
        <aside className="mag-rail" aria-label="Alodev studio identity">

          {/* Top: logo */}
          <div className="mag-rail-top">
            <Link href="/" className="inline-block">
              <span className="text-sm font-bold tracking-tighter text-gray-900 dark:text-white">
                alodev<span className="text-brand-600 dark:text-brand-400">.vn</span>
              </span>
            </Link>
            <p className="mt-1 text-[10px] font-mono text-gray-400 dark:text-ink-600 tracking-wide">
              Studio · Hà Nội · 2025
            </p>
          </div>

          {/* Middle: cube - small, breathing room */}
{/* Bottom: TOC nav + contact + CTA */}
          <div className="mag-rail-bottom">
            {/* Tagline */}
            <p className="text-sm font-bold leading-snug tracking-tight text-gray-900 dark:text-white">
              Phần mềm cho<br />doanh nghiệp Việt.
            </p>

            {/* Table of contents - magazine nav */}
            <nav className="mt-5 pt-4 border-t border-slate-200 dark:border-ink-800" aria-label="Mục lục">
              <ul className="space-y-1.5">
                {toc.map((t) => (
                  <li key={t.hash}>
                    <a href={t.hash}
                       className="mag-toc-link group flex items-baseline gap-2 text-xs font-mono text-gray-400 dark:text-ink-600 hover:text-gray-900 dark:hover:text-white transition">
                      <span className="opacity-70 group-hover:opacity-100">{t.num}</span>
                      <span className="mag-toc-name">{t.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-ink-800 space-y-0.5">
              <a href="tel:0364234936"
                 className="block text-xs font-semibold text-gray-700 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-400 transition">
                0364 234 936
              </a>
              <a href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer"
                 className="block text-xs text-gray-400 dark:text-ink-600 hover:text-brand-600 dark:hover:text-brand-400 transition">
                Zalo →
              </a>
            </div>

            <div className="magnetic mt-3">
              <QuoteCTA size="sm" variant="solid" className="w-full justify-center text-xs">
                Yêu cầu báo giá
              </QuoteCTA>
            </div>
          </div>
        </aside>

        {/* ── CONTENT COLUMN ── */}
        <div className="mag-scroll">

          {/* Mobile-only identity (rail hidden on mobile) */}
          <div className="lg:hidden border-b border-gray-200 dark:border-ink-800">
<div className="px-5 pb-7 pt-2">
              <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                Phần mềm do <span className="text-brand-600 dark:text-brand-400">người làm ra</span>.
              </p>
              <p className="mt-2 text-xs font-mono text-gray-400 dark:text-ink-600">Studio Hà Nội · Est. 2025</p>
              <div className="mt-4 flex gap-2.5">
                <QuoteCTA size="md" variant="solid" className="flex-1 justify-center">Báo giá</QuoteCTA>
                <Link href="/du-an"
                  className="flex-1 inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-ink-800 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white hover:border-gray-300 transition">
                  Dự án →
                </Link>
              </div>
            </div>
          </div>

          {/* INTRO / MANIFESTO - hook: who we are and what we do, before any proof */}
          <section id="gioi-thieu" className="mag-section mag-bg-paper" data-section-name="Studio">
            <div className="mag-section-inner">
              <p className="mag-section-index">01</p>
              <h1 className="mag-section-head">Phát triển phần mềm <br />cho doanh nghiệp Việt.</h1>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-ink-400 max-w-lg">
                Triển khai website, ứng dụng di động và hệ thống quản trị nội bộ. Trụ sở Hà Nội, phục vụ doanh nghiệp 5–50 nhân sự trên toàn quốc.
              </p>

              {/* Differentiators - 4 icon tiles (no descriptions — visual-led) */}
              <div className="mag-commit-grid">
                {[
                  { icon: 'handshake'    as const, label: 'Đội ngũ\nkỹ thuật in-house' },
                  { icon: 'package'      as const, label: 'Quyền sở hữu\nmã nguồn' },
                  { icon: 'gauge'        as const, label: 'Quản trị dự án\ntheo milestone' },
                  { icon: 'shield-check' as const, label: 'Hỗ trợ kỹ thuật\nsau bàn giao' },
                ].map((d) => (
                  <div key={d.label} className="mag-commit-tile" data-stagger="up">
                    <span className="mag-commit-tile-icon">
                      <Icon name={d.icon} className="w-4 h-4" strokeWidth={1.75} />
                    </span>
                    <span className="mag-commit-tile-label" style={{ whiteSpace: 'pre-line' }}>{d.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <div className="magnetic">
                  <QuoteCTA size="sm" variant="solid" className="justify-center">Báo giá</QuoteCTA>
                </div>
                <a href="#du-an"
                   className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-ink-400 hover:text-gray-900 dark:hover:text-white transition">
                  Xem dự án ↓
                </a>
              </div>
            </div>
          </section>

          {/* SERVICES - 2x2 card grid (was vertical list — varied to break "01+head" template) */}
          <section className="mag-section mag-bg-paper" id="dich-vu" data-section-name="Dịch vụ">
            <div className="mag-section-inner">
              <p className="mag-section-label">
                <span className="num">02</span>
                <span aria-hidden="true">/</span>
                <span>Dịch vụ</span>
              </p>
              <h2 className="mag-section-head">Việc Alodev nhận làm.</h2>

              <div className="mag-services-grid">
                {[
                  { label: 'Website',             note: 'Doanh nghiệp · E-commerce', anchor: '/dich-vu#website',    icon: 'globe' as const },
                  { label: 'Ứng dụng di động',    note: 'iOS · Android',             anchor: '/dich-vu#mobile',     icon: 'phone' as const },
                  { label: 'Hệ thống quản trị',   note: 'CRM · ERP · Dashboard',     anchor: '/dich-vu#system',     icon: 'cpu' as const },
                  { label: 'Tự động hoá · AI',    note: 'Chatbot · Workflow',        anchor: '/dich-vu#automation', icon: 'bot' as const },
                ].map((c, i) => (
                  <Link key={c.label} href={c.anchor} className="mag-service-card group" data-stagger="up">
                    <span className="mag-service-card-icon">
                      <Icon name={c.icon} className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <span className="mag-service-card-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mag-service-card-name">{c.label}</span>
                    <span className="mag-service-card-note">{c.note}</span>
                    <span className="mag-service-card-arrow" aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
                <Link href="/quy-trinh" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700">Quy trình →</Link>
                <Link href="/dich-vu" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700">Bảng giá →</Link>
                <Link href="/bao-gia" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700">Báo giá →</Link>
              </div>
            </div>
          </section>

          {/* ABOUT - quote-led layout (no big number — lead with the strongest line) */}
          <section id="ve-alodev" className="mag-section mag-bg-tint mag-about-led" data-section-name="Về Alodev">
            <div className="mag-section-inner">
              <p className="mag-section-label">
                <span className="num">03</span>
                <span aria-hidden="true">/</span>
                <span>Về Alodev</span>
              </p>

              {/* Lead with the strongest line — drop big head, let the quote breathe */}
              <blockquote className="mag-about-led-quote">
                11 sản phẩm production đang vận hành trên domain riêng <em>của khách hàng.</em>
              </blockquote>
              <p className="mag-about-led-attr">Trụ sở Hà Nội · Hoạt động từ 03/2025 · Phục vụ doanh nghiệp 5–50 nhân sự</p>

              {/* 4 trust tiles — visual instead of CAM KẾT bullet list */}
              <div className="mag-trust-strip">
                <div className="mag-trust-tile" data-stagger="up">
                  <span className="mag-trust-icon"><Icon name="folder" className="w-5 h-5" strokeWidth={1.75} /></span>
                  <span className="mag-trust-num">11+</span>
                  <span className="mag-trust-label">Dự án</span>
                </div>
                <div className="mag-trust-tile" data-stagger="up">
                  <span className="mag-trust-icon"><Icon name="target" className="w-5 h-5" strokeWidth={1.75} /></span>
                  <span className="mag-trust-num">6+</span>
                  <span className="mag-trust-label">Ngành dọc</span>
                </div>
                <div className="mag-trust-tile" data-stagger="up">
                  <span className="mag-trust-icon"><Icon name="package" className="w-5 h-5" strokeWidth={1.75} /></span>
                  <span className="mag-trust-num">100%</span>
                  <span className="mag-trust-label">Mã nguồn</span>
                </div>
                <div className="mag-trust-tile" data-stagger="up">
                  <span className="mag-trust-icon"><Icon name="clock" className="w-5 h-5" strokeWidth={1.75} /></span>
                  <span className="mag-trust-num">24h</span>
                  <span className="mag-trust-label">Phản hồi</span>
                </div>
              </div>

              <div className="mt-5">
                <Link href="/ve-chung-toi" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700">
                  Hồ sơ năng lực · founder · cam kết hợp đồng →
                </Link>
              </div>
            </div>
          </section>

          {/* PULL-QUOTE INTERSTITIAL — full-bleed band, no number, no head.
              Editorial rhythm break between two information-heavy sections. */}
          <aside className="mag-pullquote-band" aria-hidden="false">
            <p className="mag-pullquote-text">
              Quản trị dự án theo milestone. <em>Cam kết SLA</em> về tiến độ và chất lượng. Quyền sở hữu mã nguồn <em>thuộc khách hàng.</em>
            </p>
            <p className="mag-pullquote-attr">Cam kết hợp đồng · alodev.vn</p>
          </aside>

          {/* PROCESS - horizontal timeline (was vertical list — A/B variation) */}
          <section id="quy-trinh" className="mag-section mag-bg-paper" data-section-name="Cách làm việc">
            <div className="mag-section-inner">
              <p className="mag-section-label">
                <span className="num">04</span>
                <span aria-hidden="true">/</span>
                <span>Cách làm việc</span>
              </p>
              <h2 className="mag-section-head">Quy trình 4 giai đoạn.</h2>

              <div className="mag-timeline">
                <div className="mag-timeline-track">
                  {process.map((p, i) => {
                    const icons = ['message-circle', 'brush', 'code', 'package'] as const
                    return (
                      <div key={p.step} className="mag-timeline-step mag-timeline-step--with-icon group" data-stagger="up">
                        <span className="mag-timeline-step-icon" aria-hidden="true">
                          <Icon name={icons[i]} className="w-3 h-3" strokeWidth={2} />
                        </span>
                        <span className="mag-timeline-time">{p.time}</span>
                        <span className="mag-timeline-name">{String(i + 1).padStart(2, '0')} · {p.step}</span>
                        <p className="mag-timeline-desc">{p.desc}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 text-[10px]">
                <Link href="/quy-trinh" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700">
                  Quy trình đầy đủ 8 giai đoạn →
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ - common questions (first item pre-opened, label instead of big number) */}
          <section id="cau-hoi" className="mag-section mag-bg-tint" data-section-name="Câu hỏi">
            <div className="mag-section-inner">
              <p className="mag-section-label">
                <span className="num">05</span>
                <span aria-hidden="true">/</span>
                <span>FAQ</span>
              </p>
              <h2 className="mag-section-head">Câu hỏi thường gặp.</h2>
              <div className="mt-5 divide-y divide-slate-200 dark:divide-ink-800">
                {faq.map((item, i) => (
                  <details key={i} className="mag-faq group" data-stagger="up">
                    <summary className="mag-faq-q">
                      <span className="text-[10px] font-mono text-gray-300 dark:text-ink-700 w-5 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 font-semibold text-gray-900 dark:text-white text-sm">
                        {item.q}
                      </span>
                      <span className="mag-faq-toggle" aria-hidden="true">+</span>
                    </summary>
                    <p className="mag-faq-a">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CONTACT - closing CTA, theme-adaptive */}
          <section id="lien-he" className="mag-section mag-section--dark" data-section-name="Liên hệ">
            <div className="mag-section-inner">
              <p className="mag-section-index">06</p>
              <h2 className="mag-section-head">
                Liên hệ tư vấn<br className="hidden sm:block" /> dự án.
              </h2>
              <p className="mt-3 text-sm text-gray-600 dark:text-ink-400 max-w-sm leading-relaxed">
                Gửi yêu cầu kèm phạm vi dự án và ngân sách dự kiến. Đội ngũ kỹ thuật phản hồi trong <span className="text-gray-900 dark:text-white font-medium">24h</span>.
                Tư vấn ban đầu miễn phí.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <div className="magnetic">
                  <QuoteCTA size="md" variant="solid" className="justify-center">Báo giá</QuoteCTA>
                </div>
                <div className="magnetic">
                  <a href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-ink-700 hover:border-gray-300 dark:hover:border-ink-500 hover:bg-gray-50 dark:hover:bg-ink-800 px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white transition">
                    Chat Zalo →
                  </a>
                </div>
              </div>

              {/* Trust signals */}
              <div className="mt-8 pt-5 border-t border-gray-200 dark:border-ink-800 grid grid-cols-3 gap-4">
                {[
                  { v: '24h', l: 'Phản hồi' },
                  { v: '100%', l: 'Ownership' },
                  { v: '6–12th', l: 'Bảo hành' },
                ].map(s => (
                  <div key={s.l}>
                    <div className="text-lg font-bold tracking-tight text-gray-900 dark:text-white tabular-nums">{s.v}</div>
                    <div className="text-[10px] font-mono text-gray-400 dark:text-ink-500 mt-0.5 uppercase tracking-widest">{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-ink-600">
                <a href="mailto:hello@alodev.vn" className="hover:text-gray-900 dark:hover:text-white transition">hello@alodev.vn</a>
                <a href="tel:0364234936" className="hover:text-gray-900 dark:hover:text-white transition">0364 234 936</a>
                <a href="https://t.me/alodevvn" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition">Telegram @alodevvn</a>
              </div>
            </div>
          </section>

          {/* COMPACT FOOTER - in-column, closes the magazine spread */}
          <div className="mag-footer" role="contentinfo">
            <div className="mag-footer-inner">

              {/* Top: brand + nav */}
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="mag-footer-brand">
                  <Link href="/">
                    alodev<span className="text-brand-600 dark:text-brand-400">.vn</span>
                  </Link>
                  <p className="mt-1 text-[10px] font-mono text-gray-400 dark:text-ink-600 tracking-wide">
                    Công ty phần mềm · Hà Nội · Hoạt động từ 03/2025
                  </p>
                </div>
                <nav aria-label="Footer navigation">
                  <ul className="mag-footer-nav">
                    {[
                      { href: '/dich-vu',       label: 'Dịch vụ' },
                      { href: '/du-an',         label: 'Dự án' },
                      { href: '/blog',          label: 'Blog' },
                      { href: '/quy-trinh',     label: 'Quy trình' },
                      { href: '/ve-chung-toi',  label: 'Về Alodev' },
                      { href: '/lien-he',       label: 'Liên hệ' },
                      { href: '/bao-gia',       label: 'Báo giá →' },
                    ].map(l => (
                      <li key={l.href}>
                        <Link href={l.href}>{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Bottom bar: copyright + contact */}
              <div className="mag-footer-bar">
                <p className="mag-footer-copy">© 2026 alodev.vn - All rights reserved.</p>
                <div className="mag-footer-contact">
                  <a href="tel:0364234936">0364 234 936</a>
                  <a href="mailto:hello@alodev.vn">hello@alodev.vn</a>
                  <a href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer">Zalo</a>
                  <a href="https://t.me/alodevvn" target="_blank" rel="noopener noreferrer">Telegram</a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}

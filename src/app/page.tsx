import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/data/projects'
import JsonLd from '@/components/JsonLd'
import HeroCube from '@/components/HeroCube'
import QuoteCTA from '@/components/QuoteCTA'
import Icon from '@/components/Icon'
import ScrollEffects from '@/components/ScrollEffects'
import HideGlobalFooter from '@/components/HideGlobalFooter'
// CustomCursor disabled May 2026 - spring physics intentionally laggy
// "mềm như nước" feel made cursor read as delayed. Real pro studios
// (Linear, Vercel, Stripe, Apple, Pentagram) all use native cursor.
// import CustomCursor from '@/components/CustomCursor'
import Marquee from '@/components/Marquee'
import DeviceShowcase from '@/components/DeviceShowcase'
import { faqPageSchema, breadcrumbSchema, organizationSchema, websiteSchema } from '@/lib/schema'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const featured = [
  { slug: 'onthi365',        name: 'OnThi365',           domain: 'onthi365.com',        tag: 'Edtech · Livestream HLS',      year: '2024' },
  { slug: 'maxmin',          name: 'MAXMIN',             domain: 'maxmin.vn',           tag: 'SaaS · Cloud restream',        year: '2025' },
  { slug: 'vietnamid',       name: 'VietnamID',          domain: 'vietnamid.vn',        tag: 'Social commerce · PWA',        year: '2024' },
  { slug: 'shopaccgame',     name: 'Shop Acc Game',      domain: 'shopaccgame.net',     tag: 'E-commerce · Multi-tenant',    year: '2023' },
  { slug: 'ganday',          name: 'Gần Đây',            domain: 'ganday.com.vn',       tag: 'Multi-site CMS',               year: '2024' },
  { slug: 'thitruongkinhte', name: 'Thị trường Kinh tế', domain: 'thitruongkinhte.net', tag: 'Tin tức · Realtime',           year: '2024' },
].filter((f) => projects.some((p) => p.slug === f.slug))

const capabilities = [
  { label: 'Website',           note: 'Landing, doanh nghiệp, e-commerce',    anchor: '/dich-vu#website' },
  { label: 'App mobile',        note: 'iOS, Android, cross-platform',          anchor: '/dich-vu#mobile' },
  { label: 'Hệ thống quản trị', note: 'CRM, ERP, dashboard nội bộ',            anchor: '/dich-vu#system' },
  { label: 'Tự động hoá & AI',  note: 'Chatbot Zalo, workflow, tích hợp LLM', anchor: '/dich-vu#automation' },
]

const process = [
  { step: 'Brief',     desc: 'Nghe nghiệp vụ, đề xuất scope',     time: '2–3 ngày' },
  { step: 'Design',    desc: 'Wireframe, báo giá rõ ràng',         time: '1–2 tuần' },
  { step: 'Build',     desc: 'Code theo milestone, demo hàng tuần', time: '4–12 tuần' },
  { step: 'Handover',  desc: 'Bàn giao + bảo hành',                 time: '6–12 tháng' },
]

const toc = [
  { num: '01', name: 'Studio',        hash: '#gioi-thieu' },
  { num: '02', name: 'Dự án',         hash: '#du-an' },
  { num: '03', name: 'Dịch vụ',       hash: '#dich-vu' },
  { num: '04', name: 'Về Alodev',     hash: '#ve-alodev' },
  { num: '05', name: 'Cách làm việc', hash: '#quy-trinh' },
  { num: '06', name: 'Câu hỏi',       hash: '#cau-hoi' },
  { num: '07', name: 'Liên hệ',       hash: '#lien-he' },
]

const stats = [
  { num: '11+',  label: 'Dự án đã triển khai' },
  { num: '6+',   label: 'Ngành dọc phục vụ' },
  { num: '100%', label: 'Source code thuộc khách hàng' },
  { num: '24h',  label: 'Phản hồi yêu cầu báo giá' },
]

const commitments = [
  'Source code, database, domain đứng tên khách hàng',
  'Bảo hành 6–12 tháng',
  'Demo định kỳ hàng tuần theo milestone',
  'Trễ hạn → giảm 5% / tuần',
  'Không vendor lock-in, không phí license ẩn',
]

const faq = [
  { q: 'Chi phí thiết kế website doanh nghiệp khoảng bao nhiêu?', a: 'Website giới thiệu từ 8tr, e-commerce từ 25tr, app mobile từ 60tr, hệ thống quản trị báo theo scope. Cấu hình tại /bao-gia.' },
  { q: 'Source code và data có thuộc về tôi không?', a: 'Có. Source code, database, domain, hosting đứng tên bạn. Không vendor lock-in, không phí license.' },
  { q: 'Thời gian triển khai một dự án mất bao lâu?', a: 'Website 3–5 tuần. E-commerce 6–10 tuần. App mobile 10–16 tuần. Hệ thống quản trị 8–20 tuần. Demo hàng tuần.' },
  { q: 'Sau bàn giao có hỗ trợ tiếp không?', a: 'Bảo hành 6–12 tháng tuỳ hợp đồng. Phát triển thêm tính theo gói retainer hoặc giờ.' },
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
          <div className="mag-rail-cube">
            <HeroCube />
          </div>

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
            <HeroCube />
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
              <h1 className="mag-section-head">Phần mềm do <br />người làm ra.</h1>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-ink-400 max-w-lg">
                Studio Hà Nội - website, app mobile và hệ thống quản trị cho SME 5–50 người.
              </p>

              {/* Differentiators - 4 icon tiles (no descriptions — visual-led) */}
              <div className="mag-commit-grid">
                {[
                  { icon: 'handshake'    as const, label: 'Founder-led' },
                  { icon: 'package'      as const, label: 'Source code\nthuộc về bạn' },
                  { icon: 'gauge'        as const, label: 'Demo hàng tuần' },
                  { icon: 'shield-check' as const, label: 'Bảo hành 6–12 tháng' },
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

          {/* DEVICE SHOWCASE */}
          <DeviceShowcase />

          {/* PORTFOLIO PREVIEW - peek, not full listing */}
          <section id="du-an" className="mag-section mag-bg-tint" data-section-name="Portfolio">
            <div className="mag-section-inner">
              <p className="mag-section-index">02</p>
              <h2 className="mag-section-head">Portfolio.</h2>
              <p className="mt-3 text-sm text-gray-600 dark:text-ink-400 max-w-lg">
                11+ sản phẩm vận hành thật - giáo dục, SaaS, social commerce, tin tức.
              </p>

              {/* Hero featured project - biggest visual statement */}
              {featured[0] && (
                <Link href={`/du-an/${featured[0].slug}`}
                  className="mag-pf-hero group mt-6"
                  data-stagger="up"
                  aria-label={`Dự án ${featured[0].name}`}>
                  <div className="mag-pf-hero-art" aria-hidden="true">
                    <div className="mag-pf-hero-grid">
                      <span /><span /><span /><span /><span /><span />
                    </div>
                  </div>
                  <div className="mag-pf-hero-meta">
                    <div className="mag-pf-hero-row">
                      <span className="mag-pf-hero-num">01</span>
                      <span className="mag-pf-hero-name">{featured[0].name}</span>
                      <span className="mag-pf-hero-arrow">→</span>
                    </div>
                    <div className="mag-pf-hero-sub">
                      <span>{featured[0].tag}</span>
                      <span className="opacity-50">·</span>
                      <span className="font-mono">{featured[0].domain}</span>
                      <span className="opacity-50">·</span>
                      <span className="font-mono">{featured[0].year}</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Compact list - next 3 */}
              <div className="mt-2 mag-pf-list">
                {featured.slice(1, 4).map((p, i) => (
                  <Link key={p.slug} href={`/du-an/${p.slug}`}
                    className="mag-pf-row group"
                    data-stagger="row"
                    aria-label={`Dự án ${p.name}`}>
                    <span className="mag-pf-num">{String(i + 2).padStart(2, '0')}</span>
                    <span className="mag-pf-name">{p.name}</span>
                    <span className="mag-pf-tag">{p.tag}</span>
                    <span className="mag-pf-year">{p.year}</span>
                    <span className="mag-pf-arrow" aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>

              {/* Strong CTA to full portfolio page */}
              <Link href="/du-an" className="mag-pf-cta group mt-5">
                <span className="mag-pf-cta-label">
                  Xem portfolio đầy đủ
                </span>
                <span className="mag-pf-cta-meta">
                  11+ dự án · case study · metric
                </span>
                <span className="mag-pf-cta-arrow" aria-hidden="true">→</span>
              </Link>

              {/* Stats strip */}
              <div className="mag-stats mt-6" aria-label="Studio thống kê">
                {stats.map((s) => (
                  <div key={s.label} className="mag-stat" data-stagger="stat">
                    <div className="mag-stat-num" data-count={s.num}>{s.num}</div>
                    <div className="mag-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SERVICE TICKER - editorial marquee strip */}
          <div className="mag-ticker" aria-hidden="true">
            <Marquee speed={42} className="py-3">
              {[
                'WEBSITE', 'APP MOBILE', 'HỆ THỐNG QUẢN TRỊ',
                'TỰ ĐỘNG HOÁ', 'UI/UX DESIGN', 'FOUNDER-LED',
                'SOURCE CODE BẠN SỞ HỮU', 'BẢO HÀNH 12 THÁNG',
              ].map((item) => (
                <span key={item} className="mag-ticker-item">
                  {item}
                  <span className="mag-ticker-sep" aria-hidden="true">·</span>
                </span>
              ))}
            </Marquee>
          </div>

          {/* SERVICES - 2x2 card grid (was vertical list — varied to break "01+head" template) */}
          <section className="mag-section mag-bg-paper" id="dich-vu" data-section-name="Dịch vụ">
            <div className="mag-section-inner">
              <p className="mag-section-label">
                <span className="num">03</span>
                <span aria-hidden="true">/</span>
                <span>Dịch vụ</span>
              </p>
              <h2 className="mag-section-head">Việc Alodev nhận làm.</h2>

              <div className="mag-services-grid">
                {[
                  { label: 'Website',           note: 'Doanh nghiệp, e-commerce', anchor: '/dich-vu#website',    icon: 'globe' as const },
                  { label: 'App mobile',        note: 'iOS · Android',              anchor: '/dich-vu#mobile',     icon: 'phone' as const },
                  { label: 'Hệ thống quản trị', note: 'CRM · ERP · Dashboard',      anchor: '/dich-vu#system',     icon: 'cpu' as const },
                  { label: 'Tự động hoá · AI',  note: 'Chatbot · Workflow',         anchor: '/dich-vu#automation', icon: 'bot' as const },
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
                <span className="num">04</span>
                <span aria-hidden="true">/</span>
                <span>Về Alodev</span>
              </p>

              {/* Lead with the strongest line — drop big head, let the quote breathe */}
              <blockquote className="mag-about-led-quote">
                11 sản phẩm đang chạy trên domain riêng <em>—</em> không phải demo.
              </blockquote>
              <p className="mag-about-led-attr">Hà Nội · 03/2025 · SME 5–50 người</p>

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
                  <span className="mag-trust-label">Source code</span>
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
              Demo hàng tuần. Trễ <em>→ giảm 5%/tuần.</em> Source code <em>thuộc về bạn.</em>
            </p>
            <p className="mag-pullquote-attr">Cam kết hợp đồng · alodev.vn</p>
          </aside>

          {/* PROCESS - horizontal timeline (was vertical list — A/B variation) */}
          <section id="quy-trinh" className="mag-section mag-bg-paper" data-section-name="Cách làm việc">
            <div className="mag-section-inner">
              <p className="mag-section-label">
                <span className="num">05</span>
                <span aria-hidden="true">/</span>
                <span>Cách làm việc</span>
              </p>
              <h2 className="mag-section-head">4 phase. 1 timeline.</h2>

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
                <span className="num">06</span>
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
              <p className="mag-section-index">07</p>
              <h2 className="mag-section-head">
                Có dự án<br className="hidden sm:block" /> cần triển khai?
              </h2>
              <p className="mt-3 text-sm text-gray-600 dark:text-ink-400 max-w-sm leading-relaxed">
                Mô tả ngắn + ngân sách dự kiến → phản hồi trong <span className="text-gray-900 dark:text-white font-medium">24h</span>.
                Không mất phí tư vấn.
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
                    Founder-led studio · Hà Nội · Est. 2025
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

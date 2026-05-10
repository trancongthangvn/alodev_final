import type { Metadata } from 'next'
import { Fragment } from 'react'
import Link from 'next/link'
import { projects } from '@/data/projects'
import JsonLd from '@/components/JsonLd'
import Icon from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'
import HeroCube from '@/components/HeroCube'
import { faqPageSchema, breadcrumbSchema, organizationSchema, websiteSchema } from '@/lib/schema'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

// Phase ticks for the inline process teaser — duration shorthand only.
// Full deliverables / quality gates live on /quy-trinh.
const phaseTicks = [
  { i: '01', d: '24h' },
  { i: '02', d: '48h' },
  { i: '03', d: '7d' },
  { i: '04', d: '3w' },
  { i: '05', d: '12w' },
  { i: '06', d: '7d' },
  { i: '07', d: '3d' },
  { i: '08', d: '12m' },
]

// Just 3 featured projects — selected work, not portfolio dump.
// Full portfolio lives on /du-an.
const featuredSlugs = ['onthi365', 'shopaccgame', 'ganday']
const featured = featuredSlugs.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean)

// Two FAQ items only — depth content lives on /quy-trinh and other route pages.
// Just enough to satisfy FAQPage schema for SERP rich result eligibility.
const faq = [
  {
    q: 'Chi phí thiết kế website doanh nghiệp khoảng bao nhiêu?',
    a: 'Website giới thiệu công ty cơ bản từ 8 triệu, e-commerce từ 25 triệu, app mobile từ 60 triệu, hệ thống quản trị tuỳ chỉnh báo giá theo scope. Cấu hình tính năng để xem báo giá ngay tại /bao-gia, hoặc gửi yêu cầu — phản hồi trong 24h.',
  },
  {
    q: 'Source code và data có thuộc về tôi không?',
    a: 'Có. Source code, database, domain, hosting đều đứng tên và thuộc sở hữu của bạn. Không vendor lock-in, không phí license, không khoá kỹ thuật. Tài liệu bàn giao đầy đủ để chuyển đội bất cứ lúc nào.',
  },
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

      {/* ═══ RUBIK JOURNEY REGION ═══
          Single sticky cube travels the entire homepage scroll via CSS
          scroll-timeline (cube-apple-travel keyframes in globals.css).
          Sections inside this wrapper are sparse on purpose — restraint
          is the design. Reference: Linear / Vercel / Resend / Pentagram. */}
      <div className="rubik-journey relative">

        {/* ─── HERO ─────────────────────────────────────────────────── */}
        <section className="hero-resend relative text-ink-900 dark:text-white overflow-hidden" data-section-name="Trang chủ">
          <div className="hero-resend-grid absolute inset-0" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 lg:pt-24 lg:pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 lg:items-start">
              <div className="hero-rise lg:col-span-7">
                {/* Single status pill — replaces the "Hà Nội · founder-led" line. */}
                <div className="flex">
                  <Link
                    href="/du-an"
                    className="group inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/70 backdrop-blur px-3.5 py-1.5 text-xs font-medium text-gray-700 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-700 hover:text-gray-900 dark:hover:text-white transition shadow-sm dark:shadow-lg dark:shadow-black/30"
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-brand-500 dark:bg-brand-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500 dark:bg-brand-400" />
                    </span>
                    <span>Đang nhận dự án Q2/2026 — còn slot</span>
                    <Icon name="arrow-right" className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>

                <h1 className="hero-h h-display mt-6 sm:mt-8 text-left max-w-3xl">
                  <span className="word-cascade block">
                    {['Thiết', 'kế', 'website', '&', 'lập', 'trình', 'app', '—'].map((w, i, a) => (
                      <Fragment key={i}>
                        <span style={{ animationDelay: `${80 + i * 55}ms` }}>{w}</span>
                        {i < a.length - 1 ? ' ' : ''}
                      </Fragment>
                    ))}
                  </span>
                  <span className="word-cascade block">
                    {['biến', 'ý', 'tưởng', 'thành', 'sản', 'phẩm', 'thật'].map((w, i) => (
                      <Fragment key={i}>
                        <span style={{ animationDelay: `${500 + i * 55}ms` }}>{w}</span>
                        {' '}
                      </Fragment>
                    ))}
                    <span style={{ animationDelay: `${500 + 7 * 55}ms` }}>.</span>
                  </span>
                </h1>

                {/* Single tagline — short, no Hà Nội mention. */}
                <p className="mt-6 sm:mt-8 text-base sm:text-lg text-gray-700 dark:text-zinc-400 max-w-xl leading-relaxed">
                  Studio thiết kế &amp; phát triển web/app · CRM/ERP · tự động hoá AI.
                  Source code thuộc về bạn. Bàn giao đúng hạn — bảo hành 6–12 tháng.
                </p>

                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                  <span className="magnetic w-full sm:w-auto">
                    <QuoteCTA size="lg" variant="solid" className="w-full sm:w-auto justify-center">Yêu cầu báo giá</QuoteCTA>
                  </span>
                  <Link
                    href="/du-an"
                    className="ghost-dark inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold transition w-full sm:w-auto"
                  >
                    Xem dự án
                  </Link>
                </div>
              </div>

              {/* Mobile cube (lg:hidden); desktop cube via sticky overlay below. */}
              <div className="lg:col-span-5">
                <div className="lg:hidden">
                  <HeroCube />
                </div>
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:aspect-[700/550] lg:max-w-[700px] lg:ml-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── TRIẾT LÝ — "Sáu mặt. Một sản phẩm." ────────────────────
            Trimmed: hook + single impact line + collapsed essay only.
            The chaos cards / 3-axis breakdown moved out — cube anchor
            beside the centered statement is the entire visual gesture. */}
        <section
          id="triet-ly"
          data-section-name="Triết lý"
          className="relative py-20 lg:py-40 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800 overflow-hidden"
        >
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal text-center">
              <Eyebrow>Triết lý</Eyebrow>
              <h2 className="h-display mt-4 sm:mt-5 text-gray-900 dark:text-white">
                Sáu mặt. <span className="text-brand-600 dark:text-brand-400">Một sản phẩm.</span>
              </h2>
              <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-gray-600 dark:text-ink-300 leading-relaxed">
                Người ngoài thấy một cái hộp vuông.
                <br className="hidden sm:block" />
                {' '}Bạn thấy một <span className="font-semibold text-gray-900 dark:text-white">khối Rubik</span>.
              </p>
              <div className="mt-12 lg:mt-16">
                <div className="inline-block w-12 h-px bg-brand-500 mb-6" />
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white leading-snug">
                  Alodev là góc nhìn từ ngoài.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SELECTED WORK — 3 projects, magazine layout ─────────── */}
        <section id="du-an" className="py-20 lg:py-32 bg-white dark:bg-ink-950" data-section-name="Selected work">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex items-end justify-between flex-wrap gap-4 mb-10 lg:mb-16">
              <div>
                <Eyebrow>Selected work</Eyebrow>
                <h2 className="h-section mt-3 text-gray-900 dark:text-white">
                  Ba dự án. Đang vận hành thật.
                </h2>
              </div>
              <Link
                href="/du-an"
                className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1.5"
              >
                Xem 11+ dự án
                <Icon name="arrow-right" className="w-4 h-4" />
              </Link>
            </div>
            <div className="reveal-stagger grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {featured.map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/du-an/${p.slug}`}
                  className="lift group flex flex-col rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden hover:border-gray-300 dark:hover:border-ink-700 transition"
                >
                  <div className={`relative aspect-[4/5] bg-gradient-to-br ${p.colorClass} flex items-center justify-center overflow-hidden`}>
                    <span className="absolute top-4 left-4 text-[10px] tabular text-white/70 font-mono">
                      {String(i + 1).padStart(2, '0')} / 03
                    </span>
                    <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 dark:bg-ink-900/70 backdrop-blur text-gray-700 dark:text-ink-300 font-semibold">
                      {p.category.split('·')[0].trim()}
                    </span>
                    <div className="text-center px-4">
                      <div className="text-3xl lg:text-4xl font-bold text-gray-700 dark:text-ink-200 dark:opacity-90">{p.name}</div>
                      <div className="mt-2 text-xs text-gray-600 dark:text-ink-400 font-mono">{p.domain}</div>
                    </div>
                  </div>
                  <div className="p-5 lg:p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-ink-400 line-clamp-2">{p.shortDesc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PROCESS TEASER — single line + 8-tick strip + CTA ─── */}
        <section
          id="quy-trinh"
          data-section-name="Quy trình"
          className="py-20 lg:py-32 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Eyebrow>Quy trình</Eyebrow>
            <h2 className="h-display mt-4 sm:mt-5 text-gray-900 dark:text-white">
              Tám giai đoạn. <span className="text-brand-600 dark:text-brand-400">Có deliverable.</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-ink-400 max-w-2xl mx-auto leading-relaxed">
              Từ tư vấn miễn phí (24h) đến hết bảo hành (6–12 tháng) — minh bạch, có quality gate, không skip.
            </p>

            <div className="reveal-stagger mt-10 lg:mt-14 grid grid-cols-4 lg:grid-cols-8 gap-3">
              {phaseTicks.map((p) => (
                <div
                  key={p.i}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 py-3 lg:py-4"
                >
                  <div className="text-base lg:text-lg font-mono font-bold tabular text-gray-900 dark:text-white">
                    {p.i}
                  </div>
                  <div className="text-[10px] lg:text-xs font-mono text-gray-500 dark:text-ink-500">
                    {p.d}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/quy-trinh"
              className="mt-10 lg:mt-14 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
            >
              Xem chi tiết quy trình
              <Icon name="arrow-right" className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ─── FINAL CTA ───────────────────────────────────────────── */}
        <section className="relative py-20 lg:py-32 bg-white dark:bg-ink-950 overflow-hidden" data-section-name="Liên hệ">
          <div className="aurora opacity-40" />
          <div className="reveal relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="h-display text-gray-900 dark:text-white">
              Sẵn sàng <span className="text-brand-600 dark:text-brand-400">bắt đầu</span>?
            </h2>
            <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-ink-400">
              Phản hồi trong 24h kèm báo giá sơ bộ — không sales pitch.
            </p>
            <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <span className="magnetic w-full sm:w-auto">
                <QuoteCTA size="lg" className="px-8 py-4 w-full sm:w-auto justify-center">Yêu cầu báo giá</QuoteCTA>
              </span>
              <a
                href="https://zalo.me/0364234936"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-ink-900 border border-gray-200 dark:border-ink-800 px-8 py-4 text-gray-900 dark:text-white font-semibold hover:border-gray-300 dark:hover:border-ink-700 transition w-full sm:w-auto"
              >
                Chat Zalo
              </a>
            </div>
            {/* Single contact line — quiet at the bottom. */}
            <p className="mt-10 text-xs font-mono text-gray-500 dark:text-ink-500 tracking-wider">
              hello@alodev.vn  ·  0587 789 456  ·  @alodevvn
            </p>
          </div>
        </section>

        {/* ─── DESKTOP STICKY CUBE OVERLAY ─── (inside .rubik-journey)
             Travels the entire scroll. Mobile (<lg) hides this overlay;
             the inline cube in the hero col-span-5 (lg:hidden) handles
             mobile. Width-check guard in HeroCube.isWrapNearViewport
             ensures only the active visible cube boots WebGL — net 1
             cube at any one viewport size. */}
        <div className="cube-sticky-overlay absolute inset-0 hidden lg:block pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="grid grid-cols-12 h-full">
              <div className="col-span-7" />
              <div className="col-span-5 pointer-events-auto">
                <div className="sticky top-24 pt-12 lg:pt-24">
                  <HeroCube />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>{/* /.rubik-journey */}
    </>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
      <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">{children}</span>
    </div>
  )
}

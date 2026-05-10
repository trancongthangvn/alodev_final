import type { Metadata } from 'next'
import { Fragment } from 'react'
import Link from 'next/link'
import { projects } from '@/data/projects'
import JsonLd from '@/components/JsonLd'
import HeroCube from '@/components/HeroCube'
import LiveTicker from '@/components/LiveTicker'
import { faqPageSchema, breadcrumbSchema, organizationSchema, websiteSchema } from '@/lib/schema'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/* Studio Live doctrine — homepage as the studio's heartbeat dashboard.
   Real-time ICT clock, git-log-style activity feed, project index as
   text catalog, colophon. Reference: Read.cv, Robin Sloan, Are.na,
   Stripe Press, Robin Rendle — sites where the clock ticks for real,
   the page feels alive, no marketing brochure pattern.

   Cube journey wrapper kept; cube anchors the right column through
   all 4 narrative beats (Heartbeat → Statement → Studio Log → Index
   → Colophon). */

const indexEntries: { slug: string; name: string; year: string; role: string }[] = [
  { slug: 'onthi365',    name: 'OnThi365',     year: '2024', role: 'edtech · live PvP' },
  { slug: 'ganday',      name: 'Gần Đây',      year: '2025', role: 'multi-site CMS' },
  { slug: 'lammmo',      name: 'Lammmo',       year: '2025', role: 'marketplace' },
  { slug: 'shopaccgame', name: 'Shop Acc Game', year: '2022', role: 'e-commerce' },
  { slug: 'datacenter',  name: 'Datacenter',   year: '2025', role: 'fleet dashboard' },
  { slug: 'vietnamid',   name: 'VietnamID',    year: '2026', role: 'identity verify' },
  { slug: 'maxmin',      name: 'MAXMIN',       year: '2026', role: 'social commerce' },
  { slug: 'vn247',       name: 'VN247',        year: '2024', role: 'classifieds' },
]
const validIndex = indexEntries.filter((e) => projects.some((p) => p.slug === e.slug))

// Studio activity log — git-log-style entries for the last ~2 weeks.
// Hand-curated for honesty; would be auto-fed from CI in future.
const studioLog: { date: string; project: string; line: string; tag: string }[] = [
  { date: '10·05', project: 'studio',    line: 'Homepage redesign — Studio Live doctrine shipped', tag: 'design' },
  { date: '09·05', project: 'vietnamid', line: 'KYC workflow v1.2 deployed to production',         tag: 'ship' },
  { date: '08·05', project: 'ganday',    line: 'Multi-site CMS — added /hong-bien-duong-pho',     tag: 'feature' },
  { date: '06·05', project: 'maxmin',    line: 'PWA install prompt — opt-in tracking 18% → 31%',   tag: 'metric' },
  { date: '04·05', project: 'onthi365',  line: 'Livestream HLS — Safari iOS 26 fix',              tag: 'fix' },
  { date: '02·05', project: 'lammmo',    line: 'Marketplace seller dashboard — 4 weeks build',     tag: 'ship' },
]

const tagColor: Record<string, string> = {
  ship:    'text-emerald-600 dark:text-emerald-400',
  feature: 'text-brand-600 dark:text-brand-400',
  fix:     'text-rose-600 dark:text-rose-400',
  metric:  'text-tech-600 dark:text-tech-400',
  design:  'text-fuchsia-600 dark:text-fuchsia-400',
}

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

// Split a string into per-letter spans for the .letter-cascade CSS effect.
// Whitespace stays as text nodes (else inline-blocks collapse adjacent spaces).
function letterize(text: string, baseDelay = 0, perLetter = 18): React.ReactNode[] {
  const out: React.ReactNode[] = []
  let i = 0
  for (const ch of text) {
    if (ch === ' ') {
      out.push(' ')
    } else {
      out.push(
        <span key={i} style={{ animationDelay: `${baseDelay + i * perLetter}ms` }}>
          {ch}
        </span>,
      )
    }
    i++
  }
  return out
}

export default function Home() {
  return (
    <>
      <JsonLd data={[
        organizationSchema(),
        websiteSchema(),
        faqPageSchema(faq),
        breadcrumbSchema([{ name: 'Trang chủ', url: '/' }]),
      ]} />

      <div className="rubik-journey relative">

        {/* ═══ HEARTBEAT — live masthead with ICT clock + fleet status. */}
        <div className="hero-resend relative">
          <div className="hero-resend-grid absolute inset-0 opacity-40" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 lg:pt-7 pb-3">
            <div className="flex items-center justify-between gap-4 border-b border-gray-300 dark:border-ink-800 pb-3 flex-wrap">
              <div className="text-[10px] lg:text-[11px] font-mono uppercase tracking-[0.32em] text-gray-700 dark:text-ink-400">
                alodev studio · vol. 5 · no. 26
              </div>
              <LiveTicker />
            </div>
          </div>

          {/* ═══ STATEMENT — letter-by-letter glitch reveal. Smaller
              type, framed by ruled lines. Cube right column via
              sticky overlay below. */}
          <section
            className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-28"
            data-section-name="Statement"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-start">
              <div className="lg:col-span-7">
                <div className="reveal flex items-center gap-3 mb-6 lg:mb-8">
                  <div className="draw-rule w-12 text-brand-500" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.42em] text-brand-600 dark:text-brand-400">
                    Statement / Q2·2026
                  </span>
                </div>

                <h1
                  className="text-gray-900 dark:text-white font-semibold tracking-[-0.025em] leading-[1.05]"
                  style={{ fontSize: 'clamp(1.875rem, 4.4vw, 4rem)' }}
                >
                  <span className="letter-cascade block">
                    {letterize('Một bên ngoài,', 80, 22)}
                  </span>
                  <span className="letter-cascade block">
                    {letterize('để biến kế hoạch tốt', 480, 22)}
                  </span>
                  <span className="letter-cascade block">
                    {letterize('thành hệ thống', 940, 22)}
                  </span>
                  <span className="letter-cascade block text-brand-600 dark:text-brand-400">
                    {letterize('vận hành được.', 1280, 22)}
                  </span>
                </h1>

                <div className="reveal mt-7 lg:mt-9 flex items-start gap-3 max-w-md">
                  <span className="text-brand-500 mt-0.5 text-[10px] font-mono">¹</span>
                  <p className="text-[13px] lg:text-sm text-gray-600 dark:text-ink-400 leading-[1.65]">
                    Studio thiết kế &amp; phát triển web · app · CRM/ERP · automation AI.
                    Source code thuộc về bạn, bàn giao đúng hạn, bảo hành 6–12 tháng.{' '}
                    <Link
                      href="/bao-gia"
                      className="text-gray-900 dark:text-white underline decoration-brand-500/40 underline-offset-4 hover:decoration-brand-500"
                    >
                      → Yêu cầu báo giá
                    </Link>
                  </p>
                </div>
              </div>

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
          </section>
        </div>

        {/* ═══ STUDIO LOG — git-log-style activity feed. Most distinctive
            move: shows the studio is operating, not selling. */}
        <section
          data-section-name="Studio Log"
          className="relative bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800 py-16 lg:py-24"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex items-baseline justify-between gap-4 pb-4 mb-6 lg:mb-10">
              <div className="flex items-center gap-3">
                <div className="draw-rule w-10 text-brand-500" />
                <span className="text-[10px] font-mono uppercase tracking-[0.42em] text-brand-600 dark:text-brand-400">
                  Studio Log / last 14 days
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.32em] text-gray-500 dark:text-ink-500">
                $ git log --oneline
              </span>
            </div>

            <div className="reveal-stagger font-mono text-[13px] lg:text-sm">
              {studioLog.map((entry, i) => (
                <div key={i} className="log-row">
                  <span className="text-gray-400 dark:text-ink-600 tabular shrink-0">
                    {entry.date}
                  </span>
                  <span className="text-gray-900 dark:text-white shrink-0 w-24 lg:w-32 truncate">
                    {entry.project}
                  </span>
                  <span className="text-gray-700 dark:text-ink-300 truncate">
                    {entry.line}
                  </span>
                  <span className={`text-[10px] uppercase tracking-[0.18em] shrink-0 ${tagColor[entry.tag] ?? 'text-gray-500'}`}>
                    {entry.tag}
                  </span>
                </div>
              ))}
            </div>

            <div className="reveal mt-8 text-[10px] font-mono uppercase tracking-[0.32em] text-gray-500 dark:text-ink-500">
              ── 6 of 87 commits this quarter
            </div>
          </div>
        </section>

        {/* ═══ INDEX — text catalog, dotted leader fills */}
        <section
          id="du-an"
          data-section-name="Index"
          className="relative py-16 lg:py-24 bg-white dark:bg-ink-950"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex items-baseline justify-between gap-4 pb-4 mb-6 lg:mb-10">
              <div className="flex items-center gap-3">
                <div className="draw-rule w-10 text-brand-500" />
                <span className="text-[10px] font-mono uppercase tracking-[0.42em] text-brand-600 dark:text-brand-400">
                  Index of work / 2022 — 2026
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.32em] text-gray-500 dark:text-ink-500">
                {validIndex.length} of 19
              </span>
            </div>

            <ol className="reveal-stagger divide-y divide-gray-200 dark:divide-ink-800">
              {validIndex.map((e, i) => (
                <li key={e.slug}>
                  <Link
                    href={`/du-an/${e.slug}`}
                    className="group flex items-baseline gap-3 sm:gap-5 py-3.5 lg:py-4 hover:bg-cream-50 dark:hover:bg-ink-900/40 transition px-2 -mx-2 rounded"
                  >
                    <span className="text-[10px] lg:text-xs font-mono tabular text-gray-400 dark:text-ink-600 w-6 lg:w-8 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-semibold text-[15px] lg:text-lg tracking-[-0.01em] text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition shrink-0">
                      {e.name}
                    </span>
                    <span className="hidden sm:inline-block flex-1 mx-3 border-b border-dotted border-gray-300 dark:border-ink-700 translate-y-[-0.35em]" />
                    <span className="hidden md:inline text-[11px] lg:text-xs font-mono text-gray-500 dark:text-ink-500 ml-auto sm:ml-0 shrink-0">
                      {e.role}
                    </span>
                    <span className="text-[11px] lg:text-xs font-mono tabular text-gray-700 dark:text-ink-400 ml-auto sm:ml-5 w-10 text-right shrink-0">
                      {e.year}
                    </span>
                    <span className="hidden lg:inline-block text-brand-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-x-1 transition w-3 text-right text-sm">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="reveal mt-8 lg:mt-10 flex items-baseline justify-between gap-4 pt-4 border-t border-gray-200 dark:border-ink-800">
              <span className="text-[10px] font-mono uppercase tracking-[0.32em] text-gray-500 dark:text-ink-500">
                ── 11 đang vận hành thật, 8 case study mở
              </span>
              <Link
                href="/du-an"
                className="text-xs lg:text-sm font-mono uppercase tracking-[0.22em] text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
              >
                Toàn bộ index →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ COLOPHON — print-book closer */}
        <section
          data-section-name="Colophon"
          className="relative py-16 lg:py-24 bg-cream-50 dark:bg-ink-950 border-t border-gray-200 dark:border-ink-800"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex items-center gap-3 pb-4 mb-8 lg:mb-12">
              <div className="draw-rule w-10 text-brand-500" />
              <span className="text-[10px] font-mono uppercase tracking-[0.42em] text-brand-600 dark:text-brand-400">
                Colophon
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
              <div className="lg:col-span-7">
                <p
                  className="font-semibold tracking-[-0.015em] leading-[1.15] text-gray-900 dark:text-white"
                  style={{ fontSize: 'clamp(1.25rem, 2.4vw, 1.875rem)' }}
                >
                  Sáu mặt. <span className="text-brand-600 dark:text-brand-400">Một sản phẩm.</span>
                </p>
                <p className="mt-5 text-[14px] lg:text-base text-gray-600 dark:text-ink-400 leading-[1.7] max-w-lg">
                  Người ngoài thấy một cái hộp vuông. Bạn thấy một khối Rubik.
                  Alodev là góc nhìn từ ngoài — một bên ngoài để biến kế hoạch
                  tốt thành hệ thống vận hành được.
                </p>
                <p className="mt-6">
                  <Link
                    href="/bao-gia"
                    className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white underline decoration-brand-500 underline-offset-[6px] decoration-1 hover:decoration-2 transition"
                  >
                    → Yêu cầu báo giá
                  </Link>
                </p>
              </div>

              <div className="lg:col-span-5 lg:border-l lg:border-gray-300 lg:dark:border-ink-700 lg:pl-12">
                <dl className="space-y-5 text-[13px]">
                  <div>
                    <dt className="text-[10px] font-mono uppercase tracking-[0.32em] text-gray-500 dark:text-ink-500">
                      Founded
                    </dt>
                    <dd className="mt-1.5 font-mono text-gray-900 dark:text-white">
                      31 · 03 · 2025
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-mono uppercase tracking-[0.32em] text-gray-500 dark:text-ink-500">
                      Reach
                    </dt>
                    <dd className="mt-1.5 font-mono text-gray-900 dark:text-white space-y-0.5 leading-relaxed">
                      <div>hello@alodev.vn</div>
                      <div>0587 789 456</div>
                      <div>@alodevvn — Telegram</div>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-mono uppercase tracking-[0.32em] text-gray-500 dark:text-ink-500">
                      Read further
                    </dt>
                    <dd className="mt-1.5 font-mono text-gray-900 dark:text-white space-y-0.5 leading-relaxed">
                      <div><Link href="/dich-vu" className="hover:text-brand-600 dark:hover:text-brand-400 transition">→ /dich-vu</Link></div>
                      <div><Link href="/quy-trinh" className="hover:text-brand-600 dark:hover:text-brand-400 transition">→ /quy-trinh</Link></div>
                      <div><Link href="/du-an" className="hover:text-brand-600 dark:hover:text-brand-400 transition">→ /du-an</Link></div>
                      <div><Link href="/ve-chung-toi" className="hover:text-brand-600 dark:hover:text-brand-400 transition">→ /ve-chung-toi</Link></div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-12 lg:mt-16 pt-4 border-t border-gray-300 dark:border-ink-700 flex items-baseline justify-between gap-4 flex-wrap">
              <div className="text-[10px] font-mono uppercase tracking-[0.42em] text-gray-500 dark:text-ink-500">
                alodev studio · est. 31·03·2025 · alodev.vn
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-gray-500 dark:text-ink-500">
                Vol. 5 · Q2 / 2026
              </div>
            </div>
          </div>
        </section>

        {/* ─── DESKTOP STICKY CUBE OVERLAY ─── */}
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

/* Type for Fragment unused — kept for letterize iter compat with existing
   word-cascade pattern in case it's ever extended. */
const _F = Fragment
void _F

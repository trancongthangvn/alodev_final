import type { Metadata } from 'next'
import { Fragment } from 'react'
import Link from 'next/link'
import { projects } from '@/data/projects'
import JsonLd from '@/components/JsonLd'
import HeroCube from '@/components/HeroCube'
import { faqPageSchema, breadcrumbSchema, organizationSchema, websiteSchema } from '@/lib/schema'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/* Studio press sheet doctrine — homepage IS the studio's monthly issue.
   Reference: Pentagram, Bureau Borsche, Studio Lin, Daikoku, Wendy
   Trommer. No SaaS-landing pattern (no hero pill / 3-col grid / final
   CTA section / timeline strip). Editorial monograph: type-as-art,
   ruled lines, project INDEX (not gallery), colophon footer.

   Cube journey wrapper kept; 3 narrative beats only — Statement,
   Index, Colophon. Cube travels through the 3 stops via the existing
   scroll-timeline keyframes. */

// Project index — 8 most representative entries with hand-curated year + role.
// Full 19-entry portfolio lives at /du-an.
const indexEntries: { slug: string; name: string; year: string; role: string }[] = [
  { slug: 'onthi365',         name: 'OnThi365',         year: '2024', role: 'edtech · live PvP' },
  { slug: 'ganday',           name: 'Gần Đây',          year: '2025', role: 'multi-site CMS' },
  { slug: 'lammmo',           name: 'Lammmo',           year: '2025', role: 'marketplace' },
  { slug: 'shopaccgame',      name: 'Shop Acc Game',    year: '2022', role: 'e-commerce' },
  { slug: 'datacenter',       name: 'Datacenter',       year: '2025', role: 'fleet dashboard' },
  { slug: 'vietnamid',        name: 'VietnamID',        year: '2026', role: 'identity verify' },
  { slug: 'maxmin',           name: 'MAXMIN',           year: '2026', role: 'social commerce' },
  { slug: 'vn247',            name: 'VN247',            year: '2024', role: 'classifieds' },
]
// Validate slugs exist (build-time guard).
const validIndex = indexEntries.filter((e) => projects.some((p) => p.slug === e.slug))

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

      <div className="rubik-journey relative">

        {/* ═══ MASTHEAD — issue number / dateline / colophon-style top
            bar. Real studios open with print metadata, not a marketing
            pill. Inspired by Wired/Monocle/MIT Tech Review mastheads. */}
        <div className="hero-resend relative">
          <div className="hero-resend-grid absolute inset-0 opacity-50" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-3">
            <div className="flex items-center justify-between gap-4 border-b border-gray-300 dark:border-ink-800 pb-3">
              <div className="text-[10px] lg:text-xs font-mono uppercase tracking-[0.32em] text-gray-700 dark:text-ink-400">
                Vol. 5 · No. 26
              </div>
              <div className="hidden sm:block text-[10px] lg:text-xs font-mono uppercase tracking-[0.32em] text-gray-700 dark:text-ink-400">
                Studio · Web · App · CRM/ERP · AI
              </div>
              <div className="text-[10px] lg:text-xs font-mono uppercase tracking-[0.32em] text-gray-700 dark:text-ink-400">
                Q2 / 2026
              </div>
            </div>
          </div>

          {/* ═══ STATEMENT — single editorial paragraph, monumental
              type. No headline + subhead split. No CTA buttons. The
              statement IS the value prop. Cube anchors the right
              column on desktop via the sticky overlay. */}
          <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-20 lg:pb-28" data-section-name="Statement">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-start">
              <div className="hero-rise lg:col-span-7">
                <div className="text-[10px] font-mono uppercase tracking-[0.42em] text-brand-600 dark:text-brand-400">
                  ── Statement, Q2/2026
                </div>
                <h1
                  className="hero-h mt-5 lg:mt-7 text-gray-900 dark:text-white font-semibold tracking-[-0.025em] leading-[1.05]"
                  style={{ fontSize: 'clamp(2rem, 4.6vw, 4.25rem)' }}
                >
                  <span className="word-cascade block">
                    {['Một', 'bên', 'ngoài,'].map((w, i, a) => (
                      <Fragment key={i}>
                        <span style={{ animationDelay: `${80 + i * 65}ms` }}>{w}</span>
                        {i < a.length - 1 ? ' ' : ''}
                      </Fragment>
                    ))}
                  </span>
                  <span className="word-cascade block">
                    {['để', 'biến', 'kế', 'hoạch', 'tốt'].map((w, i, a) => (
                      <Fragment key={i}>
                        <span style={{ animationDelay: `${340 + i * 65}ms` }}>{w}</span>
                        {i < a.length - 1 ? ' ' : ''}
                      </Fragment>
                    ))}
                  </span>
                  <span className="word-cascade block">
                    {['thành', 'hệ', 'thống'].map((w, i, a) => (
                      <Fragment key={i}>
                        <span style={{ animationDelay: `${680 + i * 65}ms` }}>{w}</span>
                        {i < a.length - 1 ? ' ' : ''}
                      </Fragment>
                    ))}
                  </span>
                  <span className="word-cascade block">
                    <span style={{ animationDelay: '880ms' }} className="text-brand-600 dark:text-brand-400">
                      vận hành được.
                    </span>
                  </span>
                </h1>

                {/* Inline footnote, not subheading. */}
                <div className="mt-7 lg:mt-9 flex items-start gap-3 max-w-md">
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

              {/* Cube column — mobile inline; desktop via sticky overlay below. */}
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

        {/* ═══ INDEX — project list as text catalog, NOT image grid.
            Studio Lin / Bureau Borsche pattern. Each row hover-reveals
            the role + arrow. Numbered entries, year right-aligned. */}
        <section
          id="du-an"
          data-section-name="Index"
          className="relative bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800 py-16 lg:py-24"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex items-baseline justify-between gap-4 pb-6 mb-8 lg:mb-12 border-b border-gray-300 dark:border-ink-700">
              <div className="text-[10px] font-mono uppercase tracking-[0.42em] text-brand-600 dark:text-brand-400">
                ── Index of work, 2022 — 2026
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-gray-500 dark:text-ink-500">
                {validIndex.length} of 19
              </div>
            </div>

            <ol className="reveal-stagger divide-y divide-gray-200 dark:divide-ink-800">
              {validIndex.map((e, i) => (
                <li key={e.slug}>
                  <Link
                    href={`/du-an/${e.slug}`}
                    className="group flex items-baseline gap-3 sm:gap-5 py-3.5 lg:py-4 hover:bg-white dark:hover:bg-ink-900/40 transition px-2 -mx-2 rounded"
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

            <div className="reveal mt-10 lg:mt-14 flex items-baseline justify-between gap-4 pt-6 border-t border-gray-300 dark:border-ink-700">
              <div className="text-[10px] font-mono uppercase tracking-[0.42em] text-gray-500 dark:text-ink-500">
                ── 11 đang vận hành thật, 8 case study mở
              </div>
              <Link
                href="/du-an"
                className="text-xs lg:text-sm font-mono uppercase tracking-[0.22em] text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
              >
                Toàn bộ index →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ COLOPHON — print-book-style closing. Manifesto + contact
            + edition + URL all in one tight typographic block. NO
            "Get started" button — single inline link to /bao-gia. */}
        <section
          data-section-name="Colophon"
          className="relative py-16 lg:py-24 bg-white dark:bg-ink-950"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-[10px] font-mono uppercase tracking-[0.42em] text-brand-600 dark:text-brand-400 pb-6 mb-10 border-b border-gray-300 dark:border-ink-700">
              ── Colophon
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
              {/* LEFT — manifesto column */}
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

              {/* RIGHT — colophon metadata stack */}
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
                      <div>
                        <Link href="/dich-vu" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                          → /dich-vu
                        </Link>
                      </div>
                      <div>
                        <Link href="/quy-trinh" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                          → /quy-trinh
                        </Link>
                      </div>
                      <div>
                        <Link href="/du-an" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                          → /du-an
                        </Link>
                      </div>
                      <div>
                        <Link href="/ve-chung-toi" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                          → /ve-chung-toi
                        </Link>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Bottom imprint line */}
            <div className="mt-16 lg:mt-24 pt-6 border-t border-gray-300 dark:border-ink-700 flex items-baseline justify-between gap-4">
              <div className="text-[10px] font-mono uppercase tracking-[0.42em] text-gray-500 dark:text-ink-500">
                alodev studio · est. 31·03·2025 · alodev.vn
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-gray-500 dark:text-ink-500">
                Vol. 5 · Q2 / 2026
              </div>
            </div>
          </div>
        </section>

        {/* ─── DESKTOP STICKY CUBE OVERLAY ─── (inside .rubik-journey)
             Same overlay as before — cube travels through Statement →
             Index → Colophon. Mobile (<lg) hides this; the inline
             cube in the statement column (lg:hidden) handles mobile. */}
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

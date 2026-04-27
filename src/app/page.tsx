import type { Metadata } from 'next'
import { Fragment } from 'react'
import Link from 'next/link'
import { projects } from '@/data/projects'
import JsonLd from '@/components/JsonLd'
import Icon, { type IconName } from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'
import FeaturedTabs from '@/components/FeaturedTabs'
import HeroCube from '@/components/HeroCube'
import StackStrip from '@/components/StackStrip'
import { faqPageSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

const services: Array<{ icon: IconName; title: string; desc: string; href: string }> = [
  { icon: 'globe',    title: 'Website doanh nghiệp', desc: 'Landing, công ty, blog, e-commerce. SEO chuẩn, tốc độ tải nhanh, responsive.', href: '/dich-vu#website' },
  { icon: 'phone',    title: 'App Mobile', desc: 'Native (Swift/Kotlin) hoặc cross-platform (RN/Flutter). Push, payment, analytics.', href: '/dich-vu#mobile' },
  { icon: 'cpu',      title: 'Hệ thống quản trị', desc: 'Dashboard, CRM, ERP, hệ thống đặt hàng — viết riêng theo nghiệp vụ thực tế.', href: '/dich-vu#system' },
  { icon: 'bot',      title: 'Tự động hoá & AI', desc: 'Bot Zalo/Telegram, ChatGPT/Claude, scraping, workflow tự động.', href: '/dich-vu#automation' },
  { icon: 'wrench',   title: 'Bảo trì & nâng cấp', desc: 'Tiếp nhận website cũ, vá lỗi, tăng tốc, chuyển host, hỗ trợ tháng.', href: '/dich-vu#maintenance' },
  { icon: 'brush',    title: 'Thiết kế UI/UX', desc: 'Figma mockup, design system, prototype tương tác — bàn giao trọn gói.', href: '/dich-vu#design' },
]

const process = [
  { step: '01', title: 'Tư vấn miễn phí', desc: 'Trao đổi qua Zalo/Meet để hiểu nhu cầu, ngân sách, deadline.', kbd: '24h' },
  { step: '02', title: 'Báo giá & hợp đồng', desc: 'Báo giá chi tiết theo từng hạng mục — không có chi phí ẩn.', kbd: '48h' },
  { step: '03', title: 'Thiết kế & phát triển', desc: 'Bạn duyệt mockup, theo dõi tiến độ trên dashboard riêng.', kbd: '2–12w' },
  { step: '04', title: 'Bàn giao & bảo hành', desc: 'Test toàn bộ, training sử dụng, bảo hành 6–12 tháng.', kbd: '6–12m' },
]

// stack categories now rendered inside <StackStrip /> (kept as single source of truth there)

const featuredSlugs = ['onthi365', 'shopaccgame', 'datacenter', 'vn247', 'ganday', 'lammmo']
const featured = featuredSlugs.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean)

// Testimonials section temporarily removed — pending real customer quotes
// with permission. Don't fabricate. Track outreach in /TODO.md.

const faq = [
  { q: 'Chi phí thiết kế website doanh nghiệp khoảng bao nhiêu?', a: 'Website giới thiệu công ty cơ bản từ 8 triệu, website thương mại điện tử từ 25 triệu, app mobile (iOS + Android) từ 60 triệu, hệ thống quản trị tuỳ chỉnh báo giá theo scope. Bạn có thể tự cấu hình tính năng để xem báo giá ngay tại trang Báo giá, hoặc gửi yêu cầu để nhận báo giá chi tiết miễn phí trong 24h.' },
  { q: 'Lập trình website / app mất bao lâu?', a: 'Landing page bán hàng 1–2 tuần, website doanh nghiệp đầy đủ 3–6 tuần, app mobile MVP 6–8 tuần, app mobile production 10–12 tuần, hệ thống quản trị (CRM/ERP) tuỳ chỉnh 2–4 tháng. Alodev cam kết deadline có ghi rõ trong hợp đồng — trễ giảm 5%/tuần.' },
  { q: 'Tôi cần thiết kế website chuyên nghiệp ở Hà Nội — Alodev có hỗ trợ không?', a: 'Có. Văn phòng Alodev đặt tại Hà Nội — gặp trực tiếp được. 70% khách hiện tại ở các tỉnh thành khác (TP.HCM, Đà Nẵng, Cần Thơ…), làm việc remote qua Zalo/Google Meet/Linear. Quy trình collaboration đã refine qua 5 năm với 11+ sản phẩm vận hành.' },
  { q: 'Sau khi bàn giao website / app có hỗ trợ kỹ thuật không?', a: 'Có. Bảo hành lỗi miễn phí 6–12 tháng tuỳ gói (mọi bug do Alodev gây ra đều fix free). Sau bảo hành: hỗ trợ kỹ thuật theo gói tháng từ 1 triệu (sửa nhỏ, thêm tính năng nhẹ, theo dõi uptime server, backup). Bạn có thể chấm dứt gói bất kỳ lúc nào — không lock-in.' },
  { q: 'Source code và data có thuộc về tôi không?', a: 'Tuyệt đối có. Source code, database, domain, hosting đều đứng tên và thuộc sở hữu của bạn. Alodev không khoá kỹ thuật, không charge phí "license sử dụng", không giữ key access. Bạn có thể chuyển sang đội khác duy trì bất kỳ lúc nào — Alodev còn cung cấp tài liệu bàn giao đầy đủ để đội mới tiếp nhận.' },
  { q: 'Stack công nghệ Alodev đang dùng là gì?', a: 'Frontend: Next.js / React / Vue / SwiftUI / Compose. Backend: Node.js / NestJS / Express / Spring Boot / Django. Database: PostgreSQL / MySQL / Redis / ClickHouse. Mobile: Swift / Kotlin / Flutter / React Native. Infra: AWS / Cloudflare / Docker / PM2. Stack được chọn theo nghiệp vụ thực tế của bạn, không chạy theo trend — mọi quyết định stack đều giải thích được lý do.' },
]

export default function Home() {
  return (
    <>
      <JsonLd data={[
        faqPageSchema(faq),
        breadcrumbSchema([{ name: 'Trang chủ', url: '/' }]),
      ]} />

      {/* ─── HERO — Resend-style, 2-col, cube right; theme-adaptive ─── */}
      <section className="hero-resend relative text-ink-900 dark:text-white overflow-hidden" data-section-name="Trang chủ">
        <div className="hero-resend-grid absolute inset-0" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 lg:pt-24 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 lg:items-start">
            {/* LEFT: copy + CTAs */}
            <div className="hero-rise lg:col-span-7">
              {/* Eyebrow — left-aligned, theme-adaptive */}
              <div className="flex">
                <Link
                  href="/du-an"
                  className="group inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/70 backdrop-blur px-3.5 py-1.5 text-xs font-medium text-gray-700 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-700 hover:text-gray-900 dark:hover:text-white transition shadow-sm dark:shadow-lg dark:shadow-black/30"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-brand-500 dark:bg-brand-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500 dark:bg-brand-400" />
                  </span>
                  <span className="sm:hidden">Q2/2026 — còn slot</span>
                  <span className="hidden sm:inline">Đang nhận dự án Q2/2026 — còn slot</span>
                  <Icon name="arrow-right" className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>


              {/* Display headline — word cascade + saffron underline (Alodev DNA preserved) */}
              {/* Each word is its own inline-block span (cascade animation
                  target). Spaces live as TEXT NODES between spans, not
                  inside, because trailing whitespace inside an inline-block
                  collapses — that's why words fused together earlier. */}
              <h1 className="hero-h h-display mt-5 sm:mt-7 text-left max-w-3xl">
                <span className="word-cascade block">
                  {['Thiết', 'kế', 'website', '&', 'lập', 'trình', 'app', '—'].map((w, i, a) => (
                    <Fragment key={i}>
                      <span style={{ animationDelay: `${80 + i * 55}ms` }}>{w}</span>
                      {i < a.length - 1 ? ' ' : ''}
                    </Fragment>
                  ))}
                </span>
                <span className="word-cascade block">
                  {['biến', 'ý', 'tưởng', 'thành', 'sản', 'phẩm'].map((w, i) => (
                    <Fragment key={i}>
                      <span style={{ animationDelay: `${500 + i * 55}ms` }}>{w}</span>
                      {' '}
                    </Fragment>
                  ))}
                  <span className="relative inline-block" style={{ animationDelay: `${500 + 6 * 55}ms` }}>
                    <span>thật</span>
                    <svg
                      aria-hidden="true"
                      className="absolute left-0 right-0 bottom-[-0.18em] w-full"
                      style={{ color: '#ed9219' }}
                      viewBox="0 0 600 14"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path d="M2 9 Q 150 2 300 7 T 598 5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span style={{ animationDelay: `${500 + 7 * 55}ms` }}>.</span>
                </span>
              </h1>

              <p className="mt-5 sm:mt-7 text-base sm:text-lg text-gray-700 dark:text-zinc-400 max-w-xl leading-relaxed">
                {/* Mobile: short tagline only — preserves above-the-fold real estate.
                    Desktop sm+: full positioning paragraph. */}
                <span className="sm:hidden">
                  Studio <b className="text-gray-900 dark:text-zinc-100">founder-led tại Hà Nội</b> — code trực tiếp,
                  source code thuộc về bạn.
                </span>
                <span className="hidden sm:inline">
                  Alodev là <b className="text-gray-900 dark:text-zinc-100">founder-led studio tại Hà Nội</b> chuyên thiết kế website doanh nghiệp,
                  lập trình app mobile và xây dựng hệ thống quản trị theo yêu cầu. Bạn làm việc trực tiếp với founder — không sales,
                  không middleman. Source code thuộc về bạn.
                </span>
              </p>

              {/* CTAs — primary full-width on mobile so the touch target is wide and obvious;
                  inline at sm+ where two buttons fit on one row. */}
              <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <span className="magnetic w-full sm:w-auto">
                  <QuoteCTA size="lg" variant="solid" className="w-full sm:w-auto justify-center">Yêu cầu báo giá</QuoteCTA>
                </span>
                <Link
                  href="/du-an"
                  className="ghost-dark inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold transition w-full sm:w-auto"
                >
                  Xem portfolio
                </Link>
              </div>
            </div>

            {/* RIGHT: 3D Rubik cube */}
            <div className="lg:col-span-5">
              <HeroCube />
            </div>
          </div>
        </div>
      </section>


      {/* ─── LOGO CLOUD MARQUEE ─── */}
      <section className="border-y border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="text-center text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-ink-500 mb-6">
            Đang vận hành cho
          </div>
          <div className="marquee-mask overflow-hidden">
            <div className="marquee">
              {[...projects, ...projects].map((p, i) => (
                <a
                  key={`${p.slug}-${i}`}
                  href={`https://${p.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-500 dark:text-ink-600 hover:text-gray-800 dark:hover:text-zinc-300 transition tracking-tight"
                >
                  <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2} /><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" strokeWidth={1.5} /></svg>
                  {p.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3 CAPABILITIES (the portfolio promise) ─── */}
      <section className="py-10 lg:py-24 bg-white dark:bg-ink-950" data-section-name="Năng lực">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal max-w-2xl">
            <Eyebrow>Năng lực cốt lõi</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">
              3 thứ Alodev không bao giờ nhận làm cẩu thả.
            </h2>
            <p className="mt-5 text-lg text-gray-600 dark:text-ink-400">
              Bạn xem portfolio bên dưới — mỗi dự án đều có proof point đo được cho cả 3 chiều.
            </p>
          </div>

          <div className="reveal-stagger mt-8 lg:mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {([
              {
                icon: 'code' as IconName,
                num: '01',
                title: 'Lập trình',
                desc: 'Stack hiện đại, kiến trúc scale được, monitoring + CI/CD ngay từ ngày đầu.',
                points: ['Next.js · Vue · Node · Postgres', 'Edge deploy + multi-region', 'PM2 + nginx + Cloudflare tunnel'],
              },
              {
                icon: 'palette' as IconName,
                num: '02',
                title: 'Thiết kế',
                desc: 'Design system tự xây, mobile-first, dark mode, animation mượt — tay làm chứ không UI kit copy.',
                points: ['Custom design system', 'Mobile-first + dark mode', 'Motion tinh tế, không jitter'],
              },
              {
                icon: 'search' as IconName,
                num: '03',
                title: 'SEO',
                desc: 'SEO kỹ thuật chuẩn từ deploy đầu tiên — không phải fix vá khi traffic đã vào.',
                points: ['Schema.org đầy đủ', 'PageSpeed 90+', 'Sitemap + Search Console ready'],
              },
            ]).map((c) => (
              <div key={c.title} className="lift spotlight glow-card group rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 md:p-7 hover:border-ink-200 dark:hover:border-ink-700">
                <div className="flex items-start justify-between">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400">
                    <Icon name={c.icon} className="w-6 h-6" />
                  </div>
                  <span className="tabular text-xs font-mono text-ink-300 dark:text-ink-600">{c.num}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-ink-900 dark:text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{c.desc}</p>
                <ul className="mt-5 space-y-2">
                  {c.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-ink-600 dark:text-ink-200">
                      <Icon name="check" className="w-4 h-4 mt-0.5 text-brand-600 dark:text-brand-400 shrink-0" strokeWidth={2.25} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROJECTS — tabbed (Supabase pattern) ─── */}
      <FeaturedTabs />

      {/* ─── SERVICES GRID ─── */}
      <section className="py-10 lg:py-24 bg-white dark:bg-ink-950" data-section-name="Dịch vụ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal max-w-2xl">
            <Eyebrow>Dịch vụ</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">Chúng tôi nhận làm gì?</h2>
            <p className="mt-5 text-lg text-gray-600 dark:text-ink-400">
              Từ landing page nhỏ đến hệ thống đa nền tảng — đội Alodev đủ chuyên môn để xử lý trọn gói.
            </p>
          </div>
          <div className="reveal mt-8 lg:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 dark:bg-ink-800 rounded-2xl border border-gray-200 dark:border-ink-800 overflow-hidden">
            {services.map((s) => (
              <Link key={s.title} href={s.href} className="group bg-white dark:bg-ink-950 p-5 md:p-7 hover:bg-cream-50 dark:hover:bg-zinc-900/60 transition">
                <div className="flex items-center justify-between">
                  <Icon name={s.icon} className="w-6 h-6 text-ink-700 dark:text-ink-100" strokeWidth={1.6} />
                  <Icon name="arrow-up-right" className="w-4 h-4 text-ink-300 dark:text-ink-700 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS — scroll-fill connector (Cal.com 01→04 narrative) ─── */}
      <section className="py-10 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800" data-section-name="Quy trình">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal max-w-2xl mx-auto text-center">
            <Eyebrow>Quy trình</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">4 bước — minh bạch từ đầu đến cuối</h2>
          </div>
          <div data-process-section className="relative mt-8 lg:mt-14">
            {/* Track sits at the vertical center of the step-number row inside each card */}
            <div className="hidden lg:block absolute left-12 right-12 top-[3.25rem] process-track" />
            <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {process.map((p) => (
                <div key={p.step} className="relative process-dot">
                  <div className="rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 md:p-6 h-full">
                    <div className="flex items-center justify-between">
                      <div className="tabular text-3xl font-bold text-gray-300 dark:text-ink-700">{p.step}</div>
                      <span className="kbd">{p.kbd}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{p.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-ink-400 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PORTFOLIO GRID ─── */}
      <section className="py-10 lg:py-24 bg-white dark:bg-ink-950" data-section-name="Portfolio">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal flex items-end justify-between flex-wrap gap-4 mb-8 lg:mb-12">
            <div className="max-w-2xl">
              <Eyebrow>Portfolio</Eyebrow>
              <h2 className="h-section mt-3 text-gray-900 dark:text-white">Một vài sản phẩm Alodev đã xây.</h2>
            </div>
            <Link href="/du-an" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1">Xem tất cả <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></Link>
          </div>
          <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((p) => (
              <Link key={p.slug} href={`/du-an/${p.slug}`} className="lift spotlight group rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden hover:border-gray-300 dark:hover:border-ink-700 hover:shadow-xl hover:shadow-brand-500/10">
                <div className={`relative aspect-[16/10] bg-gradient-to-br ${p.colorClass} flex items-center justify-center overflow-hidden`}>
                  <div className="text-center px-4">
                    <div className="text-2xl font-bold text-gray-700 dark:text-ink-200 dark:opacity-90">{p.name}</div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-ink-400 font-mono">{p.domain}</div>
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 dark:bg-ink-900/70 backdrop-blur text-gray-700 dark:text-ink-300 font-semibold">{p.category.split('·')[0].trim()}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">{p.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-ink-400 line-clamp-2">{p.shortDesc}</p>
                  {p.code.metrics && p.code.metrics[0] && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-ink-800 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {p.code.stack.slice(0, 2).map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-ink-800 text-gray-700 dark:text-ink-400 font-medium font-mono">{t}</span>
                        ))}
                      </div>
                      <div className="tabular text-xs">
                        <span className="font-bold text-gray-900 dark:text-white">{p.code.metrics[0].value}</span>
                        <span className="text-gray-500 dark:text-ink-500 ml-1">{p.code.metrics[0].label.toLowerCase()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STACK STRIP — slim, cube now lives in hero ─── */}
      <StackStrip />

      {/* ─── WHY ALODEV (honest comparison) ─── */}
      <section className="py-10 lg:py-24 bg-white dark:bg-ink-950" data-section-name="Khác biệt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal max-w-2xl">
            <Eyebrow>Khác biệt</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">
              Tại sao chọn Alodev?
            </h2>
            <p className="mt-5 text-lg text-gray-600 dark:text-ink-400">
              Founder-led studio: bạn làm việc trực tiếp với người code, không qua sales hay PM trung gian. Báo giá rõ, deadline rõ, code rõ.
            </p>
          </div>

          <div className="reveal-stagger mt-8 lg:mt-14 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {/* Each card has a long-form `desc` for desktop and a `short` blurb for
                mobile. 6 cards in a single column would create ~2000px of scroll;
                grid-cols-2 mobile + truncated copy keeps the section scannable
                without losing any of the differentiation points. */}
            {([
              { icon: 'handshake' as IconName,    title: 'Founder trực tiếp',          short: 'Không sales, không middleman.', desc: 'Không sales, không middleman. Chat trực tiếp với người sẽ code dự án của bạn — tiết kiệm 70% thời gian briefing.' },
              { icon: 'package' as IconName,      title: 'Source code thuộc về bạn',   short: 'Repo + DB + domain đứng tên bạn.', desc: 'Repo Git, database, domain, hosting — tất cả đứng tên bạn. Alodev không khoá kỹ thuật, không charge phí license sử dụng.' },
              { icon: 'zap' as IconName,          title: 'Bàn giao đúng hợp đồng',     short: 'Trễ → giảm 5%/tuần. 11+ sản phẩm.', desc: 'Ngày bàn giao ghi rõ trong hợp đồng. Trễ → giảm 5%/tuần. Track record 5 năm, 11+ sản phẩm vận hành thật.' },
              { icon: 'cpu' as IconName,          title: 'Stack hiện đại, có lý do',   short: 'Next.js / Node / Postgres / Cloudflare.', desc: 'Next.js / Node / Postgres / Cloudflare — không chạy theo trend. Mỗi quyết định stack đều giải thích được vì sao.' },
              { icon: 'target' as IconName,       title: 'Đo lường bằng metric',       short: 'PageSpeed 90+, uptime > 99.9%.', desc: 'Cam kết PageSpeed 90+, P95 < 200ms, uptime > 99.9%. Báo cáo hằng tháng, không che giấu số liệu.' },
              { icon: 'life-buoy' as IconName,    title: 'Bảo hành thật',              short: 'Sửa miễn phí 6–12 tháng.', desc: 'Lỗi sau bàn giao: sửa miễn phí 6–12 tháng. Hỗ trợ kỹ thuật theo gói tháng từ 1tr — không bắt buộc renew.' },
            ]).map((c) => (
              <div key={c.title} className="lift spotlight rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 sm:p-5 md:p-6 hover:border-ink-200 dark:hover:border-ink-700">
                <div className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cream-100 dark:bg-ink-800 text-ink-700 dark:text-ink-100">
                  <Icon name={c.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="mt-3 sm:mt-4 text-sm sm:text-base font-bold text-ink-900 dark:text-white">{c.title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-ink-500 dark:text-ink-300 leading-relaxed">
                  <span className="sm:hidden">{c.short}</span>
                  <span className="hidden sm:inline">{c.desc}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-10 lg:py-24 bg-cream-50 dark:bg-ink-950 border-t border-gray-200 dark:border-ink-800" data-section-name="FAQ">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal text-center max-w-2xl mx-auto mb-8 lg:mb-12">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">Câu hỏi thường gặp.</h2>
          </div>
          <div className="reveal-stagger space-y-2">
            {faq.map((f) => {
              // Preview: first 90 chars of the answer with ellipsis. Visible only
              // when the <details> is closed — gives users a "scent" of the
              // answer's value so they actually tap the relevant question
              // instead of giving up on a wall of bare titles.
              const preview = f.a.length > 90 ? f.a.slice(0, 90).trimEnd() + '…' : f.a
              return (
                <details key={f.q} className="group rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 md:px-6 py-3 md:py-4 open:shadow-md dark:open:shadow-zinc-950/50 transition">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-3 font-semibold text-gray-900 dark:text-white">
                    <span>{f.q}</span>
                    <svg className="w-5 h-5 mt-0.5 text-gray-400 dark:text-ink-500 transition group-open:rotate-180 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  {/* Preview hidden when open; full answer takes over. */}
                  <p className="mt-1.5 text-sm text-gray-500 dark:text-ink-500 leading-relaxed line-clamp-2 group-open:hidden">{preview}</p>
                  <p className="mt-3 text-gray-600 dark:text-ink-400 leading-relaxed hidden group-open:block">{f.a}</p>
                </details>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative py-12 lg:py-28 bg-white dark:bg-ink-950 overflow-hidden" data-section-name="Liên hệ">
        <div className="aurora opacity-50" />
        <div className="reveal relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="h-display text-gray-900 dark:text-white">
            Sẵn sàng <span className="text-brand-600 dark:text-brand-400">bắt đầu</span>?
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-600 dark:text-ink-400">Phản hồi trong 24h kèm báo giá sơ bộ.</p>
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
            <span className="magnetic w-full sm:w-auto">
              <QuoteCTA size="lg" className="px-7 py-4 w-full sm:w-auto justify-center">Yêu cầu báo giá</QuoteCTA>
            </span>
            <a href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 px-7 py-4 text-ink-900 dark:text-white font-semibold hover:border-ink-300 dark:hover:border-ink-700 transition w-full sm:w-auto">
              Chat Zalo
            </a>
          </div>
          {/* ⌘K hint — desktop only; mobile users have no keyboard shortcut. */}
          <p className="hidden md:block mt-8 text-sm text-gray-500 dark:text-ink-500">
            Hoặc nhấn <span className="kbd">⌘</span> <span className="kbd">K</span> ở bất kỳ trang nào để mở quick search (sắp ra mắt).
          </p>
        </div>
      </section>
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

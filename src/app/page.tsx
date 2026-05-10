import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/data/projects'
import JsonLd from '@/components/JsonLd'
import HeroCube from '@/components/HeroCube'
import QuoteCTA from '@/components/QuoteCTA'
import Icon, { type IconName } from '@/components/Icon'
import { faqPageSchema, breadcrumbSchema, organizationSchema, websiteSchema } from '@/lib/schema'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/* B2B-Vietnamese pivot — drop AI-flagship signals (mono uppercase
   eyebrows, "VOL./NO./EDITION" masthead, git-log feed, letter
   cascade, animated bg mesh, section indicator floating, English
   labels). Sans-serif throughout, practical sectioning (Hero /
   Dịch vụ / Sản phẩm / Vì sao / Liên hệ), saffron accent used
   sparingly. Cube journey + Lenis smooth scroll preserved as
   subtle craft signals — kept under user's eye but not screaming
   for attention. */

const services: Array<{ icon: IconName; title: string; desc: string; href: string }> = [
  { icon: 'globe',  title: 'Thiết kế website', desc: 'Landing, web doanh nghiệp, e-commerce. Chuẩn SEO, tốc độ tải nhanh, responsive.', href: '/dich-vu#website' },
  { icon: 'phone',  title: 'Lập trình app mobile', desc: 'Native iOS/Android hoặc cross-platform. Tích hợp thanh toán, push, analytics.', href: '/dich-vu#mobile' },
  { icon: 'cpu',    title: 'Hệ thống quản trị', desc: 'CRM, ERP, dashboard nội bộ — viết riêng theo nghiệp vụ thực tế của bạn.', href: '/dich-vu#system' },
  { icon: 'bot',    title: 'Tự động hoá & AI', desc: 'Chatbot, workflow automation, tích hợp ChatGPT/Claude vào quy trình hiện hữu.', href: '/dich-vu#automation' },
]

const featuredSlugs = ['onthi365', 'shopaccgame', 'ganday']
const featured = featuredSlugs.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean)

const reasons: Array<{ icon: IconName; title: string; desc: string }> = [
  { icon: 'package',  title: 'Source code thuộc về bạn', desc: 'Repo, database, domain, hosting đứng tên bạn từ ngày bàn giao. Không vendor lock-in.' },
  { icon: 'check',    title: 'Bàn giao đúng hạn',         desc: 'Deadline ràng buộc trong hợp đồng. Trễ → giảm 5%/tuần. Track record 5+ năm.' },
  { icon: 'shield-check', title: 'Bảo hành 6–12 tháng',   desc: 'Mọi bug do Alodev gây ra đều khắc phục miễn phí trong thời hạn bảo hành.' },
  { icon: 'gauge',    title: 'Đo lường minh bạch',         desc: 'PageSpeed 90+, P95 < 200ms, uptime > 99.9%. Báo cáo định kỳ với khách hàng.' },
]

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

        {/* ─── HERO — clean brand-first */}
        <section
          className="hero-resend relative text-ink-900 dark:text-white overflow-hidden"
          data-section-name="Trang chủ"
        >
          <div className="hero-resend-grid absolute inset-0" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-24 lg:pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-start">
              <div className="hero-rise lg:col-span-7">
                {/* Status pill — natural Vietnamese, not performative */}
                <Link
                  href="/du-an"
                  className="group inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/70 backdrop-blur px-3.5 py-1.5 text-xs font-medium text-gray-700 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-700 transition shadow-sm"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  Đang nhận dự án Q2/2026
                  <Icon name="arrow-right" className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 transition" />
                </Link>

                <h1
                  className="mt-7 lg:mt-9 text-gray-900 dark:text-white font-bold tracking-[-0.025em] leading-[1.1]"
                  style={{ fontSize: 'clamp(2.25rem, 5.2vw, 4.5rem)' }}
                >
                  ALODEV STUDIO — đối tác công nghệ cho{' '}
                  <span className="text-brand-600 dark:text-brand-400">doanh nghiệp Việt</span>.
                </h1>

                <p className="mt-6 lg:mt-7 text-base lg:text-lg text-gray-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                  Studio thiết kế website, lập trình app mobile và xây dựng hệ thống quản trị
                  theo yêu cầu thực tế của doanh nghiệp. 11+ sản phẩm đang vận hành — source code
                  thuộc về bạn, bàn giao đúng hạn, bảo hành 6–12 tháng.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <span className="magnetic w-full sm:w-auto">
                    <QuoteCTA size="lg" variant="solid" className="w-full sm:w-auto justify-center">
                      Yêu cầu báo giá
                    </QuoteCTA>
                  </span>
                  <Link
                    href="/du-an"
                    className="ghost-dark inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold transition w-full sm:w-auto"
                  >
                    Xem dự án
                  </Link>
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
          </div>
        </section>

        {/* ─── DỊCH VỤ — 4 services */}
        <section
          id="dich-vu"
          data-section-name="Dịch vụ"
          className="py-16 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex items-end justify-between flex-wrap gap-4 mb-10 lg:mb-14">
              <div className="max-w-2xl">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Bốn nhóm dịch vụ chính.
                </h2>
                <p className="mt-3 text-gray-600 dark:text-ink-400">
                  Từ website giới thiệu công ty đến hệ thống quản trị tuỳ chỉnh và tự động hoá AI.
                </p>
              </div>
              <Link
                href="/dich-vu"
                className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1.5"
              >
                Xem chi tiết &amp; bảng giá
                <Icon name="arrow-right" className="w-4 h-4" />
              </Link>
            </div>

            <div className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {services.map((s) => (
                <Link
                  key={s.title}
                  href={s.href}
                  className="lift group rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 lg:p-6 hover:border-brand-300 dark:hover:border-brand-500/40 transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-400 flex items-center justify-center mb-4">
                    <Icon name={s.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-ink-400 leading-relaxed">{s.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SẢN PHẨM TIÊU BIỂU — 3 projects */}
        <section
          id="du-an"
          data-section-name="Sản phẩm"
          className="py-16 lg:py-24 bg-white dark:bg-ink-950"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex items-end justify-between flex-wrap gap-4 mb-10 lg:mb-14">
              <div className="max-w-2xl">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Sản phẩm tiêu biểu.
                </h2>
                <p className="mt-3 text-gray-600 dark:text-ink-400">
                  Ba dự án Alodev đã thiết kế &amp; phát triển — đang vận hành ổn định trên môi trường thật.
                </p>
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
              {featured.map((p) => (
                <Link
                  key={p.slug}
                  href={`/du-an/${p.slug}`}
                  className="lift spotlight group rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden hover:border-gray-300 dark:hover:border-ink-700 transition"
                >
                  <div className={`relative aspect-[16/10] bg-gradient-to-br ${p.colorClass} flex items-center justify-center overflow-hidden`}>
                    <div className="text-center px-4">
                      <div className="text-2xl font-bold text-gray-700 dark:text-ink-200 dark:opacity-90">{p.name}</div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-ink-400">{p.domain}</div>
                    </div>
                    <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 dark:bg-ink-900/70 backdrop-blur text-gray-700 dark:text-ink-300 font-semibold">
                      {p.category.split('·')[0].trim()}
                    </span>
                  </div>
                  <div className="p-5">
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

        {/* ─── VÌ SAO ALODEV — 4 trust points */}
        <section
          data-section-name="Vì sao Alodev"
          className="py-16 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal max-w-2xl mb-10 lg:mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Vì sao chọn Alodev.
              </h2>
              <p className="mt-3 text-gray-600 dark:text-ink-400">
                Bốn cam kết được ràng buộc bằng hợp đồng — không marketing, không hứa suông.
              </p>
            </div>

            <div className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {reasons.map((r) => (
                <div
                  key={r.title}
                  className="rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 lg:p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-400 flex items-center justify-center mb-4">
                    <Icon name={r.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{r.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-ink-400 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>

            {/* Quy trình teaser link, single line */}
            <div className="reveal mt-10 lg:mt-14 text-center">
              <Link
                href="/quy-trinh"
                className="inline-flex items-center gap-2 text-sm lg:text-base font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
              >
                Xem quy trình triển khai 8 giai đoạn
                <Icon name="arrow-right" className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── LIÊN HỆ CTA */}
        <section
          data-section-name="Liên hệ"
          className="relative py-16 lg:py-24 bg-white dark:bg-ink-950 overflow-hidden"
        >
          <div className="aurora opacity-40" />
          <div className="reveal relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Sẵn sàng bắt đầu dự án?
            </h2>
            <p className="mt-4 text-base lg:text-lg text-gray-600 dark:text-ink-400">
              Phản hồi trong 24h kèm báo giá sơ bộ — không sales pitch, không ràng buộc.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
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
            <p className="mt-8 text-sm text-gray-500 dark:text-ink-500">
              hello@alodev.vn  ·  0587 789 456  ·  Telegram @alodevvn
            </p>
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

import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/data/projects'
import JsonLd from '@/components/JsonLd'
import HeroCube from '@/components/HeroCube'
import QuoteCTA from '@/components/QuoteCTA'
import Icon from '@/components/Icon'
import { faqPageSchema, breadcrumbSchema, organizationSchema, websiteSchema } from '@/lib/schema'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/* B2B Vietnamese — describe function, do NOT self-claim partnership.
   Voice principles (Linear / Vercel / Stripe / Resend):
   - State what we DO ("Website, app & hệ thống") not what we ARE
     ("đối tác công nghệ"). The latter is a customer's verdict, not ours.
   - Subtitle ≤ 20 words. Section headlines ≤ 4 words where possible.
   - Each service description = one phrase, no compound sentences.
   - Trust comes from contract terms + real numbers, not adjectives.
*/

const services = [
  { num: '01', title: 'Website',          desc: 'Landing, doanh nghiệp, e-commerce.', anchor: '/dich-vu#website' },
  { num: '02', title: 'App mobile',       desc: 'Native iOS/Android hoặc cross-platform.', anchor: '/dich-vu#mobile' },
  { num: '03', title: 'Hệ thống quản trị', desc: 'CRM, ERP, dashboard viết riêng theo nghiệp vụ.', anchor: '/dich-vu#system' },
  { num: '04', title: 'Tự động hoá & AI',  desc: 'Chatbot Zalo, workflow, tích hợp LLM.', anchor: '/dich-vu#automation' },
]

// Featured projects with REAL specific metrics (not vague descriptions).
// Numbers hand-curated from each project's actual operational data.
const featured = [
  { slug: 'onthi365',    name: 'OnThi365',    domain: 'onthi365.vn',    color: 'from-orange-200 to-red-300 dark:from-orange-700 dark:to-red-800', metric: '120k+ học viên', tag: 'Edtech · Livestream HLS' },
  { slug: 'shopaccgame', name: 'Shop Acc Game', domain: 'shopaccgame.com', color: 'from-violet-200 to-fuchsia-300 dark:from-violet-700 dark:to-fuchsia-800', metric: '5+ năm vận hành', tag: 'E-commerce · Multi-tenant' },
  { slug: 'ganday',      name: 'Gần Đây',     domain: 'ganday.com',     color: 'from-sky-200 to-blue-300 dark:from-sky-700 dark:to-blue-800', metric: '4 site con · 1 CMS', tag: 'Multi-site CMS' },
].filter((f) => projects.some((p) => p.slug === f.slug))

const phaseTicks = [
  { i: '01', d: '24h',  l: 'Tư vấn' },
  { i: '02', d: '48h',  l: 'Báo giá' },
  { i: '03', d: '7d',   l: 'Đặc tả' },
  { i: '04', d: '3w',   l: 'UI/UX' },
  { i: '05', d: '12w',  l: 'Phát triển' },
  { i: '06', d: '7d',   l: 'QA' },
  { i: '07', d: '3d',   l: 'Bàn giao' },
  { i: '08', d: '12m',  l: 'Bảo hành' },
]

const reasons = [
  { title: 'Source code thuộc về bạn',    desc: 'Repo, database, domain, hosting đứng tên khách hàng. Không vendor lock-in.' },
  { title: 'Bàn giao đúng hạn',           desc: 'Deadline ràng buộc hợp đồng. Trễ → giảm 5%/tuần, capped 30%.' },
  { title: 'Bảo hành 6–12 tháng',         desc: 'Bug do code Alodev — fix miễn phí. Critical ≤ 24h, minor ≤ 7 ngày.' },
  { title: 'Đo lường minh bạch',          desc: 'PageSpeed ≥ 90, P95 < 200ms, uptime ≥ 99.9% — cam kết hợp đồng.' },
]

const faq = [
  { q: 'Chi phí thiết kế website doanh nghiệp khoảng bao nhiêu?', a: 'Website giới thiệu công ty cơ bản từ 8 triệu, e-commerce từ 25 triệu, app mobile từ 60 triệu, hệ thống quản trị tuỳ chỉnh báo giá theo scope. Cấu hình tính năng để xem báo giá ngay tại /bao-gia, hoặc gửi yêu cầu — phản hồi trong 24h.' },
  { q: 'Source code và data có thuộc về tôi không?', a: 'Có. Source code, database, domain, hosting đều đứng tên và thuộc sở hữu của bạn. Không vendor lock-in, không phí license, không khoá kỹ thuật. Tài liệu bàn giao đầy đủ để chuyển đội bất cứ lúc nào.' },
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

        {/* HERO */}
        <section className="hero-resend relative text-ink-900 dark:text-white overflow-hidden" data-section-name="Trang chủ">
          <div className="hero-resend-grid absolute inset-0" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-24 lg:pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-start">
              <div className="hero-rise lg:col-span-7">
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/70 backdrop-blur px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-gray-600 dark:text-zinc-400 shadow-sm"
                >
                  <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  Since 2025
                </span>

                <h1
                  className="mt-7 lg:mt-9 text-gray-900 dark:text-white font-bold tracking-[-0.025em] leading-[1.1]"
                  style={{ fontSize: 'clamp(2.25rem, 5.2vw, 4.5rem)' }}
                >
                  Website, app &amp; hệ thống —{' '}
                  <span className="text-brand-600 dark:text-brand-400">cho doanh nghiệp Việt</span>.
                </h1>

                <p className="mt-6 lg:mt-7 text-base lg:text-lg text-gray-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                  Studio Hà Nội, 11+ sản phẩm đang vận hành.
                  Bàn giao source code, bảo hành 6–12 tháng.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <span className="magnetic w-full sm:w-auto">
                    <QuoteCTA size="lg" variant="solid" className="w-full sm:w-auto justify-center">Yêu cầu báo giá</QuoteCTA>
                  </span>
                  <Link href="/du-an" className="ghost-dark inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold transition w-full sm:w-auto">
                    Xem dự án
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="lg:hidden"><HeroCube /></div>
                <div aria-hidden="true" className="hidden lg:block lg:aspect-[700/550] lg:max-w-[700px] lg:ml-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── DỊCH VỤ — numbered editorial list (NOT card grid) ─── */}
        <section
          id="dich-vu"
          data-section-name="Dịch vụ"
          className="py-16 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex items-end justify-between flex-wrap gap-4 mb-8 lg:mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Dịch vụ.
              </h2>
              <Link href="/dich-vu" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1.5">
                Xem chi tiết &amp; bảng giá
                <Icon name="arrow-right" className="w-4 h-4" />
              </Link>
            </div>

            <ol className="reveal-stagger divide-y divide-gray-200 dark:divide-ink-800">
              {services.map((s) => (
                <li key={s.num}>
                  <Link
                    href={s.anchor}
                    className="group grid grid-cols-12 gap-4 lg:gap-6 py-5 lg:py-7 hover:bg-white dark:hover:bg-ink-900/40 transition px-2 -mx-2 rounded items-baseline"
                  >
                    <span className="col-span-2 lg:col-span-1 text-sm lg:text-base font-mono tabular text-gray-400 dark:text-ink-600">
                      {s.num}
                    </span>
                    <div className="col-span-10 lg:col-span-4">
                      <h3 className="text-lg lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">
                        {s.title}
                      </h3>
                    </div>
                    <p className="col-span-12 lg:col-span-6 text-sm lg:text-base text-gray-600 dark:text-ink-400 leading-relaxed">
                      {s.desc}
                    </p>
                    <span className="hidden lg:inline-block col-span-1 text-brand-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-x-1 transition text-right">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── FOUNDER'S NOTE — distinctive, no agency does this ─── */}
        <section
          data-section-name="Founder note"
          className="py-16 lg:py-24 bg-white dark:bg-ink-950"
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal">
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-500 dark:text-ink-500 mb-5">
                Ghi chú · Q2 / 2026
              </div>
              <div className="space-y-4 text-base lg:text-lg leading-[1.75] text-gray-700 dark:text-ink-300">
                <p>
                  Quý này đội Alodev nhận thêm dự án <strong className="text-gray-900 dark:text-white">hệ thống quản trị cho SME</strong> —
                  giai đoạn doanh nghiệp scale từ 5–10 lên 30–50 nhân viên.
                </p>
                <p>
                  Mỗi dự án cần có nghiệp vụ cụ thể và người chịu trách nhiệm bên khách.
                  Gửi 1–2 dòng mô tả + range ngân sách, phản hồi fit / no-fit trong 24h.
                </p>
              </div>
              <div className="mt-7 pt-6 border-t border-gray-200 dark:border-ink-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-700 dark:text-brand-400 font-bold text-sm">
                  TCT
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Trần Công Thắng</div>
                  <div className="text-xs text-gray-500 dark:text-ink-500">Founder · alodev studio</div>
                </div>
                <Link
                  href="/lien-he"
                  className="ml-auto text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
                >
                  Gửi mô tả →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SẢN PHẨM TIÊU BIỂU — with REAL specific numbers ─── */}
        <section
          id="du-an"
          data-section-name="Sản phẩm"
          className="py-16 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex items-end justify-between flex-wrap gap-4 mb-10 lg:mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sản phẩm tiêu biểu.
              </h2>
              <Link href="/du-an" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1.5">
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
                  <div className={`relative aspect-[16/10] bg-gradient-to-br ${p.color} flex flex-col justify-between p-5 overflow-hidden`}>
                    <div className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 dark:bg-ink-900/70 backdrop-blur text-gray-700 dark:text-ink-300 font-semibold inline-flex w-max">
                      {p.tag}
                    </div>
                    <div>
                      <div className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-ink-100">{p.name}</div>
                      <div className="mt-1 text-xs text-gray-700 dark:text-ink-300">{p.domain}</div>
                    </div>
                  </div>
                  <div className="p-5 flex items-baseline justify-between gap-3">
                    <span className="text-base lg:text-lg font-bold text-gray-900 dark:text-white tabular">
                      {p.metric}
                    </span>
                    <span className="text-brand-600 dark:text-brand-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                      Xem →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── INLINE QUY TRÌNH STRIP — single line, link to full page ─── */}
        <section
          data-section-name="Quy trình"
          className="py-12 lg:py-16 bg-white dark:bg-ink-950"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex items-center justify-between gap-6 flex-wrap">
              <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Quy trình — 8 giai đoạn.
              </h3>
              <Link
                href="/quy-trinh"
                className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1.5"
              >
                Xem chi tiết
                <Icon name="arrow-right" className="w-4 h-4" />
              </Link>
            </div>
            <div className="reveal-stagger mt-6 lg:mt-8 grid grid-cols-4 lg:grid-cols-8 gap-2 lg:gap-3">
              {phaseTicks.map((p) => (
                <div
                  key={p.i}
                  className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 dark:border-ink-800 bg-cream-50 dark:bg-ink-900/40 py-2.5 lg:py-3"
                >
                  <span className="text-sm lg:text-base font-mono tabular font-bold text-gray-900 dark:text-white">{p.i}</span>
                  <span className="text-[10px] text-gray-500 dark:text-ink-500 font-mono">{p.d}</span>
                  <span className="text-[10px] lg:text-xs text-gray-700 dark:text-ink-400 font-medium">{p.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── VÌ SAO — long-form trust copy with real contract terms ─── */}
        <section
          data-section-name="Vì sao Alodev"
          className="py-16 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal max-w-2xl mb-10 lg:mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Bốn cam kết hợp đồng.
              </h2>
            </div>
            <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {reasons.map((r, i) => (
                <div key={r.title} className="flex gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-full border-2 border-brand-300 dark:border-brand-500/40 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 flex items-center justify-center font-mono text-sm font-bold tabular">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{r.title}</h3>
                    <p className="mt-2 text-sm lg:text-base text-gray-600 dark:text-ink-400 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIÊN HỆ */}
        <section data-section-name="Liên hệ" className="relative py-16 lg:py-24 bg-white dark:bg-ink-950 overflow-hidden">
          <div className="aurora opacity-40" />
          <div className="reveal relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Bắt đầu dự án.
            </h2>
            <p className="mt-4 text-base lg:text-lg text-gray-600 dark:text-ink-400">
              Phản hồi trong 24h kèm báo giá sơ bộ.
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

        {/* DESKTOP STICKY CUBE OVERLAY */}
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

      </div>
    </>
  )
}

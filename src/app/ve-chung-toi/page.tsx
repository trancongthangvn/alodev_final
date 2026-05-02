import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import Icon, { type IconName } from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'
import { breadcrumbSchema, aboutPageSchema, founderPersonSchema } from '@/lib/schema'
import { projects } from '@/data/projects'

export const metadata = {
  // `absolute` to bypass the '%s — Alodev' template since the title already
  // names the brand ("Về Alodev"). Without this we'd emit a duplicate suffix.
  title: { absolute: 'Về Alodev — Hồ sơ năng lực founder-led studio web/app' },
  // 156 chars
  description: 'Alodev — founder-led studio tại Hà Nội: 5+ năm vận hành 11+ sản phẩm thực tế. Hồ sơ năng lực: pháp lý, lĩnh vực, stack công nghệ, cam kết SLA chi tiết.',
  alternates: { canonical: '/ve-chung-toi' },
  openGraph: {
    url: '/ve-chung-toi',
    title: 'Về Alodev — Hồ sơ năng lực founder-led studio',
    description: '5+ năm vận hành fleet, 11+ sản phẩm đang chạy thực tế. Hồ sơ năng lực đầy đủ — pháp lý, dịch vụ, stack, SLA.',
  },
}

// ─── Data blocks ────────────────────────────────────────────────────────

const principles: Array<{ icon: IconName; title: string; desc: string }> = [
  { icon: 'target',  title: 'Honest by default',   desc: 'Không phóng đại số liệu, không testimonials hư cấu. Báo giá minh bạch theo hạng mục, deadline ràng buộc, danh tính người trực tiếp viết code công khai.' },
  { icon: 'wrench',  title: 'Build to last',        desc: 'Code phải đọc được sau 3 năm. Stack lựa chọn theo nghiệp vụ thực tế, không chạy theo trend ngắn hạn.' },
  { icon: 'package', title: 'You own everything',   desc: 'Source code, database, domain và hosting đứng tên bạn. Không vendor lock-in, không phí license, không khoá kỹ thuật.' },
  { icon: 'rocket',  title: 'Ship, then iterate',   desc: 'Bàn giao MVP đúng hạn rồi cải tiến trên user thật. Không trì hoãn 6 tháng vì &ldquo;perfect product&rdquo; — phản hồi của user thật giá trị hơn polish chưa được kiểm chứng.' },
]

const milestones = [
  { year: '2021', text: 'Bắt đầu fleet — site đầu tiên (thitruongkinhte.net) lên live.' },
  { year: '2022', text: 'Mở rộng sang e-commerce. Shopaccgame, freefiremienphi vận hành đa-tenant.' },
  { year: '2023', text: 'Bước vào edtech — OnThi365 launch với khoá học, đề thi online.' },
  { year: '2024', text: 'OnThi365 thêm livestream HLS multi-platform + đấu trường PvP real-time.' },
  { year: '2025', text: 'Multi-site CMS (ganday + 3 domain con) + Datacenter dashboard nội bộ quản lý cả fleet.' },
  { year: '2026', text: 'Mở dịch vụ ra ngoài — chính thức nhận dự án cho doanh nghiệp khác. Bạn đang xem.' },
]

const stats = [
  { num: '11', unit: 'sản phẩm', label: 'đang vận hành liên tục' },
  { num: '5+', unit: 'năm', label: 'fleet operation thực tế' },
  { num: '99.94%', unit: 'uptime', label: 'trên fleet 11 site' },
  { num: '< 24h', unit: 'phản hồi', label: 'cho mọi yêu cầu báo giá' },
]

// Business identity card — quick reference for procurement / due diligence
// teams who need a one-glance summary of who Alodev is. Only fields with
// known truthful values are listed; legal fields (mã số thuế, full
// registered name) are intentionally omitted rather than fabricated —
// add when registration paperwork supplies real values.
const identityRows: Array<{ label: string; value: string; href?: string }> = [
  { label: 'Tên studio',         value: 'Alodev' },
  { label: 'Loại hình',          value: 'Founder-led studio web / app' },
  { label: 'Founder',            value: 'Trần Công Thắng' },
  { label: 'Trụ sở',             value: 'Hà Nội · Việt Nam' },
  { label: 'Phạm vi phục vụ',    value: 'Toàn quốc qua remote (Zalo / Meet / Linear)' },
  { label: 'Hoạt động từ',       value: '2021 — 5+ năm fleet operation' },
  { label: 'Quy mô đội',         value: 'Founder + cộng tác viên project-based' },
  { label: 'Đang nhận dự án',    value: 'Q2/2026 — còn slot' },
  { label: 'Website',            value: 'alodev.vn',           href: 'https://alodev.vn' },
  { label: 'Email',              value: 'hello@alodev.vn',     href: 'mailto:hello@alodev.vn' },
  { label: 'Zalo / Phone',       value: '0364 234 936',         href: 'https://zalo.me/0364234936' },
  { label: 'GitHub',             value: 'github.com/trancongthangvn', href: 'https://github.com/trancongthangvn' },
]

// Service catalog — same set as homepage `/dich-vu` but tuned for capability
// profile context (each line emphasises deliverable, not pitch). Links go
// to the service detail pages where they exist.
const services: Array<{ icon: IconName; title: string; desc: string; href: string }> = [
  { icon: 'globe',    title: 'Thiết kế website doanh nghiệp', desc: 'Landing, công ty, blog, e-commerce. Custom design system, SEO chuẩn từ deploy đầu, PageSpeed 90+.', href: '/dich-vu/thiet-ke-website' },
  { icon: 'phone',    title: 'Lập trình app mobile',          desc: 'Native (Swift / Kotlin) hoặc cross-platform (Flutter / RN / Capacitor). Push, payment, analytics built-in.', href: '/dich-vu/lap-trinh-app-mobile' },
  { icon: 'cpu',      title: 'Hệ thống quản trị',             desc: 'Dashboard, CRM, ERP, hệ thống đặt hàng, multi-tenant. Viết riêng theo nghiệp vụ thực tế.', href: '/dich-vu/he-thong-quan-tri' },
  { icon: 'bot',      title: 'Tự động hoá & AI',              desc: 'Bot Zalo/Telegram, ChatGPT/Claude integration, scraping, workflow automation, n8n custom node.', href: '/dich-vu#automation' },
  { icon: 'wrench',   title: 'Bảo trì & nâng cấp',            desc: 'Tiếp nhận website cũ, khắc phục lỗi, tối ưu hiệu năng, chuyển host, cấu hình SSL, hỗ trợ kỹ thuật theo gói tháng.', href: '/dich-vu#maintenance' },
  { icon: 'brush',    title: 'UI/UX design',                  desc: 'Figma mockup, design system, prototype tương tác, asset bundle. Bàn giao Figma + spec đầy đủ.', href: '/dich-vu#design' },
]

// Industries Alodev has actually shipped to. Each item ties back to a real
// project in the portfolio so prospects can verify domain experience —
// matches anti-fabrication memory (no fake clients).
const industries: Array<{ tag: string; name: string; desc: string; examples: string }> = [
  { tag: 'EDU',         name: 'Giáo dục online',        desc: 'Khoá học, ngân hàng đề, đấu trường lý thuyết, livestream multi-platform.', examples: 'OnThi365' },
  { tag: 'NEWS',        name: 'Tin tức & Truyền thông', desc: 'Multi-site CMS, edge cache, sitemap động, AdSense / DFP integration.', examples: 'gần Đây · VN247 · Thị trường Kinh tế · Hồng Biên Đường Phố' },
  { tag: 'COMMERCE',    name: 'E-commerce',             desc: 'Catalogue, đơn hàng, payment gateway, multi-tenant, voucher / loyalty.', examples: 'Shop Acc Game · Lammmo' },
  { tag: 'INTERNAL',    name: 'Hệ thống nội bộ',        desc: 'Dashboard fleet, CRM, đặt hàng, kho, batch job, monitoring.', examples: 'Datacenter (nội bộ alodev fleet)' },
  { tag: 'AUTOMATION',  name: 'Tools / Automation',     desc: 'Bot, scraping, workflow, AI integration, content automation.', examples: 'Lammmo · các tools nội bộ fleet' },
  { tag: 'PERSONAL',    name: 'Personal brand',         desc: 'Trang cá nhân founder, portfolio, blog, internal tools.', examples: 'trancongthang.com' },
]

// Stack groups — mirror StackStrip on home but condensed. Tinted with
// tech-cyan via the new palette so this page reads as the technical
// reference document its capability-profile role demands.
const stackGroups: Array<{ label: string; items: string[] }> = [
  { label: 'Frontend',  items: ['Next.js 16', 'React 19', 'Vue / Nuxt', 'SwiftUI', 'Compose', 'Tailwind v4'] },
  { label: 'Backend',   items: ['Node.js', 'NestJS', 'Express', 'Spring Boot', 'Django', 'FastAPI'] },
  { label: 'Database',  items: ['PostgreSQL', 'MySQL', 'Redis', 'ClickHouse', 'Cloudflare D1'] },
  { label: 'Mobile',    items: ['Swift', 'Kotlin', 'Flutter', 'React Native', 'Capacitor'] },
  { label: 'Infra',     items: ['AWS', 'Cloudflare', 'Docker', 'PM2', 'Nginx', 'CF Tunnel'] },
]

// SLA / quality commitments — concrete, contractually-binding promises.
// Each one is observable by the customer (PageSpeed score, uptime URL,
// warranty period). Avoids vague language like "high quality" — the whole
// point of a capability statement is that the buyer can hold us to these.
const commitments: Array<{ icon: IconName; title: string; desc: string }> = [
  { icon: 'gauge',        title: 'PageSpeed 90+ (P95)',      desc: 'Mọi trang public ≥ 90 điểm Lighthouse Mobile sau bàn giao. Có report kèm hợp đồng.' },
  { icon: 'shield-check', title: 'Uptime 99.9%+',            desc: 'Hạ tầng cloud + monitoring 24/7 + auto-rollback. Có uptime URL công khai để tự kiểm tra.' },
  { icon: 'clock',        title: 'Trễ deadline → giảm 5%/tuần', desc: 'Ngày bàn giao ghi rõ trong hợp đồng. Trễ do Alodev → tự động giảm 5% giá trị/tuần.' },
  { icon: 'life-buoy',    title: 'Bảo hành 6–12 tháng',      desc: 'Mọi bug do Alodev gây ra → khắc phục miễn phí trong thời gian bảo hành. Không thủ tục phức tạp.' },
  { icon: 'package',      title: 'Source code 100% thuộc khách', desc: 'Repo Git, database, domain và hosting đứng tên bạn. Bàn giao tài liệu kỹ thuật đầy đủ — đội của bạn có thể tiếp nhận bảo trì liền mạch.' },
  { icon: 'message-circle', title: 'Phản hồi < 24h',         desc: 'Mọi câu hỏi / báo giá / bug report — phản hồi trong 24h giờ làm việc. Founder trực tiếp, không qua sales.' },
  { icon: 'handshake',    title: 'Không lock-in, không phí ẩn', desc: 'Báo giá chi tiết theo hạng mục. Không phí license, không charge "renewal" bắt buộc.' },
]

// Featured 6 projects for the capability profile — diverse industries to
// demonstrate breadth (edu / news / commerce / internal / automation).
// Pulled from the canonical projects.ts source so portfolio + about stay
// in sync; the 6 chosen here cover all 6 industry slices above.
const featuredSlugs = ['onthi365', 'ganday', 'shopaccgame', 'datacenter', 'vn247', 'lammmo']
const featured = featuredSlugs
  .map((s) => projects.find((p) => p.slug === s))
  .filter((p): p is NonNullable<typeof p> => Boolean(p))

// ─── Page ───────────────────────────────────────────────────────────────

export default function VeChungToiPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Về chúng tôi', url: '/ve-chung-toi' },
        ]),
        aboutPageSchema({
          name: 'Về Alodev — Hồ sơ năng lực founder-led studio',
          description: 'Hồ sơ năng lực Alodev: thông tin pháp lý, lĩnh vực hoạt động, stack công nghệ, cam kết SLA và đội ngũ founder-led tại Hà Nội.',
        }),
        founderPersonSchema(),
      ]} />

      {/* HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-ink-950">
        <div className="aurora opacity-50" />
        <div className="absolute inset-0 grid-bg grid-bg-fade opacity-50" />
        <div className="hero-rise relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 lg:pt-28 lg:pb-20">
          <Eyebrow>Hồ sơ năng lực</Eyebrow>
          <h1 className="h-display mt-4 text-ink-900 dark:text-white max-w-4xl">
            Một founder, một studio,<br />
            <span>11+ sản phẩm đang vận hành.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-ink-400 max-w-3xl leading-relaxed">
            Alodev khác đa số agency Việt Nam ở một điểm cụ thể: chúng tôi <b className="text-gray-900 dark:text-white">tự phát triển và vận hành</b> 11+ sản phẩm
            trong các ngành giáo dục, tin tức, e-commerce và automation. Đây không phải case study mượn — đây là các sản phẩm Alodev
            đang trực tiếp theo dõi uptime, khắc phục lỗi và tối ưu liên tục. Khi bạn ký hợp đồng với Alodev,
            người ký là người đang vận hành 11 sản phẩm đó.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <QuoteCTA size="md">Yêu cầu báo giá</QuoteCTA>
            <a
              href="#thong-tin-chung"
              className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 px-5 py-3 text-ink-900 dark:text-white text-sm font-semibold hover:bg-cream-50 dark:hover:bg-ink-800 transition"
            >
              <Icon name="file-text" className="w-4 h-4" />
              Xem hồ sơ năng lực
            </a>
          </div>
        </div>
      </section>

      {/* STATS ─────────────────────────────────────────────────────────── */}
      <section className="py-10 lg:py-16 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 dark:bg-ink-800 rounded-2xl border border-gray-200 dark:border-ink-800 overflow-hidden">
            {stats.map((s) => (
              <div key={s.label} className="bg-white dark:bg-ink-950 px-5 py-7 text-center">
                <div className="tabular text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {s.num}<span className="text-base font-medium text-gray-500 dark:text-ink-500 ml-1">{s.unit}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-ink-400 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THÔNG TIN CHUNG (NEW) — quick-reference identity card.
          B2B procurement / due-diligence teams expect a "one-glance" summary
          panel with founder, address, contact, scope. This replaces the
          missing legal/contact card that a Vietnamese hồ sơ năng lực
          standard requires. Listed only truthful fields — see
          identityRows comment for rationale. */}
      <section id="thong-tin-chung" className="py-10 lg:py-24 bg-white dark:bg-ink-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal max-w-2xl mb-8 lg:mb-12">
            <Eyebrow>Thông tin chung</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">Hồ sơ doanh nghiệp.</h2>
            <p className="mt-4 text-gray-600 dark:text-ink-400 leading-relaxed">
              Một bảng tham chiếu nhanh cho team mua sắm / pháp chế của bạn — ai, ở đâu, liên hệ thế nào.
            </p>
          </div>
          <div className="reveal grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 dark:bg-ink-800 rounded-2xl border border-gray-200 dark:border-ink-800 overflow-hidden">
            {identityRows.map((row) => (
              <div key={row.label} className="bg-white dark:bg-ink-950 px-5 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 dark:text-ink-500 font-mono">{row.label}</div>
                <div className="mt-1.5 text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                  {row.href ? (
                    <a
                      href={row.href}
                      target={row.href.startsWith('http') ? '_blank' : undefined}
                      rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="hover:text-brand-600 dark:hover:text-brand-400 transition inline-flex items-center gap-1.5"
                    >
                      {row.value}
                      {row.href.startsWith('http') && <Icon name="arrow-up-right" className="w-3.5 h-3.5 opacity-60" />}
                    </a>
                  ) : (
                    row.value
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES (existing) — Nguyên tắc làm việc */}
      <section className="py-10 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal max-w-2xl">
            <Eyebrow>Nguyên tắc</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">Bốn nguyên tắc làm việc.</h2>
            <p className="mt-5 text-gray-600 dark:text-ink-400">
              Không có process 50 trang, không có &ldquo;client onboarding ceremony&rdquo;. Chỉ có bốn nguyên tắc Alodev áp dụng trên mọi dự án.
            </p>
          </div>
          <div className="reveal-stagger mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
            {principles.map((p) => (
              <div key={p.title} className="lift spotlight rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-7">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-cream-100 dark:bg-ink-800 text-ink-700 dark:text-ink-100">
                  <Icon name={p.icon} className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink-900 dark:text-white">{p.title}</h3>
                <p className="mt-2 text-ink-500 dark:text-ink-300 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LĨNH VỰC HOẠT ĐỘNG (NEW) — what services + which industries.
          Two grids in one section: services (what we build) and industries
          (who we've shipped to). Each industry ties back to a real project
          in the canonical fleet — anti-fabrication: every tag here maps to
          a specific running site in projects.ts. */}
      <section className="py-10 lg:py-24 bg-white dark:bg-ink-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* — Services — */}
          <div className="reveal max-w-2xl">
            <Eyebrow>Lĩnh vực hoạt động</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">Phạm vi dịch vụ Alodev triển khai.</h2>
            <p className="mt-4 text-gray-600 dark:text-ink-400 leading-relaxed">
              Sáu nhóm dịch vụ — từ landing page đến hệ thống đa nền tảng. Mỗi dự án có hợp đồng riêng, không bundle ép buộc.
            </p>
          </div>
          <div className="reveal-stagger mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 hover:border-brand-300 dark:hover:border-brand-500/40 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cream-100 dark:bg-ink-800 text-ink-700 dark:text-ink-100">
                    <Icon name={s.icon} className="w-5 h-5" />
                  </div>
                  <Icon name="arrow-up-right" className="w-4 h-4 text-ink-300 dark:text-ink-700 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>

          {/* — Industries — */}
          <div className="reveal max-w-2xl mt-16 lg:mt-24">
            <Eyebrow>Ngành phục vụ</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">Sáu ngành Alodev đã triển khai sản phẩm vận hành.</h2>
            <p className="mt-4 text-gray-600 dark:text-ink-400 leading-relaxed">
              Không phải &ldquo;capability claim&rdquo; — mỗi ngành dưới đây có ít nhất 1 sản phẩm Alodev tự vận hành đang chạy live.
            </p>
          </div>
          <div className="reveal-stagger mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {industries.map((ind) => (
              <div key={ind.name} className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-cream-50 dark:bg-ink-900 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-tech-700 dark:text-tech-400 font-mono">{ind.tag}</div>
                <h3 className="mt-2 text-base font-bold text-ink-900 dark:text-white">{ind.name}</h3>
                <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{ind.desc}</p>
                <div className="mt-3 pt-3 border-t border-ink-100 dark:border-ink-800 text-xs text-ink-400 dark:text-ink-500 font-mono">{ind.examples}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK CÔNG NGHỆ (NEW) — categorized stack on this page so the
          capability profile is self-contained (homepage StackStrip exists
          but a profile reader shouldn't need to context-switch). Tech-cyan
          tinted to match the new design system's "code-y text" treatment. */}
      <section className="py-10 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal max-w-2xl">
            <Eyebrow>Stack công nghệ</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">Công cụ đang dùng.</h2>
            <p className="mt-4 text-gray-600 dark:text-ink-400 leading-relaxed">
              Stack chọn theo nghiệp vụ thực tế của bạn, không chạy theo trend. Mỗi quyết định kỹ thuật đều có lý do giải thích được trong tài liệu bàn giao.
            </p>
          </div>
          <div className="reveal-stagger mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {stackGroups.map((g) => (
              <div key={g.label} className="rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-ink-500 mb-3">{g.label}</div>
                <ul className="space-y-1.5">
                  {g.items.map((it) => (
                    <li key={it} className="font-mono text-sm text-tech-800 dark:text-tech-300">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAM KẾT CHẤT LƯỢNG (NEW) — concrete SLA-style commitments that
          go into the contract. The whole point of a capability profile is
          that the buyer can hold us accountable; vague language ("high
          quality") fails this test, observable terms ("PageSpeed ≥ 90",
          "trễ → -5%/tuần") pass it. */}
      <section className="py-10 lg:py-24 bg-white dark:bg-ink-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal max-w-2xl">
            <Eyebrow>Cam kết chất lượng</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">Bảy cam kết được ghi vào hợp đồng.</h2>
            <p className="mt-4 text-gray-600 dark:text-ink-400 leading-relaxed">
              Không phải khẩu hiệu — đây là điều khoản đo được, có hậu quả nếu Alodev không giữ được.
            </p>
          </div>
          <div className="reveal-stagger mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
            {commitments.map((c) => (
              <div key={c.title} className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-cream-50 dark:bg-ink-900 p-5 flex gap-4">
                <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400">
                  <Icon name={c.icon} className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink-900 dark:text-white">{c.title}</h3>
                  <p className="mt-1 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE (existing) — Hành trình */}
      <section className="py-10 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal max-w-xl mx-auto text-center">
            <Eyebrow>Hành trình</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">Năm năm fleet operation.</h2>
          </div>
          <div className="reveal-stagger mt-14 relative">
            <div className="absolute left-[2.75rem] sm:left-[3.5rem] top-1 bottom-1 w-px bg-gray-200 dark:bg-ink-800" />
            {milestones.map((m) => (
              <div key={m.year} className="relative pl-20 sm:pl-24 pb-8 last:pb-0">
                <div className="absolute left-0 top-0 w-20 sm:w-24 text-right">
                  <span className="tabular text-xl font-bold text-gray-900 dark:text-white font-mono">{m.year}</span>
                </div>
                <div className="absolute left-[2.5rem] sm:left-[3.25rem] top-2 w-2.5 h-2.5 rounded-full bg-brand-600 dark:bg-brand-400 ring-4 ring-slate-50 dark:ring-zinc-950" />
                <p className="text-gray-700 dark:text-ink-300 leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM TRANSPARENCY (existing, expanded) — Founder + đội ngũ */}
      <section id="founder" className="scroll-mt-20 py-10 lg:py-24 bg-white dark:bg-ink-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal rounded-3xl border border-ink-100 dark:border-ink-800 bg-cream-50 dark:bg-ink-900 p-8 lg:p-10">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400">
              <Icon name="handshake" className="w-5 h-5" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-ink-900 dark:text-white">Đội ngũ — minh bạch về quy mô</h2>
            <div className="mt-4 space-y-4 text-gray-700 dark:text-ink-300 leading-relaxed">
              <p>
                Alodev là <b>founder-led studio</b> — một người chịu trách nhiệm chính cho kiến trúc, code và vận hành.
                Khi dự án cần, đội mở rộng với cộng tác viên thiết kế hoặc mobile dev — gắn theo từng dự án, không tuyển full-time.
              </p>
              <p>
                Điều này có nghĩa: <b className="text-gray-900 dark:text-white">bạn không phải đi qua sales rep, PM hay account manager</b>.
                Bạn trao đổi trực tiếp với người trực tiếp viết code — tiết kiệm thời gian briefing, không &ldquo;tam sao thất bản&rdquo;.
              </p>
              <p>
                Trade-off: Alodev <b>không phải agency 50 người</b>. Mỗi quý chỉ nhận 3–5 dự án để đảm bảo chất lượng và deadline. Nếu bạn cần đội 20 dev cho một dự án enterprise dài 12 tháng — Alodev không phù hợp. Nếu bạn cần một sản phẩm chất lượng, bàn giao đúng hạn, code sạch để team của bạn tiếp nhận bảo trì — đây là đúng nơi.
              </p>
              <p>
                Founder: <b className="text-gray-900 dark:text-white">Trần Công Thắng</b>. Hơn 5 năm phát triển và vận hành 11 sản phẩm trong fleet alodev (giáo dục, tin tức, e-commerce, automation, internal tools). Stack chủ đạo: Next.js / Node / Postgres / Cloudflare. Chuyên xử lý các bài toán nghiệp vụ phức tạp: livestream multi-platform, real-time PvP, multi-tenant CMS, fleet monitoring.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <QuoteCTA size="md">Trao đổi với founder</QuoteCTA>
              <Link href="/du-an" className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 px-5 py-3 text-ink-900 dark:text-white text-sm font-semibold hover:bg-cream-50 dark:hover:bg-ink-700 transition">
                Xem 11 sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HỒ SƠ DỰ ÁN TIÊU BIỂU (NEW) — featured 6 projects spanning all
          industries above. Mini-card grid links to /du-an/[slug] for full
          case study. Uses canonical projects.ts data so portfolio + about
          stay in sync. */}
      <section className="py-10 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal flex items-end justify-between flex-wrap gap-4 mb-8 lg:mb-12">
            <div className="max-w-2xl">
              <Eyebrow>Hồ sơ dự án tiêu biểu</Eyebrow>
              <h2 className="h-section mt-3 text-gray-900 dark:text-white">Sáu sản phẩm đại diện cho sáu ngành.</h2>
              <p className="mt-4 text-gray-600 dark:text-ink-400 leading-relaxed">
                Mỗi dự án là một sản phẩm Alodev tự phát triển và vận hành. Mở chi tiết để xem case study với metrics đo được và lý do quyết định kỹ thuật.
              </p>
            </div>
            <Link
              href="/du-an"
              className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1"
            >
              Xem tất cả 11 dự án
              <Icon name="arrow-right" className="w-4 h-4" />
            </Link>
          </div>
          <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((p) => (
              <Link
                key={p.slug}
                href={`/du-an/${p.slug}`}
                className="lift spotlight group rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden hover:border-gray-300 dark:hover:border-ink-700 hover:shadow-xl hover:shadow-brand-500/10 transition"
              >
                <div className={`relative aspect-[16/10] bg-gradient-to-br ${p.colorClass} flex items-center justify-center overflow-hidden`}>
                  <div className="text-center px-4">
                    <div className="text-xl font-bold text-gray-700 dark:text-ink-200 dark:opacity-90">{p.name}</div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-ink-400 font-mono">{p.domain}</div>
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 dark:bg-ink-900/70 backdrop-blur text-gray-700 dark:text-ink-300 font-semibold">
                    {p.category.split('·')[0].trim()}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-600 dark:text-ink-400 line-clamp-2 leading-relaxed">{p.shortDesc}</p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {p.code.stack.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-tech-50 dark:bg-tech-900/30 text-tech-700 dark:text-tech-300 font-medium font-mono ring-1 ring-tech-100 dark:ring-tech-800/40"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA (NEW) — close out the capability profile with a clear
          next-step funnel. Two paths: (1) immediate quote request for
          warm leads, (2) Zalo for prospects who want a chat first. */}
      <section className="relative py-12 lg:py-24 bg-white dark:bg-ink-950 overflow-hidden">
        <div className="aurora opacity-50" />
        <div className="reveal relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eyebrow>Kết nối</Eyebrow>
          <h2 className="h-section mt-4 text-gray-900 dark:text-white">
            Đã đọc hết hồ sơ năng lực?
          </h2>
          <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-ink-400 leading-relaxed">
            Bước tiếp theo tuỳ bạn — gửi yêu cầu báo giá để nhận phản hồi chi tiết trong 24h, hoặc chat Zalo nếu muốn trao đổi nhanh trước khi commit.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
            <QuoteCTA size="lg" className="px-7 py-4 w-full sm:w-auto justify-center">Yêu cầu báo giá</QuoteCTA>
            <a
              href="https://zalo.me/0364234936"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 px-7 py-4 text-ink-900 dark:text-white font-semibold hover:border-ink-300 dark:hover:border-ink-700 transition w-full sm:w-auto"
            >
              <Icon name="message-circle" className="w-5 h-5" />
              Chat Zalo
            </a>
          </div>
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

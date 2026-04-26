import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import Icon, { type IconName } from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata = {
  title: 'Về Alodev — Founder-led studio web/app',
  description: 'Alodev là founder-led studio: 5+ năm tự build và tự vận hành 11+ sản phẩm trong giáo dục, tin tức, e-commerce, hệ thống quản trị. Bạn làm việc trực tiếp với người code.',
  alternates: { canonical: '/ve-chung-toi' },
  openGraph: { url: '/ve-chung-toi', title: 'Về Alodev — Founder-led studio', description: '5+ năm fleet operation, 11+ sản phẩm thật. Bạn chat trực tiếp với founder.' },
}

const principles: Array<{ icon: IconName; title: string; desc: string }> = [
  { icon: 'target',  title: 'Honest by default',   desc: 'Không phóng đại số liệu, không testimonials chế. Báo giá rõ, deadline rõ, ai code dự án bạn cũng rõ.' },
  { icon: 'wrench',  title: 'Build to last',        desc: 'Code phải đọc được sau 3 năm. Stack chọn theo nghiệp vụ, không theo trend hot tuần này.' },
  { icon: 'package', title: 'You own everything',   desc: 'Source code, database, domain, hosting — tất cả đứng tên bạn. Không vendor lock-in.' },
  { icon: 'rocket',  title: 'Ship, then iterate',   desc: 'Bàn giao MVP đúng hạn rồi cải tiến. Không "perfect product" delay 6 tháng. Real users > fake polish.' },
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

export default function VeChungToiPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Trang chủ', url: '/' },
        { name: 'Về chúng tôi', url: '/ve-chung-toi' },
      ])} />

      <section className="relative overflow-hidden bg-white dark:bg-ink-950">
        <div className="aurora opacity-50" />
        <div className="absolute inset-0 grid-bg grid-bg-fade opacity-50" />
        <div className="hero-rise relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 lg:pt-28 lg:pb-20">
          <Eyebrow>Về chúng tôi</Eyebrow>
          <h1 className="h-display mt-4 text-ink-900 dark:text-white max-w-4xl">
            Một founder, một studio,<br />
            <span className="relative inline-block">
              <span>11+ sản phẩm vận hành thật</span>
              <svg aria-hidden="true" className="absolute left-0 right-0 bottom-[-0.18em] w-full text-brand-500 dark:text-brand-400" viewBox="0 0 600 14" fill="none" preserveAspectRatio="none">
                <path d="M2 9 Q 150 2 300 7 T 598 5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
            <span>.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-ink-400 max-w-3xl leading-relaxed">
            Alodev khác đa số agency Việt Nam: chúng tôi <b className="text-gray-900 dark:text-white">tự build &amp; tự vận hành</b> 11+ sản phẩm
            trong các ngành giáo dục, tin tức, e-commerce, automation. Đây không phải case study mượn — đây là sản phẩm chúng tôi
            đang ngày đêm theo dõi uptime, vá lỗi, optimize. Khi bạn thuê Alodev, bạn không thuê sales rep — bạn thuê chính người
            đang vận hành 11 sản phẩm sống đó.
          </p>
        </div>
      </section>

      {/* Stats */}
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

      {/* Principles */}
      <section className="py-14 lg:py-24 bg-white dark:bg-ink-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal max-w-2xl">
            <Eyebrow>Nguyên tắc</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">4 nguyên tắc làm việc.</h2>
            <p className="mt-5 text-gray-600 dark:text-ink-400">
              Không có process 50 trang. Không có &ldquo;client onboarding ceremony&rdquo;. Chỉ có 4 thứ Alodev cam kết với mọi dự án.
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

      {/* Timeline */}
      <section className="py-14 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal max-w-xl mx-auto text-center">
            <Eyebrow>Hành trình</Eyebrow>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">5 năm fleet operation.</h2>
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

      {/* Team transparency */}
      <section className="py-14 lg:py-24 bg-white dark:bg-ink-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal rounded-3xl border border-ink-100 dark:border-ink-800 bg-cream-50 dark:bg-ink-900 p-8 lg:p-10">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400">
              <Icon name="handshake" className="w-5 h-5" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-ink-900 dark:text-white">Sự thật về &quot;đội&quot;</h2>
            <div className="mt-4 space-y-4 text-gray-700 dark:text-ink-300 leading-relaxed">
              <p>
                Alodev là <b>founder-led studio</b> — tức là 1 người chịu trách nhiệm chính cho kiến trúc, code, vận hành.
                Khi cần, có thêm cộng tác viên thiết kế / mobile dev tham gia theo từng dự án (project-based, không hire full-time).
              </p>
              <p>
                Điều này có nghĩa: <b className="text-gray-900 dark:text-white">bạn không bao giờ phải qua sales rep, qua PM, qua account manager</b>.
                Bạn chat thẳng với người sẽ code dự án bạn. Tiết kiệm thời gian briefing, không &ldquo;tam sao thất bản&rdquo;.
              </p>
              <p>
                Trade-off: chúng tôi <b>không phải agency 50 người</b>. Mỗi quý chỉ nhận 3–5 dự án để đảm bảo chất lượng và deadline. Nếu bạn cần đội 20 dev cho 1 dự án enterprise dài 12 tháng — Alodev không phù hợp. Nếu bạn cần 1 sản phẩm chất lượng, ship đúng hạn, code sạch để team bạn maintain tiếp — đúng nơi rồi.
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

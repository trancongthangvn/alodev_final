import JsonLd from '@/components/JsonLd'
import Icon, { type IconName } from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'
import Link from 'next/link'
import { serviceSchema, breadcrumbSchema, collectionPageSchema } from '@/lib/schema'
import MagazineLayout from '@/components/layout/MagazineLayout'

const toc = [
  { num: '01', name: 'Khởi điểm',    hash: '#hero' },
  { num: '02', name: 'Cam kết',      hash: '#cam-ket' },
  { num: '03', name: 'Website',      hash: '#website' },
  { num: '04', name: 'App Mobile',   hash: '#mobile' },
  { num: '05', name: 'Hệ thống QT',  hash: '#system' },
  { num: '06', name: 'AI / Bot',     hash: '#ai' },
  { num: '07', name: 'Bảo trì',      hash: '#maintenance' },
  { num: '08', name: 'Tư vấn',       hash: '#cta' },
]

export const metadata = {
  title: 'Dịch vụ & bảng giá thiết kế web/app',
  description: 'Bảng giá 6 nhóm dịch vụ Alodev: website, app mobile, CRM/ERP, AI, bảo trì, UI/UX. Mức giá khởi điểm minh bạch - báo giá chi tiết trong 24h.',
  alternates: { canonical: '/dich-vu' },
  keywords: [
    'dịch vụ thiết kế website',
    'lập trình app mobile',
    'hệ thống CRM ERP',
    'báo giá website',
    'thiết kế web doanh nghiệp',
    'app iOS Android',
    'studio website Việt Nam',
    'Alodev',
  ],
  openGraph: { url: '/dich-vu', title: 'Dịch vụ & bảng giá - Alodev', description: 'Báo giá rõ ràng cho 6 nhóm dịch vụ Alodev - website, app, hệ thống, AI, bảo trì, UI/UX.' },
}

const packages = [
  {
    id: 'website',
    icon: 'globe' as IconName,
    name: 'Website',
    tagline: 'Landing page · Website doanh nghiệp · E-commerce',
    from: 'Từ 8 triệu',
    tiers: [
      { name: 'Cơ bản', price: 'Từ 8 triệu', deliverables: ['Landing 1 trang', 'Mobile responsive', 'Form liên hệ', 'Bàn giao 7–10 ngày'] },
      { name: 'Doanh nghiệp', price: 'Từ 18 triệu', deliverables: ['5–10 trang', 'CMS đăng bài', 'SEO on-page', 'Tích hợp Analytics + Pixel', 'Bàn giao 3–4 tuần'], popular: true },
      { name: 'Thương mại điện tử', price: 'Từ 35 triệu', deliverables: ['Sản phẩm + giỏ hàng', 'Thanh toán VNPAY/MoMo', 'Quản lý đơn + kho', 'Bàn giao 6–8 tuần'] },
    ],
  },
  {
    id: 'mobile',
    icon: 'phone' as IconName,
    name: 'App Mobile',
    tagline: 'iOS · Android · Cross-platform',
    from: 'Từ 60 triệu',
    tiers: [
      { name: 'MVP', price: 'Từ 60 triệu', deliverables: ['React Native / Flutter', 'Login + 5–7 màn hình', 'Push notification', 'Bàn giao 6–8 tuần'] },
      { name: 'Production', price: 'Từ 120 triệu', deliverables: ['Native Swift/Kotlin', 'Tích hợp thanh toán', 'Analytics + Crashlytics', 'Đẩy lên App Store + Play Store'], popular: true },
      { name: 'Custom', price: 'Báo giá theo scope', deliverables: ['IoT/BLE/AR/ML', 'Phân tích yêu cầu chuyên sâu', 'Hợp đồng theo giai đoạn'] },
    ],
  },
  {
    id: 'system',
    icon: 'cpu' as IconName,
    name: 'Hệ thống quản trị',
    tagline: 'CRM · ERP · Dashboard nội bộ',
    from: 'Từ 25 triệu',
    tiers: [
      { name: 'Dashboard', price: 'Từ 25 triệu', deliverables: ['Auth + phân quyền', 'CRUD core entities', 'Thống kê biểu đồ', 'Bàn giao 4–6 tuần'] },
      { name: 'CRM/ERP', price: 'Từ 80 triệu', deliverables: ['Quản lý khách hàng', 'Quản lý đơn + kho + công nợ', 'Báo cáo tự động', 'Phân quyền nhiều cấp'], popular: true },
      { name: 'Custom workflow', price: 'Báo giá theo scope', deliverables: ['Phân tích nghiệp vụ', 'Tích hợp hệ thống cũ', 'Migration data'] },
    ],
  },
  {
    id: 'automation',
    icon: 'bot' as IconName,
    name: 'Tự động hoá & AI',
    tagline: 'Bot · Scraping · LLM tích hợp',
    from: 'Từ 5 triệu',
    tiers: [
      { name: 'Bot Zalo/Telegram', price: 'Từ 5 triệu', deliverables: ['Trả lời tự động', 'Tích hợp với hệ thống nội bộ', 'Báo cáo realtime'] },
      { name: 'Tích hợp AI', price: 'Từ 15 triệu', deliverables: ['ChatGPT / Claude API', 'RAG trên dữ liệu của bạn', 'Cost tracking'], popular: true },
      { name: 'Workflow tự động', price: 'Báo giá theo scope', deliverables: ['Cron jobs', 'Scraping định kỳ', 'Pipeline ETL'] },
    ],
  },
  {
    id: 'maintenance',
    icon: 'wrench' as IconName,
    name: 'Bảo trì & nâng cấp',
    tagline: 'Tiếp nhận hệ thống cũ · Hỗ trợ theo tháng',
    from: '0đ',
    tiers: [
      { name: 'Audit miễn phí', price: '0đ', deliverables: ['Khảo sát hiện trạng', 'Báo cáo lỗi + đề xuất', 'Không cam kết tiếp tục'] },
      { name: 'Gói tháng', price: 'Từ 1 triệu/tháng', deliverables: ['Theo dõi uptime 24/7', 'Backup tự động', 'Sửa lỗi nhỏ', 'Báo cáo hàng tháng'], popular: true },
      { name: 'Nâng cấp lớn', price: 'Báo giá theo scope', deliverables: ['Đổi giao diện', 'Tăng tốc / refactor', 'Chuyển host'] },
    ],
  },
  {
    id: 'design',
    icon: 'brush' as IconName,
    name: 'Thiết kế UI/UX',
    tagline: 'Figma · Design system · Prototype',
    from: 'Từ 3 triệu',
    tiers: [
      { name: 'Wireframe', price: 'Từ 3 triệu', deliverables: ['Sitemap + flow', 'Wireframe low-fidelity', 'Bàn giao Figma'] },
      { name: 'Hi-fi mockup', price: 'Từ 8 triệu', deliverables: ['Toàn bộ màn hình', 'Design system cơ bản', 'Prototype tương tác'], popular: true },
      { name: 'Design system', price: 'Từ 20 triệu', deliverables: ['Token + component library', 'Documentation', 'Hỗ trợ dev triển khai'] },
    ],
  },
]

const guarantees = [
  { icon: 'file-text' as IconName, label: 'Hợp đồng rõ ràng', desc: 'Milestone + điều khoản bằng văn bản' },
  { icon: 'receipt' as IconName, label: 'Hoá đơn VAT', desc: 'Xuất VAT đầy đủ' },
  { icon: 'code' as IconName, label: 'Sở hữu mã nguồn', desc: 'Bàn giao toàn bộ, không vendor lock-in' },
  { icon: 'shield' as IconName, label: 'Bảo hành 6–12 tháng', desc: 'Hỗ trợ kỹ thuật sau bàn giao' },
  { icon: 'calendar' as IconName, label: 'Demo hàng tuần', desc: 'Theo dõi tiến độ theo milestone' },
]

export default function DichVuPage() {
  return (
    <MagazineLayout toc={toc} tagline={<>Đúng dịch vụ.<br />Đúng ngân sách.</>}>
      <JsonLd data={[
        breadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Dịch vụ', url: '/dich-vu' },
        ]),
        collectionPageSchema({
          name: 'Dịch vụ Alodev - Web · App · Hệ thống · AI · Bảo trì · UI/UX',
          description: 'Sáu nhóm dịch vụ Alodev với mức giá khởi điểm minh bạch. Click vào từng dịch vụ để xem chi tiết và bảng giá theo gói.',
          url: '/dich-vu',
          items: packages.map((p) => ({
            name: `${p.name} - ${p.tagline}`,
            url: ['website','mobile','system'].includes(p.id)
              ? `/dich-vu/${p.id === 'website' ? 'thiet-ke-website' : p.id === 'mobile' ? 'lap-trinh-app-mobile' : 'he-thong-quan-tri'}`
              : `/dich-vu#${p.id}`,
            description: `${p.name}. ${p.tagline}. Mức giá khởi điểm: ${p.tiers[0].price}.`,
          })),
        }),
        ...packages.map((p) => serviceSchema({
          name: `${p.name} - ${p.tagline}`,
          description: `${p.name}. Các gói: ${p.tiers.map((t) => `${t.name} (${t.price})`).join(', ')}.`,
          url: `/dich-vu#${p.id}`,
        })),
      ]} />

      {/* ── HERO ── */}
      <section id="hero" className="mag-section mag-bg-paper relative overflow-hidden border-b border-gray-100 dark:border-ink-800">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-24">
          <p className="mag-section-index">Dịch vụ &amp; bảng giá</p>
          <h1 className="mag-section-head max-w-3xl">
            Đúng dịch vụ.<br />
            <span className="text-brand-600 dark:text-brand-400">Đúng ngân sách.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-ink-400 max-w-xl leading-relaxed">
            6 nhóm dịch vụ - website, app, CRM/ERP, AI, bảo trì, UI/UX. Giá khởi điểm công khai. Hợp đồng + VAT + bảo hành đi kèm.
          </p>

          {/* Quick jump chips */}
          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Nhóm dịch vụ">
            {packages.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-brand-400 dark:hover:border-brand-500 hover:text-brand-700 dark:hover:text-brand-400 px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:text-ink-300 transition"
              >
                <Icon name={p.icon} className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
                {p.name}
                <span className="text-xs text-gray-400 dark:text-ink-500">{p.from}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ── GUARANTEES STRIP ── */}
      <div id="cam-ket" className="bg-gray-50 dark:bg-ink-900 border-b border-gray-100 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-ink-500 mb-4">Bao gồm trong mọi gói</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {guarantees.map((g) => (
              <div key={g.label} className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <Icon name={g.icon} className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{g.label}</div>
                  <div className="text-xs text-gray-500 dark:text-ink-500 mt-0.5 leading-snug">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICE SECTIONS ── */}
      <div className="bg-white dark:bg-ink-950">
        {packages.map((pkg, pkgIdx) => (
          <section
            key={pkg.id}
            id={pkg.id}
            className={`scroll-mt-20 border-b border-gray-100 dark:border-ink-800/60 ${pkgIdx % 2 !== 0 ? 'bg-gray-50/50 dark:bg-ink-900/30' : ''}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              {/* Section header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl border border-gray-200 dark:border-ink-700 bg-white dark:bg-ink-900 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm">
                    <Icon name={pkg.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="mag-section-head">{pkg.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-ink-400 mt-0.5">{pkg.tagline}</p>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-xs text-gray-400 dark:text-ink-500 uppercase tracking-widest mb-0.5">Khởi điểm từ</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{pkg.from}</div>
                </div>
              </div>

              {/* Tier cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {pkg.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`relative rounded-2xl border p-5 lg:p-6 flex flex-col transition-shadow ${
                      tier.popular
                        ? 'border-brand-400 dark:border-brand-500 bg-brand-50/40 dark:bg-brand-500/[0.06] shadow-[0_0_0_1px_rgba(59,130,246,0.15)]'
                        : 'border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-gray-300 dark:hover:border-ink-700'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                          Phổ biến nhất
                        </span>
                      </div>
                    )}
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-ink-400 mb-2">{tier.name}</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white mb-5">{tier.price}</div>
                    <ul className="space-y-2.5 flex-1">
                      {tier.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-gray-700 dark:text-ink-300">
                          <svg className="w-4 h-4 mt-0.5 shrink-0 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Detail page links for 3 main services */}
              {['website', 'mobile', 'system'].includes(pkg.id) && (
                <div className="mt-5">
                  <Link
                    href={`/dich-vu/${pkg.id === 'website' ? 'thiet-ke-website' : pkg.id === 'mobile' ? 'lap-trinh-app-mobile' : 'he-thong-quan-tri'}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition group"
                  >
                    Xem chi tiết dịch vụ {pkg.name.toLowerCase()}
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* ── CTA - theme-adaptive ── */}
      <section id="cta" className="mag-section mag-bg-tint py-12 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mag-section-head">Chưa biết cần gói nào?</h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-ink-400 max-w-xl leading-relaxed">
            Mô tả ngắn về dự án - Alodev tư vấn đúng scope, đúng ngân sách. Không mất phí tư vấn.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <QuoteCTA size="md" variant="solid">Tư vấn miễn phí</QuoteCTA>
            <a href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-ink-700 hover:border-gray-300 dark:hover:border-ink-500 hover:bg-gray-50 dark:hover:bg-ink-800 px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white transition">
              Chat Zalo →
            </a>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-ink-800 grid grid-cols-3 gap-6 max-w-sm">
            {[
              { v: '24h', l: 'Phản hồi' },
              { v: '11+', l: 'Dự án live' },
              { v: '100%', l: 'Mã nguồn' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{s.v}</div>
                <div className="text-[10px] sm:text-xs text-gray-500 dark:text-ink-500 uppercase tracking-wider mt-0.5 font-mono">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MagazineLayout>
  )
}

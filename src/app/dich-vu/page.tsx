import JsonLd from '@/components/JsonLd'
import Icon, { type IconName } from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'
import { serviceSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata = {
  title: 'Dịch vụ & bảng giá thiết kế web/app',
  description: 'Báo giá rõ ràng cho 6 nhóm dịch vụ Alodev: website, app mobile, hệ thống quản trị, tự động hoá AI, bảo trì, UI/UX. Nhận báo giá chi tiết miễn phí trong 24h.',
  alternates: { canonical: '/dich-vu' },
  openGraph: { url: '/dich-vu', title: 'Dịch vụ & bảng giá — Alodev', description: 'Báo giá rõ ràng cho 6 nhóm dịch vụ Alodev — website, app, hệ thống, AI, bảo trì, UI/UX.' },
}

const packages = [
  {
    id: 'website',
    icon: 'globe' as IconName,
    name: 'Website',
    tagline: 'Landing page · Website doanh nghiệp · E-commerce',
    tiers: [
      { name: 'Cơ bản', price: 'Từ 8 triệu', deliverables: ['Landing 1 trang', 'Mobile responsive', 'Form liên hệ', 'Bàn giao 7–10 ngày'] },
      { name: 'Doanh nghiệp', price: 'Từ 18 triệu', deliverables: ['5–10 trang', 'CMS đăng bài', 'SEO on-page', 'Tích hợp Analytics + Pixel', 'Bàn giao 3–4 tuần'] },
      { name: 'Thương mại điện tử', price: 'Từ 35 triệu', deliverables: ['Sản phẩm + giỏ hàng', 'Thanh toán VNPAY/MoMo', 'Quản lý đơn + kho', 'Bàn giao 6–8 tuần'] },
    ],
  },
  {
    id: 'mobile',
    icon: 'phone' as IconName,
    name: 'App Mobile',
    tagline: 'iOS · Android · Cross-platform',
    tiers: [
      { name: 'MVP', price: 'Từ 60 triệu', deliverables: ['React Native / Flutter', 'Login + 5–7 màn hình', 'Push notification', 'Bàn giao 6–8 tuần'] },
      { name: 'Production', price: 'Từ 120 triệu', deliverables: ['Native Swift/Kotlin', 'Tích hợp thanh toán', 'Analytics + Crashlytics', 'Đẩy lên App Store + Play Store'] },
      { name: 'Custom', price: 'Báo giá theo scope', deliverables: ['IoT/BLE/AR/ML', 'Phân tích yêu cầu chuyên sâu', 'Hợp đồng theo giai đoạn'] },
    ],
  },
  {
    id: 'system',
    icon: 'cpu' as IconName,
    name: 'Hệ thống quản trị',
    tagline: 'CRM · ERP · Dashboard nội bộ',
    tiers: [
      { name: 'Dashboard', price: 'Từ 25 triệu', deliverables: ['Auth + phân quyền', 'CRUD core entities', 'Thống kê biểu đồ', 'Bàn giao 4–6 tuần'] },
      { name: 'CRM/ERP', price: 'Từ 80 triệu', deliverables: ['Quản lý khách hàng', 'Quản lý đơn + kho + công nợ', 'Báo cáo tự động', 'Phân quyền nhiều cấp'] },
      { name: 'Custom workflow', price: 'Báo giá theo scope', deliverables: ['Phân tích nghiệp vụ', 'Tích hợp hệ thống cũ', 'Migration data'] },
    ],
  },
  {
    id: 'automation',
    icon: 'bot' as IconName,
    name: 'Tự động hoá & AI',
    tagline: 'Bot · Scraping · LLM tích hợp',
    tiers: [
      { name: 'Bot Zalo/Telegram', price: 'Từ 5 triệu', deliverables: ['Trả lời tự động', 'Tích hợp với hệ thống nội bộ', 'Báo cáo realtime'] },
      { name: 'Tích hợp AI', price: 'Từ 15 triệu', deliverables: ['ChatGPT / Claude API', 'RAG trên dữ liệu của bạn', 'Cost tracking'] },
      { name: 'Workflow tự động', price: 'Báo giá theo scope', deliverables: ['Cron jobs', 'Scraping định kỳ', 'Pipeline ETL'] },
    ],
  },
  {
    id: 'maintenance',
    icon: 'wrench' as IconName,
    name: 'Bảo trì & nâng cấp',
    tagline: 'Tiếp nhận hệ thống cũ · Hỗ trợ theo tháng',
    tiers: [
      { name: 'Audit miễn phí', price: '0đ', deliverables: ['Khảo sát hiện trạng', 'Báo cáo lỗi + đề xuất', 'Không cam kết tiếp tục'] },
      { name: 'Gói tháng', price: 'Từ 1 triệu/tháng', deliverables: ['Theo dõi uptime 24/7', 'Backup tự động', 'Sửa lỗi nhỏ', 'Báo cáo hàng tháng'] },
      { name: 'Nâng cấp lớn', price: 'Báo giá theo scope', deliverables: ['Đổi giao diện', 'Tăng tốc / refactor', 'Chuyển host'] },
    ],
  },
  {
    id: 'design',
    icon: 'brush' as IconName,
    name: 'Thiết kế UI/UX',
    tagline: 'Figma · Design system · Prototype',
    tiers: [
      { name: 'Wireframe', price: 'Từ 3 triệu', deliverables: ['Sitemap + flow', 'Wireframe low-fidelity', 'Bàn giao Figma'] },
      { name: 'Hi-fi mockup', price: 'Từ 8 triệu', deliverables: ['Toàn bộ màn hình', 'Design system cơ bản', 'Prototype tương tác'] },
      { name: 'Design system', price: 'Từ 20 triệu', deliverables: ['Token + component library', 'Documentation', 'Hỗ trợ dev triển khai'] },
    ],
  },
]

export default function DichVuPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Dịch vụ', url: '/dich-vu' },
        ]),
        ...packages.map((p) => serviceSchema({
          name: `${p.name} — ${p.tagline}`,
          description: `${p.name}. Các gói: ${p.tiers.map((t) => `${t.name} (${t.price})`).join(', ')}.`,
          url: `/dich-vu#${p.id}`,
        })),
      ]} />

      <section className="bg-gradient-to-br from-cream-50 via-white to-cream-100 border-b border-gray-100 dark:from-ink-950 dark:via-ink-950 dark:to-ink-900 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Dịch vụ</div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">Bảng giá &amp; phạm vi dịch vụ</h1>
            <p className="mt-5 text-lg text-gray-600 dark:text-ink-400">Mức giá khởi điểm — chốt theo scope thực tế sau buổi tư vấn miễn phí. Mọi gói đều bao gồm hợp đồng, hoá đơn VAT, bảo hành.</p>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16 bg-white dark:bg-ink-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {packages.map((pkg) => (
            <div key={pkg.id} id={pkg.id} className="scroll-mt-20">
              <div className="flex items-center gap-4 mb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-ink-100 bg-cream-100 text-ink-700 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-100">
                  <Icon name={pkg.icon} className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">{pkg.name}</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-400">{pkg.tagline}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {pkg.tiers.map((tier, i) => (
                  <div key={tier.name} className={`rounded-2xl border p-6 transition ${i === 1 ? 'border-brand-300 bg-brand-50/30 shadow-md dark:border-brand-500/40 dark:bg-brand-500/5' : 'border-gray-200 bg-white hover:border-gray-300 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-ink-700'}`}>
                    <div className="text-sm font-semibold text-gray-500 dark:text-ink-400">{tier.name}</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{tier.price}</div>
                    <ul className="mt-5 space-y-2.5">
                      {tier.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-gray-700 dark:text-ink-300">
                          <svg className="w-4 h-4 mt-0.5 text-brand-600 dark:text-brand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-cream-50 dark:bg-ink-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Cần báo giá chính xác?</h2>
          <p className="mt-3 text-gray-600 dark:text-ink-400">Mỗi dự án mỗi khác. Bạn có thể tự cấu hình để xem giá ngay, hoặc gửi yêu cầu để Alodev tư vấn từ đầu.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <QuoteCTA size="md">Yêu cầu báo giá</QuoteCTA>
            <a href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white border border-ink-100 px-6 py-3 text-ink-900 font-semibold hover:bg-cream-50 dark:bg-ink-900 dark:border-ink-800 dark:text-white dark:hover:bg-ink-800 transition">Chat Zalo</a>
          </div>
        </div>
      </section>
    </>
  )
}

import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import Icon from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedServices from '@/components/RelatedServices'
import { breadcrumbSchema, serviceWithOffersSchema, faqPageSchema } from '@/lib/schema'

export const metadata = {
  // 51 chars + " — Alodev" template = 60 chars total, fits Google SERP.
  title: 'Lập trình CRM / ERP / hệ thống quản trị — từ 25tr',
  // 159 chars
  description: 'Lập trình hệ thống quản trị tuỳ chỉnh — CRM khách hàng, ERP quản lý kho, HR, SaaS multi-tenant. Phân quyền, báo cáo, API, backup tự động. Từ 25 triệu.',
  alternates: { canonical: '/dich-vu/he-thong-quan-tri' },
  keywords: [
    'lập trình CRM',
    'lập trình ERP',
    'hệ thống quản trị doanh nghiệp',
    'phần mềm CRM Việt Nam',
    'phần mềm ERP custom',
    'SaaS multi-tenant',
    'phân quyền báo cáo',
    'báo giá hệ thống quản trị',
  ],
  openGraph: {
    url: '/dich-vu/he-thong-quan-tri',
    title: 'Lập trình hệ thống quản trị CRM / ERP — Alodev',
    description: 'CRM, ERP, HR, SaaS multi-tenant. Viết riêng theo nghiệp vụ thực tế. Từ 25 triệu, source code thuộc về bạn.',
  },
}

const types = [
  { name: 'CRM — Quản lý khách hàng', desc: 'Lưu data khách, theo dõi liên hệ, ghi chú, deal pipeline, báo cáo doanh thu.', price: 'Từ 35 triệu' },
  { name: 'Quản lý kho / Bán hàng', desc: 'Sản phẩm, tồn kho, đơn nhập/xuất, công nợ, in hoá đơn, báo cáo Excel.', price: 'Từ 45 triệu' },
  { name: 'Hệ thống nhân sự (HR)', desc: 'Chấm công, lương, đơn nghỉ phép, hợp đồng, workflow approval nhiều cấp.', price: 'Từ 50 triệu' },
  { name: 'SaaS Multi-tenant', desc: 'Hệ thống cho thuê — bán cho nhiều khách dùng chung, mỗi khách 1 không gian riêng.', price: 'Từ 80 triệu' },
  { name: 'Hệ thống đặc thù', desc: 'Hệ thống quản lý phòng khám / spa / trường học / kho vận — tuỳ chỉnh nghiệp vụ.', price: 'Báo giá theo scope' },
]

const features = [
  { icon: 'shield-check', title: 'Phân quyền RBAC', desc: 'Admin / Manager / Nhân viên / Khách — mỗi vai trò thấy gì làm gì khác nhau.' },
  { icon: 'file-text', title: 'Báo cáo + Excel/PDF', desc: 'Dashboard biểu đồ, click 1 nút tải Excel báo cáo doanh thu/tồn kho.' },
  { icon: 'package', title: 'Audit log đầy đủ', desc: 'Ai sửa gì lúc mấy giờ — chống gian lận, có proof khi cần.' },
  { icon: 'message-circle', title: 'Notify Email + Telegram', desc: 'Có đơn mới → Telegram bot ping. Server lỗi → email cho bạn.' },
  { icon: 'arrow-down-up', title: 'API mở cho mobile/3rd-party', desc: 'REST API + Webhook receivers — tích hợp app mobile và Sheet/Slack.' },
  { icon: 'gauge', title: 'Backup + Monitoring 24/7', desc: 'Sao lưu data hằng ngày, alert qua Telegram khi server có vấn đề.' },
]

const faq = [
  { q: 'Lập trình CRM / ERP riêng có đắt hơn dùng phần mềm có sẵn (Misa, KiotViet) không?', a: 'Đắt hơn. Misa / KiotViet rẻ hơn nhờ phân tải chi phí phát triển cho hàng nghìn khách. Code riêng từ Alodev: 25-100+ triệu. Nhưng bạn được: nghiệp vụ đúng 100% (phần mềm có sẵn buộc bạn theo flow của họ), không phí license hằng tháng, source code thuộc về bạn, dễ scale custom. Phù hợp khi: nghiệp vụ phức tạp đặc thù, doanh nghiệp lớn, hoặc bán làm SaaS.' },
  { q: 'Có thể migrate từ Excel / phần mềm cũ sang hệ thống mới không?', a: 'Có. Đây là dịch vụ "Tích hợp / migration hệ thống cũ" trong báo giá (15 triệu). Alodev đọc dữ liệu Excel/MySQL/MongoDB cũ, transform đúng schema mới, import sạch không trùng lặp, có log đầy đủ. Test trên 10% data trước, OK mới migrate full.' },
  { q: 'Hệ thống có chạy trên mobile được không?', a: 'Có. Dashboard responsive — chạy được trên tablet (iPad / Android tablet) cho manager đi gặp khách. Nếu cần app mobile thật (push notification, offline mode), Alodev làm app riêng kết nối qua API — combo CRM + Mobile App tiết kiệm thời gian briefing 2 lần.' },
  { q: 'Tích hợp được với Google Workspace / Microsoft 365 không?', a: 'Có. SSO qua Google Workspace / Microsoft 365 — nhân viên login Gmail/Outlook công ty là vào được, không cần password riêng. Tích hợp Google Calendar (đặt lịch hiện trên cal), Google Sheet (export báo cáo), Microsoft Teams (notify), v.v.' },
  { q: 'AI có thể tích hợp vào hệ thống quản trị không?', a: 'Có. AI assist (ChatGPT/Claude API) — gợi ý hành động, tóm tắt báo cáo dài thành 3 dòng key takeaway, draft email reply cho khách dựa trên context CRM. Cost tracking cẩn thận để không bị burn budget. Báo giá: 12 triệu cho gói AI assist cơ bản.' },
]

export default function HeThongQuanTriPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Dịch vụ', url: '/dich-vu' },
          { name: 'Hệ thống quản trị', url: '/dich-vu/he-thong-quan-tri' },
        ]),
        serviceWithOffersSchema({
          name: 'Lập trình hệ thống quản trị CRM / ERP',
          description: 'Phát triển hệ thống quản trị doanh nghiệp tuỳ chỉnh — CRM, ERP, HR, SaaS multi-tenant. Phân quyền, báo cáo, API, backup tự động.',
          url: '/dich-vu/he-thong-quan-tri',
          serviceType: 'Custom CRM / ERP / business management software',
          tiers: [
            { name: 'CRM — Quản lý khách hàng',  priceMin: 35_000_000, description: 'Lưu data khách, theo dõi liên hệ, deal pipeline, báo cáo doanh thu.' },
            { name: 'Quản lý kho / Bán hàng',    priceMin: 45_000_000, description: 'Sản phẩm, tồn kho, đơn nhập/xuất, công nợ, báo cáo Excel.' },
            { name: 'Hệ thống nhân sự (HR)',     priceMin: 50_000_000, description: 'Chấm công, lương, đơn nghỉ phép, hợp đồng, workflow approval.' },
            { name: 'SaaS Multi-tenant',         priceMin: 80_000_000, description: 'Hệ thống cho thuê — bán cho nhiều khách dùng chung, mỗi khách 1 không gian.' },
          ],
        }),
        faqPageSchema(faq),
      ]} />

      <section className="relative overflow-hidden bg-cream-50 dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800">
        <div className="aurora opacity-50" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 lg:pt-20 lg:pb-16">
          <Breadcrumbs items={[
            { name: 'Trang chủ', href: '/' },
            { name: 'Dịch vụ', href: '/dich-vu' },
            { name: 'Hệ thống quản trị', href: '/dich-vu/he-thong-quan-tri' },
          ]} />
          <div className="mt-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">Dịch vụ · System</span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink-900 dark:text-white leading-tight">
              Lập trình hệ thống quản trị<br />
              <span className="text-brand-700 dark:text-brand-400">CRM · ERP · SaaS</span>
            </h1>
            <p className="mt-5 text-lg text-ink-500 dark:text-ink-300 max-w-3xl leading-relaxed">
              Alodev xây dựng hệ thống quản trị doanh nghiệp tuỳ chỉnh — CRM khách hàng, ERP quản lý kho và bán hàng, HR nhân sự, SaaS multi-tenant.
              Code riêng theo nghiệp vụ thực tế của bạn (không phải <b>Misa/KiotViet</b> dùng chung), phân quyền chi tiết, báo cáo tự động, API mở để tích hợp.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <QuoteCTA size="lg">Yêu cầu báo giá hệ thống</QuoteCTA>
              <Link href="/du-an" className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 px-6 py-3.5 text-ink-900 dark:text-white font-semibold hover:border-ink-300 dark:hover:border-ink-700 transition">
                Xem hệ thống đã làm
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-20 bg-white dark:bg-ink-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">Cam kết</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">Sáu tính năng tiêu chuẩn áp dụng cho mọi hệ thống</h2>
          </div>
          <div className="mt-6 lg:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 md:p-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400">
                  <Icon name={f.icon as 'cpu'} className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-20 bg-cream-50 dark:bg-ink-950 border-y border-ink-100 dark:border-ink-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">Loại hệ thống</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">Năm loại hệ thống Alodev đã triển khai</h2>
          </div>
          <div className="mt-10 space-y-3">
            {types.map((t) => (
              <div key={t.name} className="rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 md:p-5 flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-ink-900 dark:text-white">{t.name}</h3>
                  <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{t.desc}</p>
                </div>
                <div className="tabular text-sm font-bold text-brand-700 dark:text-brand-400 shrink-0">{t.price}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <QuoteCTA size="md">Tự cấu hình & xem báo giá ngay</QuoteCTA>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-20 bg-white dark:bg-ink-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">FAQ</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">Câu hỏi thường gặp về hệ thống quản trị</h2>
          </div>
          <div className="space-y-2">
            {faq.map((f, i) => (
              <details key={i} className="group rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 md:px-6 py-3 md:py-4 open:shadow-md transition" >
                <summary className="cursor-pointer list-none flex items-center justify-between font-semibold text-ink-900 dark:text-white">
                  <span>{f.q}</span>
                  <Icon name="chevron-down" className="w-5 h-5 text-ink-400 transition group-open:rotate-180 shrink-0" />
                </summary>
                <p className="mt-3 text-ink-600 dark:text-ink-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <RelatedServices exclude="he-thong-quan-tri" />

      <section className="py-8 lg:py-20 bg-cream-50 dark:bg-ink-950 border-t border-ink-100 dark:border-ink-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">Sẵn sàng xây dựng hệ thống?</h2>
          <p className="mt-3 text-ink-500 dark:text-ink-300">Gửi mô tả nghiệp vụ — Alodev tư vấn miễn phí + báo giá chi tiết trong 48h.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <QuoteCTA size="md">Yêu cầu báo giá</QuoteCTA>
            <Link href="/dich-vu" className="rounded-xl bg-white border border-ink-100 px-6 py-3 text-ink-900 font-semibold hover:bg-cream-50 dark:bg-ink-900 dark:border-ink-800 dark:text-white dark:hover:bg-ink-800 transition">Xem các dịch vụ khác</Link>
          </div>
        </div>
      </section>
    </>
  )
}

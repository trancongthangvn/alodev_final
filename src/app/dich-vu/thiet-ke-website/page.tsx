import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import Icon from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'
import Breadcrumbs from '@/components/Breadcrumbs'
import { breadcrumbSchema, serviceSchema, faqPageSchema } from '@/lib/schema'

export const metadata = {
  title: 'Thiết kế website chuyên nghiệp — Báo giá từ 8 triệu',
  description: 'Dịch vụ thiết kế website doanh nghiệp, landing page, e-commerce, blog của Alodev — chuẩn SEO, responsive, tốc độ tải <1s. Founder-led studio tại Hà Nội, source code thuộc về bạn.',
  alternates: { canonical: '/dich-vu/thiet-ke-website' },
  openGraph: {
    url: '/dich-vu/thiet-ke-website',
    title: 'Thiết kế website chuyên nghiệp — Alodev',
    description: 'Thiết kế website doanh nghiệp, landing page, e-commerce. Báo giá rõ ràng từ 8 triệu, bàn giao đúng hạn, source code thuộc về bạn.',
  },
}

const types = [
  { name: 'Landing page bán hàng', desc: '1 trang dài tập trung 1 sản phẩm/dịch vụ, tối ưu chuyển đổi khi chạy ads Facebook / Google.', price: 'Từ 8 triệu' },
  { name: 'Website giới thiệu công ty', desc: 'Trang chủ, Giới thiệu, Dịch vụ, Sản phẩm, Tin tức, Liên hệ — chuẩn doanh nghiệp.', price: 'Từ 14 triệu' },
  { name: 'Website thương mại điện tử', desc: 'Sản phẩm, giỏ hàng, thanh toán VNPay/MoMo, quản lý đơn — như Shopee mini.', price: 'Từ 25 triệu' },
  { name: 'Blog / Trang tin tức', desc: 'CMS đăng bài, chuyên mục, SEO, đăng ký nhận tin email.', price: 'Từ 12 triệu' },
  { name: 'Hệ thống đa site (multi-site)', desc: '1 backend phân phối nội dung tới nhiều domain — như mạng tin tức.', price: 'Báo giá theo scope' },
]

const features = [
  { icon: 'gauge', title: 'Tốc độ tải dưới 1 giây', desc: 'Static export + CDN edge — Core Web Vitals 90+ điểm Google.' },
  { icon: 'search', title: 'Chuẩn SEO từ ngày deploy', desc: 'Schema.org đầy đủ, sitemap auto, OG, canonical, breadcrumb. Không phải "fix sau".' },
  { icon: 'phone', title: 'Responsive mọi kích thước', desc: 'Mobile-first design — 70% traffic VN từ điện thoại.' },
  { icon: 'shield-check', title: 'Bảo mật từ ngày deploy', desc: 'HTTPS, HSTS, CSP, security headers, DDoS protection qua Cloudflare.' },
  { icon: 'package', title: 'Source code thuộc về bạn', desc: 'Repo Git, database, domain, hosting — đứng tên bạn. Không vendor lock-in.' },
  { icon: 'wrench', title: 'Bảo hành 6–12 tháng', desc: 'Mọi bug do Alodev gây ra đều fix miễn phí trong thời gian bảo hành.' },
]

const faq = [
  { q: 'Thiết kế website giá rẻ có chất lượng không?', a: 'Tuỳ định nghĩa "rẻ". Alodev báo giá từ 8 triệu cho landing page — đó là mức rẻ với một website code riêng (không template), responsive, SEO chuẩn, hosting + domain năm đầu inclusive. Rẻ hơn nữa thường là template Wordpress lắp ghép — chạy được nhưng khó scale, khó SEO, khó bảo trì sau 1-2 năm.' },
  { q: 'Có nên dùng Wordpress hay code riêng (Next.js)?', a: 'Wordpress phù hợp khi bạn cần cms blog đơn giản, ngân sách hạn chế và không quan tâm tốc độ. Next.js / code riêng phù hợp khi bạn cần tốc độ tải nhanh (SEO, conversion), tính năng custom (e-commerce phức tạp, hệ thống), dài hạn dễ scale. Alodev khuyến nghị Next.js cho 90% trường hợp doanh nghiệp.' },
  { q: 'Thiết kế website mất bao lâu?', a: 'Landing page 1 trang: 7-10 ngày. Website doanh nghiệp 5-10 trang: 3-4 tuần. Website thương mại điện tử: 6-8 tuần. Hệ thống multi-site: 8-12 tuần. Cam kết deadline ghi rõ trong hợp đồng.' },
  { q: 'Sau khi bàn giao có hỗ trợ tiếp không?', a: 'Có. Bảo hành lỗi miễn phí 6–12 tháng tuỳ gói. Hỗ trợ thêm tính năng / sửa nội dung theo gói tháng từ 1 triệu — không bắt buộc renew.' },
  { q: 'Tôi đã có website cũ — Alodev có nhận nâng cấp không?', a: 'Có. Đây là dịch vụ "Bảo trì & nâng cấp" — Alodev audit miễn phí hiện trạng website, đề xuất kế hoạch nâng cấp / migrate sang stack mới. Có thể giữ domain + nội dung hiện tại.' },
]

export default function ThietKeWebsitePage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Dịch vụ', url: '/dich-vu' },
          { name: 'Thiết kế website', url: '/dich-vu/thiet-ke-website' },
        ]),
        serviceSchema({
          name: 'Thiết kế website doanh nghiệp',
          description: 'Dịch vụ thiết kế website chuyên nghiệp — landing page, website công ty, e-commerce, blog. Chuẩn SEO, tốc độ tải <1s, responsive, bảo hành 6-12 tháng.',
          url: '/dich-vu/thiet-ke-website',
        }),
        faqPageSchema(faq),
      ]} />

      <section className="relative overflow-hidden bg-cream-50 dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800">
        <div className="aurora opacity-50" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 lg:pt-20 lg:pb-16">
          <Breadcrumbs items={[
            { name: 'Trang chủ', href: '/' },
            { name: 'Dịch vụ', href: '/dich-vu' },
            { name: 'Thiết kế website', href: '/dich-vu/thiet-ke-website' },
          ]} />
          <div className="mt-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">Dịch vụ · Web</span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink-900 dark:text-white leading-tight">
              Thiết kế website chuyên nghiệp<br />
              <span className="text-brand-700 dark:text-brand-400">cho doanh nghiệp Việt</span>
            </h1>
            <p className="mt-5 text-lg text-ink-500 dark:text-ink-300 max-w-3xl leading-relaxed">
              Alodev nhận thiết kế website doanh nghiệp, landing page bán hàng, website thương mại điện tử và blog tin tức.
              Code riêng bằng <b className="text-ink-700 dark:text-ink-200">Next.js</b> (không template Wordpress lắp ghép),
              tốc độ tải dưới 1 giây, SEO chuẩn từ ngày deploy đầu tiên, source code thuộc về bạn.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <QuoteCTA size="lg">Yêu cầu báo giá website</QuoteCTA>
              <Link href="/du-an" className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 px-6 py-3.5 text-ink-900 dark:text-white font-semibold hover:border-ink-300 dark:hover:border-ink-700 transition">
                Xem website đã làm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-8 lg:py-20 bg-white dark:bg-ink-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">Tại sao Alodev</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">
              6 cam kết khi thiết kế website cho bạn
            </h2>
          </div>
          <div className="mt-6 lg:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 md:p-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400">
                  <Icon name={f.icon as 'gauge'} className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types */}
      <section className="py-8 lg:py-20 bg-cream-50 dark:bg-ink-950 border-y border-ink-100 dark:border-ink-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">Loại website</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">
              5 loại website Alodev nhận thiết kế
            </h2>
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

      {/* FAQ */}
      <section className="py-8 lg:py-20 bg-white dark:bg-ink-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">FAQ</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">Câu hỏi thường gặp về thiết kế website</h2>
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

      {/* CTA */}
      <section className="py-8 lg:py-20 bg-cream-50 dark:bg-ink-950 border-t border-ink-100 dark:border-ink-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">Sẵn sàng thiết kế website?</h2>
          <p className="mt-3 text-ink-500 dark:text-ink-300">Gửi yêu cầu — Alodev báo giá chi tiết trong 24h kèm timeline cụ thể.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <QuoteCTA size="md">Yêu cầu báo giá</QuoteCTA>
            <Link href="/dich-vu" className="rounded-xl bg-white border border-ink-100 px-6 py-3 text-ink-900 font-semibold hover:bg-cream-50 dark:bg-ink-900 dark:border-ink-800 dark:text-white dark:hover:bg-ink-800 transition">Xem các dịch vụ khác</Link>
          </div>
        </div>
      </section>
    </>
  )
}

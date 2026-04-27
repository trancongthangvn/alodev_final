import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import Icon from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'
import Breadcrumbs from '@/components/Breadcrumbs'
import { breadcrumbSchema, serviceSchema, faqPageSchema } from '@/lib/schema'

export const metadata = {
  title: 'Lập trình app mobile iOS / Android — Báo giá từ 60 triệu',
  description: 'Dịch vụ lập trình app mobile native (Swift/Kotlin) hoặc cross-platform (React Native, Flutter) — đặt lịch, giao hàng, e-commerce, app nội bộ. Đưa lên App Store + Google Play, source code thuộc về bạn.',
  alternates: { canonical: '/dich-vu/lap-trinh-app-mobile' },
  openGraph: {
    url: '/dich-vu/lap-trinh-app-mobile',
    title: 'Lập trình app mobile iOS / Android — Alodev',
    description: 'Phát triển app mobile native + cross-platform. Đặt lịch, giao hàng, e-commerce, app nội bộ. Báo giá từ 60 triệu.',
  },
}

const types = [
  { name: 'App đặt lịch / dịch vụ', desc: 'Khách đặt lịch nail / spa / khám / sửa chữa qua app — push notification, thanh toán in-app.', price: 'Từ 70 triệu' },
  { name: 'App giao hàng / đặt món', desc: 'Khách đặt món, shipper giao, có bản đồ tracking real-time — như Grab/Be mini.', price: 'Từ 95 triệu' },
  { name: 'App bán hàng / e-commerce', desc: 'App version của shop — sản phẩm, giỏ hàng, thanh toán VNPay/Stripe.', price: 'Từ 85 triệu' },
  { name: 'App nội bộ công ty', desc: 'Chấm công, đơn nghỉ phép, báo cáo, chat nội bộ — Face ID / vân tay.', price: 'Từ 75 triệu' },
  { name: 'App tuỳ chỉnh đặc thù', desc: 'IoT, BLE, AR, ML — báo giá theo phân tích yêu cầu chuyên sâu.', price: 'Báo giá theo scope' },
]

const features = [
  { icon: 'phone', title: 'Native + Cross-platform', desc: 'Swift / Kotlin native cho hiệu năng tối đa, hoặc React Native / Flutter cho tốc độ ship.' },
  { icon: 'shield-check', title: 'Publish App Store + Play', desc: 'Alodev xử lý toàn bộ Apple Developer + Google Play Console — review pass.' },
  { icon: 'cpu', title: 'Backend riêng đi kèm', desc: 'API server Node/Postgres + admin dashboard quản lý — không phụ thuộc bên thứ 3.' },
  { icon: 'package', title: 'Source code đầy đủ', desc: 'Xcode + Android Studio project, server code, CI/CD config — đứng tên bạn.' },
  { icon: 'wrench', title: 'Bảo hành & update OS', desc: 'Bảo hành 12 tháng + free update khi iOS / Android ra version mới.' },
  { icon: 'gauge', title: 'Crashlytics + Analytics', desc: 'Theo dõi crash + user behavior — Firebase đã setup sẵn ngày deploy.' },
]

const faq = [
  { q: 'Lập trình app mobile mất bao lâu?', a: 'App MVP (5-7 màn hình + login + 1 flow chính): 6-8 tuần. App production đầy đủ (auth, payment, push, chat): 10-12 tuần. App phức tạp (IoT, AR, ML): 4-6 tháng. Cam kết deadline ghi rõ trong hợp đồng.' },
  { q: 'Native (Swift/Kotlin) hay React Native/Flutter — chọn cái nào?', a: 'Native phù hợp khi: app cần hiệu năng cực cao (game, AR, video editing), tích hợp sâu hệ điều hành (CallKit, HealthKit, BLE phức tạp). Cross-platform (RN/Flutter) phù hợp khi: ngân sách hạn chế, cần ship cả iOS + Android cùng lúc, app business logic chiếm phần lớn (đặt lịch, e-commerce, social). Alodev khuyến nghị 80% trường hợp dùng cross-platform.' },
  { q: 'Chi phí Apple Developer + Google Play như thế nào?', a: 'Apple Developer Program: 99 USD/năm (~2.5 triệu). Google Play Console: 25 USD 1 lần (~600k). Khoản này không có trong báo giá Alodev — bạn phải đăng ký bằng tài khoản công ty/cá nhân của bạn (đảm bảo bạn sở hữu app). Alodev hỗ trợ hướng dẫn đăng ký miễn phí.' },
  { q: 'App đã có nhưng bị lỗi / cần nâng cấp — Alodev có nhận không?', a: 'Có. Alodev nhận audit miễn phí app cũ, đề xuất kế hoạch fix bug / refactor / nâng cấp. Có thể giữ nguyên user data + backend hiện tại nếu bạn muốn.' },
  { q: 'App có thể tích hợp thanh toán VNPay/MoMo không?', a: 'Có. Alodev tích hợp được tất cả cổng thanh toán phổ biến VN: VNPay, MoMo, Zalopay, ATM card, ví điện tử. Quốc tế: Stripe, PayPal. Apple Pay / Google Pay nếu cần.' },
]

export default function LapTrinhAppMobilePage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Dịch vụ', url: '/dich-vu' },
          { name: 'Lập trình app mobile', url: '/dich-vu/lap-trinh-app-mobile' },
        ]),
        serviceSchema({
          name: 'Lập trình app mobile iOS / Android',
          description: 'Dịch vụ phát triển app mobile native (Swift/Kotlin) hoặc cross-platform (React Native, Flutter). Đặt lịch, giao hàng, e-commerce, nội bộ.',
          url: '/dich-vu/lap-trinh-app-mobile',
        }),
        faqPageSchema(faq),
      ]} />

      <section className="relative overflow-hidden bg-cream-50 dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800">
        <div className="aurora opacity-50" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 lg:pt-20 lg:pb-16">
          <Breadcrumbs items={[
            { name: 'Trang chủ', href: '/' },
            { name: 'Dịch vụ', href: '/dich-vu' },
            { name: 'Lập trình app mobile', href: '/dich-vu/lap-trinh-app-mobile' },
          ]} />
          <div className="mt-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">Dịch vụ · Mobile</span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink-900 dark:text-white leading-tight">
              Lập trình app mobile<br />
              <span className="text-brand-700 dark:text-brand-400">iOS &amp; Android</span>
            </h1>
            <p className="mt-5 text-lg text-ink-500 dark:text-ink-300 max-w-3xl leading-relaxed">
              Alodev nhận phát triển app mobile cho doanh nghiệp Việt — đặt lịch, giao hàng, e-commerce, app nội bộ.
              Dùng <b className="text-ink-700 dark:text-ink-200">Swift/Kotlin native</b> cho hiệu năng tối đa hoặc <b className="text-ink-700 dark:text-ink-200">React Native/Flutter</b> cho tốc độ ship cả 2 nền tảng cùng lúc.
              Alodev xử lý toàn bộ publish lên App Store + Google Play.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <QuoteCTA size="lg">Yêu cầu báo giá app</QuoteCTA>
              <Link href="/du-an" className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 px-6 py-3.5 text-ink-900 dark:text-white font-semibold hover:border-ink-300 dark:hover:border-ink-700 transition">
                Xem app đã làm
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20 bg-white dark:bg-ink-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">Cam kết</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">6 thứ Alodev xử lý trọn gói</h2>
          </div>
          <div className="mt-6 lg:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 md:p-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400">
                  <Icon name={f.icon as 'phone'} className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20 bg-cream-50 dark:bg-ink-950 border-y border-ink-100 dark:border-ink-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">Loại app</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">5 loại app Alodev nhận lập trình</h2>
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

      <section className="py-12 lg:py-20 bg-white dark:bg-ink-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">FAQ</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">Câu hỏi thường gặp về lập trình app</h2>
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

      <section className="py-12 lg:py-20 bg-cream-50 dark:bg-ink-950 border-t border-ink-100 dark:border-ink-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">Sẵn sàng phát triển app?</h2>
          <p className="mt-3 text-ink-500 dark:text-ink-300">Gửi yêu cầu — Alodev báo giá chi tiết trong 24h kèm scope of work.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <QuoteCTA size="md">Yêu cầu báo giá</QuoteCTA>
            <Link href="/dich-vu" className="rounded-xl bg-white border border-ink-100 px-6 py-3 text-ink-900 font-semibold hover:bg-cream-50 dark:bg-ink-900 dark:border-ink-800 dark:text-white dark:hover:bg-ink-800 transition">Xem các dịch vụ khác</Link>
          </div>
        </div>
      </section>
    </>
  )
}

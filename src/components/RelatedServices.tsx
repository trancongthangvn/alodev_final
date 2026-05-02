import Link from 'next/link'
import Icon, { type IconName } from './Icon'

/**
 * Cross-links between service detail pages.
 *
 * SEO rationale: each service detail page (`/dich-vu/thiet-ke-website`,
 * `/dich-vu/lap-trinh-app-mobile`, `/dich-vu/he-thong-quan-tri`) is a
 * keyword-targeted landing. Cross-linking distributes link equity laterally
 * between siblings, helps Google understand the topical cluster, and gives
 * users a clear next-step that isn't "back to /dich-vu hub".
 *
 * Anchor text uses the FULL service name + price-anchored sub-line — never
 * "click here" / "xem thêm" without context (Google explicitly downweights
 * generic anchors).
 */

type ServiceId = 'thiet-ke-website' | 'lap-trinh-app-mobile' | 'he-thong-quan-tri'

const SERVICES: Record<ServiceId, { name: string; tagline: string; icon: IconName; price: string }> = {
  'thiet-ke-website': {
    name: 'Thiết kế website',
    tagline: 'Landing · doanh nghiệp · e-commerce · blog',
    icon: 'globe',
    price: 'Từ 8 triệu',
  },
  'lap-trinh-app-mobile': {
    name: 'Lập trình app mobile',
    tagline: 'iOS · Android · cross-platform',
    icon: 'phone',
    price: 'Từ 60 triệu',
  },
  'he-thong-quan-tri': {
    name: 'Hệ thống quản trị',
    tagline: 'CRM · ERP · HR · SaaS multi-tenant',
    icon: 'cpu',
    price: 'Từ 25 triệu',
  },
}

export default function RelatedServices({ exclude }: { exclude: ServiceId }) {
  const others = (Object.keys(SERVICES) as ServiceId[]).filter((id) => id !== exclude)

  return (
    <section className="py-10 lg:py-20 bg-white dark:bg-ink-950 border-t border-ink-100 dark:border-ink-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">Dịch vụ liên quan</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">
            Alodev cũng nhận triển khai
          </h2>
          <p className="mt-3 text-ink-500 dark:text-ink-300 max-w-xl mx-auto">
            Một số dự án kết hợp nhiều dịch vụ — Alodev báo giá tổng thể tốt hơn
            khi gộp gói.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {others.map((id) => {
            const s = SERVICES[id]
            return (
              <Link
                key={id}
                href={`/dich-vu/${id}`}
                className="group rounded-2xl border border-ink-100 dark:border-ink-800 bg-cream-50 dark:bg-ink-900 hover:border-brand-300 dark:hover:border-brand-500/40 hover:bg-white dark:hover:bg-ink-900/80 p-5 lg:p-6 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white dark:bg-ink-950 border border-ink-100 dark:border-ink-800 text-brand-700 dark:text-brand-400 shrink-0">
                    <Icon name={s.icon} className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">
                        {s.name}
                      </h3>
                      <Icon name="arrow-right" className="w-4 h-4 text-ink-400 group-hover:translate-x-0.5 transition shrink-0" />
                    </div>
                    <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{s.tagline}</p>
                    <p className="mt-2 text-xs font-semibold text-brand-700 dark:text-brand-400">{s.price}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Fallback to hub for users who want full overview */}
        <div className="mt-6 text-center">
          <Link
            href="/dich-vu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-700 dark:text-ink-300 hover:text-brand-700 dark:hover:text-brand-400 transition"
          >
            Xem toàn bộ 6 nhóm dịch vụ
            <Icon name="arrow-right" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

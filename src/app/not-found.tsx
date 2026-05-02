import Link from 'next/link'
import type { Metadata } from 'next'
import Icon from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'

/**
 * Custom 404 — replaces Next's default error page.
 *
 * SEO/UX rationale:
 *  • Returns HTTP 404 automatically (Next handles status code).
 *  • `noindex` so the URL itself isn't indexed even if linked from elsewhere.
 *  • Recovery internal links to ALL primary destinations (services, portfolio,
 *    quote, contact) — keeps users in funnel, sends positive PageRank flow back
 *    to high-value pages. A bare 404 = user bounces; a navigated 404 keeps
 *    session signals healthy (which Google reads).
 *  • Vietnamese copywriting in CEO-tier tone.
 */
export const metadata: Metadata = {
  title: 'Không tìm thấy trang',
  description: 'Trang bạn tìm không tồn tại hoặc đã được di chuyển. Quay lại trang chủ Alodev hoặc khám phá dịch vụ thiết kế web/app, hệ thống quản trị.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/' },
}

export default function NotFound() {
  return (
    <main id="main" className="relative min-h-[70vh] flex items-center bg-white dark:bg-ink-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <p className="text-sm font-semibold tracking-[0.18em] uppercase text-brand-600 dark:text-brand-400">
          404
        </p>
        <h1 className="mt-4 h-display text-gray-900 dark:text-white">
          Không tìm thấy trang.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Đường dẫn này không tồn tại hoặc đã được di chuyển. Bạn có thể quay lại
          trang chủ, xem các dịch vụ Alodev đang cung cấp, hoặc gửi yêu cầu báo
          giá để được phản hồi trong 24h.
        </p>

        {/* Primary recovery CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-900 hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-zinc-100 px-6 py-3.5 text-base font-semibold text-white transition"
          >
            <Icon name="arrow-right" className="w-4 h-4 -scale-x-100" />
            Trang chủ
          </Link>
          <QuoteCTA size="lg" variant="outline">Yêu cầu báo giá</QuoteCTA>
        </div>

        {/* Secondary nav — internal linking lifts surrounding pages.
            Each link uses descriptive anchor text (no "click here"). */}
        <nav aria-label="Khám phá Alodev" className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
          <RecoveryLink href="/dich-vu" title="Tất cả dịch vụ" desc="Web · App · Hệ thống · AI · Bảo trì · UI/UX" />
          <RecoveryLink href="/dich-vu/thiet-ke-website" title="Thiết kế website" desc="Doanh nghiệp · landing · e-commerce" />
          <RecoveryLink href="/dich-vu/lap-trinh-app-mobile" title="Lập trình app mobile" desc="iOS · Android · cross-platform" />
          <RecoveryLink href="/dich-vu/he-thong-quan-tri" title="Hệ thống quản trị" desc="CRM · ERP · SaaS multi-tenant" />
          <RecoveryLink href="/du-an" title="Portfolio" desc="11+ sản phẩm đang vận hành" />
          <RecoveryLink href="/ve-chung-toi" title="Về Alodev" desc="Hồ sơ năng lực founder-led" />
        </nav>
      </div>
    </main>
  )
}

function RecoveryLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-brand-300 dark:hover:border-brand-500/40 px-4 py-3 transition"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">
          {title}
        </span>
        <Icon name="arrow-right" className="w-4 h-4 text-gray-400 dark:text-zinc-500 group-hover:translate-x-0.5 transition" />
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-zinc-500">{desc}</p>
    </Link>
  )
}

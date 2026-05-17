import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import Icon, { type IconName } from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'
import { breadcrumbSchema, howToSchema, faqPageSchema } from '@/lib/schema'
import MagazineLayout from '@/components/layout/MagazineLayout'

const toc = [
  { num: '01', name: 'Khởi điểm',  hash: '#hero' },
  { num: '02', name: 'Phases',     hash: '#phases' },
  { num: '03', name: 'Cadence',    hash: '#cadence' },
  { num: '04', name: 'Công cụ',    hash: '#tools' },
  { num: '05', name: 'Câu hỏi',    hash: '#faq' },
  { num: '06', name: 'Bắt đầu',    hash: '#cta' },
]

export const metadata: Metadata = {
  title: 'Quy trình triển khai dự án - 8 giai đoạn từ tư vấn đến bảo hành',
  description:
    'Quy trình 8 giai đoạn của Alodev: từ tư vấn miễn phí (24h) → báo giá (48h) → thiết kế UI/UX → phát triển sprint hàng tuần → kiểm thử → bàn giao → bảo hành 6–12 tháng. Minh bạch, có deadline ràng buộc.',
  alternates: { canonical: '/quy-trinh' },
  keywords: [
    'quy trình thiết kế website',
    'quy trình lập trình app',
    'quy trình outsource phần mềm',
    'sprint phát triển web',
    'bàn giao dự án phần mềm',
    'bảo hành website',
    'alodev quy trình',
  ],
  openGraph: { url: '/quy-trinh', title: 'Quy trình 8 giai đoạn - Alodev', description: 'Tư vấn 24h → báo giá 48h → UI/UX → sprint demo hàng tuần → kiểm thử → bàn giao → bảo hành 6–12 tháng.' },
}

type Phase = {
  index: string
  duration: string
  icon: IconName
  title: string
  intro: string
  yourSide: string[]
  ourSide: string[]
  deliverables: string[]
  gate?: string
}

const phases: Phase[] = [
  {
    index: '01',
    duration: '≤ 24h',
    icon: 'phone',
    title: 'Khám phá & tư vấn miễn phí',
    intro:
      'Zalo/Meet 30 phút. Hiểu nhu cầu, ngân sách, deadline. Không sales pitch - kết luận fit/no-fit thẳng.',
    yourSide: [
      'Mô tả ngắn về dự án (1–2 câu)',
      'Range ngân sách dự kiến (nếu có)',
      'Deadline mong muốn (nếu có)',
    ],
    ourSide: [
      'Đặt câu hỏi đào sâu nghiệp vụ',
      'Đánh giá độ phức tạp & rủi ro',
      'Tư vấn stack + mô hình triển khai phù hợp',
    ],
    deliverables: ['Email tóm tắt cuộc gọi', 'Đánh giá fit / no-fit thẳng thắn'],
    gate: 'Quyết định: tiếp tục hay không (cả 2 chiều)',
  },
  {
    index: '02',
    duration: '≤ 48h',
    icon: 'package',
    title: 'Báo giá chi tiết & ký hợp đồng',
    intro:
      'Báo giá theo từng hạng mục - không có "tuỳ phát sinh", không phí ẩn. Hợp đồng ràng buộc deadline, scope, sở hữu source code, điều khoản trễ giảm 5%/tuần.',
    yourSide: [
      'Confirm scope & milestones',
      'Ký hợp đồng + thanh toán đợt 1 (30%)',
    ],
    ourSide: [
      'Báo giá chi tiết theo phase',
      'Soạn hợp đồng + Statement of Work',
      'Setup project tracker (Linear/Notion)',
    ],
    deliverables: [
      'Quote PDF chi tiết',
      'Hợp đồng ký số',
      'Project board + access invitation',
    ],
    gate: 'Hợp đồng có hiệu lực, 30% deposit nhận',
  },
  {
    index: '03',
    duration: '3–7 ngày',
    icon: 'cpu',
    title: 'Phân tích yêu cầu & đặc tả kỹ thuật',
    intro:
      'Chuyển từ ý tưởng → user story → wireframe + tech spec. Quyết định kiến trúc, stack, hosting, integration points (Zalo/Stripe/email/SMS/...).',
    yourSide: [
      'Cung cấp brand assets (logo, color, font)',
      'Review user story + wireframe (2–3 vòng)',
      'Confirm tech stack',
    ],
    ourSide: [
      'User story breakdown trên project board',
      'Wireframe (Figma)',
      'Architecture diagram + DB schema draft',
      'Stack decision document',
    ],
    deliverables: [
      'User story list (≥ 30 tickets)',
      'Wireframe Figma duyệt',
      'Tech spec PDF',
      'Repository khởi tạo (bạn được invite)',
    ],
    gate: 'Wireframe + tech spec ký duyệt',
  },
  {
    index: '04',
    duration: '1–3 tuần',
    icon: 'brush',
    title: 'Thiết kế UI/UX (mockup duyệt từng màn)',
    intro:
      'Figma mockup chi tiết từng màn. Design system trước (color, type, spacing), rồi component, rồi layout. Bạn duyệt từng màn - không bao giờ "code rồi chỉnh sửa giao diện sau".',
    yourSide: [
      'Review từng màn trên Figma',
      'Comment trực tiếp trong file',
      'Duyệt design final',
    ],
    ourSide: [
      'Design system Figma (color/type/spacing)',
      'Component library',
      'Mockup tất cả màn theo flow',
      'Prototype tương tác (interactions)',
    ],
    deliverables: [
      'Figma file đầy đủ access',
      'Design system token export',
      'Prototype link demo',
    ],
    gate: 'Design ký duyệt cho TẤT CẢ màn',
  },
  {
    index: '05',
    duration: '2–12 tuần',
    icon: 'rocket',
    title: 'Phát triển - sprint hàng tuần + demo trên staging',
    intro:
      'Sprint 1 tuần. Cuối tuần: deploy staging, demo Zalo/Meet, bạn test + feedback. Tiến độ trên Linear board.',
    yourSide: [
      'Tham gia demo cuối tuần (30–45 phút)',
      'Test trên staging + report bug qua Linear',
      'Thanh toán đợt 2 (40%) ở ½ chặng',
    ],
    ourSide: [
      'Code theo standard (lint, format, type-check trước commit)',
      'Unit + integration test ≥ 70% coverage',
      'Deploy staging URL với mỗi merge',
      'Demo + sprint retro hàng tuần',
    ],
    deliverables: [
      'Staging URL refresh hàng ngày',
      'Sprint changelog mỗi tuần',
      'Test report + coverage badge',
    ],
    gate: 'Mỗi sprint cần feedback duyệt mới sang sprint kế',
  },
  {
    index: '06',
    duration: '3–7 ngày',
    icon: 'shield-check',
    title: 'Kiểm thử toàn diện & QA',
    intro:
      'Cross-browser (Chrome/Safari/Firefox/Edge), mobile real-device (iOS Safari, Android Chrome), Lighthouse Performance/SEO/A11y, security audit (OWASP top-10), load test cơ bản.',
    yourSide: [
      'UAT theo checklist Alodev cung cấp',
      'Provide test data thực tế (sanitized)',
      'Sign-off UAT báo cáo',
    ],
    ourSide: [
      'Cross-browser matrix test',
      'Mobile real-device test (BrowserStack)',
      'Lighthouse + Web Vitals optimize',
      'Security scan (npm audit, snyk, OWASP zap)',
      'Bug fix all critical/major',
    ],
    deliverables: [
      'QA report PDF',
      'Lighthouse score ≥ 90 mobile',
      'Security scan clean',
      'Bug list (severity-tagged)',
    ],
    gate: 'UAT pass + 0 critical bug',
  },
  {
    index: '07',
    duration: '1–3 ngày',
    icon: 'handshake',
    title: 'Bàn giao & training',
    intro:
      'Deploy production. Transfer domain, hosting, repo, database, admin về tên bạn. Training 1–2 tiếng. Tài liệu kỹ thuật bàn giao.',
    yourSide: [
      'Tham gia training session',
      'Confirm transfer của các tài khoản',
      'Thanh toán đợt cuối (30%)',
    ],
    ourSide: [
      'Deploy production',
      'Transfer domain/hosting/repo/DB ownership',
      'Training session (record video)',
      'Tài liệu kỹ thuật + admin guide',
      'Runbook cho on-call (nếu có)',
    ],
    deliverables: [
      'Production URL live',
      'Tài liệu PDF (kỹ thuật + admin)',
      'Training video',
      'Runbook on-call',
      'Bộ assets (Figma + brand kit)',
    ],
    gate: 'Production live + tài khoản chuyển 100% sang bạn',
  },
  {
    index: '08',
    duration: '6–12 tháng',
    icon: 'wrench',
    title: 'Bảo hành & hỗ trợ vận hành',
    intro:
      'Bug do code Alodev → fix không phí trong hạn bảo hành. Sau hạn: gói hỗ trợ từ 1tr/tháng, huỷ bất kỳ lúc nào.',
    yourSide: [
      'Báo bug qua email/Linear/Zalo',
      'Quyết định có gia hạn gói hỗ trợ tháng',
    ],
    ourSide: [
      'Fix bug bảo hành ≤ 24h cho critical, ≤ 7 ngày cho minor',
      'Monitoring uptime',
      'Backup database hàng ngày (nếu opt-in support)',
      'Patch security advisory (nếu opt-in support)',
    ],
    deliverables: [
      'SLA bảo hành ký kết',
      'Channel báo bug riêng',
      'Monthly health report (nếu opt-in)',
    ],
  },
]

const faq = [
  {
    q: 'Mỗi giai đoạn có bắt buộc theo đúng thứ tự không?',
    a: 'Có. 8 giai đoạn được thiết kế tuyến tính, mỗi giai đoạn có quality gate phải duyệt mới sang giai đoạn kế. Cho phép rework trong cùng giai đoạn (vd: 2–3 vòng wireframe), nhưng không skip giai đoạn - tránh tình huống "code rồi sửa giao diện sau" gây phát sinh chi phí.',
  },
  {
    q: 'Nếu tôi muốn rút ngắn timeline, có được không?',
    a: 'Có thể nén giai đoạn 03 (đặc tả) + 04 (UI/UX) song song nếu scope nhỏ - tiết kiệm 1–2 tuần. Riêng giai đoạn 05 (phát triển) và 06 (QA) không nén được vì tính chất sprint + test cần thời gian thực. Quote sẽ note rõ option fast-track.',
  },
  {
    q: 'Tôi không có team kỹ thuật - có theo dõi tiến độ được không?',
    a: 'Được. Linear board được setup mode UX-friendly cho non-tech (chỉ nhìn % done + milestones, không nhìn vào ticket detail). Demo cuối tuần qua Zalo/Meet bằng tiếng Việt thuần, không jargon. Bạn chỉ cần focus vào "đúng yêu cầu chưa" thay vì code.',
  },
  {
    q: 'Hợp đồng quy định "trễ giảm 5%/tuần" áp dụng thế nào?',
    a: 'Tính từ deadline cuối ghi trong hợp đồng. Mỗi tuần trễ → giảm 5% giá trị hợp đồng (capped 30%). Áp dụng ngay cả khi chỉ trễ 1 ngày sang tuần kế. Loại trừ: bug do bên bạn (server đổi, API bên 3 đổi spec, requirement thay đổi).',
  },
  {
    q: 'Bảo hành 6–12 tháng cụ thể là gì?',
    a: 'Fix không phí cho bug do code Alodev (logic, UI, perf regression). Không bao gồm: feature mới, đổi requirement, lỗi bên 3 (Zalo/Stripe đổi API). Thời hạn 6 tháng cho web, 12 tháng cho mobile app + hệ thống quản trị.',
  },
  {
    q: 'Tôi có thể đổi đội bảo trì sau bảo hành không?',
    a: 'Có và Alodev khuyến khích. Source code, repo, hosting, domain, DB tất cả đứng tên bạn từ ngày bàn giao. Tài liệu kỹ thuật + runbook bàn giao đủ để team mới tiếp nhận trong 1 tuần. Không vendor lock-in về kỹ thuật, không phí thoát.',
  },
]

export default function QuyTrinhPage() {
  return (
    <MagazineLayout toc={toc} tagline={<>8 giai đoạn,<br />minh bạch.</>}>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Trang chủ', url: '/' },
            { name: 'Quy trình', url: '/quy-trinh' },
          ]),
          howToSchema({
            name: 'Quy trình triển khai dự án tại Alodev',
            description:
              '8 giai đoạn tuyến tính từ tư vấn miễn phí đến bảo hành 6–12 tháng, mỗi giai đoạn có deliverables cụ thể và quality gate.',
            totalTime: 'P12W',
            steps: phases.map((p) => ({ name: p.title, text: p.intro })),
          }),
          faqPageSchema(faq),
        ]}
      />

      {/* HERO */}
      <section id="hero" className="mag-section mag-bg-paper relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-24">
          <p className="mag-section-index">Quy trình</p>
          <h1 className="mag-section-head !mt-4 text-gray-900 dark:text-white max-w-3xl">
            Tám giai đoạn. Có deliverable. Có quality gate.
          </h1>
          <p className="mt-6 text-base lg:text-lg text-gray-600 dark:text-ink-400 leading-relaxed max-w-3xl">
            Từ cuộc tư vấn miễn phí đầu tiên (≤ 24h) đến hết bảo hành (6–12 tháng) - quy trình minh bạch,
            deadline ràng buộc trong hợp đồng, deliverable rõ cho từng giai đoạn. Bạn biết mình đang ở đâu, sắp ra cái gì,
            khi nào sang giai đoạn kế.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-ink-900 text-gray-700 dark:text-ink-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Trễ deadline → giảm 5%/tuần
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-ink-900 text-gray-700 dark:text-ink-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Source code thuộc về bạn
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-ink-900 text-gray-700 dark:text-ink-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Demo staging hàng tuần
            </span>
          </div>
        </div>
      </section>

      {/* TIMELINE STRIP */}
      <section id="phases" className="mag-section mag-bg-tint py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-4">
            {phases.map((p) => (
              <a
                key={p.index}
                href={`#phase-${p.index}`}
                className="group block text-center hover:opacity-100 opacity-70 transition"
              >
                <div className="text-[10px] lg:text-xs font-mono text-gray-500 dark:text-ink-500 mb-1.5">
                  {p.duration}
                </div>
                <div className="font-mono text-base lg:text-lg font-bold text-gray-900 dark:text-white tabular">
                  {p.index}
                </div>
                <div className="hidden lg:block mt-1 text-xs text-gray-600 dark:text-ink-400 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {p.title.split(' (')[0].split('(')[0].trim().split('&')[0].trim()}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PHASES */}
      <section id="tools" className="mag-section mag-bg-paper py-12 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 lg:space-y-20">
          {phases.map((p, i) => (
            <article key={p.index} id={`phase-${p.index}`} className="reveal scroll-mt-24">
              <div className="flex items-start gap-5 lg:gap-7">
                {/* Index column */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl border border-brand-300 dark:border-brand-500/40 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 flex items-center justify-center">
                    <Icon name={p.icon} className="w-6 h-6" />
                  </div>
                  {i < phases.length - 1 && (
                    <div className="mt-3 w-px h-full min-h-[200px] bg-gradient-to-b from-gray-200 dark:from-ink-800 to-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="text-xs font-mono text-brand-600 dark:text-brand-400 tabular">
                      Giai đoạn {p.index}
                    </span>
                    <span className="text-xs font-mono text-gray-500 dark:text-ink-500">
                      · {p.duration}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-gray-600 dark:text-ink-400 leading-relaxed">{p.intro}</p>

                  {/* Two-column responsibility split */}
                  <div className="mt-6 grid sm:grid-cols-2 gap-4 lg:gap-5">
                    <div className="rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 lg:p-5">
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 dark:text-ink-500 mb-2">
                        Bạn làm
                      </div>
                      <ul className="space-y-1.5 text-sm text-gray-700 dark:text-ink-300">
                        {p.yourSide.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-brand-500 mt-1">▸</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 lg:p-5">
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 dark:text-ink-500 mb-2">
                        Alodev làm
                      </div>
                      <ul className="space-y-1.5 text-sm text-gray-700 dark:text-ink-300">
                        {p.ourSide.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-brand-500 mt-1">▸</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="mt-4 rounded-xl border border-dashed border-gray-300 dark:border-ink-700 bg-cream-50 dark:bg-ink-900/40 p-4 lg:p-5">
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 dark:text-ink-500 mb-2">
                      Deliverables giao tay
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-gray-700 dark:text-ink-300">
                      {p.deliverables.map((d, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">✓</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gate */}
                  {p.gate && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-400 text-xs font-semibold">
                      <Icon name="shield-check" className="w-3.5 h-3.5" />
                      Quality gate: {p.gate}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* COMMUNICATION CADENCE */}
      <section id="cadence" className="mag-section mag-bg-tint py-12 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mag-section-index">02 · Cadence giao tiếp</p>
          <h2 className="mag-section-head !mt-3">
            Khi nào và bằng kênh nào.
          </h2>
          <div className="reveal-stagger mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {[
              { freq: 'Hàng ngày', what: 'Staging URL update', via: 'Tự động qua Linear webhook' },
              { freq: 'Hàng tuần', what: 'Sprint demo + retro', via: 'Zalo/Meet 30–45 phút' },
              { freq: 'Khi cần', what: 'Bug report / câu hỏi nhanh', via: 'Zalo / Linear ticket' },
              { freq: 'Mỗi milestone', what: 'Phase sign-off', via: 'Email + chữ ký số' },
            ].map((c, i) => (
              <div key={i} className="rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
                <div className="text-xs font-mono text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1.5">
                  {c.freq}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">{c.what}</div>
                <div className="mt-2 text-xs text-gray-500 dark:text-ink-500">{c.via}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="mag-section mag-bg-paper py-12 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mag-section-index">03 · Công cụ</p>
          <h2 className="mag-section-head !mt-3">Stack quy trình.</h2>
          <p className="mt-3 text-base text-gray-600 dark:text-ink-400 max-w-2xl">
            Công cụ Alodev dùng để chạy dự án - bạn được invite full quyền view, không cần tài khoản trả phí.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Linear', use: 'Project tracker' },
              { name: 'Figma', use: 'Design + mockup' },
              { name: 'GitHub', use: 'Source repo + CI' },
              { name: 'Vercel/CF', use: 'Staging + prod deploy' },
              { name: 'Zalo + Meet', use: 'Demo + chat' },
              { name: 'Notion', use: 'Tài liệu + handoff' },
            ].map((t, i) => (
              <div key={i} className="rounded-lg border border-gray-200 dark:border-ink-800 px-4 py-3">
                <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                <div className="text-xs text-gray-500 dark:text-ink-500 mt-0.5">{t.use}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mag-section mag-bg-tint py-12 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mag-section-index">04 · Câu hỏi thường gặp</p>
          <h2 className="mag-section-head !mt-3">Về quy trình.</h2>
          <div className="mt-8 space-y-3">
            {faq.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 md:px-6 py-3 md:py-4 open:shadow-md transition"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-3 font-semibold text-gray-900 dark:text-white">
                  <span>{f.q}</span>
                  <svg className="w-5 h-5 mt-0.5 text-gray-400 dark:text-ink-500 transition group-open:rotate-180 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-ink-400 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mag-section mag-bg-paper relative py-12 lg:py-24 overflow-hidden">
        <div className="aurora opacity-50" />
        <div className="reveal relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mag-section-index">05 · Bắt đầu</p>
          <h2 className="mag-section-head !mt-4">
            Sẵn sàng bước vào giai đoạn 01?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-ink-400">
            Cuộc tư vấn miễn phí 30 phút - không sales pitch, không ràng buộc. Chỉ đánh giá fit hay no-fit.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <span className="magnetic w-full sm:w-auto">
              <QuoteCTA size="lg" className="w-full sm:w-auto justify-center">
                Yêu cầu báo giá
              </QuoteCTA>
            </span>
            <Link
              href="/dich-vu"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-ink-900 border border-gray-200 dark:border-ink-800 px-7 py-4 text-gray-900 dark:text-white font-semibold hover:border-gray-300 dark:hover:border-ink-700 transition w-full sm:w-auto"
            >
              Xem dịch vụ &amp; bảng giá
            </Link>
          </div>
        </div>
      </section>
    </MagazineLayout>
  )
}

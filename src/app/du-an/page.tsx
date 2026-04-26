import Link from 'next/link'
import { projects, type Project } from '@/data/projects'
import JsonLd from '@/components/JsonLd'
import Icon, { type IconName } from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'
import { itemListSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata = {
  title: 'Portfolio dự án — 11+ sản phẩm vận hành thật',
  description: '11+ sản phẩm Alodev đã thiết kế, phát triển và đang vận hành — giáo dục, tin tức, e-commerce, hệ thống quản trị. Mỗi dự án có metric đo được cho 3 năng lực: lập trình, thiết kế, SEO.',
  alternates: { canonical: '/du-an' },
  openGraph: { url: '/du-an', title: 'Portfolio dự án — Alodev', description: '11+ sản phẩm Alodev đã xây và vận hành. Lập trình · Thiết kế · SEO — đo bằng metric.' },
}

const capabilities: Array<{ icon: IconName; num: string; title: string; desc: string; points: string[] }> = [
  { icon: 'code',    num: '01', title: 'Lập trình', desc: 'Stack hiện đại, kiến trúc scale được, monitoring + CI/CD ngay từ ngày deploy đầu tiên.', points: ['Next.js · Vue · Node · Postgres', 'Edge deploy + multi-region', 'CI/CD + monitoring 24/7'] },
  { icon: 'palette', num: '02', title: 'Thiết kế', desc: 'Design system tự xây thay vì UI kit copy-paste. Mobile-first, dark mode, motion tinh tế.', points: ['Custom design system', 'Mobile-first + dark mode', 'Micro-interaction tinh tế'] },
  { icon: 'search',  num: '03', title: 'SEO', desc: 'SEO kỹ thuật chuẩn từ deploy đầu tiên. Schema.org, sitemap, OG, canonical — không vá sau.', points: ['Schema.org đầy đủ', 'PageSpeed 90+', 'Sitemap + Search Console'] },
]

export default function DuAnPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Dự án', url: '/du-an' },
        ]),
        itemListSchema(projects.map((p) => ({
          name: p.name,
          url: `/du-an/${p.slug}`,
          description: p.shortDesc,
        }))),
      ]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-white dark:bg-ink-950">
        <div className="aurora opacity-60" />
        <div className="absolute inset-0 grid-bg grid-bg-fade opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 lg:pt-28 lg:pb-20">
          <div className="hero-rise max-w-3xl">
            <Eyebrow>Portfolio</Eyebrow>
            <h1 className="h-display mt-4 text-gray-900 dark:text-white">
              Mỗi dự án là phép thử<br />
              <span className="bg-gradient-to-r from-brand-600 to-brand-700 dark:from-brand-400 dark:to-brand-300 bg-clip-text text-transparent">cho 3 năng lực cốt lõi.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-ink-400 max-w-2xl leading-relaxed">
              Lập trình · thiết kế · SEO. Mỗi card bên dưới đều có metric đo được. Click để xem case study chi tiết.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-10 lg:py-16 bg-white dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 dark:bg-ink-800 rounded-2xl border border-gray-200 dark:border-ink-800 overflow-hidden">
            {capabilities.map((c) => (
              <div key={c.title} className="bg-white dark:bg-ink-950 p-7">
                <div className="flex items-start justify-between">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400">
                    <Icon name={c.icon} className="w-5 h-5" />
                  </div>
                  <span className="tabular text-xs font-mono text-ink-300 dark:text-ink-600">{c.num}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink-900 dark:text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{c.desc}</p>
                <ul className="mt-4 space-y-1.5">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-ink-600 dark:text-ink-200">
                      <Icon name="check" className="w-3.5 h-3.5 mt-0.5 text-brand-600 dark:text-brand-400 shrink-0" strokeWidth={2.25} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects list */}
      <section className="py-12 lg:py-20 bg-white dark:bg-ink-950">
        <div className="reveal-stagger max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i + 1} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 lg:py-24 bg-cream-50 dark:bg-ink-950 border-t border-gray-200 dark:border-ink-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="h-section text-gray-900 dark:text-white">Bạn cũng muốn xuất hiện ở đây?</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-ink-400">Gửi yêu cầu — Alodev biến ý tưởng của bạn thành sản phẩm thật.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <QuoteCTA size="md">Yêu cầu báo giá</QuoteCTA>
            <Link href="/dich-vu" className="rounded-xl bg-white border border-ink-100 px-6 py-3 text-ink-900 font-semibold hover:bg-cream-50 dark:bg-ink-900 dark:border-ink-800 dark:text-white dark:hover:bg-ink-800 transition">Xem bảng giá</Link>
          </div>
        </div>
      </section>
    </>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="lift spotlight rounded-3xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden hover:border-gray-300 dark:hover:border-ink-700">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">
        {/* Thumbnail */}
        <div className={`relative aspect-[16/10] lg:aspect-auto bg-gradient-to-br ${project.colorClass} flex items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative text-center px-6">
            <div className="tabular text-xs font-mono text-gray-500 dark:text-ink-400 mb-2">#{String(index).padStart(2, '0')}</div>
            <div className="text-2xl font-bold text-gray-700 dark:text-ink-200 dark:opacity-90">{project.name}</div>
            <div className="mt-1 text-xs text-gray-600 dark:text-ink-400 font-mono">{project.domain}</div>
          </div>
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/80 dark:bg-ink-900/70 backdrop-blur text-gray-700 dark:text-ink-200 font-bold">
            {project.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 lg:p-7 flex flex-col">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
              <a href={`https://${project.domain}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 dark:text-ink-500 hover:text-brand-600 dark:hover:text-brand-400 transition inline-flex items-center gap-1 font-mono">
                {project.domain}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
            <Link href={`/du-an/${project.slug}`} className="group inline-flex items-center gap-1.5 rounded-lg bg-gray-900 dark:bg-white px-3.5 py-2 text-white dark:text-gray-900 text-xs font-semibold hover:opacity-90 transition">
              Case study
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-ink-400 leading-relaxed">{project.shortDesc}</p>

          {/* Mobile: horizontal swipe carousel; Desktop: 3-col grid */}
          <div className="mt-6 -mx-6 md:mx-0">
            <div className="flex md:grid md:grid-cols-3 gap-3 px-6 md:px-0 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-3 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="snap-center shrink-0 w-[85%] md:w-auto md:shrink"><CapabilityBlock icon="code"    title="Lập trình" tags={project.code.stack.slice(0, 4)} highlights={project.code.highlights.slice(0, 3)} metrics={project.code.metrics} /></div>
              <div className="snap-center shrink-0 w-[85%] md:w-auto md:shrink"><CapabilityBlock icon="palette" title="Thiết kế" highlights={project.design.highlights.slice(0, 3)} metrics={project.design.metrics} /></div>
              <div className="snap-center shrink-0 w-[85%] md:w-auto md:shrink"><CapabilityBlock icon="search"  title="SEO"      highlights={project.seo.highlights.slice(0, 3)} metrics={project.seo.metrics} /></div>
            </div>
            <div className="md:hidden mt-1 px-6 flex justify-center gap-1.5" aria-hidden="true">
              {[0,1,2].map((i) => (<span key={i} className="w-1.5 h-1.5 rounded-full bg-ink-200 dark:bg-ink-700" />))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function CapabilityBlock({
  icon, title, tags, highlights, metrics,
}: {
  icon: IconName
  title: string
  tags?: string[]
  highlights: string[]
  metrics?: { label: string; value: string }[]
}) {
  return (
    <div className="rounded-xl bg-cream-50 dark:bg-ink-950/60 border border-ink-100 dark:border-ink-800 p-4">
      <div className="flex items-center gap-2">
        <Icon name={icon} className="w-4 h-4 text-brand-700 dark:text-brand-400" />
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">{title}</h4>
      </div>
      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {tags.map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-700 dark:bg-ink-900 dark:border-ink-800 dark:text-ink-300 font-mono">
              {t}
            </span>
          ))}
        </div>
      )}
      <ul className="mt-3 space-y-1.5">
        {highlights.map((h) => (
          <li key={h} className="text-xs text-gray-600 dark:text-ink-400 leading-snug flex gap-1.5">
            <span className="text-brand-500 dark:text-brand-400 shrink-0">•</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
      {metrics && metrics.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-ink-800 grid grid-cols-1 gap-1.5">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-ink-500">{m.label}</span>
              <span className="tabular font-bold text-gray-900 dark:text-white font-mono">{m.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
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

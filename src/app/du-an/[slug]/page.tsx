import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects, getProject, type Project } from '@/data/projects'
import JsonLd from '@/components/JsonLd'
import Breadcrumbs from '@/components/Breadcrumbs'
import Icon, { type IconName } from '@/components/Icon'
import QuoteCTA from '@/components/QuoteCTA'
import { projectSchema, breadcrumbSchema } from '@/lib/schema'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) return { title: 'Không tìm thấy dự án' }
  const url = `/du-an/${p.slug}`
  return {
    title: `${p.name} — Case study ${p.category}`,
    description: p.shortDesc,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${p.name} — Case study Alodev`,
      description: p.shortDesc,
      type: 'article',
    },
  }
}

type Params = Promise<{ slug: string }>

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  return <CaseStudy project={project} />
}

function CaseStudy({ project }: { project: Project }) {
  const hasCaseStudy = !!project.caseStudy && project.caseStudy.sections.length > 0

  return (
    <>
      <JsonLd data={[
        projectSchema(project),
        breadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Dự án', url: '/du-an' },
          { name: project.name, url: `/du-an/${project.slug}` },
        ]),
      ]} />

      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${project.colorClass} border-b border-gray-100 dark:border-ink-800`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <Breadcrumbs items={[
            { name: 'Trang chủ', href: '/' },
            { name: 'Dự án', href: '/du-an' },
            { name: project.name, href: `/du-an/${project.slug}` },
          ]} />
          <div className="mt-6">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/80 dark:bg-ink-900/70 text-gray-700 dark:text-ink-200">{project.category}</span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">{project.name}</h1>
            <a href={`https://${project.domain}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-gray-700 dark:text-ink-300 hover:text-brand-700 dark:hover:text-brand-400">
              {project.domain}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <p className="mt-5 text-lg text-gray-700 dark:text-ink-300 max-w-3xl leading-relaxed">{project.longDesc || project.shortDesc}</p>
          </div>
        </div>
      </section>

      {/* Three capability sections */}
      <section className="py-16 bg-white dark:bg-ink-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <CapabilitySection
            icon="code"
            title="Lập trình"
            subtitle="Kiến trúc & công nghệ áp dụng"
            tags={project.code.stack}
            highlights={project.code.highlights}
            metrics={project.code.metrics}
          />
          <CapabilitySection
            icon="palette"
            title="Thiết kế"
            subtitle="UX/UI & design system"
            highlights={project.design.highlights}
            metrics={project.design.metrics}
          />
          <CapabilitySection
            icon="search"
            title="SEO"
            subtitle="Tối ưu công cụ tìm kiếm"
            highlights={project.seo.highlights}
            metrics={project.seo.metrics}
          />
        </div>
      </section>

      {/* Case study body */}
      {hasCaseStudy ? (
        <section className="py-12 lg:py-16 bg-cream-50 dark:bg-ink-950">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {project.caseStudy!.summary && (
              <p className="text-lg text-gray-700 dark:text-ink-300 leading-relaxed mb-10 italic border-l-4 border-brand-500 pl-5">
                {project.caseStudy!.summary}
              </p>
            )}
            <div className="space-y-8">
              {project.caseStudy!.sections.map((s, i) => (
                <div key={i}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{s.title}</h2>
                  <div className="mt-3 text-gray-700 dark:text-ink-300 leading-relaxed whitespace-pre-line">{s.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12 lg:py-16 bg-cream-50 dark:bg-ink-950">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-2xl border-2 border-dashed border-ink-200 dark:border-ink-700 p-10 lg:p-14 bg-white/50 dark:bg-ink-900/40">
              <Icon name="file-text" className="w-9 h-9 mb-3 text-ink-400 dark:text-ink-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Case study đang được biên soạn</h2>
              <p className="mt-3 text-gray-600 dark:text-ink-400 max-w-xl mx-auto">
                Bài chi tiết về quá trình xây dựng dự án này — context kinh doanh, vấn đề kỹ thuật, lựa chọn công nghệ, kết quả đo được — sẽ được cập nhật sớm.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <a href={`https://${project.domain}`} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-ink-900 hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100 px-5 py-2.5 text-white text-sm font-semibold transition">
                  Xem trực tiếp sản phẩm
                </a>
                <QuoteCTA size="sm" variant="outline">Yêu cầu dự án tương tự</QuoteCTA>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      <section className="py-16 bg-white dark:bg-ink-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dự án khác</h2>
            <Link href="/du-an" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">Tất cả →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.filter((p) => p.slug !== project.slug).slice(0, 3).map((p) => (
              <Link key={p.slug} href={`/du-an/${p.slug}`} className="group rounded-2xl border border-gray-200 bg-white overflow-hidden dark:bg-ink-900 dark:border-ink-800 hover:border-brand-300 dark:hover:border-brand-500/40 transition">
                <div className={`aspect-[16/10] bg-gradient-to-br ${p.colorClass} flex items-center justify-center text-lg font-bold text-gray-700 dark:text-ink-200`}>{p.name}</div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">{p.name}</h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-ink-400 line-clamp-2">{p.shortDesc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function CapabilitySection({
  icon, title, subtitle, tags, highlights, metrics,
}: {
  icon: IconName
  title: string
  subtitle: string
  tags?: string[]
  highlights: string[]
  metrics?: { label: string; value: string }[]
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white dark:bg-ink-900 dark:border-ink-800 overflow-hidden">
      <div className="px-6 lg:px-8 py-6 border-b border-ink-100 dark:border-ink-800 flex items-center gap-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400">
          <Icon name={icon} className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink-900 dark:text-white">{title}</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>
        </div>
      </div>
      <div className="px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-brand-300 font-medium">
                  {t}
                </span>
              ))}
            </div>
          )}
          <ul className="space-y-2.5">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-ink-300 leading-relaxed">
                <svg className="w-4 h-4 mt-0.5 text-brand-600 dark:text-brand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
        {metrics && metrics.length > 0 && (
          <div className="rounded-xl bg-cream-50 dark:bg-ink-950/60 border border-slate-200 dark:border-ink-800 p-4 self-start">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-ink-500 mb-3">Chỉ số đo được</div>
            <div className="space-y-2.5">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{m.value}</div>
                  <div className="text-xs text-gray-500 dark:text-ink-500">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import Link from 'next/link'
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getAllPosts } from '@/lib/blog'
import { breadcrumbSchema, collectionPageSchema } from '@/lib/schema'
import MagazineLayout from '@/components/layout/MagazineLayout'

const toc = [
  { num: '01', name: 'Hero',      hash: '#hero' },
  { num: '02', name: 'Bài viết',  hash: '#posts' },
]

export const metadata: Metadata = {
  title: 'Blog Alodev - Bài viết về web/app, hệ thống & SEO',
  description: 'Bài viết founder-perspective về thiết kế website, lập trình app mobile, hệ thống quản trị, SEO kỹ thuật và vận hành sản phẩm thực tế tại Alodev.',
  alternates: { canonical: '/blog' },
  openGraph: {
    url: '/blog',
    title: 'Blog Alodev',
    description: 'Bài viết về web/app, hệ thống quản trị, SEO. Founder-perspective từ Alodev.',
  },
}

function formatVnDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch { return iso }
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <MagazineLayout toc={toc} tagline={<>Bài viết<br />từ founder.</>}>
      <JsonLd data={[
        breadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Blog', url: '/blog' },
        ]),
        collectionPageSchema({
          name: 'Blog Alodev',
          description: 'Bài viết founder-perspective về web/app, hệ thống, SEO.',
          url: '/blog',
          items: posts.map((p) => ({
            name: p.title,
            url: `/blog/${p.slug}`,
            description: p.description ?? undefined,
          })),
        }),
      ]} />

      <section id="hero" className="mag-section mag-bg-paper relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <Breadcrumbs items={[
            { name: 'Trang chủ', href: '/' },
            { name: 'Blog', href: '/blog' },
          ]} />
          <div className="mt-6 max-w-3xl">
            <p className="mag-section-index">Blog</p>
            <h1 className="mag-section-head">
              Bài viết về <span className="text-brand-600 dark:text-brand-400">web/app</span>,<br />
              hệ thống &amp; SEO.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-ink-400 max-w-xl leading-relaxed">
              Founder-perspective về thiết kế web, app, hệ thống và SEO kỹ thuật.
            </p>
          </div>
        </div>
      </section>

      <section id="posts" className="mag-section mag-bg-paper py-12 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-ink-500">Bài viết đầu tiên đang được biên soạn.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-brand-300 dark:hover:border-brand-500/40 p-6 lg:p-8 transition"
                >
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {p.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-xs uppercase tracking-wider font-semibold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="mag-card-head group-hover:text-brand-700 dark:group-hover:text-brand-400 leading-snug transition">
                    {p.title}
                  </h2>
                  {p.description && (
                    <p className="mt-3 text-gray-600 dark:text-ink-400 leading-relaxed line-clamp-3">{p.description}</p>
                  )}
                  <div className="mt-5 flex items-center gap-3 text-xs text-gray-500 dark:text-ink-500">
                    <span>{formatVnDate(p.published_at)}</span>
                    {p.reading_min && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{p.reading_min} phút đọc</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>{p.author_name}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </MagazineLayout>
  )
}

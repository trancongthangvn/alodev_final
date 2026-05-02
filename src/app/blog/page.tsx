import Link from 'next/link'
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getAllPosts } from '@/lib/blog'
import { breadcrumbSchema, collectionPageSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Blog Alodev — Bài viết về web/app, hệ thống & SEO',
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
    <>
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

      <section className="bg-cream-50 dark:bg-ink-950 border-b border-gray-100 dark:border-ink-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
          <Breadcrumbs items={[
            { name: 'Trang chủ', href: '/' },
            { name: 'Blog', href: '/blog' },
          ]} />
          <div className="mt-6 max-w-3xl">
            <div className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Blog</div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              Bài viết về web/app, hệ thống & SEO.
            </h1>
            <p className="mt-5 text-lg text-gray-600 dark:text-zinc-400">
              Founder-perspective về thiết kế website, lập trình app mobile, hệ thống quản trị,
              SEO kỹ thuật và vận hành sản phẩm thực tế.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16 bg-white dark:bg-ink-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-zinc-500">Bài viết đầu tiên đang được biên soạn.</p>
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
                        <span key={t} className="text-[11px] uppercase tracking-wider font-semibold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 leading-snug transition">
                    {p.title}
                  </h2>
                  {p.description && (
                    <p className="mt-3 text-gray-600 dark:text-zinc-400 leading-relaxed line-clamp-3">{p.description}</p>
                  )}
                  <div className="mt-5 flex items-center gap-3 text-xs text-gray-500 dark:text-zinc-500">
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
    </>
  )
}

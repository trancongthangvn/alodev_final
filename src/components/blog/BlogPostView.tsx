import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

/**
 * BlogPostView — shared visual rendering of a blog post body, used by:
 *   • /blog/<slug> (public, server, via wrapper page)
 *   • /admin/blog/preview?id=... (admin, client, fetches from D1)
 *
 * Intentionally excludes JSON-LD, OG metadata and related-posts grid: those
 * are SEO concerns owned by the public route.  The preview only needs the
 * visual surface so the founder can see how the post will look on the site.
 */

export type BlogPostViewData = {
  slug: string
  title: string
  description: string | null
  content: string
  content_html: string | null
  cover_image: string | null
  tags: string[]
  author_name: string
  reading_min: number | null
  published_at: string | null
  updated_at: string
}

function formatVnDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch { return iso }
}

// Mirrors renderMarkdown() in src/app/blog/[slug]/page.tsx.  Kept duplicated
// (rather than imported) so the public route stays free of admin-side imports
// and we don't risk regressing SEO output during preview-only changes.
function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, body) =>
    `<pre class="bg-ink-950 dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-4 overflow-x-auto my-6"><code class="text-sm text-zinc-100 ${lang ? `language-${lang}` : ''}">${body.trim()}</code></pre>`)

  html = html.replace(/`([^`\n]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-cream-100 dark:bg-ink-800 text-sm">$1</code>')

  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-3">$1</h4>')
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-10 mb-4">$1</h3>')
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">$1</h2>')
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-5">$1</h1>')

  html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-4 border-brand-500 pl-5 italic text-gray-700 dark:text-zinc-300 my-6">$1</blockquote>')

  html = html.replace(/(?:^- .+(?:\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map((l) => `<li class="ml-6 list-disc my-1.5">${l.replace(/^- /, '')}</li>`).join('')
    return `<ul class="my-5 space-y-1">${items}</ul>`
  })
  html = html.replace(/(?:^\d+\. .+(?:\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map((l) => `<li class="ml-6 list-decimal my-1.5">${l.replace(/^\d+\. /, '')}</li>`).join('')
    return `<ol class="my-5 space-y-1">${items}</ol>`
  })

  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-gray-900 dark:text-white font-bold">$1</strong>')
  html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-700 dark:text-brand-400 hover:underline">$1</a>')

  html = html.split(/\n{2,}/).map((block) => {
    const trimmed = block.trim()
    if (!trimmed) return ''
    if (/^<(h[1-6]|ul|ol|pre|blockquote|p|div)/.test(trimmed)) return trimmed
    return `<p class="text-gray-700 dark:text-zinc-300 leading-relaxed my-5">${trimmed.replace(/\n/g, '<br>')}</p>`
  }).join('\n')

  return html
}

export default function BlogPostView({ post }: { post: BlogPostViewData }) {
  const url = `/blog/${post.slug}`
  const html = post.content_html && post.content_html.trim()
    ? post.content_html
    : renderMarkdown(post.content)

  const showUpdated = post.updated_at && (
    !post.published_at || post.updated_at.slice(0, 10) !== post.published_at.slice(0, 10)
  )

  return (
    <article>
      <header className="bg-cream-50 dark:bg-ink-950 border-b border-gray-100 dark:border-ink-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <Breadcrumbs items={[
            { name: 'Trang chủ', href: '/' },
            { name: 'Blog', href: '/blog' },
            { name: post.title, href: url },
          ]} />
          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span key={t} className="text-[11px] uppercase tracking-wider font-semibold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          )}
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-5 text-lg text-gray-700 dark:text-zinc-300 leading-relaxed">{post.description}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-zinc-400">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 text-[11px] font-bold">TT</span>
              <span>Bởi <Link href="/ve-chung-toi#founder" className="font-semibold text-gray-900 dark:text-white hover:text-brand-700 dark:hover:text-brand-400">{post.author_name}</Link></span>
            </span>
            {post.published_at ? (
              <>
                <span aria-hidden="true" className="text-gray-300 dark:text-ink-700">·</span>
                <span>Xuất bản <time dateTime={post.published_at}>{formatVnDate(post.published_at)}</time></span>
              </>
            ) : (
              <>
                <span aria-hidden="true" className="text-gray-300 dark:text-ink-700">·</span>
                <span className="italic text-amber-700 dark:text-amber-400">Chưa xuất bản</span>
              </>
            )}
            {showUpdated && (
              <>
                <span aria-hidden="true" className="text-gray-300 dark:text-ink-700">·</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691v4.992m0 0h-4.992m4.992 0l-3.181-3.183a8.25 8.25 0 00-11.667 0l-3.181 3.183" />
                  </svg>
                  Cập nhật <time dateTime={post.updated_at}>{formatVnDate(post.updated_at)}</time>
                </span>
              </>
            )}
            {post.reading_min && (
              <>
                <span aria-hidden="true" className="text-gray-300 dark:text-ink-700">·</span>
                <span>{post.reading_min} phút đọc</span>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="py-10 lg:py-16 bg-white dark:bg-ink-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </section>
    </article>
  )
}

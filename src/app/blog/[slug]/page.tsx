import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getAllPosts, getPost, getRelatedPosts } from '@/lib/blog'
import { articleSchema, breadcrumbSchema, founderPersonSchema } from '@/lib/schema'
import { buildAllSchemas } from '@/lib/articleSchema'
import { PUBLISHER, DEFAULT_AUTHOR, OG_IMAGE } from '@/config/publisher'

export function generateStaticParams() {
  const posts = getAllPosts()
  // Empty array breaks `output: export` ("missing generateStaticParams").
  // Return a sentinel slug so the route exists; the page renders notFound()
  // for unknown slugs which 308 → /not-found.
  if (posts.length === 0) return [{ slug: '_no_posts_yet' }]
  return posts.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Không tìm thấy bài viết', robots: { index: false } }
  const url = `/blog/${post.slug}`
  // Per-post og:image from cover_image when set, else falls back to the
  // site-wide /og.png.  Without this, Next 16's per-page openGraph silently
  // replaces the root's openGraph (no merge), so a missing images field on a
  // post means the og:image meta tag disappears entirely → every post share
  // looks like a 404 preview on Facebook/LinkedIn.
  const ogImages = [
    post.cover_image
      ? { url: post.cover_image, width: 1200, height: 630, alt: post.title }
      : { url: '/og.png', width: 1200, height: 630, alt: 'Alodev' },
  ]
  const metaTitle = post.seo_title || post.title
  const metaDescription = post.description || undefined
  const keywords = Array.from(new Set([
    ...post.tags,
    ...post.lsi_keywords,
    ...(post.focus_keyword ? [post.focus_keyword] : []),
  ].filter(Boolean)))

  return {
    title: metaTitle,
    description: metaDescription,
    keywords,
    authors: [{ name: post.author_name, url: '/ve-chung-toi#founder' }],
    alternates: { canonical: url },
    openGraph: {
      url,
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      tags: post.tags,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImages.map((i) => i.url),
    },
  }
}

function formatVnDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch { return iso }
}

/**
 * Minimal markdown renderer — handles the subset Alodev posts will actually
 * use: headings, paragraphs, bold, italic, code (inline + block), links,
 * lists, blockquotes. Avoids pulling react-markdown (~30KB) which is overkill
 * for founder-led blog volume. If posts get longer or more complex, swap
 * this for `marked` + `dompurify`.
 */
function renderMarkdown(md: string): string {
  // Escape HTML first
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Code blocks ```lang\n...\n```
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, body) =>
    `<pre class="bg-ink-950 dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-4 overflow-x-auto my-6"><code class="text-sm text-zinc-100 ${lang ? `language-${lang}` : ''}">${body.trim()}</code></pre>`)

  // Inline code `x`
  html = html.replace(/`([^`\n]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-cream-100 dark:bg-ink-800 text-sm">$1</code>')

  // Headings (#, ##, ###, ####)
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-3">$1</h4>')
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-10 mb-4">$1</h3>')
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">$1</h2>')
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-5">$1</h1>')

  // Blockquote >
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-4 border-brand-500 pl-5 italic text-gray-700 dark:text-zinc-300 my-6">$1</blockquote>')

  // Lists — collapse consecutive `- ` lines
  html = html.replace(/(?:^- .+(?:\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map((l) => `<li class="ml-6 list-disc my-1.5">${l.replace(/^- /, '')}</li>`).join('')
    return `<ul class="my-5 space-y-1">${items}</ul>`
  })
  html = html.replace(/(?:^\d+\. .+(?:\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map((l) => `<li class="ml-6 list-decimal my-1.5">${l.replace(/^\d+\. /, '')}</li>`).join('')
    return `<ol class="my-5 space-y-1">${items}</ol>`
  })

  // Bold + italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-gray-900 dark:text-white font-bold">$1</strong>')
  html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-700 dark:text-brand-400 hover:underline">$1</a>')

  // Paragraphs — wrap remaining double-newline-separated text
  html = html.split(/\n{2,}/).map((block) => {
    const trimmed = block.trim()
    if (!trimmed) return ''
    if (/^<(h[1-6]|ul|ol|pre|blockquote|p|div)/.test(trimmed)) return trimmed
    return `<p class="text-gray-700 dark:text-zinc-300 leading-relaxed my-5">${trimmed.replace(/\n/g, '<br>')}</p>`
  }).join('\n')

  return html
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const url = `/blog/${post.slug}`
  const related = getRelatedPosts(post.slug, 3)

  // Prefer enriched HTML from paste-import; fall back to markdown rendering
  // for legacy posts authored before the SEO pipeline existed.
  const html = post.content_html && post.content_html.trim()
    ? post.content_html
    : renderMarkdown(post.content)

  // Word count for schema (rough — strips tags, splits on whitespace)
  const plain = (post.content_html || post.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = plain ? plain.split(' ').filter(Boolean).length : 0

  // Use the enriched paste-import schema generator when SEO fields are present,
  // otherwise fall back to alodev's hand-rolled articleSchema().
  const hasSeoFields = post.content_html || post.faq.length > 0 || post.key_takeaways.length > 0 || post.focus_keyword
  const canonical = `${PUBLISHER.url}${url}`
  const schemas: object[] = hasSeoFields
    ? buildAllSchemas({
        headline: post.seo_title || post.title,
        description: post.description || post.title,
        slug: post.slug,
        canonical_url: canonical,
        published: post.published_at,
        modified: post.updated_at,
        category: post.tags?.[0],
        tags: post.tags,
        lsi_keywords: post.lsi_keywords,
        focus_keyword: post.focus_keyword || undefined,
        author: {
          name: post.author_name,
          bio: DEFAULT_AUTHOR.bio_fallback,
          job_title: DEFAULT_AUTHOR.job_title,
          expertise: [...DEFAULT_AUTHOR.expertise],
          social_profiles: [...DEFAULT_AUTHOR.social_profiles],
          avatar: DEFAULT_AUTHOR.avatar,
          url: '/ve-chung-toi#founder',
        },
        featured_image: post.cover_image
          ? { url: post.cover_image, alt: post.title, width: OG_IMAGE.width, height: OG_IMAGE.height }
          : undefined,
        content_type: post.content_type || undefined,
        primary_intent: post.primary_intent || undefined,
        faq: post.faq,
        key_takeaways: post.key_takeaways,
        related_entities: post.related_entities,
        html_body: post.content_html || '',
        word_count: wordCount,
        reading_time_minutes: post.reading_min || Math.max(1, Math.ceil(wordCount / 220)),
      }).all
    : [
        articleSchema({
          url,
          headline: post.title,
          description: post.description || post.title,
          datePublished: post.published_at.slice(0, 10),
          dateModified: post.updated_at.slice(0, 10),
          keywords: post.tags,
          authorName: post.author_name,
          articleSection: post.tags?.[0],
        }),
        breadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url },
        ]),
      ]
  schemas.push(founderPersonSchema())

  return (
    <article itemScope itemType="https://schema.org/Article">
      <JsonLd data={schemas} />

      <header className="bg-cream-50 dark:bg-ink-950 border-b border-gray-100 dark:border-ink-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <Breadcrumbs items={[
            { name: 'Trang chủ', href: '/' },
            { name: 'Blog', href: '/blog' },
            { name: post.title, href: url },
          ]} />
          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span key={t} className="text-[11px] uppercase tracking-wider font-semibold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          )}
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight" itemProp="headline">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-5 text-lg text-gray-700 dark:text-zinc-300 leading-relaxed" itemProp="description">{post.description}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-zinc-400">
            <span itemProp="author" itemScope itemType="https://schema.org/Person" className="inline-flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 text-[11px] font-bold">TT</span>
              <span>Bởi <Link href="/ve-chung-toi#founder" className="font-semibold text-gray-900 dark:text-white hover:text-brand-700 dark:hover:text-brand-400" itemProp="name">{post.author_name}</Link></span>
            </span>
            <span aria-hidden="true" className="text-gray-300 dark:text-ink-700">·</span>
            <span>Xuất bản <time dateTime={post.published_at} itemProp="datePublished">{formatVnDate(post.published_at)}</time></span>
            {post.updated_at && post.updated_at.slice(0, 10) !== post.published_at.slice(0, 10) && (
              <>
                <span aria-hidden="true" className="text-gray-300 dark:text-ink-700">·</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691v4.992m0 0h-4.992m4.992 0l-3.181-3.183a8.25 8.25 0 00-11.667 0l-3.181 3.183" />
                  </svg>
                  Cập nhật <time dateTime={post.updated_at} itemProp="dateModified">{formatVnDate(post.updated_at)}</time>
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
          <div className="prose-content" itemProp="articleBody" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-10 lg:py-16 bg-cream-50 dark:bg-ink-950 border-t border-gray-100 dark:border-ink-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bài viết khác</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-brand-300 dark:hover:border-brand-500/40 p-5 transition">
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 leading-snug">{r.title}</h3>
                  {r.description && <p className="mt-2 text-xs text-gray-600 dark:text-zinc-400 line-clamp-2">{r.description}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

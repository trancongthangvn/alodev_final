/**
 * /admin/blog/preview?id=<id>
 *
 * Renders a draft (or any-status) post as it will appear on /blog/<slug>.
 * Fetches via the same /api/admin/blog/:id endpoint the editor uses, so the
 * preview always reflects the latest D1 row — no rebuild required.
 *
 * Auth gated by ../../_middleware.ts (admin cookie).
 */
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import BlogPostView, { type BlogPostViewData } from '@/components/blog/BlogPostView'

type RawPost = {
  id: string
  slug: string
  title: string
  description: string | null
  content: string | null
  content_html: string | null
  cover_image: string | null
  tags: string | null
  author_name: string | null
  status: string
  reading_min: number | null
  published_at: string | null
  updated_at: string
  created_at: string
}

function normalize(p: RawPost): BlogPostViewData & { status: string } {
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    content: p.content || '',
    content_html: p.content_html,
    cover_image: p.cover_image,
    tags: typeof p.tags === 'string' && p.tags
      ? p.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    author_name: p.author_name || 'Trần Công Thắng',
    reading_min: p.reading_min,
    published_at: p.published_at,
    updated_at: p.updated_at,
    status: p.status,
  }
}

function PreviewInner() {
  const sp = useSearchParams()
  const id = sp.get('id')
  const [post, setPost] = useState<(BlogPostViewData & { status: string }) | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) { setError('Thiếu tham số ?id='); return }
    let aborted = false
    fetch(`/api/admin/blog/${id}`, { credentials: 'same-origin' })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((d: RawPost) => { if (!aborted) setPost(normalize(d)) })
      .catch((e) => { if (!aborted) setError((e as Error).message) })
    return () => { aborted = true }
  }, [id])

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-ink-950">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/30 px-4 py-3 text-sm text-rose-800 dark:text-rose-300">
            Lỗi: {error}
          </div>
          <Link href="/admin/blog" className="mt-4 inline-block text-sm text-brand-700 dark:text-brand-400 hover:underline">← Về danh sách bài</Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-ink-950">
        <div className="max-w-3xl mx-auto px-6 py-16 text-sm text-gray-500 dark:text-zinc-500">Đang tải bản preview…</div>
      </div>
    )
  }

  const isDraft = post.status === 'draft'
  const isArchived = post.status === 'archived'
  const isPublished = post.status === 'published'

  const bannerCls = isPublished
    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300'
    : isArchived
      ? 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300'
      : 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-300'

  return (
    <div className="bg-white dark:bg-ink-950 min-h-screen">
      <div className={`border-b ${bannerCls}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm flex flex-wrap gap-3 items-center justify-between">
          <span className="font-medium">
            {isDraft && <>🟡 <strong>Bản nháp</strong> — chưa hiển thị trên site công khai.</>}
            {isArchived && <>🗄️ <strong>Đã lưu trữ</strong> — không hiển thị trên site công khai.</>}
            {isPublished && (
              <>
                ✅ <strong>Đã publish</strong> — bản công khai:&nbsp;
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener" className="underline font-semibold">/blog/{post.slug}</a>
              </>
            )}
          </span>
          <div className="flex items-center gap-2">
            <Link href="/admin/blog" className="rounded-md border border-current/20 px-3 py-1 text-xs font-semibold hover:bg-current/5">Danh sách</Link>
            <Link href={`/admin/blog/edit?id=${id}`} className="rounded-md bg-ink-900 dark:bg-white text-white dark:text-ink-900 px-3 py-1 text-xs font-semibold hover:bg-ink-800 dark:hover:bg-zinc-100">Sửa bài →</Link>
          </div>
        </div>
      </div>
      <BlogPostView post={post} />
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={null}>
      <PreviewInner />
    </Suspense>
  )
}

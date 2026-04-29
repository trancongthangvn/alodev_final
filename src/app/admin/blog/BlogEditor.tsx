'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '../AdminShell'
import PasteImport from '@/components/admin/PasteImport'
import ImageAltAudit from '@/components/admin/ImageAltAudit'
import type { ParseResult } from '@/lib/articleImport'

/**
 * BlogEditor — used by both /admin/blog/new and /admin/blog/edit?id=XXX.
 * mode='new' shows blank form. mode='edit' fetches existing post by ?id= .
 *
 * Save flow:
 *   POST /api/admin/blog (new)            → returns { id, slug }
 *   PATCH /api/admin/blog/:id (existing)  → returns { ok }
 *
 * Publish flow:
 *   1. Save (PATCH with status='published')
 *   2. Trigger /api/admin/deploy → CF Pages rebuild
 *   3. New post live in /blog/<slug> after ~60s
 *
 * No rich text editor for now — markdown textarea + live preview pane.
 * Founder writes raw markdown which renders predictably and stays small.
 * Tier 2 can add Tiptap or Notion-style editor.
 */

type Post = {
  id: string
  slug: string
  title: string
  description: string | null
  content: string
  /** Enriched HTML body from paste-import.  Null for legacy markdown-only posts. */
  content_html: string | null
  cover_image: string | null
  tags: string | null
  status: string
  published_at: string | null
  reading_min: number | null
  // Paste-import SEO fields
  seo_title: string | null
  focus_keyword: string | null
  content_type: string | null
  primary_intent: string | null
  lsi_keywords: unknown[] | null
  faq: Array<{ q: string; a: string }> | null
  key_takeaways: string[] | null
  related_entities: Array<{ name: string; url?: string }> | null
}

const TAB_BUTTON = 'px-3 py-1.5 text-sm font-medium rounded-md transition'

export default function BlogEditor({ mode }: { mode: 'new' | 'edit' }) {
  const router = useRouter()
  const [id, setId] = useState<string | null>(null)
  const [post, setPost] = useState<Post>({
    id: '', slug: '', title: '', description: '', content: '', content_html: null,
    cover_image: '', tags: '', status: 'draft', published_at: null, reading_min: null,
    seo_title: null, focus_keyword: null, content_type: null, primary_intent: null,
    lsi_keywords: null, faq: null, key_takeaways: null, related_entities: null,
  })
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'edit' | 'html' | 'preview' | 'seo'>('edit')

  useEffect(() => {
    if (mode === 'edit' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const queryId = params.get('id')
      if (!queryId) { setError('Thiếu ?id= trong URL.'); setLoading(false); return }
      setId(queryId)
      fetch(`/api/admin/blog/${queryId}`, { credentials: 'same-origin' })
        .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
        .then((p: Post & { lsi_keywords?: string; faq?: string; key_takeaways?: string; related_entities?: string }) => {
          // D1 returns JSON-string columns as strings; parse them on read.
          const parseArr = <T,>(v: unknown): T[] | null => {
            if (Array.isArray(v)) return v as T[]
            if (typeof v !== 'string' || !v.trim()) return null
            try { const x = JSON.parse(v); return Array.isArray(x) ? x : null } catch { return null }
          }
          setPost({
            id: p.id, slug: p.slug, title: p.title,
            description: p.description ?? '', content: p.content ?? '',
            content_html: p.content_html ?? null,
            cover_image: p.cover_image ?? '', tags: p.tags ?? '',
            status: p.status, published_at: p.published_at, reading_min: p.reading_min,
            seo_title: p.seo_title ?? null,
            focus_keyword: p.focus_keyword ?? null,
            content_type: p.content_type ?? null,
            primary_intent: p.primary_intent ?? null,
            lsi_keywords: parseArr(p.lsi_keywords),
            faq: parseArr<{ q: string; a: string }>(p.faq),
            key_takeaways: parseArr<string>(p.key_takeaways),
            related_entities: parseArr<{ name: string; url?: string }>(p.related_entities),
          })
        })
        .catch((e) => setError((e as Error).message))
        .finally(() => setLoading(false))
    }
  }, [mode])

  async function save(opts: { publish?: boolean } = {}) {
    setSaving(true); setError(null); setStatusMsg(null)
    try {
      const payload: Record<string, unknown> = {
        title: post.title,
        description: post.description,
        content: post.content,
        content_html: post.content_html,
        cover_image: post.cover_image || null,
        tags: post.tags,
        seo_title: post.seo_title,
        focus_keyword: post.focus_keyword,
        content_type: post.content_type,
        primary_intent: post.primary_intent,
        lsi_keywords: post.lsi_keywords,
        faq: post.faq,
        key_takeaways: post.key_takeaways,
        related_entities: post.related_entities,
      }
      if (opts.publish) payload.status = 'published'
      else if (post.status) payload.status = post.status

      let savedId = id
      let savedSlug = post.slug
      if (mode === 'new') {
        const r = await fetch('/api/admin/blog', {
          method: 'POST', credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        })
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`)
        savedId = j.id; savedSlug = j.slug
        // For new posts, redirect to edit page so subsequent saves are PATCH
        router.replace(`/admin/blog/edit?id=${j.id}`)
      } else if (id) {
        // Allow slug edit on existing posts
        if (post.slug) payload.slug = post.slug
        const r = await fetch(`/api/admin/blog/${id}`, {
          method: 'PATCH', credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        })
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`)
      }
      setStatusMsg(opts.publish ? 'Đã lưu + đặt published. Click Deploy để rebuild site.' : 'Đã lưu nháp.')
      if (opts.publish) {
        setPost((p) => ({ ...p, status: 'published' }))
      }
      void savedSlug
      void savedId
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  // Wire paste-import → form fields.  All fields are optional fallbacks; if
  // the YAML doesn't supply seo_title we keep the title field instead, etc.
  function handlePasteImport(result: ParseResult) {
    if (!result.article) return
    const a = result.article
    setPost((p) => ({
      ...p,
      title: a.h1 || a.seo_title || p.title,
      slug: a.slug || p.slug,
      description: a.meta_description || p.description,
      content: p.content, // keep markdown body untouched — paste-import targets HTML body
      content_html: a.html_body || null,
      cover_image: a.featured_image?.url || p.cover_image,
      tags: Array.isArray(a.tags) && a.tags.length ? a.tags.join(',') : (p.tags ?? ''),
      seo_title: a.seo_title || null,
      focus_keyword: a.focus_keyword || null,
      content_type: a.content_type || null,
      primary_intent: a.primary_intent || null,
      lsi_keywords: a.lsi_keywords || [],
      faq: a.faq || [],
      key_takeaways: a.key_takeaways || [],
      related_entities: a.related_entities || [],
    }))
    setActiveTab('preview')
    setStatusMsg(`Đã điền form từ paste-import (${result.stats?.word_count ?? 0} từ, ${result.stats?.h2_count ?? 0} H2, ${result.stats?.faq_count ?? 0} FAQ).`)
  }

  async function deployNow() {
    setSaving(true); setStatusMsg(null); setError(null)
    try {
      const r = await fetch('/api/admin/deploy', { method: 'POST', credentials: 'same-origin' })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`)
      setStatusMsg('Đã queue deploy. Site cập nhật trong ~60s.')
    } catch (e) {
      setError((e as Error).message)
    } finally { setSaving(false) }
  }

  if (loading) {
    return <AdminShell><div className="text-center py-16 text-gray-400">Đang tải…</div></AdminShell>
  }

  return (
    <AdminShell>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {mode === 'new' ? 'Bài viết mới' : 'Sửa bài viết'}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
            {mode === 'edit' && post.slug && (
              <>
                <span className="font-mono text-xs">/blog/{post.slug}</span>
                {post.status === 'published' && (
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener" className="ml-2 text-brand-700 dark:text-brand-400 hover:underline">Xem live ↗</a>
                )}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => save()} disabled={saving} className="rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-4 py-2 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-ink-800 disabled:opacity-50">
            {saving ? 'Đang lưu…' : 'Lưu nháp'}
          </button>
          <button onClick={() => save({ publish: true })} disabled={saving} className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50">
            Publish
          </button>
          {mode === 'edit' && post.status === 'published' && (
            <button onClick={deployNow} disabled={saving} className="rounded-lg bg-ink-900 dark:bg-white text-white dark:text-ink-900 px-4 py-2 text-sm font-semibold hover:bg-ink-800 dark:hover:bg-zinc-100 disabled:opacity-50">
              Deploy
            </button>
          )}
        </div>
      </header>

      {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300">{error}</div>}
      {statusMsg && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300">{statusMsg}</div>}

      <div className="mb-4">
        <PasteImport
          onImport={handlePasteImport}
          hasExistingContent={!!(post.title || post.content || post.content_html)}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 space-y-5">
        <Field label="Tiêu đề" required>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            placeholder="Vì sao Alodev chọn Next.js cho dự án doanh nghiệp"
            className="w-full rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-950 text-gray-900 dark:text-white px-4 py-3 text-lg font-semibold focus:outline-none focus:border-brand-500"
          />
          <Counter value={post.title} max={70} sweet={[40, 60]} hint="Khuyến nghị 40-60 ký tự (Google SERP)" />
        </Field>

        {mode === 'edit' && (
          <Field label="Slug (URL)">
            <input
              type="text"
              value={post.slug}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-950 text-gray-900 dark:text-white px-4 py-2 text-sm font-mono focus:outline-none focus:border-brand-500"
            />
          </Field>
        )}

        <div className="border-b border-gray-200 dark:border-ink-800 flex gap-1 flex-wrap">
          <button onClick={() => setActiveTab('edit')} className={`${TAB_BUTTON} ${activeTab === 'edit' ? 'bg-cream-50 dark:bg-ink-950 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-400'}`}>Markdown</button>
          <button onClick={() => setActiveTab('html')} className={`${TAB_BUTTON} ${activeTab === 'html' ? 'bg-cream-50 dark:bg-ink-950 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-400'}`}>
            HTML body{post.content_html ? <span className="ml-1 text-emerald-600 dark:text-emerald-400">●</span> : null}
          </button>
          <button onClick={() => setActiveTab('preview')} className={`${TAB_BUTTON} ${activeTab === 'preview' ? 'bg-cream-50 dark:bg-ink-950 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-400'}`}>Preview</button>
          <button onClick={() => setActiveTab('seo')} className={`${TAB_BUTTON} ${activeTab === 'seo' ? 'bg-cream-50 dark:bg-ink-950 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-400'}`}>SEO &amp; Meta</button>
        </div>

        {activeTab === 'edit' && (
          <Field label="Nội dung (markdown)">
            <textarea
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              rows={24}
              placeholder="# Tiêu đề chính\n\nViết nội dung markdown ở đây.\n\n## Phần 1\n\n- Bullet point\n- **bold**, *italic*, `code`\n\n```ts\n// Code block\nconst x = 1\n```"
              className="w-full rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-950 text-gray-900 dark:text-white px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none focus:border-brand-500"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-zinc-500">
              Markdown body. Public page hiển thị field này khi <em>không</em> có HTML body.
            </p>
          </Field>
        )}

        {activeTab === 'html' && (
          <Field label="HTML body (paste-import)">
            <textarea
              value={post.content_html ?? ''}
              onChange={(e) => setPost({ ...post, content_html: e.target.value || null })}
              rows={20}
              placeholder="<article>\n  <h2>Heading</h2>\n  <p>...</p>\n</article>\n\nDán block YAML+HTML ở panel phía trên để tự động điền field này."
              className="w-full rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-950 text-gray-900 dark:text-white px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none focus:border-brand-500"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-zinc-500">
              {post.content_html
                ? 'Khi có HTML body, public page sẽ render HTML này (có TOC, srcset, banner) thay vì markdown.'
                : 'Để trống → public page render markdown ở tab "Markdown".'}
            </p>
            {post.content_html && (
              <div className="mt-3">
                <ImageAltAudit
                  html={post.content_html}
                  onChange={(next) => setPost({ ...post, content_html: next })}
                />
              </div>
            )}
          </Field>
        )}

        {activeTab === 'preview' && (
          <div className="rounded-lg border border-gray-200 dark:border-ink-800 bg-cream-50 dark:bg-ink-950 p-6 prose-content min-h-[400px]">
            {post.content_html
              ? <div dangerouslySetInnerHTML={{ __html: post.content_html }} />
              : <Preview md={post.content} />}
          </div>
        )}

        {activeTab === 'seo' && (
          <>
            <Field label="Mô tả meta (SEO)">
              <textarea
                value={post.description ?? ''}
                onChange={(e) => setPost({ ...post, description: e.target.value })}
                rows={3}
                placeholder="Mô tả 120-160 ký tự — hiển thị trên Google SERP"
                className="w-full rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-950 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-brand-500"
              />
              <Counter value={post.description ?? ''} max={165} sweet={[120, 160]} hint="Khuyến nghị 120-160 ký tự" />
            </Field>
            <Field label="Tags (cách nhau dấu phẩy)">
              <input
                type="text"
                value={post.tags ?? ''}
                onChange={(e) => setPost({ ...post, tags: e.target.value })}
                placeholder="seo, nextjs, case-study"
                className="w-full rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-950 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-brand-500"
              />
            </Field>
            <Field label="Cover image URL (tùy chọn)">
              <input
                type="url"
                value={post.cover_image ?? ''}
                onChange={(e) => setPost({ ...post, cover_image: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-950 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-brand-500"
              />
            </Field>
          </>
        )}
      </div>
    </AdminShell>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
        {label}{required && <span className="text-rose-500 ml-1">*</span>}
      </div>
      {children}
    </label>
  )
}

function Counter({ value, max, sweet, hint }: { value: string; max: number; sweet: [number, number]; hint: string }) {
  const len = value.length
  const inSweet = len >= sweet[0] && len <= sweet[1]
  const tooLong = len > max
  return (
    <div className={`mt-1 text-xs ${tooLong ? 'text-rose-600' : inSweet ? 'text-emerald-600' : 'text-gray-500 dark:text-zinc-500'}`}>
      {len} ký tự — {hint}
    </div>
  )
}

function Preview({ md }: { md: string }) {
  // Reuse the same markdown renderer as the public blog page (kept inline
  // here to avoid client/server boundary import issues).
  let html = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, body) =>
    `<pre class="bg-ink-950 dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-4 overflow-x-auto my-6"><code class="text-sm text-zinc-100">${body.trim()}</code></pre>`)
  html = html.replace(/`([^`\n]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-cream-100 dark:bg-ink-800 text-sm">$1</code>')
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-lg font-bold mt-8 mb-3">$1</h4>')
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-bold mt-10 mb-4">$1</h3>')
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold mt-12 mb-5">$1</h2>')
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold mt-12 mb-5">$1</h1>')
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-4 border-brand-500 pl-5 italic my-6">$1</blockquote>')
  html = html.replace(/(?:^- .+(?:\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map((l) => `<li class="ml-6 list-disc my-1.5">${l.replace(/^- /, '')}</li>`).join('')
    return `<ul class="my-5">${items}</ul>`
  })
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-700 hover:underline">$1</a>')
  html = html.split(/\n{2,}/).map((b) => {
    const t = b.trim()
    if (!t) return ''
    if (/^<(h[1-6]|ul|ol|pre|blockquote|p|div)/.test(t)) return t
    return `<p class="my-5 leading-relaxed">${t.replace(/\n/g, '<br>')}</p>`
  }).join('\n')
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

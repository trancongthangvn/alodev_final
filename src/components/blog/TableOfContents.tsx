'use client'

import { useEffect, useState } from 'react'

type Heading = { id: string; text: string; level: 2 | 3 }

/**
 * Sticky right-side ToC on desktop, drawer-like collapsible on mobile.
 *
 * Auto-generates entries from the article's h2/h3 elements after mount.
 * Assigns IDs to headings that don't have one (slugify of text), so the
 * ToC links scroll-to-section without requiring HTML to be pre-tagged.
 *
 * Scroll-spy: highlights the heading nearest the top of the viewport so
 * the reader always knows which section they're in.
 */
export default function TableOfContents({ articleId = 'article-body' }: { articleId?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [open, setOpen] = useState(false) // mobile drawer

  useEffect(() => {
    const article = document.getElementById(articleId)
    if (!article) return

    const nodes = Array.from(article.querySelectorAll<HTMLElement>('h2, h3'))
    const list: Heading[] = []

    function slugify(s: string): string {
      return s
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60)
    }

    const seenIds = new Set<string>()
    for (const n of nodes) {
      const text = (n.textContent || '').trim()
      if (!text) continue
      let id = n.id
      if (!id) {
        const base = slugify(text) || 'section'
        let candidate = base
        let i = 2
        while (seenIds.has(candidate) || document.getElementById(candidate)) {
          candidate = `${base}-${i++}`
        }
        id = candidate
        n.id = id
      }
      seenIds.add(id)
      list.push({ id, text, level: n.tagName === 'H3' ? 3 : 2 })
    }
    setHeadings(list)

    // Skip ToC entirely if too few headings — it's noise on short posts.
    if (list.length < 3) return

    // Scroll-spy via IntersectionObserver — fires when a heading crosses
    // the 20%-from-top mark, so the highlighted item leads the eye.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId((visible[0].target as HTMLElement).id)
      },
      { rootMargin: '-15% 0px -75% 0px' },
    )
    for (const n of nodes) if (n.id) observer.observe(n)
    return () => observer.disconnect()
  }, [articleId])

  if (headings.length < 3) return null

  return (
    <>
      {/* Desktop: sticky sidebar on the right */}
      <nav
        aria-label="Mục lục"
        className="hidden xl:block fixed right-6 top-32 w-56 max-h-[calc(100vh-10rem)] overflow-y-auto z-20"
      >
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-3">
          Trong bài này
        </div>
        <ul className="space-y-1.5 text-sm">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
              <a
                href={`#${h.id}`}
                className={`block py-1 leading-snug transition border-l-2 pl-3 -ml-3 ${
                  activeId === h.id
                    ? 'border-brand-500 text-brand-700 dark:text-brand-400 font-medium'
                    : 'border-transparent text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile / tablet: floating chip → drawer */}
      <div className="xl:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-toc"
          className="fixed bottom-24 right-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-ink-900 dark:bg-white px-3.5 py-2 text-xs font-semibold text-white dark:text-ink-900 shadow-lg shadow-ink-900/20"
        >
          <span aria-hidden="true">☰</span> Mục lục
        </button>

        {open && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
            <div
              id="mobile-toc"
              role="dialog"
              aria-label="Mục lục bài viết"
              className="fixed inset-x-3 bottom-3 z-50 max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-500">Mục lục</div>
                <button onClick={() => setOpen(false)} aria-label="Đóng" className="text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200">✕</button>
              </div>
              <ul className="space-y-1.5 text-sm">
                {headings.map((h) => (
                  <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                    <a
                      href={`#${h.id}`}
                      onClick={() => setOpen(false)}
                      className={`block py-1 leading-snug ${
                        activeId === h.id
                          ? 'text-brand-700 dark:text-brand-400 font-medium'
                          : 'text-gray-700 dark:text-zinc-300'
                      }`}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </>
  )
}

'use client'

import { useEffect } from 'react'

/**
 * Mounts global motion enhancements:
 *  1. IntersectionObserver auto-reveals elements with class `.reveal` or `.reveal-stagger`
 *     by adding `data-revealed` once they cross the viewport (one-shot).
 *  2. Cursor-aware spotlight: tracks pointer over `.spotlight` cards, sets CSS vars
 *     `--mx` / `--my` so the radial highlight follows the cursor.
 *  3. Scroll progress bar at top of viewport.
 *
 * All effects respect `prefers-reduced-motion`.
 */
export default function MotionLayer() {
  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ─── 1. Reveal on scroll ───
    if (!reduced && typeof IntersectionObserver !== 'undefined') {
      const targets = document.querySelectorAll<HTMLElement>('.reveal, .reveal-stagger')
      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.setAttribute('data-revealed', '')
              obs.unobserve(e.target)
            }
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
      )
      targets.forEach((t) => obs.observe(t))

      // Re-scan after route change / dynamic content (lightweight MutationObserver)
      const mo = new MutationObserver(() => {
        document.querySelectorAll<HTMLElement>('.reveal:not([data-revealed]), .reveal-stagger:not([data-revealed])').forEach((el) => {
          if (!el.dataset.observed) {
            el.dataset.observed = '1'
            obs.observe(el)
          }
        })
      })
      mo.observe(document.body, { childList: true, subtree: true })

      // ─── 2. Cursor spotlight ───
      function onMove(e: PointerEvent) {
        const target = e.target as Element | null
        const card = target?.closest('.spotlight') as HTMLElement | null
        if (!card) return
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
        card.style.setProperty('--my', `${e.clientY - rect.top}px`)
      }
      window.addEventListener('pointermove', onMove, { passive: true })

      // ─── 3. Scroll progress ───
      let bar = document.getElementById('scroll-progress') as HTMLDivElement | null
      if (!bar) {
        bar = document.createElement('div')
        bar.id = 'scroll-progress'
        bar.className = 'scroll-progress'
        document.body.appendChild(bar)
      }
      function onScroll() {
        const h = document.documentElement
        const max = h.scrollHeight - h.clientHeight
        const pct = max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0
        if (bar) bar.style.width = `${pct}%`
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()

      return () => {
        obs.disconnect()
        mo.disconnect()
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('scroll', onScroll)
      }
    } else {
      // Reduced motion — just reveal everything immediately
      document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => el.setAttribute('data-revealed', ''))
    }
  }, [])

  return null
}

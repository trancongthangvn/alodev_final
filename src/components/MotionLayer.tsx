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

      // ─── 2. Cursor spotlight + magnetic CTA pull ───
      // Magnetic radius — within this many px, the .magnetic element drifts
      // toward the cursor. Subtle (max 6px translate) so it doesn't feel
      // janky on misaim. Disabled on touch devices.
      const MAG_RADIUS = 90
      const MAG_MAX = 6
      const isCoarse = window.matchMedia('(pointer: coarse)').matches

      function onMove(e: PointerEvent) {
        const target = e.target as Element | null
        const card = target?.closest('.spotlight') as HTMLElement | null
        if (card) {
          const rect = card.getBoundingClientRect()
          card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
          card.style.setProperty('--my', `${e.clientY - rect.top}px`)
        }

        if (isCoarse) return
        // For each visible .magnetic, compute distance to cursor and pull
        const mags = document.querySelectorAll<HTMLElement>('.magnetic')
        mags.forEach((m) => {
          const r = m.getBoundingClientRect()
          const cx = r.left + r.width / 2
          const cy = r.top + r.height / 2
          const dx = e.clientX - cx
          const dy = e.clientY - cy
          const d = Math.hypot(dx, dy)
          if (d < MAG_RADIUS) {
            const k = (1 - d / MAG_RADIUS) * MAG_MAX
            const tx = (dx / d) * k
            const ty = (dy / d) * k
            m.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
            const inner = m.firstElementChild as HTMLElement | null
            if (inner) inner.style.transform = `scale(${1 + (1 - d / MAG_RADIUS) * 0.025})`
          } else {
            m.style.transform = ''
            const inner = m.firstElementChild as HTMLElement | null
            if (inner) inner.style.transform = ''
          }
        })
      }
      window.addEventListener('pointermove', onMove, { passive: true })

      function onLeave() {
        // Reset all magnetic when pointer leaves window
        document.querySelectorAll<HTMLElement>('.magnetic').forEach((m) => {
          m.style.transform = ''
          const inner = m.firstElementChild as HTMLElement | null
          if (inner) inner.style.transform = ''
        })
      }
      window.addEventListener('pointerleave', onLeave)

      // ─── 3. Scroll progress + process-line scroll-fill ───
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

        // Process line: fill 0→1 as the section travels through viewport
        document.querySelectorAll<HTMLElement>('.process-track').forEach((track) => {
          const wrap = track.closest<HTMLElement>('[data-process-section]') || track.parentElement
          if (!wrap) return
          const rect = wrap.getBoundingClientRect()
          const vh = window.innerHeight
          // Fill as the section's top crosses 70% viewport down to bottom 30%
          const start = vh * 0.75
          const end = vh * 0.25
          const top = rect.top
          let progress = (start - top) / (start - end)
          progress = Math.max(0, Math.min(1, progress))
          track.style.setProperty('--fill', String(progress))
        })
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()

      return () => {
        obs.disconnect()
        mo.disconnect()
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerleave', onLeave)
        window.removeEventListener('scroll', onScroll)
      }
    } else {
      // Reduced motion — just reveal everything immediately
      document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => el.setAttribute('data-revealed', ''))
      // Pre-fill process tracks
      document.querySelectorAll<HTMLElement>('.process-track').forEach((t) => t.style.setProperty('--fill', '1'))
    }
  }, [])

  return null
}

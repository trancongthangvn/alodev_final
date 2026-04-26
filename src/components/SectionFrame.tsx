'use client'

import { useEffect, useState } from 'react'

/**
 * Rauno-style "frame mounted" indicator that floats above the page:
 *   - 4 corner crosshair markers (subtle, fixed-position)
 *   - top-right pill showing the section currently in viewport
 *
 * Pages opt-in by tagging sections with `data-section-name="..."`.
 * The indicator is hidden until the user scrolls past the hero, so the
 * very first impression stays clean.
 *
 * Hidden on mobile via CSS (too cramped).
 */
export default function SectionFrame() {
  const [name, setName] = useState<string>('')
  const [num, setNum] = useState<string>('00')
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Still render frame, just no indicator updates
      return
    }

    function scan() {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-section-name]')
      )
      if (!sections.length) return
      const mid = window.innerHeight * 0.4
      let active: HTMLElement | null = null
      for (const s of sections) {
        const r = s.getBoundingClientRect()
        if (r.top <= mid && r.bottom >= mid) {
          active = s
          break
        }
      }
      // fallback: nearest above viewport mid
      if (!active) {
        let best = -Infinity
        for (const s of sections) {
          const r = s.getBoundingClientRect()
          if (r.top <= mid && r.top > best) {
            best = r.top
            active = s
          }
        }
      }
      if (active) {
        const idx = sections.indexOf(active)
        setName(active.dataset.sectionName || '')
        setNum(String(idx + 1).padStart(2, '0'))
        setShow(idx > 0) // keep hidden while in hero
      }
    }

    scan()
    window.addEventListener('scroll', scan, { passive: true })
    window.addEventListener('resize', scan)
    return () => {
      window.removeEventListener('scroll', scan)
      window.removeEventListener('resize', scan)
    }
  }, [])

  return (
    <div className="section-frame" aria-hidden="true">
      <span className="ch ch-tl" />
      <span className="ch ch-tr" />
      <span className="ch ch-bl" />
      <span className="ch ch-br" />
      <div className="ind" {...(show ? { 'data-on': '' } : {})}>
        <span className="ind-dot" />
        <span className="ind-num">{num}</span>
        <span className="ind-name">{name || 'Trang chủ'}</span>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'

/**
 * SectionIndicator — fixed bottom-right "you are here" pin.
 *
 * Tracks which homepage section the user is currently in and shows
 * "01 / 04 — STATEMENT" style indicator. Updates as scroll progresses.
 * Reference: Apple feature pages, lusion case studies, Stripe launches
 * — sites that show navigation context as you read.
 *
 * Sections enumerated by [data-section-name] attribute on each
 * <section>. Active = section whose center is closest to viewport mid.
 */
export default function SectionIndicator() {
  const [active, setActive] = useState<{ idx: number; total: number; name: string } | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    function update() {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('section[data-section-name]'),
      )
      if (!sections.length) return
      const mid = window.innerHeight / 2
      let bestIdx = 0
      let bestDist = Infinity
      sections.forEach((s, i) => {
        const r = s.getBoundingClientRect()
        const c = r.top + r.height / 2
        const d = Math.abs(c - mid)
        if (d < bestDist) {
          bestDist = d
          bestIdx = i
        }
      })
      setActive({
        idx: bestIdx + 1,
        total: sections.length,
        name: sections[bestIdx].dataset.sectionName ?? '',
      })

      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }

    update()
    const onScroll = () => update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('lenis-scroll', onScroll as EventListener)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('lenis-scroll', onScroll as EventListener)
      window.removeEventListener('resize', update)
    }
  }, [])

  if (!active) return null

  return (
    <div
      className="fixed bottom-5 right-5 z-40 hidden lg:flex items-center gap-3 rounded-full border border-gray-200 dark:border-ink-800 bg-white/85 dark:bg-ink-950/85 backdrop-blur-md px-3.5 py-2 shadow-sm pointer-events-none"
      aria-hidden="true"
    >
      <span className="text-[10px] font-mono tabular text-gray-900 dark:text-white">
        {String(active.idx).padStart(2, '0')}{' '}
        <span className="text-gray-400 dark:text-ink-600">/ {String(active.total).padStart(2, '0')}</span>
      </span>
      <span className="w-px h-3 bg-gray-300 dark:bg-ink-700" />
      <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-gray-700 dark:text-ink-300">
        {active.name}
      </span>
      {/* Mini progress arc */}
      <span className="relative w-4 h-4">
        <svg viewBox="0 0 16 16" className="w-4 h-4 -rotate-90">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300 dark:text-ink-700" />
          <circle
            cx="8"
            cy="8"
            r="6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 6.5}`}
            strokeDashoffset={`${2 * Math.PI * 6.5 * (1 - progress)}`}
            className="text-brand-500 transition-[stroke-dashoffset] duration-200"
          />
        </svg>
      </span>
    </div>
  )
}

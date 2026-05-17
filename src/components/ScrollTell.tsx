'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Step = {
  /** Optional badge label (e.g. "01", "Khám phá"). */
  badge?: string
  /** Step heading. */
  title: string
  /** Body content - string or JSX. */
  body: ReactNode
}

type Props = {
  /** Sticky-side eyebrow (small uppercase tag above the title). */
  eyebrow?: string
  /** Sticky-side main title. */
  title: string
  /** Optional sticky-side body (1-2 sentences). */
  intro?: string
  /** Right-column steps that scroll past the sticky title. */
  steps: Step[]
  /** Optional className on the outer section. */
  className?: string
}

/**
 * Sticky scroll-tell - left column pins at viewport mid while right column
 * scrolls past. Pattern signature of Apple feature pages, lusion case
 * studies, akaru about pages. As each step on the right enters the
 * viewport center, it fades + slides up; the left title stays anchored,
 * giving a "I'm watching this story unfold" feel.
 *
 * Vertical scroll, vertical content - fundamentally different cadence
 * from the kinetic marquee (horizontal type) and horizontal-pin
 * showcase (horizontal cards). Adds a third scroll flavour on the page.
 *
 * Mobile collapses to single column with steps stacked normally.
 */
export default function ScrollTell({ eyebrow, title, intro, steps, className = '' }: Props) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const items = root.querySelectorAll<HTMLElement>('[data-step]')
    if (reduced) {
      items.forEach((el) => el.setAttribute('data-revealed', ''))
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-revealed', '')
          }
        }
      },
      // Trigger when 35% of the step crosses the viewport bottom-30% line -
      // the moment the eye lands on it during downward scroll.
      { threshold: 0.35, rootMargin: '0px 0px -20% 0px' },
    )
    items.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={rootRef} className={`scroll-tell ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
          {/* LEFT - sticky title block. lg:col-span-5, sticky top:25vh, the
              right column steps glide past it. */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[25vh]">
              {eyebrow && (
                <div className="inline-flex items-center gap-2">
                  <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                    {eyebrow}
                  </span>
                </div>
              )}
              <h2 className="h-section mt-3 text-gray-900 dark:text-white">{title}</h2>
              {intro && (
                <p className="mt-5 text-base lg:text-lg text-gray-600 dark:text-ink-400 leading-relaxed">
                  {intro}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT - scrolling steps. lg:col-span-7 with vertical gap so each
              step occupies enough scroll travel for the left to stay pinned
              through the whole sequence. */}
          <div className="lg:col-span-7 mt-10 lg:mt-0 space-y-12 lg:space-y-32">
            {steps.map((s, i) => (
              <div key={i} data-step className="scroll-tell-step">
                {s.badge && (
                  <div className="text-sm font-mono tabular text-brand-600 dark:text-brand-400 mb-3">
                    {s.badge}
                  </div>
                )}
                <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                  {s.title}
                </h3>
                <div className="mt-4 text-gray-600 dark:text-ink-400 leading-relaxed">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

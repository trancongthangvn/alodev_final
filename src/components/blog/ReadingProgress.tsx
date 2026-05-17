'use client'

import { useEffect, useState } from 'react'

/**
 * Thin (2px) progress bar fixed to the top of the viewport, tracking
 * the user's scroll through the article body. Helps long-form readers
 * gauge how much more is left without scrolling to check.
 *
 * Reads the article-body height from a target element id (defaults to
 * `article-body`) so the bar fills to 100% when the END of the article
 * reaches the bottom of the viewport — not when the entire document
 * (including footer/related posts) is fully scrolled.
 */
export default function ReadingProgress({ targetId = 'article-body' }: { targetId?: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return

    function compute() {
      const target = document.getElementById(targetId)
      if (!target) return
      const rect = target.getBoundingClientRect()
      const total = target.offsetHeight - window.innerHeight + rect.top + window.scrollY
      const scrolled = window.scrollY - (rect.top + window.scrollY - 0)
      const ratio = total > 0 ? Math.min(1, Math.max(0, (window.scrollY + window.innerHeight - (rect.top + window.scrollY)) / target.offsetHeight)) : 0
      setProgress(ratio)
    }

    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [targetId])

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 z-50 h-[2px] bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500 transition-[width] duration-75"
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'

/**
 * BackToTop — floating circular button at the bottom-right that smooth-
 * scrolls the page back to the top. Hidden until the user has scrolled
 * past 600px so it doesn't compete with above-the-fold UI.
 *
 * On mobile (md:hidden, the sticky CTA bar takes priority): the button
 * is positioned bottom-right slightly above the safe area to avoid the
 * sticky bar. On desktop, it sits flush in the corner.
 *
 * Smooth scroll relies on globals.css `scroll-behavior: smooth` (added
 * in the a11y commit) and is auto-disabled by prefers-reduced-motion.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      aria-label="Lên đầu trang"
      onClick={scrollTop}
      className={`fixed right-4 bottom-24 md:bottom-6 z-30 inline-flex items-center justify-center w-11 h-11 rounded-full border border-gray-200 dark:border-ink-700 bg-white/95 dark:bg-ink-900/95 backdrop-blur-md shadow-lg shadow-black/10 dark:shadow-black/40 text-gray-700 dark:text-ink-200 hover:text-ink-900 hover:border-gray-300 dark:hover:text-white dark:hover:border-ink-600 transition-all duration-300 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.25}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  )
}

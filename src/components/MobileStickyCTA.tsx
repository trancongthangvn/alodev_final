'use client'

import { useEffect, useState } from 'react'
import Icon from '@/components/Icon'

/**
 * MobileStickyCTA — fixed bottom bar on mobile only with two primary
 * actions: "Yêu cầu báo giá" (opens the QuoteChoice modal via the same
 * `alodev:open-quote` event the QuoteCTA button dispatches) and a Zalo
 * deep-link.
 *
 * Hides itself when:
 *   - the IntroAnimation overlay is still on screen (the bar would float
 *     above the intro and look broken)
 *   - the user has scrolled to the final-CTA section (where there are
 *     already two large buttons — duplicating them would be noise)
 *   - the mobile menu drawer is open (Navbar dispatches a class on body)
 *
 * Uses iOS safe-area-inset-bottom so the bar clears the home indicator.
 */
export default function MobileStickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    function recompute() {
      // 1. Hide while intro is still on screen.
      const intro = document.querySelector('[data-intro-overlay]') as HTMLElement | null
      if (intro && getComputedStyle(intro).opacity !== '0' && intro.offsetHeight > 0) {
        setVisible(false)
        return
      }
      // 2. Hide while mobile drawer is open (Navbar uses no body class —
      //    detect via the `Menu` button's aria-expanded).
      const menuBtn = document.querySelector('header [aria-label=Menu]') as HTMLElement | null
      if (menuBtn?.getAttribute('aria-expanded') === 'true') {
        setVisible(false)
        return
      }
      // 3. Hide when the final-CTA section OR the footer is in view —
      //    duplicating the CTAs in the final section would be visual
      //    noise; the footer has its own contact links and the white
      //    bar would clash with the dark slate footer bg.
      const blockers: (Element | null)[] = [
        document.querySelector('[data-section-name="Liên hệ"]'),
        document.querySelector('footer'),
      ]
      for (const b of blockers) {
        if (!b) continue
        const r = b.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) {
          setVisible(false)
          return
        }
      }
      // 4. Otherwise show after the user has scrolled past the eyebrow
      //    (so the bar does not flash on top of the hero on first paint).
      setVisible(window.scrollY > 120)
    }

    recompute()
    window.addEventListener('scroll', recompute, { passive: true })
    window.addEventListener('resize', recompute)
    // The Navbar drawer toggle does not fire scroll/resize; observe the
    // header for aria-expanded changes.
    const header = document.querySelector('header')
    let mo: MutationObserver | null = null
    if (header) {
      mo = new MutationObserver(recompute)
      mo.observe(header, { subtree: true, attributes: true, attributeFilter: ['aria-expanded'] })
    }
    return () => {
      window.removeEventListener('scroll', recompute)
      window.removeEventListener('resize', recompute)
      mo?.disconnect()
    }
  }, [])

  function openQuote() {
    window.dispatchEvent(new CustomEvent('alodev:open-quote'))
  }

  return (
    <div
      aria-hidden={!visible}
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 pointer-events-none transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="pointer-events-auto mx-3 mb-3 rounded-2xl border border-gray-200/80 dark:border-ink-800/80 bg-white/95 dark:bg-ink-950/95 backdrop-blur-xl shadow-lg shadow-black/10 dark:shadow-black/40 flex items-stretch gap-2 p-2"
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          type="button"
          onClick={openQuote}
          className="flex-1 inline-flex items-center justify-center gap-2 min-h-12 rounded-xl bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-semibold text-sm transition active:scale-[0.98]"
        >
          <Icon name="zap" className="w-4 h-4" />
          Yêu cầu báo giá
        </button>
        <a
          href="https://zalo.me/0364234936"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
          className="inline-flex items-center justify-center gap-2 min-h-12 px-4 rounded-xl bg-cream-100 dark:bg-ink-800 text-ink-900 dark:text-white font-semibold text-sm transition active:scale-[0.98]"
        >
          <Icon name="message-circle" className="w-4 h-4" />
          Zalo
        </a>
      </div>
    </div>
  )
}

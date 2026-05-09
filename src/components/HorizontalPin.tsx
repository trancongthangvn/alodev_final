'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  /** The horizontal track content. Should be a flex row sized by its children. */
  children: ReactNode
  /** Extra horizontal padding at the start, in vw. Default 8 (matches max-w-7xl px-8). */
  startVw?: number
  /** Extra horizontal padding at the end, in vw. Default 8. */
  endVw?: number
  /** Optional className on the outermost wrapper. */
  className?: string
  /** Optional aria-label for the pinned region (e.g. "Danh mục dự án"). */
  ariaLabel?: string
}

/**
 * Pinned horizontal scroll section — akaru/lusion/darkroom signature.
 *
 * Layout:
 *   .h-pin-wrap      tall outer wrapper, height = 100vh + (trackWidth - 100vw)
 *   .h-pin-stick     position:sticky inner, height 100vh
 *   .h-pin-viewport  overflow:hidden window
 *   .h-pin-track     translateX(progress * -(trackWidth - 100vw))
 *
 * Behaviour:
 *   • As wrapper.top crosses from 0 to -(wrapper.height - 100vh), `progress`
 *     ramps 0 → 1, and the track translates accordingly.
 *   • Driven by `lenis-scroll` (preferred) or native `scroll` — same handler
 *     for both, no double-fire risk because we recompute from scrollY each
 *     time.
 *   • Recomputes pin-height on resize + ResizeObserver of track (e.g. font
 *     load reflow).
 *
 * Mobile / touch / reduced-motion: bypassed entirely. The wrapper renders
 * children directly with native horizontal overflow + scroll-snap so users
 * can swipe left-right naturally — pin patterns fight touch UX (no inertia
 * to "scroll past" a pinned section, leads to confusion).
 */
export default function HorizontalPin({
  children,
  startVw = 8,
  endVw = 8,
  className = '',
  ariaLabel,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stickRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const stick = stickRef.current
    const track = trackRef.current
    if (!wrap || !stick || !track) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    const small = window.matchMedia('(max-width: 1023px)').matches
    if (reduced || isCoarse || small) {
      // Fallback: render in native horizontal overflow mode (CSS class flips).
      wrap.classList.add('h-pin-fallback')
      return
    }

    let trackWidth = 0
    let travel = 0  // px the track must translate from 0 to fully reveal end
    let pinHeight = 0
    let wrapTop = 0  // wrap.offsetTop relative to document (cached)

    function measure() {
      if (!wrap || !track) return
      trackWidth = track.scrollWidth
      const vw = window.innerWidth
      travel = Math.max(0, trackWidth - vw)
      // Pin duration = travel px of vertical scroll. Add 100vh so the
      // section enters/exits with breathing room (sticky parent height
      // = 100vh + travel; sticky child sits at top:0).
      pinHeight = window.innerHeight + travel
      wrap.style.setProperty('--pin-h', `${pinHeight}px`)
      // Cache wrap top in document coords. getBoundingClientRect gives
      // viewport-relative; add scrollY for absolute.
      wrapTop = wrap.getBoundingClientRect().top + window.scrollY
    }

    function update() {
      if (travel <= 0 || !track) return
      const y = window.scrollY
      // progress 0..1 across the pin window
      const raw = (y - wrapTop) / (pinHeight - window.innerHeight)
      const progress = Math.max(0, Math.min(1, raw))
      const x = -progress * travel
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`
    }

    measure()
    update()

    const onScroll = () => update()
    const onResize = () => { measure(); update() }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('lenis-scroll', onScroll as EventListener)
    window.addEventListener('resize', onResize)

    // Re-measure when track content changes size (font load, image decode, etc.)
    const ro = new ResizeObserver(() => { measure(); update() })
    ro.observe(track)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('lenis-scroll', onScroll as EventListener)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className={`h-pin-wrap ${className}`}
      role={ariaLabel ? 'region' : undefined}
      aria-label={ariaLabel}
    >
      <div ref={stickRef} className="h-pin-stick">
        <div className="h-pin-viewport">
          <div
            ref={trackRef}
            className="h-pin-track"
            style={{
              paddingLeft: `${startVw}vw`,
              paddingRight: `${endVw}vw`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

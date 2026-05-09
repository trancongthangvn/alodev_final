'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Pixels per second. Default 60 = calm; 120 = energetic. */
  speed?: number
  /** Reverse direction (right-to-left default). */
  reverse?: boolean
  /** Pause when pointer is over the strip. */
  pauseOnHover?: boolean
  className?: string
}

/**
 * Kinetic marquee — infinite horizontal scroll of children.
 *
 * Implementation: render children twice side-by-side, translateX from 0
 * to -50% in a CSS-driven RAF loop. When the offset reaches -50% (one
 * full copy travelled), reset to 0 — the swap is invisible because the
 * second copy is now where the first was.
 *
 * Why JS instead of pure CSS @keyframes? Because we want:
 *   • Pause-on-hover without restarting the animation
 *   • Optional scroll-velocity coupling (added later via window.__lenisVel)
 *   • Reduced-motion guard
 *
 * Usage: wrap any inline content (chips, icons, text). Caller controls
 * spacing inside children with margin/gap.
 */
export default function Marquee({
  children,
  speed = 60,
  reverse = false,
  pauseOnHover = true,
  className = '',
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let offset = 0
    let last = performance.now()
    let paused = false
    let raf = 0

    function tick(now: number) {
      const dt = (now - last) / 1000
      last = now
      if (!paused && track) {
        // Pull global scroll velocity (set by SmoothScroll); when user
        // scrolls fast, marquee briefly speeds up — kinetic feedback.
        const vel = (window as unknown as { __lenisVel?: number }).__lenisVel ?? 0
        const boost = 1 + Math.min(Math.abs(vel) / 600, 1.6)
        const dir = reverse ? 1 : -1
        offset += dir * speed * boost * dt
        const half = track.scrollWidth / 2
        if (half > 0) {
          // Wrap into [-half, 0] — invisible because content is duplicated
          offset = ((offset % half) + half) % half - half
          track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    let onEnter: (() => void) | undefined
    let onLeave: (() => void) | undefined
    if (pauseOnHover) {
      onEnter = () => { paused = true }
      onLeave = () => { paused = false }
      track.parentElement?.addEventListener('pointerenter', onEnter)
      track.parentElement?.addEventListener('pointerleave', onLeave)
    }

    return () => {
      cancelAnimationFrame(raf)
      if (onEnter) track.parentElement?.removeEventListener('pointerenter', onEnter)
      if (onLeave) track.parentElement?.removeEventListener('pointerleave', onLeave)
    }
  }, [speed, reverse, pauseOnHover])

  return (
    // Class prefix is `kmq-` (kinetic-marquee-quick) instead of `marquee`
    // to avoid collision with the existing CSS-only `.marquee` rule in
    // globals.css (a 32s linear scroll used by older logo strips).
    <div className={`kmq ${className}`} aria-hidden="true">
      <div ref={trackRef} className="kmq-track">
        <div className="kmq-copy">{children}</div>
        <div className="kmq-copy">{children}</div>
      </div>
    </div>
  )
}

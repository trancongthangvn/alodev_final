'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Lenis smooth-scroll provider. Single instance for the whole app,
 * mounted at root layout level alongside MotionLayer.
 *
 * Scope:
 *  - Desktop only — disabled on coarse pointers (touch) so iOS/Android
 *    keep native momentum scroll. Lenis on mobile fights overscroll/
 *    pull-to-refresh and feels worse than native.
 *  - Disabled when `prefers-reduced-motion: reduce`.
 *  - Drives a global `window.__lenisScrollY` mirror so MotionLayer's
 *    parallax/reveal logic uses Lenis' interpolated scrollTop instead
 *    of native (avoids two RAF chains fighting each other).
 *
 * Anchor links: Lenis intercepts `<a href="#id">` natively when
 * `anchors: true` — kept on so all in-page CTAs glide instead of jump.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (reduced || isCoarse) return

    const lenis = new Lenis({
      // Recommended easing from Lenis docs — exponential ease-out, no overshoot
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      duration: 1.1,
      // Wheel + touchpad multiplier — 1.0 keeps scroll travel matching the
      // native delta so users don't feel "drift past where I aimed".
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      anchors: true,
      autoRaf: false,
    })

    // Mirror Lenis' interpolated scrollY on window so other modules
    // (MotionLayer parallax, scroll-progress) read the smoothed value
    // and stay in lock-step. Native window.scrollY also updates from
    // Lenis since it uses `scrollTo` on root, but the smoothed
    // intermediate frames are more useful for parallax.
    lenis.on('scroll', ({ scroll, velocity }: { scroll: number; velocity: number }) => {
      const w = window as unknown as { __lenisY: number; __lenisVel: number }
      w.__lenisY = scroll
      w.__lenisVel = velocity
      // Drive a CSS variable so any element can react to scroll velocity
      // via pure CSS — used by .skew-on-scroll and the cursor ring squeeze.
      // Clamped to [-30, 30] (px-equivalent) so extreme flicks don't break layout.
      const clamped = Math.max(-30, Math.min(30, velocity * 0.04))
      document.documentElement.style.setProperty('--scroll-vel', clamped.toFixed(2))
      window.dispatchEvent(new CustomEvent('lenis-scroll', { detail: scroll }))
    })

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    document.documentElement.classList.add('lenis-smooth')

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      document.documentElement.classList.remove('lenis-smooth')
    }
  }, [])

  return null
}

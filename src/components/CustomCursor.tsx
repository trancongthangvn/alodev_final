'use client'

import { useEffect } from 'react'

/**
 * Custom cursor — akaru/lenis-style two-layer pointer:
 *   • Inner DOT (4px solid) tracks the pointer 1:1 (no lag).
 *   • Outer RING (32px hollow) follows with lerp 0.18 → buttery trail.
 *
 * States (driven by class on document.body):
 *   .cursor-hover       — over <a> / <button> / [role=button] / .cursor-pointer
 *                         ring grows to 56px, dot shrinks to 0
 *   .cursor-magnetic    — over .magnetic targets — ring locks to element center
 *                         and morphs into a soft pill (akaru signature)
 *   .cursor-text        — over inputs / textareas — dot becomes I-beam-ish bar
 *
 * Blend mode `difference` makes the cursor auto-invert against any bg
 * (white text on dark, black text on light) — same trick darkroom/lenis use.
 *
 * Disabled on coarse pointers (touch). Disabled when prefers-reduced-motion
 * (the lerp trail itself is the offending motion).
 *
 * Interaction with MotionLayer.magnetic:
 *   MotionLayer pulls the .magnetic ELEMENT toward the cursor (max 6px).
 *   CustomCursor pulls the CURSOR toward the element center (capped lerp).
 *   The two motions meet in the middle and feel "stuck" — the akaru effect.
 */
export default function CustomCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (reduced || isCoarse) return

    const dot = document.createElement('div')
    dot.className = 'cursor-dot'
    const ring = document.createElement('div')
    ring.className = 'cursor-ring'
    document.body.appendChild(ring)
    document.body.appendChild(dot)
    document.body.classList.add('has-custom-cursor')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    // Ring lags behind via lerp
    let rx = mx
    let ry = my
    // Magnetic lock target (when hovering .magnetic) — overrides lerp toward
    // element center for a "click-into-place" feel.
    let lockX: number | null = null
    let lockY: number | null = null

    function setHoverState(target: EventTarget | null) {
      const el = target as Element | null
      if (!el || !('closest' in el)) {
        document.body.classList.remove('cursor-hover', 'cursor-magnetic', 'cursor-text')
        lockX = lockY = null
        return
      }
      const mag = el.closest('.magnetic') as HTMLElement | null
      const link = el.closest('a, button, [role="button"], .cursor-pointer, summary, label[for]') as HTMLElement | null
      const text = el.closest('input[type=text], input[type=email], input[type=search], input[type=tel], input[type=url], textarea, [contenteditable=true]') as HTMLElement | null

      document.body.classList.toggle('cursor-magnetic', !!mag)
      document.body.classList.toggle('cursor-hover', !!link && !mag)
      document.body.classList.toggle('cursor-text', !!text)

      if (mag) {
        const r = mag.getBoundingClientRect()
        lockX = r.left + r.width / 2
        lockY = r.top + r.height / 2
        // Set ring size to roughly match the magnetic element (capped),
        // so the cursor "becomes" the button — akaru's signature pill.
        const w = Math.min(r.width + 14, 240)
        const h = Math.min(r.height + 14, 80)
        ring.style.setProperty('--cw', `${w}px`)
        ring.style.setProperty('--ch', `${h}px`)
        ring.style.setProperty('--cr', `${Math.min(h / 2, 28)}px`)
      } else {
        lockX = lockY = null
        ring.style.removeProperty('--cw')
        ring.style.removeProperty('--ch')
        ring.style.removeProperty('--cr')
      }
    }

    function onMove(e: PointerEvent) {
      mx = e.clientX
      my = e.clientY
      setHoverState(e.target)
    }
    function onDown() { document.body.classList.add('cursor-press') }
    function onUp() { document.body.classList.remove('cursor-press') }
    function onLeave() {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    function onEnter() {
      dot.style.opacity = ''
      ring.style.opacity = ''
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)

    let raf = 0
    function tick() {
      // Dot tracks 1:1 (instant)
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`

      // Ring lerps. When magnetic-locked, target the element center; otherwise
      // target the pointer.
      const tx = lockX != null ? lockX : mx
      const ty = lockY != null ? lockY : my
      const k = lockX != null ? 0.28 : 0.18
      rx += (tx - rx) * k
      ry += (ty - ry) * k
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      dot.remove()
      ring.remove()
      document.body.classList.remove('has-custom-cursor', 'cursor-hover', 'cursor-magnetic', 'cursor-text', 'cursor-press')
    }
  }, [])

  return null
}

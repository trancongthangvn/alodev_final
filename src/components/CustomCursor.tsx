'use client'

import { useEffect } from 'react'

/**
 * CustomCursor v7 - spring physics, "mềm như nước"
 *
 * Thay lerp bằng spring physics cho wrap:
 *   velocity += (target - pos) * stiffness
 *   velocity *= damping
 *   pos      += velocity * dt60
 *
 * Spring cho phép velocity tích lũy → tiếp cận mục tiêu với quán tính →
 * settle mượt, có thể overshoot nhẹ (tự nhiên, không cứng).
 *
 * Parameters tuning:
 *   stiffness=0.045, damping=0.72 → rất mượt, overshoot ~3% (water-like)
 *   Border-radius lerp riêng → góc bo dần vào hình dạng button
 *
 * Wrap lifecycle:
 *   Enter: size set once (1 reflow), spring position → button center,
 *          opacity fade in, border-radius flows từ tròn → hình button
 *   Leave: opacity fade out, spring position → cursor,
 *          border-radius flows trở về tròn (sẵn sàng cho entry tiếp theo)
 *   Giữa 2 button: spring tự chảy từ button A → button B (không reset)
 *
 * Orb: lerp k=0.35 - snappy nhưng không cứng, squish theo velocity
 */

// ── Spring constants ────────────────────────────────────────────
const SPR_STIFF  = 0.045  // độ cứng: thấp = chảy chậm như nước
const SPR_DAMP   = 0.72   // damping: < 1 = có velocity, > 0.65 = không rung quá
const SPR_SZ     = 0.038  // size spring: hơi chậm hơn position
const SPR_SZ_D   = 0.74
const K_OPACITY  = 0.13   // fade lerp
const K_BR       = 0.10   // border-radius lerp
const K_ORB      = 0.35   // orb position
const K_ORB_SZ   = 0.14
const SQ_MAX     = 0.4
const SQ_VEL     = 1500

export default function CustomCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // ── DOM ──────────────────────────────────────────────────────
    const orb  = document.createElement('div')
    orb.className = 'cur-orb'
    orb.style.opacity = '0'

    const wrap = document.createElement('div')
    wrap.className = 'cur-wrap'
    wrap.style.opacity = '0'

    document.body.appendChild(wrap)
    document.body.appendChild(orb)
    document.body.classList.add('has-custom-cursor')

    // ── Orb state ────────────────────────────────────────────────
    let mx = -200, my = -200
    let cx = mx, cy = my
    let cs = 1, ts = 1
    let vx = 0, vy = 0, px = mx, py = my
    let snapped = false
    let inViewport = false
    let isHovering = false

    // ── Wrap spring state ────────────────────────────────────────
    // position
    let wx = 0, wy = 0
    let wvx = 0, wvy = 0
    let twx = 0, twy = 0
    // size
    let ww = 0, wh = 0
    let wvw = 0, wvh = 0
    let tww = 0, twh = 0
    // opacity (lerp only, spring on opacity looks bad)
    let wop = 0, twop = 0
    // border-radius (lerp)
    let wbr = 30, twbr = 30   // in px; large initial = circular entry

    let activeEl: HTMLElement | null = null

    // ── Helpers ──────────────────────────────────────────────────
    function lerp(a: number, b: number, k: number) { return a + (b - a) * k }

    function fk(k: number, dt: number) {
      return 1 - Math.pow(1 - k, dt * 60)
    }

    function spring(
      pos: number, vel: number, target: number,
      stiff: number, damp: number, dt: number
    ): [number, number] {
      const dt60 = Math.min(dt * 60, 3)   // cap for tab-hidden frames
      const newVel = vel * damp + (target - pos) * stiff * dt60
      const newPos = pos + newVel * dt60
      return [newPos, newVel]
    }

    function readBR(el: HTMLElement): number {
      const v = parseFloat(getComputedStyle(el).borderRadius)
      return isNaN(v) ? 10 : Math.min(v, 28)
    }

    // ── Orb visibility ────────────────────────────────────────────
    function syncOrb() {
      orb.style.opacity = (snapped && inViewport && !isHovering) ? '1' : '0'
    }

    // ── Wrap enter / leave ────────────────────────────────────────
    function enterButton(el: HTMLElement) {
      if (el === activeEl) return
      activeEl = el

      const r = el.getBoundingClientRect()
      const isSmall = r.height < 36
      const px_ = isSmall ? 10 : 14
      const py_ = isSmall ? 8  : 10

      // Size set once → single reflow
      const fw = r.width  + px_
      const fh = r.height + py_
      wrap.style.width  = `${fw}px`
      wrap.style.height = `${fh}px`
      tww = fw; twh = fh

      // Target border-radius (lerp, not snap)
      twbr = readBR(el) + 2

      // Target position = button center
      twx = r.left + r.width  / 2
      twy = r.top  + r.height / 2

      twop = 1
    }

    function leaveButton() {
      if (!activeEl) return
      activeEl = null
      twop = 0
      // Return position spring toward cursor
      twx = mx; twy = my
      // Reset target BR to circular (ready for next entry)
      twbr = Math.min(wh / 2, 30)
    }

    // ── Events ────────────────────────────────────────────────────
    function onMove(e: PointerEvent) {
      mx = e.clientX
      my = e.clientY

      if (!snapped) {
        cx = mx; cy = my
        wx = mx; wy = my
        twx = mx; twy = my
        snapped = true
      }
      inViewport = true

      const t    = e.target as Element | null
      const hit  = t?.closest?.('a,button,[role="button"],summary') as HTMLElement | null
      const prev = isHovering
      isHovering = !!hit

      if (isHovering !== prev) syncOrb()

      if (hit) {
        enterButton(hit)
        // Keep target rect fresh (handles scrolled pages)
        const r = hit.getBoundingClientRect()
        twx = r.left + r.width  / 2
        twy = r.top  + r.height / 2
      } else {
        leaveButton()
        twx = mx; twy = my
      }
    }

    function onDown() {
      ts = 0.65
      if (isHovering) twop = 0.6
    }
    function onUp() {
      ts = 1
      if (isHovering) twop = 1
    }
    function onLeave() {
      inViewport = false
      syncOrb()
      leaveButton()
    }
    function onEnter() {
      inViewport = true
      syncOrb()
    }

    window.addEventListener('pointermove',    onMove,   { passive: true })
    window.addEventListener('pointerdown',    onDown)
    window.addEventListener('pointerup',      onUp)
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)

    // ── RAF ───────────────────────────────────────────────────────
    let raf = 0
    let last = performance.now()

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      const kop = fk(K_ORB,    dt)
      const kos = fk(K_ORB_SZ, dt)
      const kbr = fk(K_BR,     dt)
      const kf  = fk(K_OPACITY,dt)
      const kv  = fk(0.2,      dt)

      // ── Orb ──────────────────────────────────────────────────
      cx = lerp(cx, mx, kop)
      cy = lerp(cy, my, kop)
      cs = lerp(cs, ts, kos)

      const dvx = (cx - px) / Math.max(dt, 0.001)
      const dvy = (cy - py) / Math.max(dt, 0.001)
      vx = lerp(vx, dvx, kv)
      vy = lerp(vy, dvy, kv)
      px = cx; py = cy

      const spd = Math.sqrt(vx * vx + vy * vy)
      const sq  = isHovering ? 0 : Math.min(spd / SQ_VEL, 1) * SQ_MAX
      const sX  = cs * (1 + sq)
      const sY  = cs / (1 + sq * 0.65)
      const ang = (!isHovering && spd > 40) ? Math.atan2(vy, vx) * (180 / Math.PI) : 0

      orb.style.transform =
        `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)` +
        ` translate(-50%,-50%)` +
        ` rotate(${ang.toFixed(1)}deg)` +
        ` scale(${sX.toFixed(3)},${sY.toFixed(3)})`

      // ── Wrap spring ───────────────────────────────────────────
      ;[wx,  wvx]  = spring(wx,  wvx,  twx,  SPR_STIFF, SPR_DAMP,   dt)
      ;[wy,  wvy]  = spring(wy,  wvy,  twy,  SPR_STIFF, SPR_DAMP,   dt)
      ;[ww,  wvw]  = spring(ww,  wvw,  tww,  SPR_SZ,    SPR_SZ_D,   dt)
      ;[wh,  wvh]  = spring(wh,  wvh,  twh,  SPR_SZ,    SPR_SZ_D,   dt)

      wbr = lerp(wbr, twbr, kbr)
      wop = lerp(wop, twop, kf)

      if (wop > 0.004) {
        wrap.style.opacity      = wop.toFixed(3)
        wrap.style.borderRadius = `${wbr.toFixed(1)}px`
        wrap.style.transform    =
          `translate3d(${wx.toFixed(1)}px,${wy.toFixed(1)}px,0)` +
          ` translate(-50%,-50%)`
      } else {
        wrap.style.opacity = '0'
        // Reset velocity so next entry starts clean
        wvx = wvy = wvw = wvh = 0
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove',    onMove)
      window.removeEventListener('pointerdown',    onDown)
      window.removeEventListener('pointerup',      onUp)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      orb.remove()
      wrap.remove()
      document.body.classList.remove('has-custom-cursor')
    }
  }, [])

  return null
}

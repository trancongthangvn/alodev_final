'use client'

/**
 * HeroCube — 3D Rubik cube for the Resend-style hero on the homepage.
 *
 * Pure visualizer: just the canvas + SVG fallback + floating mono tag chips.
 * The hero section's bg, copy, and CTAs live in page.tsx; this component
 * stays focused on the cube.
 *
 * Performance posture (homepage above-the-fold = highest scrutiny):
 *  - Three.js loaded lazily via `import('three')` only when section enters
 *    viewport (which happens immediately on page load for the hero, but the
 *    loader stays out of the critical synchronous path so first paint is
 *    fast and shows the SVG fallback).
 *  - On mobile / `prefers-reduced-motion` / no-WebGL, we fall back to a
 *    static SVG cube. No GPU work, no battery drain.
 *  - Renderer + geometries + textures fully disposed on unmount.
 *
 * Original Three.js implementation source: trancongthangvn/rubik_resend
 * (which is itself observed/derived from resend.com's hero).
 * Adapted to React 19 + three@^0.184 (replaced sRGBEncoding/outputEncoding
 * with SRGBColorSpace/outputColorSpace per r152+ migration).
 */

import { useEffect, useRef, useState } from 'react'

// Floating tag chips were removed in the Resend-fidelity pass — Resend's
// hero has nothing around its cube, and the chips were stealing focus from
// the cube itself. The brand stack still gets airtime in <StackStrip />
// further down the page, so we lose nothing.

function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const c = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

/**
 * Three states drive the visual layer:
 *
 *   'loading'     — initial. Canvas not visible yet, SVG hidden too. Only a
 *                   minimal CSS skeleton (saffron breath + sheen) shows so
 *                   the user sees "something premium is materializing"
 *                   instead of the literal SVG illustration.
 *   'interactive' — three.js loaded + setupCube ran. Canvas fades in
 *                   (700ms), skeleton fades out.
 *   'fallback'    — three.js failed to load OR took longer than 1.8s
 *                   (slow connection / underpowered device) OR no WebGL
 *                   context. SVG fades in.
 *
 * The SVG illustration is INTENTIONALLY hidden by default for JS-enabled
 * users (almost everyone) — Resend does the same. The brief "flash of SVG"
 * the previous design caused is replaced by a clean skeleton-to-WebGL
 * transition that reads as polished loading rather than as a fallback
 * being swapped out.
 *
 * For users with JS disabled, a <noscript> override in the CSS file shows
 * the SVG (graceful degradation + SEO).
 */
type CubeState = 'loading' | 'interactive' | 'fallback'

// Phones on slow networks may still need a few seconds to download three.js.
// 1.8s strikes a balance: most modern devices on 4G+ load three.js well
// under 1s, so they never hit this. Slow-3G phones see SVG kick in instead
// of staring at the skeleton forever.
const FALLBACK_TIMEOUT_MS = 1800

/**
 * Variants:
 *
 *   'hero' (default) — 700px max, full animation (tumble + layer twists,
 *     wrapper snaps, the whole "human solver flip loop"). Used in the
 *     above-the-fold hero where the cube IS the visual.
 *
 *   'inline' — 280px max, simplified animation (continuous tumble +
 *     parallax only, NO layer twists, NO wrapper snaps). Used as a
 *     section ornament that reinforces the brand metaphor (e.g., the
 *     "Triết lý — Sáu mặt một sản phẩm" section literally explains the
 *     Rubik metaphor; visually rendering the cube right there is the
 *     same Apple-WWDC-motif pattern of repeating a signature visual at
 *     ~half scale to anchor the narrative). Skipping layer twists keeps
 *     the GPU load low so two cubes co-existing on one page is cheap.
 */
type CubeVariant = 'hero' | 'inline'

interface HeroCubeProps {
  variant?: CubeVariant
}

export default function HeroCube({ variant = 'hero' }: HeroCubeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<CubeState>('loading')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    // No WebGL context available -> straight to SVG fallback.
    if (!hasWebGL()) {
      setState('fallback')
      return
    }

    // Network-aware skip. The full WebGL path costs ~192KB gzipped + GPU
    // work; skipping it on slow connections / data-save mode shows the
    // (now polished) SVG fallback instead. Users on 2G or save-data
    // mostly have low-end devices anyway, so they'd struggle to render
    // the cube even if it loaded. Network Information API is shipped on
    // Chromium-based browsers — Safari falls through to the WebGL path.
    type Conn = { effectiveType?: string; saveData?: boolean }
    const conn = (navigator as unknown as { connection?: Conn }).connection
    if (conn && (conn.saveData === true || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g')) {
      setState('fallback')
      return
    }

    const small = window.matchMedia('(max-width: 768px)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Guard against React Strict Mode double-mount: if cleanup runs before
    // `import('three')` resolves, we must NOT call setupCube — otherwise
    // two renderers stomp on the same canvas.
    let cancelled = false
    let cleanup: (() => void) | null = null
    let slowTimer = 0
    let booted = false

    function bootCube() {
      if (cancelled || booted) return
      booted = true

      // Slow-load fallback timer: if three.js + setupCube haven't finished
      // in FALLBACK_TIMEOUT_MS, switch to the SVG. Won't override
      // 'interactive' — only flips if still 'loading'.
      slowTimer = window.setTimeout(() => {
        setState((prev) => (prev === 'loading' ? 'fallback' : prev))
      }, FALLBACK_TIMEOUT_MS)

      import('three').then((THREE) => {
        if (cancelled) return
        try {
          cleanup = setupCube(canvas!, wrap!, THREE, {
            reducedMotion: reduced,
            mobile: small,
            simplifyAnimation: variant === 'inline',
          })
          window.clearTimeout(slowTimer)
          setState('interactive')
        } catch (err) {
          console.warn('[HeroCube] setupCube threw:', err)
          window.clearTimeout(slowTimer)
          setState('fallback')
        }
      }).catch((err) => {
        console.warn('[HeroCube] three.js failed to load:', err)
        window.clearTimeout(slowTimer)
        setState('fallback')
      })
    }

    // Lazy-load: only fetch three.js when the cube wrap is in (or near)
    // the viewport. For users who land on /lien-he or /bao-gia and never
    // see home, three.js is never fetched (~192KB saved).
    //
    // Initial check is synchronous via getBoundingClientRect() — important
    // because IntersectionObserver callbacks are throttled in hidden tabs
    // (no paint = no IO fire). If the cube is already on-screen at mount
    // we boot immediately; otherwise we wait for the user to scroll.
    let observer: IntersectionObserver | null = null

    function isWrapNearViewport() {
      const r = wrap!.getBoundingClientRect()
      // 0×0 rect = element is hidden via display:none (responsive class
      // like `hidden lg:block` for the inline variant on mobile). Skip
      // boot — IntersectionObserver also won't fire for hidden elements,
      // so WebGL stays unallocated until the element becomes visible
      // (e.g. user resizes window past lg breakpoint).
      if (r.width === 0 || r.height === 0) return false
      return r.bottom > -200 && r.top < window.innerHeight + 200
    }

    if (isWrapNearViewport()) {
      bootCube()
    } else if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              observer?.disconnect()
              observer = null
              bootCube()
              break
            }
          }
        },
        { rootMargin: '200px 0px' },
      )
      observer.observe(wrap)
    } else {
      // No IntersectionObserver and not currently visible — boot anyway
      // rather than risk never loading.
      bootCube()
    }

    return () => {
      cancelled = true
      observer?.disconnect()
      window.clearTimeout(slowTimer)
      cleanup?.()
    }
  }, [variant])

  return (
    <div ref={wrapRef} className="hero-cube-wrap relative w-full" data-cube-state={state} data-variant={variant}>
      {/* Skeleton — visible only during the 'loading' state. Three layered
          effects build a "premium content materializing" feel:
            1. Saffron breath (::after, z-0) — atmospheric pulse glow.
            2. WireframeCube (z-1) — Rubik structure draws in over ~1.5s
               via stroke-dashoffset, then gently pulses. Tells the user
               specifically WHAT is materializing — beats a generic blob.
            3. Sheen sweep (::before, z-2) — diagonal polish stroke that
               passes over both blob + wireframe via mix-blend-mode.
          When state flips to 'interactive', the skeleton scales+blurs out
          (skeleton-exit anim) and the wireframe dissolves with it. */}
      <div
        aria-hidden="true"
        className={`hero-cube-skeleton absolute inset-0 pointer-events-none transition-opacity duration-500 ${state === 'loading' ? 'opacity-100' : 'opacity-0'}`}
      >
        <WireframeCube />
      </div>

      {/* Static SVG fallback — only fades in if WebGL fails or times out.
          For no-JS users the CSS noscript rule keeps it visible. */}
      <div
        aria-hidden="true"
        className={`hero-cube-fallback absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${state === 'fallback' ? 'opacity-100' : 'opacity-0'}`}
      >
        <StaticCube />
      </div>

      <canvas
        ref={canvasRef}
        className={`hero-cube-canvas relative w-full h-full transition-opacity duration-700 ${state === 'interactive' ? 'opacity-100' : 'opacity-0'}`}
        aria-label="3D Rubik visualization"
      />
    </div>
  )
}

/**
 * WireframeCube — loading-state visual. Same isometric projection as
 * StaticCube (so users see structural continuity if they get bumped from
 * loading → fallback), but rendered as outline-only paths that draw in
 * via stroke-dashoffset over ~1.5s with per-face stagger.
 *
 * pathLength={1} normalizes each face's path to logical length 1, so
 * stroke-dasharray: 1 + dashoffset 1→0 produces a clean draw across the
 * outer rect first then 4 inner grid lines, single continuous stroke
 * pass per face. Stagger handled in CSS by face-class delays.
 *
 * After draw, a face-level opacity pulse (3s loop, staggered) prevents
 * the wireframe from looking frozen while three.js continues to load.
 */
function WireframeCube() {
  // Outer 120×120 rect + 2 vertical + 2 horizontal grid lines = 5 strokes
  // per face. Same shape Resend's reference uses for its loading wireframe
  // (and matches the StaticCube fallback's tile grid for visual continuity).
  const facePath = 'M0 0 L120 0 L120 120 L0 120 Z M40 0 L40 120 M80 0 L80 120 M0 40 L120 40 M0 80 L120 80'

  return (
    <svg viewBox="0 0 280 280" className="wireframe-cube" aria-hidden="true">
      <g className="wf-face wf-top" transform="translate(80 60) skewX(-30) scale(0.95 0.6)">
        <path d={facePath} pathLength={1} />
      </g>
      <g className="wf-face wf-right" transform="translate(140 130) skewY(-30)">
        <path d={facePath} pathLength={1} />
      </g>
      <g className="wf-face wf-left" transform="translate(20 130) skewY(30)">
        <path d={facePath} pathLength={1} />
      </g>
    </svg>
  )
}

/**
 * Tiny isometric cube SVG — used as the static fallback on mobile, reduced-
 * motion, and during the brief gap before three.js loads on desktop.
 */
function StaticCube() {
  // Per-face shade tiers fake the WebGL key/rim/fill lighting so the
  // cube reads as 3D even before three.js boots. Without this it is a
  // black blob during the brief boot delay (and permanent on mobile).
  const TOP   = ['#5a5a64', '#52525c', '#48484f', '#4e4e58']
  const RIGHT = ['#3e3e48', '#42424d', '#37373f', '#3a3a44']
  const LEFT  = ['#2f2f39', '#353540', '#2b2b33', '#37373f']

  const tile = (x: number, y: number, fill: string) => (
    <rect x={x} y={y} width="36" height="36" rx="4" fill={fill} stroke="#0a0a0c" strokeWidth="1" />
  )
  const pick = (arr: string[], i: number) =>
    arr[((i * 2654435761) >>> 28) % arr.length] || arr[0]

  return (
    <svg viewBox="0 0 280 280" className="w-[80%] max-w-[420px]" aria-hidden="true">
      <defs>
        <radialGradient id="cubeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(170,180,210,0.22)" />
          <stop offset="60%" stopColor="rgba(80,80,120,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        <linearGradient id="topSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,250,235,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
        </linearGradient>
        <linearGradient id="rightSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,215,170,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
        <linearGradient id="leftSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(170,200,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
        </linearGradient>

        <radialGradient id="contactShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.45)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="280" height="280" fill="url(#cubeGlow)" />
      <ellipse cx="140" cy="248" rx="92" ry="12" fill="url(#contactShadow)" />

      <g transform="translate(80 60) skewX(-30) scale(0.95 0.6)">
        {[0,1,2].map((r) => [0,1,2].map((c) => (
          <g key={`t-${r}-${c}`}>{tile(c * 40, r * 40, pick(TOP, r * 3 + c))}</g>
        )))}
        <rect x="-2" y="-2" width="124" height="124" fill="url(#topSheen)" pointerEvents="none" />
      </g>

      <g transform="translate(140 130) skewY(-30)">
        {[0,1,2].map((r) => [0,1,2].map((c) => (
          <g key={`r-${r}-${c}`}>{tile(c * 40, r * 40, pick(RIGHT, r * 3 + c))}</g>
        )))}
        <rect x="-2" y="-2" width="124" height="124" fill="url(#rightSheen)" pointerEvents="none" />
      </g>

      <g transform="translate(20 130) skewY(30)">
        {[0,1,2].map((r) => [0,1,2].map((c) => (
          <g key={`l-${r}-${c}`}>{tile(c * 40, r * 40, pick(LEFT, r * 3 + c))}</g>
        )))}
        <rect x="-2" y="-2" width="124" height="124" fill="url(#leftSheen)" pointerEvents="none" />
      </g>
    </svg>
  )
}

// ────────────────────────────────────────────────────────────────────────
// THREE.JS RUBIK SETUP — original implementation from rubik_resend repo,
// minimally adapted for r184 (SRGBColorSpace replaces sRGBEncoding etc.).
// ────────────────────────────────────────────────────────────────────────
function setupCube(
  canvas: HTMLCanvasElement,
  wrap: HTMLDivElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  THREE: any,
  opts: { reducedMotion?: boolean; mobile?: boolean; simplifyAnimation?: boolean } = {}
): () => void {
  const isMobile = !!opts.mobile
  const renderer = new THREE.WebGLRenderer({
    canvas,
    // Antialias OFF on mobile — fragment-shader cost on high-DPR phones is
    // significant (4x pixels at DPR 2-3). The lower pixel ratio cap below
    // already gives crisp-enough edges on the small cube footprint.
    antialias: !isMobile,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(
    isMobile
      ? Math.min(window.devicePixelRatio, 2)
      : Math.min(window.devicePixelRatio * 1.25, 2.5),
  )
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  // ACES with a high exposure to push the cube into the readable mid-grey
  // range against both alodev themes (light cream-50 and dark #0b0e14).
  // Resend uses 0.88 against pure black where the cube reads via
  // simultaneous contrast; we need ~2x exposure to compensate.
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.85
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const MAX_ANISO = renderer.capabilities.getMaxAnisotropy()

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 100)
  camera.position.set(8.6, 6.4, 10.0)
  camera.lookAt(0, -0.05, 0)

  function makeEnvMap() {
    // 512×256 on mobile (1/4 the texels) keeps env reflections sharp enough
    // for the cube's ~280px footprint while saving ~1.5MB of texture upload.
    const w = isMobile ? 512 : 1024, h = isMobile ? 256 : 512
    const c = document.createElement('canvas')
    c.width = w; c.height = h
    const ctx = c.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0.00, '#272a36')
    grad.addColorStop(0.40, '#10121a')
    grad.addColorStop(0.55, '#06070b')
    grad.addColorStop(1.00, '#000000')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // Horizontal soft band instead of a radial spot. A radial bright spot
    // reflects on flat tiles as a circular disc which reads as a literal
    // "dot". A horizontal band reflects as a streak across the tile's top
    // edge — that's the highlight shape Resend's reference cube shows.
    const band = ctx.createLinearGradient(0, h * 0.05, 0, h * 0.42)
    band.addColorStop(0.00, 'rgba(220,225,240,0)')
    band.addColorStop(0.45, 'rgba(220,225,240,0.32)')
    band.addColorStop(1.00, 'rgba(220,225,240,0)')
    ctx.fillStyle = band; ctx.fillRect(0, 0, w, h)

    // Tiny cool accent on the left horizon — a small streak, not a circle,
    // for variety in side-face highlights.
    const accent = ctx.createLinearGradient(w * 0.05, h * 0.38, w * 0.30, h * 0.46)
    accent.addColorStop(0.0, 'rgba(150,170,210,0)')
    accent.addColorStop(0.5, 'rgba(150,170,210,0.18)')
    accent.addColorStop(1.0, 'rgba(150,170,210,0)')
    ctx.fillStyle = accent; ctx.fillRect(0, h * 0.32, w * 0.45, h * 0.18)

    const tex = new THREE.CanvasTexture(c)
    tex.mapping = THREE.EquirectangularReflectionMapping
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = MAX_ANISO
    return tex
  }
  scene.environment = makeEnvMap()

  // Lighting follows Resend's three-point shape but with stronger fill,
  // tuned so the cube reads against alodev's light hero background as
  // well as the dark theme. Resend's exact values worked on their pure
  // black bg; on a light bg we need ~30% more ambient and key.
  // Hemisphere captured as a variable so we can boost it in light theme.
  const hemi = new THREE.HemisphereLight(0xb8c0e0, 0x02020a, 0.32)
  scene.add(hemi)

  const key = new THREE.DirectionalLight(0xffffff, 1.10)
  key.position.set(4.5, 8, 7)
  key.castShadow = true
  // 4096 to match the rubik_resend repo for crisp shadow edges (~16MB GPU).
  // Shadow map: 4096² (~16MB GPU) on desktop, 1024² (~1MB) on mobile.
  // The cube's shadow lands on a single flat plane and reads softly even
  // at 1024² thanks to the shadow.radius blur below, so dropping to 1/4
  // is invisible to the eye but reclaims ~12MB of GPU memory + cuts the
  // shadow-pass fill rate cost on phones.
  key.shadow.mapSize.set(isMobile ? 1024 : 4096, isMobile ? 1024 : 4096)
  key.shadow.camera.near = 0.5
  key.shadow.camera.far = 30
  key.shadow.camera.left = -5
  key.shadow.camera.right = 5
  key.shadow.camera.top = 5
  key.shadow.camera.bottom = -5
  key.shadow.bias = -0.0004
  key.shadow.radius = 7
  scene.add(key)

  // Cool back-rim — defines the cube silhouette against light bg.
  const rimL = new THREE.DirectionalLight(0xa8b4d8, 0.50)
  rimL.position.set(-7, 2, -4)
  scene.add(rimL)

  // Warm side-rim — three-point lit feel.
  const rimR = new THREE.DirectionalLight(0xddc8b0, 0.25)
  rimR.position.set(7, -2, -2)
  scene.add(rimR)

  // Frontal fill — alodev-specific. Soft camera-side wash so the
  // bottom-front cubelets aren't featureless silhouette mid-twist.
  const fill = new THREE.DirectionalLight(0xfff2dc, 0.35)
  fill.position.set(2, 1.5, 9)
  scene.add(fill)

  // Theme-aware lighting boost. Dark theme keeps the Resend-tuned values
  // (Resend's reference is a pitch-black bg where dim lights still read
  // via simultaneous contrast). Light theme bumps key + hemi + exposure
  // ~40% so the cube does not silhouette to "đen kịt" against the cream
  // page bg. The dark/light values are stored so we can interpolate
  // when the user toggles the theme.
  //
  // Dark-theme tuning revisited: the cube was sinking into the #07080c
  // page bg even with cube-body + tile-base colors lifted. Two minimal
  // bumps (kept well short of light-theme values so the dark "moody"
  // feel is preserved):
  //   • hemi 0.32 → 0.45  — more ambient on matte/non-reflective tiles
  //                         so the 3×3 grid reads on the unlit face.
  //   • rimL 0.50 → 0.72  — cool back-rim is what silhouettes the
  //                         cube edge against the lit pocket; old
  //                         value was too soft to register.
  const lightingForTheme = (theme: string) => {
    const isDark = theme === 'dark'
    hemi.intensity   = isDark ? 0.45 : 0.55
    key.intensity    = isDark ? 1.10 : 1.60
    rimL.intensity   = isDark ? 0.72 : 0.65
    rimR.intensity   = isDark ? 0.25 : 0.40
    fill.intensity   = isDark ? 0.35 : 0.55
    renderer.toneMappingExposure = isDark ? 1.85 : 2.20
  }
  const initialTheme = document.documentElement.getAttribute('data-theme') || 'light'
  lightingForTheme(initialTheme)
  const themeObs = new MutationObserver(() => {
    const t = document.documentElement.getAttribute('data-theme') || 'light'
    lightingForTheme(t)
  })
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  // Cursor spotlight — a hover-tracking PointLight that gently lifts the
  // illumination on whatever tile is under the cursor so its texture
  // (carbon weave / granite / hex / stripes) becomes readable.
  // distance=2.6 keeps the lit zone close to a single tile; target
  // intensity is capped low (1.6) so PointLight's specular response on
  // low-roughness materials does NOT saturate tiles into bright round
  // discs — the goal is to *reveal* the material, not flash a hotspot.
  const cursorLight = new THREE.PointLight(0xfff4e4, 0, 2.6, 2)
  cursorLight.position.set(0, 0, 3)
  scene.add(cursorLight)

  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.5 })
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), shadowMat)
  shadowPlane.rotation.x = -Math.PI / 2
  shadowPlane.position.y = -2.3
  shadowPlane.receiveShadow = true
  scene.add(shadowPlane)

  function makeHaloTexture(size = 512) {
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    const grad = ctx.createRadialGradient(size/2, size/2, 4, size/2, size/2, size/2)
    grad.addColorStop(0.00, 'rgba(170,180,210,0.32)')
    grad.addColorStop(0.25, 'rgba(120,130,170,0.18)')
    grad.addColorStop(0.55, 'rgba(80,80,120,0.06)')
    grad.addColorStop(1.00, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }
  const haloMat = new THREE.SpriteMaterial({
    map: makeHaloTexture(),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const halo = new THREE.Sprite(haloMat)
  // Scale 4 (was 7) so the soft glow fits comfortably inside the canvas
  // viewport. At 7, the sprite plane projected larger than the canvas
  // and got clipped at the canvas right edge, leaving a visible
  // rectangular cutoff in the upper-right of the cube wrap.
  halo.scale.set(4, 4, 1)
  halo.position.set(0, 0.2, -2.5)
  scene.add(halo)

  function applyAOVignette(ctx: CanvasRenderingContext2D, size: number, edgeDark = 0.18, falloffStart = 0.25) {
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    const grad = ctx.createRadialGradient(size/2, size/2, size * falloffStart, size/2, size/2, size * 0.62)
    grad.addColorStop(0, '#ffffff')
    grad.addColorStop(0.7, '#cfcfcf')
    grad.addColorStop(1, `rgba(0,0,0,${1 - edgeDark})`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    ctx.restore()
  }

  function makeNoiseAndNormal(size = 512, sparkleProb = 0.05, sparkleMax = 240, baseLevel = 12) {
    const cMap = document.createElement('canvas')
    const cNor = document.createElement('canvas')
    cMap.width = cMap.height = size
    cNor.width = cNor.height = size
    const ctxMap = cMap.getContext('2d')!
    const ctxNor = cNor.getContext('2d')!

    const h = new Float32Array(size * size)
    for (let i = 0; i < h.length; i++) {
      const r = Math.random()
      if (r < sparkleProb)             h[i] = 0.75 + Math.random() * 0.25
      else if (r < sparkleProb + 0.18) h[i] = 0.18 + Math.random() * 0.18
      else                             h[i] = 0.02 + Math.random() * 0.06
    }

    const imgMap = ctxMap.createImageData(size, size)
    for (let i = 0; i < h.length; i++) {
      const v = Math.min(255, baseLevel + h[i] * (sparkleMax - baseLevel))
      imgMap.data[i*4]   = v
      imgMap.data[i*4+1] = v
      imgMap.data[i*4+2] = v
      imgMap.data[i*4+3] = 255
    }
    ctxMap.putImageData(imgMap, 0, 0)
    applyAOVignette(ctxMap, size, 0.10)

    const imgNor = ctxNor.createImageData(size, size)
    const idx = (x: number, y: number) => ((y + size) % size) * size + ((x + size) % size)
    const strength = 4.0
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = (h[idx(x+1, y)] - h[idx(x-1, y)]) * strength
        const dy = (h[idx(x, y+1)] - h[idx(x, y-1)]) * strength
        const nx = -dx, ny = -dy, nz = 1
        const len = Math.sqrt(nx*nx + ny*ny + nz*nz)
        const i = (y * size + x) * 4
        imgNor.data[i]   = ((nx / len) * 0.5 + 0.5) * 255
        imgNor.data[i+1] = ((ny / len) * 0.5 + 0.5) * 255
        imgNor.data[i+2] = ((nz / len) * 0.5 + 0.5) * 255
        imgNor.data[i+3] = 255
      }
    }
    ctxNor.putImageData(imgNor, 0, 0)

    const map = new THREE.CanvasTexture(cMap)
    map.wrapS = map.wrapT = THREE.RepeatWrapping
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = MAX_ANISO
    const nor = new THREE.CanvasTexture(cNor)
    nor.wrapS = nor.wrapT = THREE.RepeatWrapping
    nor.anisotropy = MAX_ANISO
    return { map, nor }
  }

  // Honeycomb hex perforation — replaces the original 9x9 round-dots
  // texture which read too literally as "speaker grille buttons" against
  // alodev's dark vibe. Resend's reference cube uses fine perforated metal
  // patterns; the hex packing is denser and reads as machined alloy.
  function makeHexMeshTexture(size = 512, hexesPerSide = 22) {
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#1c1c22'; ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = '#04040a'

    // Pointy-top hex packing: every other column offset by half-row.
    const r = size / hexesPerSide / 2     // hex circumradius
    const stepX = r * Math.sqrt(3)         // column spacing
    const stepY = r * 1.5                  // row spacing
    const punch = r * 0.62                 // how big the dark hex is inside the cell

    for (let row = -1; row * stepY < size + r; row++) {
      for (let col = -1; col * stepX < size + r; col++) {
        const cx = col * stepX
        const cy = row * stepY + (col % 2 ? stepY / 2 : 0)
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i + Math.PI / 6
          const px = cx + punch * Math.cos(a)
          const py = cy + punch * Math.sin(a)
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
      }
    }
    applyAOVignette(ctx, size, 0.08)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = MAX_ANISO
    return tex
  }

  // Carbon fiber twill weave — replaces the smooth-onyx variant. The
  // smooth tile was reflecting the env map's circular bright spot as a
  // visible round disc that read as "dot" against the dark vibe. Carbon
  // fiber gives the premium dark-luxury surface without the literal
  // circular reflection.
  function makeCarbonWeaveTexture(size = 512, cellsPerSide = 8) {
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    // Base bg lifted #13131a → #1d1d28 (lum 21 → 35) so dark-theme bg
    // (#07080c, lum 9) doesn't merge into the tile. Cell colors below
    // overwrite this, but the lift keeps margin in case any pixel
    // bleeds through at low mip levels.
    ctx.fillStyle = '#1d1d28'; ctx.fillRect(0, 0, size, size)

    const step = size / cellsPerSide
    for (let i = 0; i < cellsPerSide; i++) {
      for (let j = 0; j < cellsPerSide; j++) {
        const x0 = i * step
        const y0 = j * step
        const horizontal = (i + j) % 2 === 0

        // Slight base-tone variation per cell for the alternating-weave look.
        // Both lifted ~+10 lum so the tile reads above #07080c dark bg
        // even on the unlit side of cube rotation.
        ctx.fillStyle = horizontal ? '#26262e' : '#1a1a22'
        ctx.fillRect(x0, y0, step, step)

        // 3 fine threads per cell, perpendicular to the cell's "warp"
        // direction. Highlight color picks up env subtly without dominating.
        ctx.strokeStyle = horizontal ? 'rgba(90,90,108,0.42)' : 'rgba(50,50,62,0.32)'
        ctx.lineWidth = step * 0.04
        ctx.beginPath()
        for (let k = 1; k <= 3; k++) {
          if (horizontal) {
            const y = y0 + step * (k / 4)
            ctx.moveTo(x0 + 1, y)
            ctx.lineTo(x0 + step - 1, y)
          } else {
            const x = x0 + step * (k / 4)
            ctx.moveTo(x, y0 + 1)
            ctx.lineTo(x, y0 + step - 1)
          }
        }
        ctx.stroke()
      }
    }
    applyAOVignette(ctx, size, 0.08)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = MAX_ANISO
    return tex
  }

  function makeMeshGrilleTexture(size = 512, dotsPerSide = 36) {
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#22222a'; ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = '#05050a'
    const step = size / dotsPerSide
    const r = step * 0.30
    for (let i = 0; i < dotsPerSide; i++) for (let j = 0; j < dotsPerSide; j++) {
      ctx.beginPath()
      ctx.arc(i * step + step/2, j * step + step/2, r, 0, Math.PI * 2)
      ctx.fill()
    }
    applyAOVignette(ctx, size, 0.08)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = MAX_ANISO
    return tex
  }

  function makeVerticalStripesTexture(size = 512, lines = 30) {
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    // Bg lifted #0e0e14 (lum 16) → #1a1a24 (lum 28). Old value was only
    // 7 lum above dark bg (#07080c, lum 9) — stripe gaps blended into
    // page bg making the tile invisible on unlit faces.
    ctx.fillStyle = '#1a1a24'; ctx.fillRect(0, 0, size, size)
    const step = size / lines
    for (let i = 0; i < lines; i++) {
      const x = i * step
      const w = step * 0.42
      // Stripe values lifted from 38-52 base to 56-70 so the bright
      // stripe still reads as ~3x the bg lum, preserving the texture's
      // pinstripe character after the bg lift.
      const v = 56 + Math.random() * 14
      ctx.fillStyle = `rgb(${v},${v},${v + 2})`
      ctx.fillRect(x, 0, w, size)
    }
    applyAOVignette(ctx, size, 0.08)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = MAX_ANISO
    return tex
  }

  // Texture sizes match the rubik_resend repo exactly — 1024² for the
  // patterned tiles so granite/sparkle/hex/mesh/stripes read crisp on
  // the cube faces. 512² (used previously) made them look mushy.
  const grainHeavy  = makeNoiseAndNormal(1024, 0.038, 200, 6)
  const grainSubtle = makeNoiseAndNormal(1024, 0.014, 120, 5)
  const texCarbon   = makeCarbonWeaveTexture(1024, 8)
  const texHex      = makeHexMeshTexture(1024, 22)
  const texMesh     = makeMeshGrilleTexture(1024, 38)
  const texStripes  = makeVerticalStripesTexture(1024, 30)
  // Tile center colors at mid-grey range — readable as distinct surfaces
  // on either bg. Edges still dark for the bevel rim contrast.

  // Material PBR params extracted from Resend's actual chunk:
  //   roughness: 0.2, metalness: 0.2, reflectivity: 0.2
  // envMapIntensity values per-variant match Resend's tuning — they
  // make the bevel rim catch env reflection as a bright line. Going
  // higher (we tried 1.4 globally) reads as washed-out, not punchier.
  const tileVariants = [
    // carbon fiber weave (lacquered) — premium dark-luxury surface.
    // No clearcoat: a glossy clearcoat layer reflects the env map's
    // circular spot as a visible disc on top of the weave, defeating
    // the whole point of replacing smooth-onyx. The texture itself
    // gives the lacquer feel via subtle thread highlights.
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: texCarbon,  roughness: 0.30, metalness: 0.20, reflectivity: 0.20, envMapIntensity: 0.55 }),
    // matte void — flat dark color, no texture map. The previous insetMatte
    // bevel had a center-bright radial gradient that read as a soft round
    // disc on the tile (the last "circle" tile). The cubelet body groove
    // already gives the tile geometric definition, so the texture itself
    // can be uniform without losing the inset look. Color lifted
    // 0x10101a → 0x1c1c26 so the tile separates from #07080c bg even
    // when the face is mid-tumble away from key light.
    new THREE.MeshPhysicalMaterial({ color: 0x1c1c26, roughness: 0.45, metalness: 0.18, reflectivity: 0.2, envMapIntensity: 0.07 }),
    // granite/sparkle — heavy normal scale for noise pop
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: grainHeavy.map,  normalMap: grainHeavy.nor,  normalScale: new THREE.Vector2(1.6, 1.6), roughness: 0.2, metalness: 0.2, reflectivity: 0.2, envMapIntensity: 0.7 }),
    // micro-grain — subtle noise
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: grainSubtle.map, normalMap: grainSubtle.nor, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.2, metalness: 0.2, reflectivity: 0.2, envMapIntensity: 0.75 }),
    // hex honeycomb — fine machined-alloy perforation (matches Resend's
    // reference). Replaces the original round-dot grid that read as
    // literal speaker holes against alodev's vibe.
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: texHex,     roughness: 0.34, metalness: 0.2, reflectivity: 0.2, envMapIntensity: 0.65 }),
    // mesh grille
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: texMesh,    roughness: 0.34, metalness: 0.2, reflectivity: 0.2, envMapIntensity: 0.60 }),
    // vertical stripes
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: texStripes, roughness: 0.30, metalness: 0.2, reflectivity: 0.2, envMapIntensity: 0.65 }),
    // matte carbon weave — pairs with v0 (lacquered carbon). Same texture
    // for cohesion, but rougher + lower envMap so it reads as the dry/matte
    // counterpart vs v0's lacquered finish. Replacing the old semi-gloss
    // bevel keeps any inset-style tile from reflecting the env spot as a
    // disc.
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: texCarbon,  roughness: 0.42, metalness: 0.2, reflectivity: 0.2, envMapIntensity: 0.30 }),
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function roundedBox(size: number, radius: number, smoothness = 4): any {
    const geo = new THREE.BoxGeometry(size, size, size, smoothness, smoothness, smoothness)
    const pos = geo.attributes.position
    const v = new THREE.Vector3()
    const half = size / 2 - radius
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const cx = Math.sign(v.x) * Math.min(Math.abs(v.x), half)
      const cy = Math.sign(v.y) * Math.min(Math.abs(v.y), half)
      const cz = Math.sign(v.z) * Math.min(Math.abs(v.z), half)
      const dx = v.x - cx, dy = v.y - cy, dz = v.z - cz
      const d = Math.hypot(dx, dy, dz)
      if (d > 0) {
        const k = radius / d
        pos.setXYZ(i, cx + dx * k, cy + dy * k, cz + dz * k)
      }
    }
    geo.computeVertexNormals()
    return geo
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function roundedSquareShape(size: number, radius: number): any {
    const s = size / 2
    const r = radius
    const sh = new THREE.Shape()
    sh.moveTo(-s + r, -s)
    sh.lineTo(s - r, -s)
    sh.quadraticCurveTo(s, -s, s, -s + r)
    sh.lineTo(s, s - r)
    sh.quadraticCurveTo(s, s, s - r, s)
    sh.lineTo(-s + r, s)
    sh.quadraticCurveTo(-s, s, -s, s - r)
    sh.lineTo(-s, -s + r)
    sh.quadraticCurveTo(-s, -s, -s + r, -s)
    return sh
  }

  const SIZE = 0.97
  // Re-measured against Resend's reference on a clearer mid-rotation frame:
  // their cubelets are MORE tightly packed than the 0.08 we'd previously
  // dialed. 0.055 lands closer — visible gap, but tiles still feel like one
  // cube rather than disconnected blocks.
  const GAP  = 0.055
  const STEP = SIZE + GAP
  const TILE_SIZE = 0.84
  const TILE_RADIUS = 0.08
  const TILE_DEPTH = 0.018        // 0.012 → 0.018: thicker tile = more side area for rim light to graze
  const TILE_BEVEL = 0.022        // 0.014 → 0.022: wider bevel = visible white rim around each tile,
                                  //                the single most important visual cue for "tiles on a cube"
  const TILE_OFFSET = SIZE / 2 + TILE_BEVEL

  const cubeletGeo = roundedBox(SIZE, 0.11, 6)

  const tileGeo = new THREE.ExtrudeGeometry(
    roundedSquareShape(TILE_SIZE, TILE_RADIUS),
    {
      depth: TILE_DEPTH,
      bevelEnabled: true,
      bevelThickness: TILE_BEVEL,
      bevelSize: TILE_BEVEL,
      bevelSegments: 4,
      curveSegments: 32,
    }
  )
  ;(function fixTileUVs() {
    const pos = tileGeo.attributes.position
    const uvs = new Float32Array(pos.count * 2)
    const half = TILE_SIZE / 2 + TILE_BEVEL
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      uvs[i*2]   = (x + half) / (half * 2)
      uvs[i*2+1] = (y + half) / (half * 2)
    }
    tileGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  })()

  // Cubelet body at #3a3a44 — mid-dark grey that frames each tile and
  // reads as visible 3D shape against either theme bg. Lifted from
  // 0x2e2e36 (lum 49) to 0x3a3a44 (lum 65): dark-theme bg is only lum
  // 9, and the unlit side of a tumbling cubelet at the previous tone
  // sat too close to bg, dissolving the silhouette. Light theme is bg
  // lum 247, so this 16-point lift cuts contrast by <8% — visually
  // negligible there.
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x3a3a44, roughness: 0.7, metalness: 0.2, envMapIntensity: 0.55,
  })

  function pickVariant(x: number, y: number, z: number, faceIndex: number) {
    const h = ((x + 1) * 9 + (y + 1) * 3 + (z + 1)) * 6 + faceIndex
    // Rebalanced from [4,3,2,3,1,1,1,3] → [2,2,3,3,2,2,2,2]. Old weights gave
    // 72% matte/smooth tiles, leaving visible textures rare. New distribution
    // bumps granite/hex/mesh/stripes to ~50% of tiles, matching Resend's
    // visible material variety per face.
    //              [carbonLacq, matte, granite, micro, hex, mesh, stripes, carbonMatte]
    const weights = [    2,     2,       3,     3,    2,    2,       2,    2]
    const total = weights.reduce((a, b) => a + b, 0)
    let r = (h * 2654435761 >>> 0) % total
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i]
      if (r < 0) return tileVariants[i]
    }
    return tileVariants[0]
  }

  // Two-level group hierarchy:
  //   wrapper — receives the initial 3/4 view + occasional snap rotations
  //             before each layer flip (audit's pattern-breaking trick).
  //   cubeGroup — receives the continuous tumble. Layer flip pivots are
  //               children of cubeGroup so they tumble too.
  const wrapper = new THREE.Group()
  scene.add(wrapper)
  const cubeGroup = new THREE.Group()
  wrapper.add(cubeGroup)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cubelets: any[] = []

  type FaceConf = { axis: 'x' | 'y' | 'z'; sign: 1 | -1; pos: [number, number, number]; rot: [number, number, number]; idx: number }
  const FACE_CONF: FaceConf[] = [
    { axis: 'x', sign:  1, pos: [ TILE_OFFSET, 0, 0], rot: [0,  Math.PI / 2, 0], idx: 0 },
    { axis: 'x', sign: -1, pos: [-TILE_OFFSET, 0, 0], rot: [0, -Math.PI / 2, 0], idx: 1 },
    { axis: 'y', sign:  1, pos: [0,  TILE_OFFSET, 0], rot: [-Math.PI / 2, 0, 0], idx: 2 },
    { axis: 'y', sign: -1, pos: [0, -TILE_OFFSET, 0], rot: [ Math.PI / 2, 0, 0], idx: 3 },
    { axis: 'z', sign:  1, pos: [0, 0,  TILE_OFFSET], rot: [0, 0, 0], idx: 4 },
    { axis: 'z', sign: -1, pos: [0, 0, -TILE_OFFSET], rot: [0, Math.PI, 0], idx: 5 },
  ]

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const cubelet = new THREE.Group()
        cubelet.position.set(x * STEP, y * STEP, z * STEP)
        const body = new THREE.Mesh(cubeletGeo, bodyMat)
        body.castShadow = true
        body.receiveShadow = true
        cubelet.add(body)

        const coord: Record<'x' | 'y' | 'z', number> = { x, y, z }
        for (const f of FACE_CONF) {
          if (coord[f.axis] !== f.sign) continue
          const mat = pickVariant(x, y, z, f.idx)
          const tile = new THREE.Mesh(tileGeo, mat)
          tile.position.set(...f.pos)
          tile.rotation.set(...f.rot)
          tile.castShadow = true
          tile.receiveShadow = true
          cubelet.add(tile)
        }
        cubeGroup.add(cubelet)
        cubelets.push(cubelet)
      }
    }
  }
  // Initial 3/4 view goes on the wrapper so cubeGroup is free to receive
  // the linear tumble (which overwrites cubeGroup.rotation each frame).
  wrapper.rotation.set(-0.32, 0.55, 0)

  function snap(n: number) { return Math.round(n / STEP) * STEP }

  // ─── Pre-scramble: jump straight to a scrambled state at startup ───
  // Resend's cube is visually mid-scramble — different textured tiles
  // visible across every face. Without this, our cube starts in solved
  // state with the same texture stripe across every visible face, giving
  // the "uniform dark" impression the user reported. Six instant twists
  // gets us a believable scramble before the first frame is drawn.
  function instantTwist(axis: 'x' | 'y' | 'z', layer: number, dir: number, turns = 1) {
    const pivot = new THREE.Group()
    cubeGroup.add(pivot)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const members: any[] = []
    cubelets.forEach((c) => {
      const coordVal = Math.round(c.position[axis] / STEP)
      if (coordVal === layer) {
        members.push(c)
        pivot.attach(c)
      }
    })
    const target = (Math.PI / 2) * dir * turns
    const axisVec = ({ x: new THREE.Vector3(1,0,0), y: new THREE.Vector3(0,1,0), z: new THREE.Vector3(0,0,1) })[axis]
    pivot.setRotationFromAxisAngle(axisVec, target)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    members.forEach((c: any) => cubeGroup.attach(c))
    cubeGroup.remove(pivot)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    members.forEach((c: any) => {
      c.position.set(snap(c.position.x), snap(c.position.y), snap(c.position.z))
      const QP = Math.PI / 2
      c.rotation.x = Math.round(c.rotation.x / QP) * QP
      c.rotation.y = Math.round(c.rotation.y / QP) * QP
      c.rotation.z = Math.round(c.rotation.z / QP) * QP
    })
  }
  const scrambleSeq: Array<['x' | 'y' | 'z', number, number]> = [
    ['y',  1,  1], ['x',  1, -1], ['z', -1,  1],
    ['y', -1,  1], ['x', -1,  1], ['z',  1, -1],
  ]
  scrambleSeq.forEach(([a, l, d]) => instantTwist(a, l, d))

  // Cubic ease-in-out for the 180° layer flip — smooth start AND smooth
  // landing so the wave reads as flowing rather than punchy.
  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  // Quintic ease-out for human-feel quarter turns — fast initial flick
  // then slows into the seat (like a finger snapping a layer over and
  // letting it settle into its detent).
  const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5)

  function performTwist({ axis, layer, dir, turns = 1, duration = 750, easeFn = easeInOutCubic }: {
    axis: 'x' | 'y' | 'z'; layer: number; dir: number; turns?: number; duration?: number;
    easeFn?: (t: number) => number;
  }) {
    return new Promise<void>((resolve) => {
      const pivot = new THREE.Group()
      cubeGroup.add(pivot)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const members: any[] = []
      cubelets.forEach((c) => {
        const coordVal = Math.round(c.position[axis] / STEP)
        if (coordVal === layer) {
          members.push(c)
          pivot.attach(c)
        }
      })

      const target = (Math.PI / 2) * dir * turns
      const axisVec = ({
        x: new THREE.Vector3(1,0,0),
        y: new THREE.Vector3(0,1,0),
        z: new THREE.Vector3(0,0,1)
      })[axis]
      const t0 = performance.now()

      function frame(now: number) {
        const t = Math.min((now - t0) / duration, 1)
        pivot.setRotationFromAxisAngle(axisVec, target * easeFn(t))
        if (t < 1) {
          rafTwist = requestAnimationFrame(frame)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          members.forEach((c: any) => cubeGroup.attach(c))
          cubeGroup.remove(pivot)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          members.forEach((c: any) => {
            c.position.set(snap(c.position.x), snap(c.position.y), snap(c.position.z))
            const QP = Math.PI / 2
            c.rotation.x = Math.round(c.rotation.x / QP) * QP
            c.rotation.y = Math.round(c.rotation.y / QP) * QP
            c.rotation.z = Math.round(c.rotation.z / QP) * QP
          })
          resolve()
        }
      }
      rafTwist = requestAnimationFrame(frame)
    })
  }

  let rafTwist = 0
  let rafAnimate = 0
  let stopped = false

  let timer1: ReturnType<typeof setTimeout> | null = null
  let timer2: ReturnType<typeof setTimeout> | null = null

  // Wrapper snap: instantaneous 90° on Y or Z before each layer flip.
  // The continuous tumble (running on cubeGroup, accumulating each frame)
  // hides this snap from the viewer — they see only that successive
  // layer flips appear to happen on different world axes. This is the
  // audit's "trick to break pattern repetition" without expensive logic.
  function wrapperSnap() {
    const dir = Math.random() < 0.5 ? 1 : -1
    if (Math.random() < 0.5) wrapper.rotation.y += dir * Math.PI / 2
    else                     wrapper.rotation.z += dir * Math.PI / 2
  }

  // Human-solver flip loop. Replaces the previous metronomic
  // "180° turn every 2s" with the cadence of an actual person solving
  // a Rubik's cube:
  //
  //   • 92% of moves are quarter turns (90°), 8% are double turns (180°)
  //     — real solvers do mostly U/R/L/F/B/D, occasionally U2/R2/etc.
  //   • Burst of 3-6 fast moves (220-340ms each, 60-130ms gap) — the
  //     "I see the next sequence" flow state.
  //   • Then a longer 600-1500ms thinking pause — the "now what?" beat.
  //   • Inside a burst, repeat-axis is biased AGAINST so consecutive
  //     moves rotate different faces (R,U,R',U' rather than R,R,R,R).
  //   • A wrapper-snap (cube reorient) only happens BETWEEN bursts,
  //     not mid-flow, and only ~25% of the time — like a solver
  //     occasionally tilting the cube to look at another face.
  //
  // The result reads as someone actually working through the puzzle,
  // not a programmatic "every-N-seconds-rotate-180°" loop.
  async function flipLoop() {
    const initialHold = opts.reducedMotion ? 2400 : 1500
    await new Promise((r) => { timer1 = setTimeout(r, initialHold) })

    let lastAxis: 'x' | 'y' | 'z' | null = null

    while (!stopped) {
      // Burst length: 3-6 moves
      const burstLen = 3 + Math.floor(Math.random() * 4)

      for (let i = 0; i < burstLen && !stopped; i++) {
        // Pick axis with bias against repeating the previous one
        let axis: 'x' | 'y' | 'z'
        do {
          axis = (['x', 'y', 'z'] as const)[Math.floor(Math.random() * 3)]
        } while (axis === lastAxis && Math.random() < 0.7)
        lastAxis = axis

        const layer = [-1, 0, 1][Math.floor(Math.random() * 3)]
        const dir = Math.random() < 0.5 ? 1 : -1
        // 8% double turns, 92% single quarter turns
        const turns = Math.random() < 0.08 ? 2 : 1

        // Quarter: 220-340ms (finger flick + settle). Double: 360-500ms.
        const duration = opts.reducedMotion
          ? 800 + Math.random() * 300
          : turns === 1
            ? 220 + Math.random() * 120
            : 360 + Math.random() * 140

        // Quarter turns use ease-out-quint (snappy flick + settle);
        // double turns use ease-in-out-cubic (smoother on the longer arc).
        await performTwist({
          axis, layer, dir, turns, duration,
          easeFn: turns === 1 ? easeOutQuint : easeInOutCubic,
        })
        if (stopped) break

        // Inter-move gap inside a burst: 60-130ms (breath between moves)
        const innerGap = opts.reducedMotion ? 700 : 60 + Math.random() * 70
        await new Promise((r) => { timer2 = setTimeout(r, innerGap) })
      }

      if (stopped) break

      // Between-burst "thinking" pause: 600-1500ms
      // 25% chance of a cube reorient during the pause (not mid-burst!)
      if (!opts.reducedMotion && Math.random() < 0.25) wrapperSnap()
      const thinkPause = opts.reducedMotion
        ? 2200 + Math.random() * 1000
        : 600 + Math.random() * 900
      await new Promise((r) => { timer1 = setTimeout(r, thinkPause) })
    }
  }
  // Inline ornament cubes skip the layer-twist + wrapper-snap loop —
  // continuous tumble alone keeps the visual alive while saving GPU
  // (no rotation matrices for layers/cubelets per frame, no setTimeout
  // chains). Hero cube still runs the full human-solver flip cadence.
  if (!opts.simplifyAnimation) {
    flipLoop()
  }

  // Continuous tumble (Hệ 1 of the audit). Linear accumulation on all
  // 3 axes — no easing. Equal speed on every axis sums to a fixed diagonal
  // vector, which reads as a "tumbling" object rather than spinning around
  // any single axis. ~17s per full rotation per axis at 60fps.
  const TUMBLE = opts.reducedMotion ? 0.0015 : 0.005
  const tumble = { x: 0, y: 0, z: 0 }

  // ─── Scroll-position-driven Y rotation ────────────────────────────
  // The cube's Y-axis rotation is a DETERMINISTIC FUNCTION of the
  // user's current scrollY position — not of scroll velocity. The
  // user effectively "scrubs" the cube's Y orientation by scrolling
  // the page: scroll down → cube rotates clockwise around Y; scroll
  // up → cube rotates counter-clockwise; stop → cube stops at exactly
  // that orientation. This is the cleanest expression of "scroll
  // controls cube rotation" — visually it reads as the user grabbing
  // a virtual turntable and spinning the cube with their scroll input.
  //
  // Brand metaphor "Sáu mặt — Một sản phẩm" becomes INTERACTIVE: the
  // user reveals different cube faces by scrolling. At REVOLUTIONS_PER_
  // PAGE=3, scrolling 100vh produces ~130° of Y rotation; full-page
  // scroll produces 3 complete revolutions (cube returns to its
  // starting face at page bottom = poetic bookend).
  //
  // Velocity-based approach (the previous implementation, with
  // scrollMomentum + lerp + decay + 3-axis distribution) was retired
  // because the boost read as "tumble pattern slightly different"
  // rather than "I am rotating the cube". Position-based scrub is
  // unambiguous: scroll = rotation, scrub-able both directions.
  //
  // X and Z axes keep the base TUMBLE rate (ambient gentle rotation
  // for "alive when idle" feel). Only Y is taken over by scroll.
  //
  // Reduced-motion: REVOLUTIONS_PER_PAGE = 0 (no scroll-driven Y;
  // cube tumbles ambient on all 3 axes only — vestibular comfort).
  const REVOLUTIONS_PER_PAGE = opts.reducedMotion ? 0 : 3

  // Mouse parallax adds an extra resting offset on top of the tumble.
  const parallaxTarget = { x: 0, y: 0 }
  const parallaxCurrent = { x: 0, y: 0 }

  // Cursor spotlight position + intensity, both lerped each frame for a
  // smooth flashlight feel rather than a snapping point.
  const cursorTarget = { x: 0, y: 0, intensity: 0 }
  const cursorCurrent = { x: 0, y: 0, intensity: 0 }

  function onMove(e: MouseEvent) {
    const rect = wrap.getBoundingClientRect()
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
    parallaxTarget.y =  nx * 0.30
    parallaxTarget.x = -ny * 0.16

    // Spotlight target — NDC mapped to a plane in front of the cube.
    // The 2.6 scale puts the light just outside the cube's silhouette
    // at the screen edges, so the highlight tracks visibly with the
    // cursor without the light leaving the cube's reach.
    cursorTarget.x = nx * 2.6
    cursorTarget.y = -ny * 2.6
    cursorTarget.intensity = 1.6
  }
  function onLeave() {
    parallaxTarget.x = 0
    parallaxTarget.y = 0
    cursorTarget.intensity = 0
  }
  wrap.addEventListener('mousemove', onMove)
  wrap.addEventListener('mouseleave', onLeave)

  function resize() {
    const w = wrap.clientWidth
    const h = wrap.clientHeight
    if (w === 0 || h === 0) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  let resizeRaf = 0
  function onResize() {
    cancelAnimationFrame(resizeRaf)
    resizeRaf = requestAnimationFrame(resize)
  }
  window.addEventListener('resize', onResize)
  // ResizeObserver catches the case where the wrap div was 0×0 at setupCube
  // time (layout not yet stable) — without this, the canvas stayed 0×0 and
  // the cube was never visible despite all the rendering happening.
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf)
    resizeRaf = requestAnimationFrame(resize)
  })
  ro.observe(wrap)

  let isVisible = true
  const visObs = new IntersectionObserver(
    ([entry]) => { isVisible = entry.isIntersecting },
    { rootMargin: '50px 0px' }
  )
  visObs.observe(wrap)

  // Entrance handled by CSS on the wrapper (scale-up-fade keyframe in
  // globals.css) — start the cube at full scale here. The wrapper opacity
  // animation already gives the dramatic intro; double-tweening (CSS scale
  // + JS scale) was producing a slight stutter at ~1.0 because the eased
  // curves disagreed on the final frame.
  cubeGroup.scale.setScalar(1)

  function animate() {
    if (stopped) return

    if (!isVisible) {
      rafAnimate = requestAnimationFrame(animate)
      return
    }

    // X, Y, Z all accumulate base TUMBLE (Y is overridden below when
    // scroll-driven mode is active; kept here as a fallback for
    // reduced-motion users where scroll-driven rotation is disabled).
    tumble.x += TUMBLE
    tumble.y += TUMBLE
    tumble.z += TUMBLE

    // Compute Y rotation: scroll-position-driven when motion enabled,
    // else fall back to base TUMBLE accumulation. The scroll-driven
    // path lets the user "scrub" the cube's Y orientation by their
    // scroll position — direct, deterministic, scrub-able both
    // directions. REVOLUTIONS_PER_PAGE=3 gives ~130° per 100vh scroll.
    let yRotation: number
    if (REVOLUTIONS_PER_PAGE > 0) {
      const totalScrollable = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      )
      const scrollProgress = window.scrollY / totalScrollable
      yRotation = scrollProgress * Math.PI * 2 * REVOLUTIONS_PER_PAGE
    } else {
      yRotation = tumble.y
    }

    parallaxCurrent.x += (parallaxTarget.x - parallaxCurrent.x) * 0.06
    parallaxCurrent.y += (parallaxTarget.y - parallaxCurrent.y) * 0.06

    // Spotlight: snappier on position (0.18) so the highlight tracks the
    // cursor; gentler on intensity (0.08) so the on/off ramp reads as a
    // soft fade rather than a hard flicker.
    cursorCurrent.x += (cursorTarget.x - cursorCurrent.x) * 0.18
    cursorCurrent.y += (cursorTarget.y - cursorCurrent.y) * 0.18
    cursorCurrent.intensity += (cursorTarget.intensity - cursorCurrent.intensity) * 0.08
    cursorLight.position.set(cursorCurrent.x, cursorCurrent.y, 3)
    cursorLight.intensity = cursorCurrent.intensity

    cubeGroup.rotation.x = tumble.x + parallaxCurrent.x
    // Y comes from yRotation (scroll-driven when motion enabled, base
    // tumble otherwise). Mouse parallax Y adds a small hover offset
    // so the cube also responds to cursor input.
    cubeGroup.rotation.y = yRotation + parallaxCurrent.y
    cubeGroup.rotation.z = tumble.z

    renderer.render(scene, camera)
    rafAnimate = requestAnimationFrame(animate)
  }
  rafAnimate = requestAnimationFrame(animate)

  return () => {
    stopped = true
    cancelAnimationFrame(rafAnimate)
    cancelAnimationFrame(rafTwist)
    cancelAnimationFrame(resizeRaf)
    if (timer1) clearTimeout(timer1)
    if (timer2) clearTimeout(timer2)
    visObs.disconnect()
    themeObs.disconnect()
    ro.disconnect()
    wrap.removeEventListener('mousemove', onMove)
    wrap.removeEventListener('mouseleave', onLeave)
    window.removeEventListener('resize', onResize)

    cubeletGeo.dispose()
    tileGeo.dispose()
    bodyMat.dispose()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tileVariants.forEach((m: any) => {
      if (m.map) m.map.dispose()
      if (m.normalMap) m.normalMap.dispose()
      m.dispose()
    })
    texCarbon.dispose()
    grainHeavy.map.dispose()
    grainHeavy.nor.dispose()
    grainSubtle.map.dispose()
    grainSubtle.nor.dispose()
    texHex.dispose()
    texMesh.dispose()
    texStripes.dispose()
    haloMat.map?.dispose()
    haloMat.dispose()
    shadowMat.dispose()
    if (scene.environment) scene.environment.dispose()
    renderer.dispose()
  }
}

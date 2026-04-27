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

export default function HeroCube() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [interactive, setInteractive] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    // Skip 3D ONLY for mobile (battery/GPU) or no-WebGL (impossible).
    // Reduced-motion is honored INSIDE setupCube by skipping the abrupt face
    // twists — but the gentle auto-spin + cursor parallax stay on, matching
    // Resend's actual behavior. Showing a static SVG when the user just has
    // OS-level reduce-motion enabled (a very common default on macOS) was
    // hiding the cube for far too many people.
    const small = window.matchMedia('(max-width: 768px)').matches
    if (small || !hasWebGL()) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Guard against React Strict Mode double-mount: if cleanup runs before
    // `import('three')` resolves, we must NOT call setupCube. Otherwise we
    // end up with two renderers on the same canvas (one from each mount),
    // both running animation loops and stomping on each other — that was
    // why the cube appeared frozen / not rotating.
    let cancelled = false
    let cleanup: (() => void) | null = null

    // The hero is always above-the-fold, so we don't need to gate on
    // IntersectionObserver — boot three.js immediately. Removing the
    // observer eliminates a class of race conditions and starts the cube
    // animation ~50ms sooner.
    import('three').then((THREE) => {
      if (cancelled) return
      try {
        cleanup = setupCube(canvas, wrap, THREE, { reducedMotion: reduced })
        setInteractive(true)
      } catch (err) {
        console.warn('[HeroCube] setupCube threw:', err)
      }
    }).catch((err) => {
      console.warn('[HeroCube] three.js failed to load:', err)
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return (
    <div ref={wrapRef} className="hero-cube-wrap relative w-full">
      {/* Static SVG fallback — visible until the WebGL canvas takes over. */}
      <div
        aria-hidden="true"
        className={`hero-cube-fallback absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${interactive ? 'opacity-0' : 'opacity-100'}`}
      >
        <StaticCube />
      </div>

      <canvas
        ref={canvasRef}
        className={`hero-cube-canvas relative w-full h-full transition-opacity duration-700 ${interactive ? 'opacity-100' : 'opacity-0'}`}
        aria-label="3D Rubik visualization"
      />
    </div>
  )
}

/**
 * Tiny isometric cube SVG — used as the static fallback on mobile, reduced-
 * motion, and during the brief gap before three.js loads on desktop.
 *
 * Per-face shade arrays + face sheen gradients fake the WebGL lighting:
 * top face is brightest (key-lit), right face medium-warm, left face
 * cool-dark (rim-lit). Without this, the cube reads as a black blob
 * during the boot delay.
 */
function StaticCube() {
  // Mid-grey range chosen to match the WebGL inset colors (#5e5e6a etc.)
  // so the SVG → WebGL handoff is visually continuous.
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

        {/* Per-face sheen overlays — fake the directional lighting. */}
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

        {/* Soft contact shadow grounding the cube. */}
        <radialGradient id="contactShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.45)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="280" height="280" fill="url(#cubeGlow)" />
      <ellipse cx="140" cy="248" rx="92" ry="12" fill="url(#contactShadow)" />

      {/* Top face — brightest, key-lit. */}
      <g transform="translate(80 60) skewX(-30) scale(0.95 0.6)">
        {[0,1,2].map((r) => [0,1,2].map((c) => (
          <g key={`t-${r}-${c}`}>{tile(c * 40, r * 40, pick(TOP, r * 3 + c))}</g>
        )))}
        <rect x="-2" y="-2" width="124" height="124" fill="url(#topSheen)" pointerEvents="none" />
      </g>

      {/* Right face — warm rim, medium brightness. */}
      <g transform="translate(140 130) skewY(-30)">
        {[0,1,2].map((r) => [0,1,2].map((c) => (
          <g key={`r-${r}-${c}`}>{tile(c * 40, r * 40, pick(RIGHT, r * 3 + c))}</g>
        )))}
        <rect x="-2" y="-2" width="124" height="124" fill="url(#rightSheen)" pointerEvents="none" />
      </g>

      {/* Left face — cool rim, darkest. */}
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
  opts: { reducedMotion?: boolean } = {}
): () => void {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.25, 2.5))
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

  // HDR-like environment: 5 light spots baked in for richer reflections
  // than a single soft sky. Each spot becomes a visible specular highlight
  // sweeping across the cube as it tumbles. Cool top, warm side, accent
  // colors give the polished metal a "studio shoot" character vs Resend's
  // single-spotlight feel.
  function makeEnvMap() {
    const w = 2048, h = 1024
    const c = document.createElement('canvas')
    c.width = w; c.height = h
    const ctx = c.getContext('2d')!

    // Base gradient: deep navy top → near-black bottom for crisp contrast
    // when reflections sweep across.
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0.00, '#1d2032')
    grad.addColorStop(0.30, '#0c0e16')
    grad.addColorStop(0.55, '#040508')
    grad.addColorStop(1.00, '#000000')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // 5 light spots — positions chosen so as the cube tumbles, sweeping
    // across each highlight gives a continuous "rolling shimmer" effect.
    type Spot = { cx: number; cy: number; r: number; color: string; alpha: number }
    const spots: Spot[] = [
      // Cool studio key — top center, large soft
      { cx: 0.50, cy: 0.18, r: 0.32, color: '255,250,240', alpha: 0.55 },
      // Warm rim — left, smaller crisp
      { cx: 0.14, cy: 0.34, r: 0.18, color: '255,220,170', alpha: 0.42 },
      // Cool accent — right
      { cx: 0.82, cy: 0.30, r: 0.20, color: '170,200,255', alpha: 0.38 },
      // Soft horizon glow — wide, low intensity
      { cx: 0.50, cy: 0.50, r: 0.45, color: '180,190,220', alpha: 0.16 },
      // Subtle violet kick — back-left, for chromatic interest
      { cx: 0.30, cy: 0.62, r: 0.16, color: '210,180,255', alpha: 0.22 },
    ]
    for (const s of spots) {
      const grd = ctx.createRadialGradient(
        w * s.cx, h * s.cy, 4,
        w * s.cx, h * s.cy, w * s.r
      )
      grd.addColorStop(0,    `rgba(${s.color},${s.alpha})`)
      grd.addColorStop(0.45, `rgba(${s.color},${s.alpha * 0.30})`)
      grd.addColorStop(1,    `rgba(${s.color},0)`)
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)
    }

    const tex = new THREE.CanvasTexture(c)
    tex.mapping = THREE.EquirectangularReflectionMapping
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = MAX_ANISO
    return tex
  }
  scene.environment = makeEnvMap()

  // 5-light cinematic setup — studio product photography rig.
  // The env map provides the base reflection palette; these directional
  // lights add structured shadows + per-face contrast that env alone
  // cannot. Total intensity tuned so the cube reads premium-bright on
  // alodev's cream hero, still rich on dark theme.
  scene.add(new THREE.HemisphereLight(0xb8c0e0, 0x040408, 0.30))

  const key = new THREE.DirectionalLight(0xfff5e8, 2.20)         // warm key
  key.position.set(4.5, 8, 7)
  key.castShadow = true
  key.shadow.mapSize.set(4096, 4096)
  key.shadow.camera.near = 0.5
  key.shadow.camera.far = 30
  key.shadow.camera.left = -5
  key.shadow.camera.right = 5
  key.shadow.camera.top = 5
  key.shadow.camera.bottom = -5
  key.shadow.bias = -0.0004
  key.shadow.radius = 7
  scene.add(key)

  // Cool back-rim — silhouettes the cube against the bg.
  const rimL = new THREE.DirectionalLight(0xa8b4ff, 0.85)
  rimL.position.set(-7, 2, -4)
  scene.add(rimL)

  // Warm side-rim — three-point completion.
  const rimR = new THREE.DirectionalLight(0xffd4a3, 0.55)
  rimR.position.set(7, -2, -2)
  scene.add(rimR)

  // Frontal fill — soft camera-side wash for tile fronts.
  const fill = new THREE.DirectionalLight(0xfff2dc, 0.55)
  fill.position.set(2, 1.5, 9)
  scene.add(fill)

  // Bottom bounce — fakes ground reflection light so the underside of
  // the cube isn't dead shadow when it tumbles. Subtle warm tint matches
  // the brand glow's saffron undertone.
  const bounce = new THREE.DirectionalLight(0xffe4c4, 0.30)
  bounce.position.set(0, -6, 3)
  scene.add(bounce)

  // Contact shadow — softer (opacity 0.62), brought slightly closer
  // (-2.15 from -2.30) so the cube reads as "grounded" rather than
  // floating in space. The shadow radius on the key light gives the
  // soft penumbra look of a studio softbox.
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.62 })
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), shadowMat)
  shadowPlane.rotation.x = -Math.PI / 2
  shadowPlane.position.y = -2.15
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
  halo.scale.set(7, 7, 1)
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

  function makeBaseInsetMap(size = 512, centerHex = '#1d1d22', edgeHex = '#020205') {
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    ctx.fillStyle = edgeHex; ctx.fillRect(0, 0, size, size)
    const grad = ctx.createRadialGradient(size/2, size/2, size * 0.05, size/2, size/2, size * 0.55)
    grad.addColorStop(0, centerHex)
    grad.addColorStop(0.65, centerHex)
    grad.addColorStop(1, edgeHex)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = MAX_ANISO
    return tex
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

  function makeDotGridTexture(size = 512, dotsPerSide = 9) {
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#26262c'; ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = '#04040a'
    const step = size / dotsPerSide
    const r = step * 0.20
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
    ctx.fillStyle = '#0e0e14'; ctx.fillRect(0, 0, size, size)
    const step = size / lines
    for (let i = 0; i < lines; i++) {
      const x = i * step
      const w = step * 0.42
      const v = 38 + Math.random() * 14
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
  // patterned tiles so granite/sparkle/dots/mesh/stripes read crisp on
  // the cube faces. 512² (used previously) made them look mushy.
  const grainHeavy  = makeNoiseAndNormal(1024, 0.038, 200, 6)
  const grainSubtle = makeNoiseAndNormal(1024, 0.014, 120, 5)
  const texDots     = makeDotGridTexture(1024, 9)
  const texMesh     = makeMeshGrilleTexture(1024, 38)
  const texStripes  = makeVerticalStripesTexture(1024, 30)
  // Tile center colors — slight warm tint on insets so reflections from
  // the env map's warm key spot pick up as a subtle gold sheen rather
  // than reading as flat grey.
  const insetSmooth = makeBaseInsetMap(512, '#5e5e6a', '#0a0a0e')
  const insetMatte  = makeBaseInsetMap(512, '#48484f', '#0a0a0e')
  const insetSemi   = makeBaseInsetMap(512, '#56565e', '#0a0a0e')

  // Material upgrade — premium PBR per variant. Each tile type now has
  // its own physical character (mirror gloss, matte velvet, sparkle,
  // etc.) so the cube reads as 8 distinct materials rather than tinted
  // copies of one. Iridescence on a couple variants gives the cube a
  // subtle rainbow shimmer when it sweeps past env-map highlights — the
  // single biggest "premium" cue beyond what Resend currently does.
  const tileVariants = [
    // 0: Mirror onyx — high clearcoat, near-mirror finish. The "showpiece"
    // tile that flashes specular highlights as the cube tumbles.
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: insetSmooth,
      roughness: 0.12, metalness: 0.35, reflectivity: 0.55,
      clearcoat: 0.85, clearcoatRoughness: 0.05,
      envMapIntensity: 1.10,
    }),
    // 1: Matte velvet — low everything; the dark anchor that gives the
    // cube its tonal contrast against the gloss tiles.
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: insetMatte,
      roughness: 0.55, metalness: 0.10, reflectivity: 0.10,
      envMapIntensity: 0.18,
    }),
    // 2: Granite/sparkle with iridescence — the "wow" tile. Heavy
    // normal map for visible grain + clearcoat for sparkle pop +
    // iridescence so the highlights shift hue as you watch it move.
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: grainHeavy.map, normalMap: grainHeavy.nor,
      normalScale: new THREE.Vector2(1.8, 1.8),
      roughness: 0.18, metalness: 0.40, reflectivity: 0.50,
      clearcoat: 0.55, clearcoatRoughness: 0.10,
      iridescence: 0.30, iridescenceIOR: 1.30,
      iridescenceThicknessRange: [100, 460],
      envMapIntensity: 1.05,
    }),
    // 3: Micro-grain anodized — subtle noise + slight metallic feel.
    // The "everyday" filler tile that doesn't draw attention but reads
    // as a real material rather than blank grey.
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: grainSubtle.map, normalMap: grainSubtle.nor,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughness: 0.32, metalness: 0.35, reflectivity: 0.30,
      envMapIntensity: 0.75,
    }),
    // 4: Perforated dots — speaker-grille industrial. Higher metalness
    // + lower roughness so the dots cast micro-highlights from env.
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: texDots,
      roughness: 0.20, metalness: 0.55, reflectivity: 0.40,
      envMapIntensity: 0.95,
    }),
    // 5: Mesh grille — the "vent" tile. Slight clearcoat for that
    // freshly-machined sheen.
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: texMesh,
      roughness: 0.22, metalness: 0.45, reflectivity: 0.35,
      clearcoat: 0.30, clearcoatRoughness: 0.18,
      envMapIntensity: 0.90,
    }),
    // 6: Vertical stripes with slight iridescence — anisotropic-feeling
    // brushed metal effect. The iridescence is subtle (0.18) so it just
    // adds a hint of warmth/coolness shift across the stripes.
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: texStripes,
      roughness: 0.20, metalness: 0.50, reflectivity: 0.45,
      iridescence: 0.18, iridescenceIOR: 1.25,
      iridescenceThicknessRange: [120, 380],
      envMapIntensity: 1.00,
    }),
    // 7: Semi-gloss filler — bridges between matte and full gloss. Mild
    // clearcoat so it has SOME spec response without competing with #0.
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: insetSemi,
      roughness: 0.28, metalness: 0.25, reflectivity: 0.25,
      clearcoat: 0.20, clearcoatRoughness: 0.20,
      envMapIntensity: 0.70,
    }),
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

  // Cubelet body — anodized dark steel. Slight clearcoat so the curved
  // body geometry catches a subtle highlight as the cube tumbles, giving
  // each cubelet readable 3D shape rather than reading as flat silhouette
  // between the tiles.
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x32323a, roughness: 0.55, metalness: 0.42, reflectivity: 0.35,
    clearcoat: 0.25, clearcoatRoughness: 0.32,
    envMapIntensity: 0.78,
  })

  function pickVariant(x: number, y: number, z: number, faceIndex: number) {
    const h = ((x + 1) * 9 + (y + 1) * 3 + (z + 1)) * 6 + faceIndex
    // Rebalanced from [4,3,2,3,1,1,1,3] → [2,2,3,3,2,2,2,2]. Old weights gave
    // 72% matte/smooth tiles, leaving visible textures rare. New distribution
    // bumps granite/dots/mesh/stripes to ~50% of tiles, matching Resend's
    // visible material variety per face.
    //              [smooth, matte, granite, micro, dots, mesh, stripes, semi]
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

  // easeInOutQuint — smoother than cubic at both ends. The 180° flip
  // accelerates very gently from 0, peaks fast in the middle (the eye
  // sees the "sweep"), then settles smoothly. This is what makes the
  // motion read as "elegant" rather than "mechanical".
  const easeInOutQuint = (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2

  function performTwist({ axis, layer, dir, turns = 1, duration = 750, easeFn = easeInOutQuint }: {
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

  // Layer flip loop — Hệ 2 of the audit. Pick random axis (x/y/z),
  // random layer (-1/0/1), random direction; rotate that layer 180°
  // over ~2s with cubic ease. Pause 0–1000ms between flips. Before
  // each flip, 70% probability of a wrapper snap to permute axes.
  async function flipLoop() {
    const initialHold = opts.reducedMotion ? 2400 : 1200
    await new Promise((r) => { timer1 = setTimeout(r, initialHold) })

    while (!stopped) {
      if (!opts.reducedMotion && Math.random() < 0.7) wrapperSnap()

      const axis = (['x', 'y', 'z'] as const)[Math.floor(Math.random() * 3)]
      const layer = [-1, 0, 1][Math.floor(Math.random() * 3)]
      const dir = Math.random() < 0.5 ? 1 : -1
      // Slightly slower flips (2.0-2.7s vs prev 1.7-2.4s) — with the
      // smoother quintic ease and richer materials, longer flips give
      // the eye time to track each highlight sweeping across the cube.
      const duration = opts.reducedMotion
        ? 2600
        : 2000 + Math.random() * 700

      await performTwist({ axis, layer, dir, turns: 2, duration })
      if (stopped) break

      const pause = opts.reducedMotion
        ? 1800 + Math.random() * 1200
        : Math.random() * 1000        // 0–1000ms per audit randomization
      await new Promise((r) => { timer2 = setTimeout(r, pause) })
    }
  }
  flipLoop()

  // Continuous tumble (Hệ 1 of the audit). Linear accumulation on all
  // 3 axes — no easing. Equal speed on every axis sums to a fixed diagonal
  // vector, which reads as a "tumbling" object rather than spinning around
  // any single axis. ~17s per full rotation per axis at 60fps.
  const TUMBLE = opts.reducedMotion ? 0.0015 : 0.005
  const tumble = { x: 0, y: 0, z: 0 }

  // Mouse parallax adds an extra resting offset on top of the tumble.
  const parallaxTarget = { x: 0, y: 0 }
  const parallaxCurrent = { x: 0, y: 0 }

  function onMove(e: MouseEvent) {
    const rect = wrap.getBoundingClientRect()
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
    parallaxTarget.y =  nx * 0.30
    parallaxTarget.x = -ny * 0.16
  }
  function onLeave() {
    parallaxTarget.x = 0
    parallaxTarget.y = 0
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

    // Accumulate continuous linear tumble — overwrites cubeGroup.rotation
    // each frame (no smoothing, no easing). The wrapper holds the initial
    // 3/4 view and any snap rotations, so cubeGroup is free to tumble.
    tumble.x += TUMBLE
    tumble.y += TUMBLE
    tumble.z += TUMBLE

    parallaxCurrent.x += (parallaxTarget.x - parallaxCurrent.x) * 0.06
    parallaxCurrent.y += (parallaxTarget.y - parallaxCurrent.y) * 0.06

    cubeGroup.rotation.x = tumble.x + parallaxCurrent.x
    cubeGroup.rotation.y = tumble.y + parallaxCurrent.y
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
    insetSmooth.dispose()
    insetMatte.dispose()
    insetSemi.dispose()
    grainHeavy.map.dispose()
    grainHeavy.nor.dispose()
    grainSubtle.map.dispose()
    grainSubtle.nor.dispose()
    texDots.dispose()
    texMesh.dispose()
    texStripes.dispose()
    haloMat.map?.dispose()
    haloMat.dispose()
    shadowMat.dispose()
    if (scene.environment) scene.environment.dispose()
    renderer.dispose()
  }
}

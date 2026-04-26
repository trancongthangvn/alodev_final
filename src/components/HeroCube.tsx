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

// Floating tag chips around the cube — pick stack names that read as
// "we use industrial-grade tools", short enough to fit in a tiny pill.
const floatTags = [
  { text: 'Next.js 16',  pos: 'top-[10%] right-[4%]'   },
  { text: 'PostgreSQL',  pos: 'top-[42%] right-[-2%]'  },
  { text: 'Cloudflare',  pos: 'bottom-[14%] right-[8%]' },
]

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
      cleanup = setupCube(canvas, wrap, THREE, { reducedMotion: reduced })
      setInteractive(true)
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

      {/* Floating mono-font tag chips — theme-adaptive */}
      {floatTags.map((t, i) => (
        <span
          key={t.text}
          className={`hero-cube-tag hidden lg:inline-flex absolute ${t.pos} px-2.5 py-1 rounded-md border border-gray-300 dark:border-zinc-800/90 bg-white/80 dark:bg-zinc-950/70 backdrop-blur text-[11px] font-mono text-gray-600 dark:text-zinc-400`}
          style={{ animationDelay: `${i * 1.5}s` }}
        >
          {t.text}
        </span>
      ))}
    </div>
  )
}

/**
 * Tiny isometric cube SVG — used as the static fallback on mobile, reduced-
 * motion, and during the brief gap before three.js loads on desktop.
 */
function StaticCube() {
  const tile = (x: number, y: number, fill: string) => (
    <rect x={x} y={y} width="36" height="36" rx="4" fill={fill} stroke="#0a0a0c" strokeWidth="1" />
  )
  const shades = ['#1a1a1f', '#222227', '#16161a', '#1f1f24']
  // % has higher precedence than >>>, so we need explicit parens around the shift
  const pick = (i: number) => shades[((i * 2654435761) >>> 28) % shades.length] || shades[0]

  return (
    <svg viewBox="0 0 280 280" className="w-[80%] max-w-[420px]" aria-hidden="true">
      <defs>
        <radialGradient id="cubeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(170,180,210,0.18)" />
          <stop offset="60%" stopColor="rgba(80,80,120,0.04)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="280" height="280" fill="url(#cubeGlow)" />

      <g transform="translate(80 60) skewX(-30) scale(0.95 0.6)">
        {[0,1,2].map((r) => [0,1,2].map((c) => (
          <g key={`t-${r}-${c}`}>{tile(c * 40, r * 40, pick(r * 3 + c))}</g>
        )))}
      </g>
      <g transform="translate(140 130) skewY(-30)">
        {[0,1,2].map((r) => [0,1,2].map((c) => (
          <g key={`r-${r}-${c}`}>{tile(c * 40, r * 40, pick(9 + r * 3 + c))}</g>
        )))}
      </g>
      <g transform="translate(20 130) skewY(30)">
        {[0,1,2].map((r) => [0,1,2].map((c) => (
          <g key={`l-${r}-${c}`}>{tile(c * 40, r * 40, pick(18 + r * 3 + c))}</g>
        )))}
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
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  // Bumped from 0.88 to 1.05 — r184 ACES tone mapping renders darker than
  // r128 (the version in the rubik_resend repo) at the same exposure value.
  // 1.05 brings tile texture variation back to repo-equivalent visibility.
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const MAX_ANISO = renderer.capabilities.getMaxAnisotropy()

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 100)
  camera.position.set(8.6, 6.4, 10.0)
  camera.lookAt(0, -0.05, 0)

  function makeEnvMap() {
    const w = 1024, h = 512
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

    const sb1 = ctx.createRadialGradient(w * 0.5, h * 0.18, 30, w * 0.5, h * 0.18, w * 0.30)
    sb1.addColorStop(0, 'rgba(220,225,240,0.45)')
    sb1.addColorStop(1, 'rgba(220,225,240,0)')
    ctx.fillStyle = sb1; ctx.fillRect(0, 0, w, h)

    const sb2 = ctx.createRadialGradient(w * 0.12, h * 0.40, 10, w * 0.12, h * 0.40, w * 0.18)
    sb2.addColorStop(0, 'rgba(150,170,210,0.22)')
    sb2.addColorStop(1, 'rgba(150,170,210,0)')
    ctx.fillStyle = sb2; ctx.fillRect(0, 0, w, h)

    const tex = new THREE.CanvasTexture(c)
    tex.mapping = THREE.EquirectangularReflectionMapping
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = MAX_ANISO
    return tex
  }
  scene.environment = makeEnvMap()

  // Slightly stronger ambient + key light to compensate for r184 darkening
  // and make the granite / dot / mesh / stripe textures POP across tiles.
  scene.add(new THREE.HemisphereLight(0xb8c0e0, 0x02020a, 0.28))

  const key = new THREE.DirectionalLight(0xffffff, 1.25)
  key.position.set(5, 9, 6)
  key.castShadow = true
  // 4096 to match the rubik_resend repo for crisp shadow edges (~16MB GPU).
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

  const rimL = new THREE.DirectionalLight(0xa8b4d8, 0.40)
  rimL.position.set(-7, 2, -4)
  scene.add(rimL)

  const rimR = new THREE.DirectionalLight(0xddc8b0, 0.18)
  rimR.position.set(7, -2, -2)
  scene.add(rimR)

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
  const insetSmooth = makeBaseInsetMap(512, '#26262e', '#040408')
  // Lifted matte center from #0a0a0d (near-black) to #1a1a20 — was rendering
  // as pure void on most matte tiles, killing the texture variation feel.
  const insetMatte  = makeBaseInsetMap(512, '#1a1a20', '#040407')
  const insetSemi   = makeBaseInsetMap(512, '#1f1f26', '#040408')

  const tileVariants = [
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: insetSmooth, roughness: 0.42, metalness: 0.45, clearcoat: 0.35, clearcoatRoughness: 0.22, envMapIntensity: 0.85 }),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: insetMatte,  roughness: 1.0,  metalness: 0.0,  envMapIntensity: 0.07 }),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: grainHeavy.map,  normalMap: grainHeavy.nor,  normalScale: new THREE.Vector2(1.4, 1.4), roughness: 0.65, metalness: 0.35, envMapIntensity: 0.7 }),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: grainSubtle.map, normalMap: grainSubtle.nor, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 0.55, metalness: 0.35, envMapIntensity: 0.75 }),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: texDots,    roughness: 0.45, metalness: 0.4, envMapIntensity: 0.85 }),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: texMesh,    roughness: 0.5,  metalness: 0.4, envMapIntensity: 0.8 }),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: texStripes, roughness: 0.4,  metalness: 0.5, envMapIntensity: 0.9 }),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: insetSemi,  roughness: 0.55, metalness: 0.32, envMapIntensity: 0.7 }),
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
  const GAP  = 0.05
  const STEP = SIZE + GAP
  const TILE_SIZE = 0.84
  const TILE_RADIUS = 0.08
  const TILE_DEPTH = 0.012        // bumped from 0.005 — thicker tile catches edge light
  const TILE_BEVEL = 0.014        // bumped from 0.004 — wider bevel = visible white rim
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

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x030305, roughness: 0.78, metalness: 0.18, envMapIntensity: 0.4,
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

  const cubeGroup = new THREE.Group()
  scene.add(cubeGroup)
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
  cubeGroup.rotation.set(-0.32, 0.55, 0)

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

  function performTwist({ axis, layer, dir, turns = 1, duration = 750 }: {
    axis: 'x' | 'y' | 'z'; layer: number; dir: number; turns?: number; duration?: number
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
      const ease = (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

      function frame(now: number) {
        const t = Math.min((now - t0) / duration, 1)
        pivot.setRotationFromAxisAngle(axisVec, target * ease(t))
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

  const moveBank: Array<{ axis: 'x' | 'y' | 'z'; layer: number; dir: number }> = [
    { axis: 'y', layer:  1, dir:  1 },
    { axis: 'x', layer:  1, dir:  1 },
    { axis: 'y', layer:  1, dir: -1 },
    { axis: 'x', layer:  1, dir: -1 },
    { axis: 'z', layer:  1, dir:  1 },
    { axis: 'y', layer: -1, dir:  1 },
    { axis: 'z', layer:  1, dir: -1 },
    { axis: 'y', layer: -1, dir: -1 },
    { axis: 'x', layer: -1, dir:  1 },
    { axis: 'z', layer: -1, dir:  1 },
    { axis: 'x', layer: -1, dir: -1 },
    { axis: 'z', layer: -1, dir: -1 },
  ]

  let moveIndex = 0
  let timer1: ReturnType<typeof setTimeout> | null = null
  let timer2: ReturnType<typeof setTimeout> | null = null
  async function choreograph() {
    await new Promise((r) => { timer1 = setTimeout(r, 1500) })
    while (!stopped) {
      const m = moveBank[moveIndex % moveBank.length]
      moveIndex++
      const turns = Math.random() < 0.10 ? 2 : 1
      const duration = turns === 2 ? 1000 : (600 + Math.random() * 220)
      await performTwist({ ...m, turns, duration })
      if (stopped) break
      await new Promise((r) => { timer2 = setTimeout(r, 350 + Math.random() * 500) })
    }
  }
  // Skip choreographed face twists on reduced-motion. Auto-spin + parallax
  // still run because they're gentle and don't trigger vestibular issues.
  if (!opts.reducedMotion) {
    choreograph()
  }

  const targetRot = { x: -0.32, y: 0.55 }
  const currentRot = { x: -0.32, y: 0.55 }
  let autoSpin = 0

  function onMove(e: MouseEvent) {
    const rect = wrap.getBoundingClientRect()
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
    targetRot.y = 0.55 + nx * 0.30
    targetRot.x = -0.32 - ny * 0.16
  }
  function onLeave() {
    targetRot.x = -0.32
    targetRot.y = 0.55
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

  cubeGroup.scale.setScalar(0.001)
  const entranceStart = performance.now()
  const ENTRANCE_MS = 1200

  function animate(now: number) {
    if (stopped) return
    if (!isVisible) {
      rafAnimate = requestAnimationFrame(animate)
      return
    }
    const et = Math.min((now - entranceStart) / ENTRANCE_MS, 1)
    const eased = 1 - Math.pow(1 - et, 3)
    cubeGroup.scale.setScalar(0.001 + eased * 0.999)

    autoSpin += 0.0014
    currentRot.x += (targetRot.x - currentRot.x) * 0.06
    currentRot.y += (targetRot.y - currentRot.y) * 0.06
    cubeGroup.rotation.x = currentRot.x
    cubeGroup.rotation.y = currentRot.y + autoSpin

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

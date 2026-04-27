'use client'

/**
 * HeroCube — 3D Rubik cube for the alodev hero.
 *
 * Audit-faithful Resend implementation:
 *  - 27 cubelets, single uniform metallic material (color 0x2a2a2a,
 *    metalness 1.0, roughness 0.11). All visible "color" comes from
 *    point-light reflections off polished metal — there are no sticker
 *    textures or per-tile materials.
 *  - Cubelets use ExtrudeGeometry of a rounded square shape (absarc
 *    corners) with bevelEnabled — gives real bevels at ~17% edge length,
 *    not faked with shading.
 *  - Spacing 1.03 (3% gap → visible black grooves between cubelets).
 *  - Two parallel motion systems:
 *       Hệ 1  Continuous tumble: cubeGroup.rotation.{x,y,z} += 0.005
 *             rad/frame each, LINEAR (no easing). Diagonal axis sum →
 *             "tumbling" feel rather than spin.
 *       Hệ 2  Layer flip every 1-3s: pick random axis (x/y/z), random
 *             layer (-1/0/1), 180° rotation over ~2s with cubic ease.
 *             Before each flip, snap-rotate the wrapper 90° on Y or Z
 *             (instant, hidden by tumble) — this permutes which axis is
 *             "the layer axis", so successive flips look different.
 *
 * Performance:
 *  - three.js loaded lazily only when canvas mounts.
 *  - Mobile / no-WebGL → static SVG fallback.
 *  - Renderer + geometries + materials disposed on unmount.
 */

import { useEffect, useRef, useState } from 'react'

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

    const small = window.matchMedia('(max-width: 768px)').matches
    if (small || !hasWebGL()) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let cancelled = false
    let cleanup: (() => void) | null = null

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

function StaticCube() {
  const tile = (x: number, y: number, fill: string) => (
    <rect x={x} y={y} width="36" height="36" rx="4" fill={fill} stroke="#0a0a0c" strokeWidth="1" />
  )
  const shades = ['#1a1a1f', '#222227', '#16161a', '#1f1f24']
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
// THREE.JS SETUP — Resend-faithful per the cube audit.
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
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 100)
  camera.position.set(8.6, 6.4, 10.0)
  camera.lookAt(0, 0, 0)

  // ── Lighting: point lights for color reflection ────────────────────
  // Polished metal (metalness=1, roughness=0.11) renders almost entirely
  // through reflections, so the cube's perceived "color" is the colour of
  // the lights. We use a key warm + fill cool point pair, plus accent
  // points for chromatic interest. No env map — keeps reflections crisp.
  scene.add(new THREE.AmbientLight(0xffffff, 0.18))

  const keyLight = new THREE.PointLight(0xfff1d9, 90, 40, 1.2)   // warm key
  keyLight.position.set(5, 7, 6)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.set(2048, 2048)
  keyLight.shadow.bias = -0.0004
  keyLight.shadow.radius = 6
  scene.add(keyLight)

  const fillLight = new THREE.PointLight(0xa8c8ff, 55, 40, 1.2)  // cool fill
  fillLight.position.set(-6, 3, 4)
  scene.add(fillLight)

  const accentBack = new THREE.PointLight(0xc9a8ff, 35, 40, 1.4) // violet rim
  accentBack.position.set(-3, -2, -7)
  scene.add(accentBack)

  const accentRight = new THREE.PointLight(0xffd4a3, 30, 40, 1.4) // amber rim
  accentRight.position.set(8, -1, -3)
  scene.add(accentRight)

  const underGlow = new THREE.PointLight(0x8aa8ff, 22, 30, 1.5)   // floor wash
  underGlow.position.set(0, -5, 4)
  scene.add(underGlow)

  // Contact shadow plane.
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 })
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), shadowMat)
  shadowPlane.rotation.x = -Math.PI / 2
  shadowPlane.position.y = -2.3
  shadowPlane.receiveShadow = true
  scene.add(shadowPlane)

  // ── Geometry: rounded extruded cubelet ─────────────────────────────
  // Per audit: ExtrudeGeometry from a rounded Shape (absarc corners) with
  // bevelEnabled. Bevel ≈ 17% of edge length → unmistakable rounded
  // appearance even at the cube's small viewport size.
  const SIZE = 1.0
  const SPACING = 1.03                 // 3% gap between cubelets
  const BEVEL = SIZE * 0.17            // ~17% edge length

  function roundedSquareShape(side: number, radius: number) {
    const s = side / 2
    const r = radius
    const sh = new THREE.Shape()
    sh.absarc(-s + r, -s + r, r, Math.PI, Math.PI * 1.5, false)
    sh.absarc( s - r, -s + r, r, Math.PI * 1.5, 0, false)
    sh.absarc( s - r,  s - r, r, 0, Math.PI * 0.5, false)
    sh.absarc(-s + r,  s - r, r, Math.PI * 0.5, Math.PI, false)
    return sh
  }

  // Inner side length is reduced so that after the bevel adds back, the
  // overall cubelet measures SIZE end-to-end.
  const innerSide = SIZE - BEVEL * 2
  const cubeletGeo = new THREE.ExtrudeGeometry(
    roundedSquareShape(innerSide, BEVEL * 0.85),
    {
      depth: innerSide,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 8,
      curveSegments: 24,
    }
  )
  // ExtrudeGeometry centers in XY but starts at z=0 — translate so the
  // whole cubelet is centered on origin (then layout positions cleanly).
  cubeletGeo.translate(0, 0, -innerSide / 2)
  cubeletGeo.computeVertexNormals()

  // ── Material: single uniform polished metal ────────────────────────
  // Per audit: color 0x2a2a2a, metalness 1, roughness 0.11. The cube
  // renders entirely via reflections from the point lights above.
  const cubeletMat = new THREE.MeshPhysicalMaterial({
    color: 0x2a2a2a,
    metalness: 1.0,
    roughness: 0.11,
    envMapIntensity: 1.0,
  })

  // ── Build 3×3×3 cubelets ───────────────────────────────────────────
  // Two-level group hierarchy:
  //   wrapper (outer): receives "snap rotations" before layer flips
  //   cubeGroup (inner): receives the continuous tumble
  // During a layer flip, the layer's cubelets are temporarily reparented
  // to a pivot so they rotate together; pivot lives inside cubeGroup.
  const wrapper = new THREE.Group()
  scene.add(wrapper)
  const cubeGroup = new THREE.Group()
  wrapper.add(cubeGroup)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cubelets: any[] = []
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const c = new THREE.Mesh(cubeletGeo, cubeletMat)
        c.castShadow = true
        c.receiveShadow = true
        c.position.set(x * SPACING, y * SPACING, z * SPACING)
        cubeGroup.add(c)
        cubelets.push(c)
      }
    }
  }
  cubeGroup.rotation.set(-0.32, 0.55, 0)   // initial 3/4 view

  // ── Layer flip implementation ──────────────────────────────────────
  // Pick random axis + layer index, rotate that layer 180° over ~duration
  // ms, then snap members back to grid.
  let rafTwist = 0
  let twisting = false
  function snap(n: number) { return Math.round(n / SPACING) * SPACING }

  function flipLayer(axis: 'x' | 'y' | 'z', layer: number, dir: number, duration: number) {
    return new Promise<void>((resolve) => {
      twisting = true
      const pivot = new THREE.Group()
      cubeGroup.add(pivot)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const members: any[] = []
      cubelets.forEach((c) => {
        const coord = Math.round(c.position[axis] / SPACING)
        if (coord === layer) {
          members.push(c)
          pivot.attach(c)
        }
      })

      const target = Math.PI * dir   // 180°
      const axisVec = ({
        x: new THREE.Vector3(1, 0, 0),
        y: new THREE.Vector3(0, 1, 0),
        z: new THREE.Vector3(0, 0, 1),
      })[axis]

      const t0 = performance.now()
      // Cubic ease-in-out: smooth start AND smooth landing — important for
      // 180° flips so the wave reads as flowing rather than punchy.
      const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

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
          twisting = false
          resolve()
        }
      }
      rafTwist = requestAnimationFrame(frame)
    })
  }

  // ── Wrapper snap: instantaneous 90° on Y or Z before each flip ─────
  // Hidden by the continuous tumble — the viewer sees a layer flip
  // happening but can't tell that the underlying axis frame just shifted.
  // This is what makes consecutive flips look genuinely different rather
  // than a predictable cycle.
  function wrapperSnap() {
    if (Math.random() < 0.5) {
      wrapper.rotation.y += (Math.random() < 0.5 ? 1 : -1) * Math.PI / 2
    } else {
      wrapper.rotation.z += (Math.random() < 0.5 ? 1 : -1) * Math.PI / 2
    }
  }

  let stopped = false
  let timer: ReturnType<typeof setTimeout> | null = null

  async function flipLoop() {
    // Initial wait — let the entrance scale settle.
    await new Promise((r) => { timer = setTimeout(r, 1200) })
    while (!stopped) {
      // Pre-flip wrapper snap (skipped for reduced motion to keep the
      // motion fully predictable for vestibular sensitivity).
      if (!opts.reducedMotion && Math.random() < 0.7) wrapperSnap()

      const axis = (['x', 'y', 'z'] as const)[Math.floor(Math.random() * 3)]
      const layer = [-1, 0, 1][Math.floor(Math.random() * 3)]
      const dir = Math.random() < 0.5 ? 1 : -1
      const duration = opts.reducedMotion
        ? 2400
        : 1700 + Math.random() * 700      // 1.7-2.4s per flip, audit-spec ~2s

      await flipLayer(axis, layer, dir, duration)
      if (stopped) break

      // Pause 0–1000 ms between flips per audit randomization.
      const pause = opts.reducedMotion
        ? 1800 + Math.random() * 1200
        : Math.random() * 1000
      await new Promise((r) => { timer = setTimeout(r, pause) })
    }
  }
  flipLoop()

  // ── Continuous tumble + mouse parallax ─────────────────────────────
  // Tumble: 0.005 rad/frame on all 3 axes, LINEAR (no easing). At 60fps
  // that's ~17s per full revolution per axis. Equal speed on all axes
  // sums to a fixed diagonal vector — visually reads as a "tumbling"
  // object rather than spinning around any single axis.
  const TUMBLE = opts.reducedMotion ? 0.0015 : 0.005
  const tumble = { x: 0, y: 0, z: 0 }

  const targetParallax = { x: 0, y: 0 }
  const currentParallax = { x: 0, y: 0 }

  function onMove(e: MouseEvent) {
    const rect = wrap.getBoundingClientRect()
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
    targetParallax.y = nx * 0.30
    targetParallax.x = -ny * 0.16
  }
  function onLeave() {
    targetParallax.x = 0
    targetParallax.y = 0
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
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf)
    resizeRaf = requestAnimationFrame(resize)
  })
  ro.observe(wrap)
  function onResize() {
    cancelAnimationFrame(resizeRaf)
    resizeRaf = requestAnimationFrame(resize)
  }
  window.addEventListener('resize', onResize)

  let isVisible = true
  const visObs = new IntersectionObserver(
    ([entry]) => { isVisible = entry.isIntersecting },
    { rootMargin: '50px 0px' }
  )
  visObs.observe(wrap)

  let rafAnimate = 0
  function animate() {
    if (stopped) return
    if (!isVisible) {
      rafAnimate = requestAnimationFrame(animate)
      return
    }

    // Accumulate continuous tumble.
    tumble.x += TUMBLE
    tumble.y += TUMBLE
    tumble.z += TUMBLE

    // Mouse parallax adds a subtle interactive offset on top.
    currentParallax.x += (targetParallax.x - currentParallax.x) * 0.06
    currentParallax.y += (targetParallax.y - currentParallax.y) * 0.06

    cubeGroup.rotation.x = -0.32 + tumble.x + currentParallax.x
    cubeGroup.rotation.y =  0.55 + tumble.y + currentParallax.y
    cubeGroup.rotation.z =         tumble.z

    renderer.render(scene, camera)
    rafAnimate = requestAnimationFrame(animate)
  }
  rafAnimate = requestAnimationFrame(animate)

  return () => {
    stopped = true
    cancelAnimationFrame(rafAnimate)
    cancelAnimationFrame(rafTwist)
    cancelAnimationFrame(resizeRaf)
    if (timer) clearTimeout(timer)
    visObs.disconnect()
    ro.disconnect()
    wrap.removeEventListener('mousemove', onMove)
    wrap.removeEventListener('mouseleave', onLeave)
    window.removeEventListener('resize', onResize)

    cubeletGeo.dispose()
    cubeletMat.dispose()
    shadowMat.dispose()
    renderer.dispose()
  }
}

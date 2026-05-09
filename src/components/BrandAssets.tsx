'use client'

import Image from 'next/image'
import { useState } from 'react'

/**
 * Brand assets section for /ve-chung-toi — 3 export-ready cards in
 * proper social-media aspect ratios. Each card combines the angle-
 * bracket logo (public/brand/logo-symbol.svg) with a properly-
 * projected isometric Rubik symbol that mirrors the homepage hero cube.
 *
 * Aspect ratios:
 *   1. Avatar (1:1) — Facebook profile, Zalo, LinkedIn personal
 *      Light/dark toggle so user can pick the version that suits their
 *      page palette.
 *   2. Cover (1.91:1) — Facebook cover, LinkedIn page banner
 *   3. Group photo (16:9) — Facebook group, LinkedIn org banner,
 *      YouTube channel art (safe area)
 *
 * Export: DevTools → Inspect element → ⋮ menu → Capture node screenshot
 * gives a pixel-perfect render at the card's CSS dimensions.
 */
export default function BrandAssets() {
  // Avatar theme — user picks light or dark before exporting so the
  // saved file matches the FB page palette they'll set it on.
  const [avatarTheme, setAvatarTheme] = useState<'dark' | 'light'>('dark')

  return (
    <section
      id="brand-assets"
      className="py-12 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800"
      data-section-name="Bộ nhận diện"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Bộ nhận diện
            </span>
          </div>
          <h2 className="h-section mt-3 text-gray-900 dark:text-white">
            Logo. Biểu tượng. Avatar.
          </h2>
          <p className="mt-4 text-base lg:text-lg text-gray-600 dark:text-ink-400 leading-relaxed">
            Logo Alodev (cặp ngoặc nhọn xanh — biểu trưng cho code) và biểu tượng Rubik (sáu mặt một sản phẩm).
            Ba phiên bản dưới đây là social card sẵn dùng cho Facebook profile, cover và group.
            DevTools → <em>Capture node screenshot</em> trên từng card để export pixel-perfect.
          </p>
        </div>

        <div className="reveal-stagger grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* ─── 1. AVATAR 1:1 với toggle sáng/tối ─── */}
          <BrandCard
            label={`Avatar — 1:1 · 1080×1080 · ${avatarTheme === 'dark' ? 'Dark' : 'Light'}`}
            sublabel="Facebook profile · Zalo · LinkedIn personal"
            aspect="aspect-square"
            id="brand-avatar"
            controls={
              <ThemeToggle theme={avatarTheme} onChange={setAvatarTheme} />
            }
          >
            {avatarTheme === 'dark' ? <AvatarDark /> : <AvatarLight />}
          </BrandCard>

          {/* ─── 2. COVER 1.91:1 ─── */}
          <BrandCard
            label="Cover — 1.91:1 · 1640×856"
            sublabel="Facebook cover · LinkedIn page banner"
            aspect="aspect-[820/428]"
            id="brand-cover"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#070c1a] via-[#0d1a35] to-[#1f2f6a] flex items-center">
              <div className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[24%] opacity-45">
                <IsoCube />
              </div>
              <div
                className="absolute -left-[15%] -bottom-[35%] w-[55%] aspect-square rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(95,148,247,0.20) 0%, transparent 65%)',
                  filter: 'blur(40px)',
                }}
              />
              <Grid maskImage="linear-gradient(to right, transparent 0%, #000 25%, #000 100%)" />
              <div className="relative z-10 pl-[6%] pr-[35%] flex items-center gap-7">
                <Image
                  src="/brand/logo-symbol.svg"
                  alt="Alodev logo"
                  width={120}
                  height={146}
                  className="drop-shadow-[0_8px_24px_rgba(95,148,247,0.45)]"
                />
                <div>
                  <div className="text-white text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9]">
                    alodev
                  </div>
                  <div className="mt-3 text-white/85 text-base lg:text-lg font-medium leading-snug">
                    Studio thiết kế &amp; phát triển web/app
                  </div>
                  <div className="mt-2 text-white/50 text-xs font-mono uppercase tracking-[0.22em]">
                    Hà Nội · Việt Nam · alodev.vn
                  </div>
                </div>
              </div>
            </div>
          </BrandCard>

          {/* ─── 3. GROUP COVER 16:9 ─── */}
          <BrandCard
            label="Group cover — 16:9 · 1920×1080"
            sublabel="Facebook group · LinkedIn organization · YouTube channel"
            aspect="aspect-video"
            id="brand-group"
            fullWidth
          >
            <div className="absolute inset-0 bg-[#06091a] flex items-center">
              <div
                className="absolute -left-[8%] -top-[35%] w-[45%] aspect-square rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(95,148,247,0.32) 0%, rgba(60,92,186,0.16) 35%, transparent 70%)',
                  filter: 'blur(48px)',
                }}
              />
              <div className="absolute right-[7%] top-1/2 -translate-y-1/2 w-[24%] opacity-70">
                <IsoCube />
              </div>
              <Grid maskImage="radial-gradient(ellipse at left, #000 0%, #000 50%, transparent 90%)" />
              <div className="relative z-10 pl-[7%] pr-[40%] flex flex-col gap-6">
                <div className="flex items-center gap-5">
                  <Image
                    src="/brand/logo-symbol.svg"
                    alt="Alodev logo"
                    width={88}
                    height={107}
                    className="drop-shadow-[0_8px_24px_rgba(95,148,247,0.45)]"
                  />
                  <div className="text-white text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
                    alodev
                  </div>
                </div>
                <div className="text-white/90 text-xl lg:text-2xl font-medium leading-snug max-w-xl">
                  Founder-led studio — biến ý tưởng thành sản phẩm thật.
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white/80 text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Đang nhận dự án Q2/2026
                  </span>
                  <span className="text-white/40 text-xs font-mono uppercase tracking-[0.2em]">
                    alodev.vn
                  </span>
                </div>
              </div>
            </div>
          </BrandCard>
        </div>
      </div>
    </section>
  )
}

/* ─── Avatar — Dark ───
   Navy gradient backdrop, white logo + wordmark, cube symbol bottom-right. */
function AvatarDark() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0b1426] via-[#0d1a35] to-[#1b2a5a] flex items-center justify-center">
      <Grid maskImage="radial-gradient(ellipse at center, #000 35%, transparent 75%)" />
      <div className="absolute right-[8%] bottom-[8%] w-[26%] opacity-35">
        <IsoCube />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-5">
        <Image
          src="/brand/logo-symbol.svg"
          alt="Alodev logo"
          width={180}
          height={219}
          className="drop-shadow-[0_8px_24px_rgba(95,148,247,0.45)]"
        />
        <div className="text-white text-5xl font-bold tracking-tight">alodev</div>
        <div className="text-white/55 text-xs font-mono uppercase tracking-[0.28em]">
          studio · web · app
        </div>
      </div>
    </div>
  )
}

/* ─── Avatar — Light ───
   Cream backdrop, deep-navy logo + wordmark, cube symbol bottom-right. */
function AvatarLight() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#fafbff] via-[#f0f4ff] to-[#dbe3f7] flex items-center justify-center">
      <Grid
        opacity={0.18}
        lineColor="rgba(60, 92, 186, 0.25)"
        maskImage="radial-gradient(ellipse at center, #000 35%, transparent 75%)"
      />
      <div className="absolute right-[8%] bottom-[8%] w-[26%] opacity-30">
        <IsoCube tone="light" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-5">
        <Image
          src="/brand/logo-symbol.svg"
          alt="Alodev logo"
          width={180}
          height={219}
          className="drop-shadow-[0_6px_18px_rgba(60,92,186,0.25)]"
        />
        <div className="text-[#0b1426] text-5xl font-bold tracking-tight">alodev</div>
        <div className="text-[#3c5cba]/80 text-xs font-mono uppercase tracking-[0.28em]">
          studio · web · app
        </div>
      </div>
    </div>
  )
}

/* ─── Theme toggle (avatar light/dark) ─── */
function ThemeToggle({
  theme,
  onChange,
}: {
  theme: 'dark' | 'light'
  onChange: (t: 'dark' | 'light') => void
}) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-gray-300 dark:border-ink-700 bg-white dark:bg-ink-900 p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Chọn nền sáng hoặc tối cho avatar"
    >
      <button
        type="button"
        onClick={() => onChange('dark')}
        className={`px-3 py-1.5 rounded-full transition ${
          theme === 'dark'
            ? 'bg-gray-900 text-white shadow-sm'
            : 'text-gray-500 dark:text-ink-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-pressed={theme === 'dark'}
      >
        Tối
      </button>
      <button
        type="button"
        onClick={() => onChange('light')}
        className={`px-3 py-1.5 rounded-full transition ${
          theme === 'light'
            ? 'bg-white text-gray-900 ring-1 ring-gray-300 shadow-sm'
            : 'text-gray-500 dark:text-ink-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-pressed={theme === 'light'}
      >
        Sáng
      </button>
    </div>
  )
}

/* ─── Grid backdrop ─── */
function Grid({
  opacity = 0.18,
  lineColor = 'rgba(255, 255, 255, 0.4)',
  maskImage,
}: {
  opacity?: number
  lineColor?: string
  maskImage?: string
}) {
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity,
        backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        maskImage,
        WebkitMaskImage: maskImage,
      }}
    />
  )
}

/* ─── Card frame ─── */
function BrandCard({
  label,
  sublabel,
  aspect,
  id,
  fullWidth,
  controls,
  children,
}: {
  label: string
  sublabel: string
  aspect: string
  id: string
  fullWidth?: boolean
  controls?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <figure
      className={`${fullWidth ? 'lg:col-span-2' : ''} group rounded-2xl border border-gray-200 dark:border-ink-800 overflow-hidden bg-white dark:bg-ink-900`}
    >
      <div id={id} className={`relative ${aspect} w-full overflow-hidden`}>
        {children}
      </div>
      <figcaption className="px-5 py-4 flex items-center justify-between gap-3 border-t border-gray-100 dark:border-ink-800 flex-wrap">
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{label}</div>
          <div className="text-xs text-gray-500 dark:text-ink-500 mt-0.5">{sublabel}</div>
        </div>
        <div className="flex items-center gap-3">
          {controls}
          <a
            href={`#${id}`}
            className="text-xs font-mono text-brand-600 dark:text-brand-400 hover:underline"
            aria-label={`Anchor đến ${label}`}
          >
            #{id}
          </a>
        </div>
      </figcaption>
    </figure>
  )
}

/* ─── IsoCube ───
   Mathematically-correct isometric projection of a 3×3 Rubik cube. Three
   visible faces (top, front-left, front-right) all built from 9 quadri-
   laterals each, with shared edges so corners line up exactly.
   Pure SVG → screenshots crisp at any resolution, no three.js dependency. */
function IsoCube({ tone = 'dark' }: { tone?: 'dark' | 'light' } = {}) {
  // Iso projection: x_2d = (x - z) * cos(30°), y_2d = (x + z) * sin(30°) - y
  const c30 = Math.cos(Math.PI / 6) // 0.866...
  const s30 = Math.sin(Math.PI / 6) // 0.5
  const u = 26 // pixel scale per unit cube edge
  // Project a 3D point (x, y, z) — units in tile-counts (0..3) — to 2D.
  const p = (x: number, y: number, z: number): [number, number] => [
    (x - z) * c30 * u,
    (x + z) * s30 * u - y * u,
  ]
  const fmt = (pt: [number, number]) => `${pt[0].toFixed(2)},${pt[1].toFixed(2)}`

  // Compute viewBox bounds to fit the 3×3 cube with padding.
  // Extreme 2D points come from the 8 cube vertices.
  const verts: [number, number, number][] = [
    [0, 0, 0], [3, 0, 0], [3, 0, 3], [0, 0, 3],
    [0, 3, 0], [3, 3, 0], [3, 3, 3], [0, 3, 3],
  ]
  const xs = verts.map((v) => p(...v)[0])
  const ys = verts.map((v) => p(...v)[1])
  const minX = Math.min(...xs) - 8
  const maxX = Math.max(...xs) + 8
  const minY = Math.min(...ys) - 8
  const maxY = Math.max(...ys) + 8

  const palette = tone === 'light'
    ? {
        topFrom: '#c8d4f5', topTo: '#7d92cc',
        leftFrom: '#5a73b8', leftTo: '#3a4a78',
        rightFrom: '#7d92cc', rightTo: '#4a5a8e',
        stroke: '#1f2a52',
      }
    : {
        topFrom: '#8aa0d8', topTo: '#5a73b8',
        leftFrom: '#3a4a78', leftTo: '#1f2a52',
        rightFrom: '#283450', rightTo: '#0e1530',
        stroke: '#0b1326',
      }

  // 9 tiles per face. Each tile is a quadrilateral defined by 4 corners
  // of the parametric grid on that face.
  function topTiles() {
    const tiles = []
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Top face has y=3, varying x and z.
        const a = p(i, 3, j)
        const b = p(i + 1, 3, j)
        const c = p(i + 1, 3, j + 1)
        const d = p(i, 3, j + 1)
        tiles.push(
          <polygon
            key={`top-${i}-${j}`}
            points={`${fmt(a)} ${fmt(b)} ${fmt(c)} ${fmt(d)}`}
            fill={`url(#iso-top-${tone})`}
            stroke={palette.stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />,
        )
      }
    }
    return tiles
  }
  function leftTiles() {
    // Front-left visible face: x=0, varying y and z.
    const tiles = []
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const a = p(0, i, j)
        const b = p(0, i, j + 1)
        const c = p(0, i + 1, j + 1)
        const d = p(0, i + 1, j)
        tiles.push(
          <polygon
            key={`left-${i}-${j}`}
            points={`${fmt(a)} ${fmt(b)} ${fmt(c)} ${fmt(d)}`}
            fill={`url(#iso-left-${tone})`}
            stroke={palette.stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />,
        )
      }
    }
    return tiles
  }
  function rightTiles() {
    // Right face: z=3, varying x and y.
    const tiles = []
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const a = p(i, j, 3)
        const b = p(i + 1, j, 3)
        const c = p(i + 1, j + 1, 3)
        const d = p(i, j + 1, 3)
        tiles.push(
          <polygon
            key={`right-${i}-${j}`}
            points={`${fmt(a)} ${fmt(b)} ${fmt(c)} ${fmt(d)}`}
            fill={`url(#iso-right-${tone})`}
            stroke={palette.stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />,
        )
      }
    }
    return tiles
  }

  const w = maxX - minX
  const h = maxY - minY
  return (
    <svg
      viewBox={`${minX} ${minY} ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <defs>
        <linearGradient id={`iso-top-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={palette.topFrom} />
          <stop offset="1" stopColor={palette.topTo} />
        </linearGradient>
        <linearGradient id={`iso-left-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={palette.leftFrom} />
          <stop offset="1" stopColor={palette.leftTo} />
        </linearGradient>
        <linearGradient id={`iso-right-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={palette.rightFrom} />
          <stop offset="1" stopColor={palette.rightTo} />
        </linearGradient>
      </defs>
      {/* Render order: back-most face first → front-most last. With this
          camera (top-front-right view), order is left → right → top is
          actually wrong; for proper back-to-front: bottom faces hidden,
          and visible faces don't overlap each other so order doesn't
          matter for correctness, but rendering top last keeps the top
          edge crisp. */}
      {leftTiles()}
      {rightTiles()}
      {topTiles()}
    </svg>
  )
}

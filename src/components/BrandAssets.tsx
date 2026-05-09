'use client'

import Image from 'next/image'
import { useState } from 'react'

/**
 * Brand assets — designer-pro card collection. 7 distinct compositions
 * across 3 social-export aspect ratios. No Rubik symbol, no city tag —
 * the angle-bracket logo + "alodev" wordmark carry the identity.
 *
 * Aspect specs:
 *   • Avatar 1:1   1080×1080  · FB profile / Zalo / LinkedIn personal
 *   • Cover  1.91:1 1640×856  · FB cover / LinkedIn page banner
 *   • Group  16:9  1920×1080  · FB group / LinkedIn org / YouTube
 *
 * Export: DevTools → Inspect element on a card → ⋮ menu →
 * "Capture node screenshot" gives a pixel-perfect render at the card's
 * CSS resolution.
 */
export default function BrandAssets() {
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
            Bảy biến thể. Một bộ nhận diện.
          </h2>
          <p className="mt-4 text-base lg:text-lg text-gray-600 dark:text-ink-400 leading-relaxed">
            Logo Alodev (cặp ngoặc nhọn xanh — biểu trưng cho code) làm nhân vật chính.
            Bảy card sẵn dùng cho avatar, cover Facebook và banner LinkedIn — pick concept hợp với page bạn,
            DevTools → <em>Capture node screenshot</em> để xuất pixel-perfect.
          </p>
        </div>

        {/* ═══ AVATARS ═══ */}
        <SubHead label="Avatar 1:1" hint="1080×1080 · FB profile · Zalo · LinkedIn personal" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
          <BrandCard
            label={`Avatar Mono — 1:1 · ${avatarTheme === 'dark' ? 'Dark' : 'Light'}`}
            sublabel="Logo trung tâm — clean, mạnh, không phụ kiện"
            aspect="aspect-square"
            id="brand-avatar-mono"
            controls={<ThemeToggle theme={avatarTheme} onChange={setAvatarTheme} />}
          >
            {avatarTheme === 'dark' ? <AvatarMonoDark /> : <AvatarMonoLight />}
          </BrandCard>
          <BrandCard
            label="Avatar Bracket — 1:1 · Bracket pattern"
            sublabel="Logo + bracket-glyph wallpaper — kỹ thuật forward"
            aspect="aspect-square"
            id="brand-avatar-bracket"
          >
            <AvatarBracket />
          </BrandCard>
        </div>

        {/* ═══ COVERS ═══ */}
        <SubHead label="Cover 1.91:1" hint="1640×856 · FB cover · LinkedIn page banner" />
        <div className="grid grid-cols-1 gap-6 lg:gap-8 mb-12 lg:mb-16">
          <BrandCard
            label="Cover A — Editorial"
            sublabel="Oversized wordmark, logo làm initial accent"
            aspect="aspect-[820/428]"
            id="brand-cover-editorial"
          >
            <CoverEditorial />
          </BrandCard>
          <BrandCard
            label="Cover B — Gradient Mesh"
            sublabel="Radial + conic mesh, logo + wordmark right-anchored"
            aspect="aspect-[820/428]"
            id="brand-cover-mesh"
          >
            <CoverMesh />
          </BrandCard>
          <BrandCard
            label="Cover C — Code Snippet"
            sublabel="Code glyph wallpaper, kỹ sư-forward, founder-led"
            aspect="aspect-[820/428]"
            id="brand-cover-code"
          >
            <CoverCode />
          </BrandCard>
        </div>

        {/* ═══ GROUP COVERS ═══ */}
        <SubHead label="Group cover 16:9" hint="1920×1080 · FB group · LinkedIn org · YouTube channel" />
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          <BrandCard
            label="Group A — Manifesto"
            sublabel="Bold statement chiếm sân, logo nhỏ accent"
            aspect="aspect-video"
            id="brand-group-manifesto"
          >
            <GroupManifesto />
          </BrandCard>
          <BrandCard
            label="Group B — Stats Grid"
            sublabel="4 con số khổng lồ làm wallpaper, brand block overlay"
            aspect="aspect-video"
            id="brand-group-stats"
          >
            <GroupStats />
          </BrandCard>
          <BrandCard
            label="Group C — Monogram Repeat"
            sublabel="Logo lặp tiled, brand block trung tâm"
            aspect="aspect-video"
            id="brand-group-monogram"
          >
            <GroupMonogram />
          </BrandCard>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

function SubHead({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex items-end gap-3 mb-4 lg:mb-6 flex-wrap">
      <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {label}
      </h3>
      <span className="text-xs font-mono text-gray-500 dark:text-ink-500">{hint}</span>
    </div>
  )
}

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
          theme === 'dark' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 dark:text-ink-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-pressed={theme === 'dark'}
      >
        Tối
      </button>
      <button
        type="button"
        onClick={() => onChange('light')}
        className={`px-3 py-1.5 rounded-full transition ${
          theme === 'light' ? 'bg-white text-gray-900 ring-1 ring-gray-300 shadow-sm' : 'text-gray-500 dark:text-ink-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-pressed={theme === 'light'}
      >
        Sáng
      </button>
    </div>
  )
}

function BrandCard({
  label,
  sublabel,
  aspect,
  id,
  controls,
  children,
}: {
  label: string
  sublabel: string
  aspect: string
  id: string
  controls?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <figure className="group rounded-2xl border border-gray-200 dark:border-ink-800 overflow-hidden bg-white dark:bg-ink-900">
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
          <a href={`#${id}`} className="text-xs font-mono text-brand-600 dark:text-brand-400 hover:underline">
            #{id}
          </a>
        </div>
      </figcaption>
    </figure>
  )
}

/* Bracket-glyph background SVG: tiled `<` `>` `/` markers, low-opacity. */
function BracketWallpaper({ color = 'rgba(95,148,247,0.10)' }: { color?: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="bracket-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <text x="20" y="50" fontFamily="ui-monospace, monospace" fontSize="32" fontWeight="700" fill={color}>
            {'</>'}
          </text>
          <text x="60" y="100" fontFamily="ui-monospace, monospace" fontSize="22" fontWeight="500" fill={color}>
            {'{}'}
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bracket-pattern)" />
    </svg>
  )
}

/* Code-snippet floating glyphs background. */
function CodeGlyphs() {
  const glyphs: { ch: string; x: string; y: string; size: string; rot?: number; op?: number }[] = [
    { ch: '{', x: '8%', y: '20%', size: '4rem', rot: -8, op: 0.10 },
    { ch: '}', x: '68%', y: '78%', size: '5rem', rot: 12, op: 0.10 },
    { ch: '</>', x: '78%', y: '15%', size: '2.4rem', rot: 4, op: 0.14 },
    { ch: '=>', x: '14%', y: '78%', size: '2rem', rot: -4, op: 0.18 },
    { ch: ';', x: '50%', y: '12%', size: '3rem', rot: 0, op: 0.10 },
    { ch: '()', x: '90%', y: '52%', size: '2.2rem', rot: 8, op: 0.14 },
    { ch: '[]', x: '6%', y: '52%', size: '2.2rem', rot: -10, op: 0.14 },
    { ch: 'const', x: '38%', y: '85%', size: '1.6rem', rot: 0, op: 0.18 },
    { ch: 'await', x: '60%', y: '38%', size: '1.4rem', rot: 0, op: 0.16 },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden font-mono text-white pointer-events-none">
      {glyphs.map((g, i) => (
        <span
          key={i}
          className="absolute select-none font-semibold"
          style={{
            left: g.x,
            top: g.y,
            fontSize: g.size,
            opacity: g.op,
            transform: g.rot ? `rotate(${g.rot}deg)` : undefined,
          }}
        >
          {g.ch}
        </span>
      ))}
    </div>
  )
}

/* Fine grid backdrop. */
function Grid({
  opacity = 0.18,
  lineColor = 'rgba(255, 255, 255, 0.4)',
  size = 48,
  maskImage,
}: {
  opacity?: number
  lineColor?: string
  size?: number
  maskImage?: string
}) {
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity,
        backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        maskImage,
        WebkitMaskImage: maskImage,
      }}
    />
  )
}

/* Soft radial bloom. */
function Bloom({
  color = 'rgba(95,148,247,0.32)',
  x = '50%',
  y = '50%',
  size = '60%',
  blur = 48,
}: {
  color?: string
  x?: string
  y?: string
  size?: string
  blur?: number
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        aspectRatio: '1',
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
      }}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════
   AVATAR DESIGNS
   ════════════════════════════════════════════════════════════════════ */

function AvatarMonoDark() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a1226] via-[#0d1a35] to-[#1f2f6a] flex items-center justify-center">
      <Bloom color="rgba(95,148,247,0.28)" x="50%" y="42%" size="80%" blur={56} />
      <Grid opacity={0.12} size={60} maskImage="radial-gradient(ellipse at center, #000 30%, transparent 80%)" />
      {/* Saffron pinpoint accent — top-right */}
      <span className="absolute top-[14%] right-[14%] w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_24px_rgba(244,129,26,0.65)]" />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image
          src="/brand/logo-symbol.svg"
          alt="Alodev logo"
          width={210}
          height={255}
          className="drop-shadow-[0_8px_28px_rgba(95,148,247,0.55)]"
        />
        <div className="text-white text-6xl font-bold tracking-tight">alodev</div>
      </div>
    </div>
  )
}

function AvatarMonoLight() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#fbfcff] via-[#eef2fb] to-[#dbe3f7] flex items-center justify-center">
      <Bloom color="rgba(95,148,247,0.22)" x="50%" y="42%" size="80%" blur={48} />
      <Grid
        opacity={0.16}
        size={60}
        lineColor="rgba(60, 92, 186, 0.25)"
        maskImage="radial-gradient(ellipse at center, #000 30%, transparent 80%)"
      />
      <span className="absolute top-[14%] right-[14%] w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_24px_rgba(244,129,26,0.55)]" />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image
          src="/brand/logo-symbol.svg"
          alt="Alodev logo"
          width={210}
          height={255}
          className="drop-shadow-[0_6px_18px_rgba(60,92,186,0.30)]"
        />
        <div className="text-[#0b1426] text-6xl font-bold tracking-tight">alodev</div>
      </div>
    </div>
  )
}

function AvatarBracket() {
  return (
    <div className="absolute inset-0 bg-[#0a0e1f] flex items-center justify-center">
      <BracketWallpaper color="rgba(95,148,247,0.13)" />
      <Bloom color="rgba(60,92,186,0.4)" x="50%" y="50%" size="70%" blur={60} />
      {/* Halo ring */}
      <span className="absolute w-[72%] aspect-square rounded-full border border-white/10" />
      <span className="absolute w-[56%] aspect-square rounded-full border border-white/[0.06]" />
      <div className="relative z-10 flex flex-col items-center gap-5">
        <Image
          src="/brand/logo-symbol.svg"
          alt="Alodev logo"
          width={180}
          height={219}
          className="drop-shadow-[0_8px_28px_rgba(95,148,247,0.55)]"
        />
        <div className="text-white text-5xl font-bold tracking-tight">alodev</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          <span className="text-white/55 text-[10px] font-mono uppercase tracking-[0.32em]">
            studio · web · app
          </span>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   COVER DESIGNS  (1.91:1)
   ════════════════════════════════════════════════════════════════════ */

function CoverEditorial() {
  return (
    <div className="absolute inset-0 bg-[#0a1226] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1226] via-[#101e44] to-[#1d2f70]" />
      <Bloom color="rgba(244,129,26,0.18)" x="92%" y="18%" size="60%" blur={70} />
      <Bloom color="rgba(95,148,247,0.20)" x="-5%" y="80%" size="55%" blur={60} />
      {/* Logo accent — top-left */}
      <div className="absolute top-[10%] left-[5%] flex items-center gap-3">
        <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={54} height={66} />
        <span className="text-white/55 text-[10px] font-mono uppercase tracking-[0.32em]">
          alodev studio
        </span>
      </div>
      {/* Editorial wordmark — fills the layout */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center px-[6%]">
        <div
          className="text-white font-bold tracking-[-0.05em] leading-[0.85]"
          style={{ fontSize: 'clamp(5rem, 14.5vw, 13rem)' }}
        >
          alodev
        </div>
        <div className="mt-3 text-white/65 text-base lg:text-xl font-medium tracking-wide">
          Studio thiết kế &amp; phát triển web/app — founder-led.
        </div>
      </div>
      {/* Footer-line */}
      <div className="absolute bottom-[8%] right-[5%] flex items-center gap-3 text-white/40 text-[10px] font-mono uppercase tracking-[0.28em]">
        <span className="w-8 h-px bg-white/30" />
        alodev.vn
      </div>
    </div>
  )
}

function CoverMesh() {
  return (
    <div className="absolute inset-0 bg-[#06091a] overflow-hidden">
      {/* Gradient mesh — multiple radial blooms */}
      <Bloom color="rgba(95,148,247,0.55)" x="20%" y="20%" size="55%" blur={80} />
      <Bloom color="rgba(60,92,186,0.45)" x="60%" y="80%" size="60%" blur={90} />
      <Bloom color="rgba(244,129,26,0.20)" x="92%" y="35%" size="40%" blur={70} />
      <Bloom color="rgba(160,80,220,0.18)" x="40%" y="55%" size="45%" blur={70} />
      {/* Conic accent for kinetic feel */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-screen"
        style={{
          background:
            'conic-gradient(from 210deg at 70% 50%, transparent 0deg, rgba(95,148,247,0.4) 60deg, transparent 120deg)',
          filter: 'blur(36px)',
        }}
      />
      <Grid opacity={0.1} size={56} maskImage="linear-gradient(135deg, #000 0%, transparent 80%)" />
      {/* Right-anchored wordmark + logo */}
      <div className="relative z-10 h-full flex items-center justify-end pr-[6%] pl-[35%]">
        <div className="flex items-center gap-6">
          <Image
            src="/brand/logo-symbol.svg"
            alt="Alodev logo"
            width={108}
            height={131}
            className="drop-shadow-[0_8px_24px_rgba(95,148,247,0.5)]"
          />
          <div className="text-right">
            <div className="text-white text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
              alodev
            </div>
            <div className="mt-3 text-white/85 text-sm lg:text-base font-medium">
              Founder-led · web · app · CRM/ERP
            </div>
          </div>
        </div>
      </div>
      {/* Anchor line top-left */}
      <div className="absolute top-[12%] left-[5%] flex items-center gap-3">
        <span className="w-6 h-px bg-white/40" />
        <span className="text-white/55 text-[10px] font-mono uppercase tracking-[0.32em]">
          studio · 2026
        </span>
      </div>
    </div>
  )
}

function CoverCode() {
  return (
    <div className="absolute inset-0 bg-[#070b1d] overflow-hidden">
      <CodeGlyphs />
      <Bloom color="rgba(95,148,247,0.32)" x="22%" y="60%" size="55%" blur={70} />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '4px 4px',
          maskImage: 'linear-gradient(to bottom, transparent, #000, transparent)',
        }}
      />
      {/* Center brand block */}
      <div className="relative z-10 h-full flex items-center px-[6%]">
        <div className="flex items-center gap-7">
          <Image
            src="/brand/logo-symbol.svg"
            alt="Alodev logo"
            width={112}
            height={136}
            className="drop-shadow-[0_8px_24px_rgba(95,148,247,0.5)]"
          />
          <div>
            <div className="text-white text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
              alodev
            </div>
            <div className="mt-4 text-white/85 text-sm lg:text-base font-mono">
              <span className="text-brand-400">{'<>'}</span> code is craft —{' '}
              <span className="text-emerald-400">{'/* shipped */'}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Top-right tag */}
      <div className="absolute top-[10%] right-[6%] inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 backdrop-blur ring-1 ring-white/15">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-white/85 text-[10px] font-mono uppercase tracking-[0.22em]">
          Q2/2026 · open
        </span>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   GROUP COVER DESIGNS  (16:9)
   ════════════════════════════════════════════════════════════════════ */

function GroupManifesto() {
  return (
    <div className="absolute inset-0 bg-[#06091a] overflow-hidden flex items-center">
      <Bloom color="rgba(95,148,247,0.32)" x="-5%" y="20%" size="55%" blur={80} />
      <Bloom color="rgba(244,129,26,0.16)" x="100%" y="80%" size="50%" blur={80} />
      <Grid opacity={0.10} size={64} maskImage="linear-gradient(to right, #000 0%, #000 60%, transparent 100%)" />
      <div className="relative z-10 px-[7%] max-w-[78%] flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={64} height={78} />
          <div className="text-white text-3xl lg:text-5xl font-bold tracking-tight leading-[0.9]">
            alodev
          </div>
        </div>
        <div
          className="text-white font-bold tracking-tight leading-[0.95]"
          style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}
        >
          Founder-led studio.<br />
          <span className="text-brand-400">Source code thuộc về bạn.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white/85 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Đang nhận dự án Q2/2026
          </span>
          <span className="text-white/40 text-xs font-mono uppercase tracking-[0.2em]">
            alodev.vn
          </span>
        </div>
      </div>
    </div>
  )
}

function GroupStats() {
  const stats = [
    { num: '11+', label: 'sản phẩm' },
    { num: '5+', label: 'năm vận hành' },
    { num: '99.9', label: '% uptime' },
    { num: '24h', label: 'phản hồi báo giá' },
  ]
  return (
    <div className="absolute inset-0 bg-[#06091a] overflow-hidden">
      <Bloom color="rgba(95,148,247,0.30)" x="50%" y="30%" size="80%" blur={90} />
      <Grid opacity={0.08} size={72} />
      {/* Outline numbers as wallpaper — diagonal layout */}
      <div className="absolute inset-0 flex items-center justify-around opacity-[0.13] pointer-events-none">
        {stats.map((s, i) => (
          <div
            key={i}
            className="text-white font-bold tracking-tight leading-none"
            style={{
              fontSize: 'clamp(5rem, 14vw, 13rem)',
              WebkitTextStroke: '2px white',
              color: 'transparent',
              transform: `translateY(${i % 2 === 0 ? '-10%' : '15%'})`,
            }}
          >
            {s.num}
          </div>
        ))}
      </div>
      {/* Center brand block */}
      <div className="relative z-10 h-full flex items-center px-[7%]">
        <div className="flex items-center gap-6 bg-black/35 backdrop-blur-md ring-1 ring-white/10 rounded-2xl px-7 py-6">
          <Image
            src="/brand/logo-symbol.svg"
            alt="Alodev logo"
            width={88}
            height={107}
            className="drop-shadow-[0_8px_24px_rgba(95,148,247,0.5)]"
          />
          <div>
            <div className="text-white text-4xl lg:text-6xl font-bold tracking-tight leading-[0.9]">
              alodev
            </div>
            <div className="mt-2 text-white/80 text-sm lg:text-base">
              Founder-led studio — biến ý tưởng thành sản phẩm thật.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GroupMonogram() {
  // Generate a tile of logo positions
  const tiles: { x: string; y: string; rot: number; size: number; op: number }[] = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      tiles.push({
        x: `${(col / 8) * 100 + 6}%`,
        y: `${(row / 4) * 100 + 12}%`,
        rot: ((row + col) % 4) * 8 - 12,
        size: 32 + ((row + col) % 3) * 6,
        op: 0.06 + ((row * col) % 3) * 0.02,
      })
    }
  }
  return (
    <div className="absolute inset-0 bg-[#080d22] overflow-hidden">
      {/* Tiled logos as wallpaper */}
      {tiles.map((t, i) => (
        <Image
          key={i}
          src="/brand/logo-symbol.svg"
          alt=""
          aria-hidden="true"
          width={t.size}
          height={Math.round(t.size * 1.215)}
          className="absolute"
          style={{
            left: t.x,
            top: t.y,
            opacity: t.op,
            transform: `rotate(${t.rot}deg)`,
          }}
        />
      ))}
      <Bloom color="rgba(60,92,186,0.5)" x="50%" y="50%" size="55%" blur={80} />
      {/* Center brand block */}
      <div className="relative z-10 h-full flex items-center justify-center px-[7%]">
        <div className="flex flex-col items-center gap-5 bg-black/40 backdrop-blur-md ring-1 ring-white/10 rounded-3xl px-10 lg:px-16 py-8 lg:py-10">
          <Image
            src="/brand/logo-symbol.svg"
            alt="Alodev logo"
            width={120}
            height={146}
            className="drop-shadow-[0_8px_28px_rgba(95,148,247,0.55)]"
          />
          <div className="text-white text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
            alodev
          </div>
          <div className="text-white/75 text-sm lg:text-base text-center max-w-md">
            Studio thiết kế &amp; phát triển web/app — founder-led, source-code-yours.
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import { useRef, useState, type ReactNode } from 'react'

/**
 * Brand assets — designer-pro card collection. 7 distinct compositions
 * across 3 social-export aspect ratios. Each card carries a theme
 * toggle (Tối/Sáng) and a one-click download button that captures the
 * card preview at the canonical export resolution.
 *
 * Aspects → export resolutions:
 *   • Avatar 1:1   → 1080×1080  · FB profile / Zalo / LinkedIn personal
 *   • Cover  1.91:1 → 1640×856  · FB cover / LinkedIn page banner
 *   • Group  16:9  → 1920×1080  · FB group / LinkedIn org / YouTube
 *
 * Contact integrated on cover/group cards: hello@alodev.vn ·
 * 0587 789 456 · @alodevvn (avatars stay clean — they're profile pics).
 */

type Theme = 'dark' | 'light'

const EXPORT_W = {
  avatar: 1080,
  cover: 1640,
  group: 1920,
} as const

export default function BrandAssets() {
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
            Bảy biến thể. Hai sắc thái. Một bộ nhận diện.
          </h2>
          <p className="mt-4 text-base lg:text-lg text-gray-600 dark:text-ink-400 leading-relaxed">
            Mỗi card có toggle <strong>Tối / Sáng</strong> để khớp page Facebook của bạn,
            và nút <strong>Tải</strong> xuất PNG đúng resolution chuẩn social.
            Contact: <span className="font-mono">hello@alodev.vn · 0587 789 456 · @alodevvn</span>.
          </p>
        </div>

        <SubHead label="Avatar 1:1" hint="1080×1080 · FB profile · Zalo · LinkedIn personal" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
          <BrandCard
            id="brand-avatar-mono"
            label="Avatar Mono"
            sublabel="Logo trung tâm — clean, kỷ luật brand"
            aspect="aspect-square"
            exportW={EXPORT_W.avatar}
            renderDesign={(t) => <AvatarMono theme={t} />}
          />
          <BrandCard
            id="brand-avatar-bracket"
            label="Avatar Bracket"
            sublabel="Logo + bracket-glyph wallpaper — kỹ thuật forward"
            aspect="aspect-square"
            exportW={EXPORT_W.avatar}
            renderDesign={(t) => <AvatarBracket theme={t} />}
          />
        </div>

        <SubHead label="Cover 1.91:1" hint="1640×856 · FB cover · LinkedIn page banner" />
        <div className="grid grid-cols-1 gap-6 lg:gap-8 mb-12 lg:mb-16">
          <BrandCard
            id="brand-cover-editorial"
            label="Cover A — Editorial"
            sublabel="Oversized wordmark, logo làm initial accent"
            aspect="aspect-[820/428]"
            exportW={EXPORT_W.cover}
            renderDesign={(t) => <CoverEditorial theme={t} />}
          />
          <BrandCard
            id="brand-cover-mesh"
            label="Cover B — Gradient Mesh"
            sublabel="Radial + conic mesh, logo right-anchored"
            aspect="aspect-[820/428]"
            exportW={EXPORT_W.cover}
            renderDesign={(t) => <CoverMesh theme={t} />}
          />
          <BrandCard
            id="brand-cover-code"
            label="Cover C — Code Snippet"
            sublabel="Code-glyph wallpaper, kỹ sư-forward"
            aspect="aspect-[820/428]"
            exportW={EXPORT_W.cover}
            renderDesign={(t) => <CoverCode theme={t} />}
          />
        </div>

        <SubHead label="Group cover 16:9" hint="1920×1080 · FB group · LinkedIn org · YouTube channel" />
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          <BrandCard
            id="brand-group-manifesto"
            label="Group A — Manifesto"
            sublabel="Bold statement chiếm sân"
            aspect="aspect-video"
            exportW={EXPORT_W.group}
            renderDesign={(t) => <GroupManifesto theme={t} />}
          />
          <BrandCard
            id="brand-group-stats"
            label="Group B — Stats Grid"
            sublabel="Số khổng lồ làm wallpaper, brand block overlay"
            aspect="aspect-video"
            exportW={EXPORT_W.group}
            renderDesign={(t) => <GroupStats theme={t} />}
          />
          <BrandCard
            id="brand-group-monogram"
            label="Group C — Monogram Repeat"
            sublabel="Logo lặp tiled, brand block trung tâm"
            aspect="aspect-video"
            exportW={EXPORT_W.group}
            renderDesign={(t) => <GroupMonogram theme={t} />}
          />
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
   BRAND CARD FRAME — toggle + download + caption
   ════════════════════════════════════════════════════════════════════ */

function BrandCard({
  id,
  label,
  sublabel,
  aspect,
  exportW,
  renderDesign,
}: {
  id: string
  label: string
  sublabel: string
  aspect: string
  exportW: number
  renderDesign: (theme: Theme) => ReactNode
}) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  async function handleDownload() {
    if (!previewRef.current || downloading) return
    setDownloading(true)
    try {
      const { toPng } = await import('html-to-image')
      const el = previewRef.current
      const rect = el.getBoundingClientRect()
      const pixelRatio = exportW / rect.width
      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio,
        // Match the visual bg under the card so any rounded-corner edge
        // doesn't pick up the page bg through the alpha channel.
        backgroundColor: 'transparent',
      })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `alodev-${id}-${theme}-${exportW}.png`
      link.click()
    } catch (err) {
      console.warn('[BrandCard] download failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <figure className="group rounded-2xl border border-gray-200 dark:border-ink-800 overflow-hidden bg-white dark:bg-ink-900">
      <div ref={previewRef} id={id} className={`relative ${aspect} w-full overflow-hidden`}>
        {renderDesign(theme)}
      </div>
      <figcaption className="px-5 py-4 flex items-center justify-between gap-3 border-t border-gray-100 dark:border-ink-800 flex-wrap">
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {label} <span className="text-gray-500 dark:text-ink-500 font-normal">· {theme === 'dark' ? 'Dark' : 'Light'}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-ink-500 mt-0.5">{sublabel}</div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ThemeToggle theme={theme} onChange={setTheme} />
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1.5 text-xs font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-wait transition"
            aria-label={`Tải ${label}`}
          >
            {downloading ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z" />
                </svg>
                Đang tải
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Tải PNG
              </>
            )}
          </button>
          <a href={`#${id}`} className="text-xs font-mono text-brand-600 dark:text-brand-400 hover:underline">
            #{id}
          </a>
        </div>
      </figcaption>
    </figure>
  )
}

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

function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-gray-300 dark:border-ink-700 bg-white dark:bg-ink-900 p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Chọn nền sáng/tối"
    >
      <button
        type="button"
        onClick={() => onChange('dark')}
        className={`px-3 py-1 rounded-full transition ${
          theme === 'dark' ? 'bg-gray-900 text-white' : 'text-gray-500 dark:text-ink-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-pressed={theme === 'dark'}
      >
        Tối
      </button>
      <button
        type="button"
        onClick={() => onChange('light')}
        className={`px-3 py-1 rounded-full transition ${
          theme === 'light' ? 'bg-white text-gray-900 ring-1 ring-gray-300' : 'text-gray-500 dark:text-ink-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-pressed={theme === 'light'}
      >
        Sáng
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   THEME TOKENS
   ════════════════════════════════════════════════════════════════════ */

function tokens(theme: Theme) {
  if (theme === 'dark') {
    return {
      bgBase: '#06091a',
      bgGradFrom: '#0a1226',
      bgGradVia: '#0d1a35',
      bgGradTo: '#1f2f6a',
      text: 'text-white',
      textHigh: 'text-white/95',
      textMid: 'text-white/75',
      textLow: 'text-white/55',
      textXLow: 'text-white/40',
      gridLine: 'rgba(255, 255, 255, 0.4)',
      bracketColor: 'rgba(95,148,247,0.13)',
      bloomBlue: 'rgba(95,148,247,0.32)',
      bloomBlueSoft: 'rgba(95,148,247,0.20)',
      bloomSaffron: 'rgba(244,129,26,0.20)',
      logoShadow: 'drop-shadow-[0_8px_24px_rgba(95,148,247,0.5)]',
      glassBg: 'bg-black/45',
      glassRing: 'ring-white/10',
      borderLine: 'border-white/10',
      pillBg: 'bg-white/10',
      logoStroke: 'rgba(95, 148, 247, 0.18)',
    }
  }
  return {
    bgBase: '#fbfcff',
    bgGradFrom: '#fbfcff',
    bgGradVia: '#eef3ff',
    bgGradTo: '#dbe3f7',
    text: 'text-[#0b1426]',
    textHigh: 'text-[#0b1426]',
    textMid: 'text-[#1f2a52]',
    textLow: 'text-[#3c5cba]',
    textXLow: 'text-[#3c5cba]/60',
    gridLine: 'rgba(60, 92, 186, 0.18)',
    bracketColor: 'rgba(60,92,186,0.10)',
    bloomBlue: 'rgba(95,148,247,0.28)',
    bloomBlueSoft: 'rgba(95,148,247,0.16)',
    bloomSaffron: 'rgba(244,129,26,0.18)',
    logoShadow: 'drop-shadow-[0_6px_18px_rgba(60,92,186,0.30)]',
    glassBg: 'bg-white/65',
    glassRing: 'ring-[#3c5cba]/15',
    borderLine: 'border-[#3c5cba]/15',
    pillBg: 'bg-[#3c5cba]/10',
    logoStroke: 'rgba(60, 92, 186, 0.16)',
  }
}

/* ════════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

function Bloom({
  color,
  x = '50%',
  y = '50%',
  size = '60%',
  blur = 48,
}: {
  color: string
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

function Grid({
  opacity = 0.18,
  lineColor,
  size = 48,
  maskImage,
}: {
  opacity?: number
  lineColor: string
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

function BracketWallpaper({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id={`bp-${color}`} x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <text x="20" y="50" fontFamily="ui-monospace, monospace" fontSize="32" fontWeight="700" fill={color}>{'</>'}</text>
          <text x="60" y="100" fontFamily="ui-monospace, monospace" fontSize="22" fontWeight="500" fill={color}>{'{}'}</text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#bp-${color})`} />
    </svg>
  )
}

function CodeGlyphs({ color = 'rgba(255,255,255,1)' }: { color?: string }) {
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
    <div className="absolute inset-0 overflow-hidden font-mono pointer-events-none" style={{ color }}>
      {glyphs.map((g, i) => (
        <span
          key={i}
          className="absolute select-none font-semibold"
          style={{ left: g.x, top: g.y, fontSize: g.size, opacity: g.op, transform: g.rot ? `rotate(${g.rot}deg)` : undefined }}
        >
          {g.ch}
        </span>
      ))}
    </div>
  )
}

/* Contact strip — adapts to theme. */
function ContactStrip({
  theme,
  layout = 'inline',
  size = 'sm',
}: {
  theme: Theme
  layout?: 'inline' | 'stack'
  size?: 'xs' | 'sm' | 'md'
}) {
  const items = [
    { icon: <IconMail />, label: 'hello@alodev.vn' },
    { icon: <IconPhone />, label: '0587 789 456' },
    { icon: <IconTelegram />, label: '@alodevvn' },
  ]
  const isDark = theme === 'dark'
  const txt = isDark ? 'text-white/80' : 'text-[#1f2a52]'
  const ico = isDark ? 'text-white/55' : 'text-[#3c5cba]/60'
  const sep = isDark ? 'text-white/25' : 'text-[#3c5cba]/30'
  const sizeMap = { xs: 'text-[10px]', sm: 'text-xs', md: 'text-sm' } as const
  const cls = `${txt} ${sizeMap[size]} font-mono`

  if (layout === 'stack') {
    return (
      <div className={`flex flex-col gap-1.5 ${cls}`}>
        {items.map((it, i) => (
          <div key={i} className="inline-flex items-center gap-2">
            <span className={ico}>{it.icon}</span>
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className={`inline-flex flex-wrap items-center gap-x-3 gap-y-1 ${cls}`}>
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <span className={ico}>{it.icon}</span>
          <span>{it.label}</span>
          {i < items.length - 1 && <span className={`${sep} ml-1.5`}>·</span>}
        </span>
      ))}
    </div>
  )
}

function IconMail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}
function IconPhone() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
function IconTelegram() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════
   AVATAR DESIGNS
   ════════════════════════════════════════════════════════════════════ */

function AvatarMono({ theme }: { theme: Theme }) {
  const t = tokens(theme)
  const isDark = theme === 'dark'
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0a1226 0%, #0d1a35 50%, #1f2f6a 100%)'
          : 'linear-gradient(135deg, #fbfcff 0%, #eef2fb 50%, #dbe3f7 100%)',
      }}
    >
      <Bloom color={t.bloomBlue} x="50%" y="42%" size="80%" blur={56} />
      <Grid opacity={isDark ? 0.12 : 0.18} lineColor={t.gridLine} size={60} maskImage="radial-gradient(ellipse at center, #000 30%, transparent 80%)" />
      <span className="absolute top-[14%] right-[14%] w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_24px_rgba(244,129,26,0.65)]" />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={210} height={255} className={t.logoShadow} />
        <div className={`${t.text} text-6xl font-bold tracking-tight`}>alodev</div>
      </div>
    </div>
  )
}

function AvatarBracket({ theme }: { theme: Theme }) {
  const t = tokens(theme)
  const isDark = theme === 'dark'
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: isDark ? '#0a0e1f' : '#f1f5fc' }}>
      <BracketWallpaper color={t.bracketColor} />
      <Bloom color={isDark ? 'rgba(60,92,186,0.4)' : 'rgba(95,148,247,0.22)'} x="50%" y="50%" size="70%" blur={60} />
      <span className="absolute w-[72%] aspect-square rounded-full" style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(60,92,186,0.18)'}` }} />
      <span className="absolute w-[56%] aspect-square rounded-full" style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(60,92,186,0.10)'}` }} />
      <div className="relative z-10 flex flex-col items-center gap-5">
        <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={180} height={219} className={t.logoShadow} />
        <div className={`${t.text} text-5xl font-bold tracking-tight`}>alodev</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          <span className={`${t.textLow} text-[10px] font-mono uppercase tracking-[0.32em]`}>studio · web · app</span>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   COVER DESIGNS  (1.91:1)
   ════════════════════════════════════════════════════════════════════ */

function CoverEditorial({ theme }: { theme: Theme }) {
  const t = tokens(theme)
  const isDark = theme === 'dark'
  return (
    <div className="absolute inset-0 flex items-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #0a1226 0%, #101e44 50%, #1d2f70 100%)'
            : 'linear-gradient(135deg, #fbfcff 0%, #eaf0fb 50%, #d2dcf4 100%)',
        }}
      />
      <Bloom color={t.bloomSaffron} x="92%" y="18%" size="60%" blur={70} />
      <Bloom color={t.bloomBlueSoft} x="-5%" y="80%" size="55%" blur={60} />
      <div className="absolute top-[10%] left-[5%] flex items-center gap-3">
        <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={54} height={66} />
        <span className={`${t.textLow} text-[10px] font-mono uppercase tracking-[0.32em]`}>alodev studio</span>
      </div>
      <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center px-[6%]">
        <div className={`${t.text} font-bold tracking-[-0.05em] leading-[0.85]`} style={{ fontSize: 'clamp(4.5rem, 13vw, 12rem)' }}>
          alodev
        </div>
        <div className={`mt-3 ${t.textMid} text-base lg:text-xl font-medium tracking-wide`}>
          Studio thiết kế &amp; phát triển web/app — founder-led.
        </div>
      </div>
      <div className="absolute bottom-[8%] inset-x-0 px-[5%] flex items-center justify-between gap-3 flex-wrap">
        <ContactStrip theme={theme} />
        <div className={`flex items-center gap-3 ${t.textXLow} text-[10px] font-mono uppercase tracking-[0.28em]`}>
          <span className="w-8 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(60,92,186,0.30)' }} />
          alodev.vn
        </div>
      </div>
    </div>
  )
}

function CoverMesh({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const t = tokens(theme)
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: isDark ? '#06091a' : '#f3f6fc' }}>
      <Bloom color={isDark ? 'rgba(95,148,247,0.55)' : 'rgba(95,148,247,0.35)'} x="20%" y="20%" size="55%" blur={80} />
      <Bloom color={isDark ? 'rgba(60,92,186,0.45)' : 'rgba(60,92,186,0.22)'} x="60%" y="80%" size="60%" blur={90} />
      <Bloom color="rgba(244,129,26,0.20)" x="92%" y="35%" size="40%" blur={70} />
      <Bloom color={isDark ? 'rgba(160,80,220,0.18)' : 'rgba(160,80,220,0.10)'} x="40%" y="55%" size="45%" blur={70} />
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          opacity: isDark ? 0.3 : 0.15,
          background: 'conic-gradient(from 210deg at 70% 50%, transparent 0deg, rgba(95,148,247,0.4) 60deg, transparent 120deg)',
          filter: 'blur(36px)',
        }}
      />
      <Grid opacity={isDark ? 0.10 : 0.16} lineColor={t.gridLine} size={56} maskImage="linear-gradient(135deg, #000 0%, transparent 80%)" />
      <div className="relative z-10 h-full flex items-center justify-end pr-[6%] pl-[35%]">
        <div className="flex items-center gap-6">
          <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={108} height={131} className={t.logoShadow} />
          <div className="text-right">
            <div className={`${t.text} text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9]`}>alodev</div>
            <div className={`mt-3 ${t.textHigh} text-sm lg:text-base font-medium`}>
              Founder-led · web · app · CRM/ERP
            </div>
            <div className="mt-3 flex justify-end">
              <ContactStrip theme={theme} size="xs" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-[12%] left-[5%] flex items-center gap-3">
        <span className="w-6 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(60,92,186,0.40)' }} />
        <span className={`${t.textLow} text-[10px] font-mono uppercase tracking-[0.32em]`}>studio · 2026</span>
      </div>
    </div>
  )
}

function CoverCode({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const t = tokens(theme)
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: isDark ? '#070b1d' : '#f5f7fc' }}>
      <CodeGlyphs color={isDark ? 'white' : '#3c5cba'} />
      <Bloom color={isDark ? 'rgba(95,148,247,0.32)' : 'rgba(95,148,247,0.18)'} x="22%" y="60%" size="55%" blur={70} />
      <div
        className="absolute inset-0"
        style={{
          opacity: isDark ? 0.08 : 0.12,
          backgroundImage: `linear-gradient(0deg, ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(60,92,186,0.5)'} 1px, transparent 1px)`,
          backgroundSize: '4px 4px',
          maskImage: 'linear-gradient(to bottom, transparent, #000, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000, transparent)',
        }}
      />
      <div className="relative z-10 h-full flex items-center px-[6%]">
        <div className="flex items-center gap-7">
          <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={112} height={136} className={t.logoShadow} />
          <div>
            <div className={`${t.text} text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9]`}>alodev</div>
            <div className={`mt-4 ${t.textHigh} text-sm lg:text-base font-mono`}>
              <span className="text-brand-500">{'<>'}</span> code is craft —{' '}
              <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>{'/* shipped */'}</span>
            </div>
            <div className={`mt-3 font-mono text-[11px] lg:text-xs ${t.textMid} leading-relaxed`}>
              <div><span className={isDark ? 'text-emerald-400/80' : 'text-emerald-600/80'}>// reach us</span></div>
              <div>
                <span className="text-brand-500">mail</span>
                <span className={t.textXLow}>: </span>
                hello@alodev.vn
              </div>
              <div>
                <span className="text-brand-500">tel</span>
                <span className={t.textXLow}>: </span>
                0587 789 456
              </div>
              <div>
                <span className="text-brand-500">tg</span>
                <span className={t.textXLow}>: </span>
                @alodevvn
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`absolute top-[10%] right-[6%] inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${isDark ? 'bg-white/8' : 'bg-white/70'} backdrop-blur ring-1 ${isDark ? 'ring-white/15' : 'ring-[#3c5cba]/15'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className={`${t.textHigh} text-[10px] font-mono uppercase tracking-[0.22em]`}>Q2/2026 · open</span>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   GROUP COVER DESIGNS  (16:9)
   ════════════════════════════════════════════════════════════════════ */

function GroupManifesto({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const t = tokens(theme)
  return (
    <div className="absolute inset-0 overflow-hidden flex items-center" style={{ background: isDark ? '#06091a' : '#f5f7fc' }}>
      <Bloom color={t.bloomBlue} x="-5%" y="20%" size="55%" blur={80} />
      <Bloom color="rgba(244,129,26,0.16)" x="100%" y="80%" size="50%" blur={80} />
      <Grid opacity={isDark ? 0.10 : 0.18} lineColor={t.gridLine} size={64} maskImage="linear-gradient(to right, #000 0%, #000 60%, transparent 100%)" />
      <div className="relative z-10 px-[7%] max-w-[78%] flex flex-col gap-7">
        <div className="flex items-center gap-4">
          <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={64} height={78} />
          <div className={`${t.text} text-3xl lg:text-5xl font-bold tracking-tight leading-[0.9]`}>alodev</div>
        </div>
        <div className={`${t.text} font-bold tracking-tight leading-[0.95]`} style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
          Founder-led studio.<br />
          <span className="text-brand-500">Source code thuộc về bạn.</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-[#3c5cba]/10'} backdrop-blur ${t.textHigh} text-xs font-mono`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Đang nhận dự án Q2/2026
          </span>
          <span className={`${t.textXLow} text-xs font-mono uppercase tracking-[0.2em]`}>alodev.vn</span>
        </div>
        <div className={`pt-4 border-t ${t.borderLine} max-w-md`}>
          <ContactStrip theme={theme} />
        </div>
      </div>
    </div>
  )
}

function GroupStats({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const t = tokens(theme)
  const stats = [
    { num: '11+' },
    { num: '5+' },
    { num: '99.9' },
    { num: '24h' },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: isDark ? '#06091a' : '#f5f7fc' }}>
      <Bloom color={t.bloomBlue} x="50%" y="30%" size="80%" blur={90} />
      <Grid opacity={isDark ? 0.08 : 0.16} lineColor={t.gridLine} size={72} />
      <div className="absolute inset-0 flex items-center justify-around opacity-[0.13] pointer-events-none">
        {stats.map((s, i) => (
          <div
            key={i}
            className="font-bold tracking-tight leading-none"
            style={{
              fontSize: 'clamp(5rem, 14vw, 13rem)',
              WebkitTextStroke: `2px ${isDark ? 'white' : '#3c5cba'}`,
              color: 'transparent',
              transform: `translateY(${i % 2 === 0 ? '-10%' : '15%'})`,
            }}
          >
            {s.num}
          </div>
        ))}
      </div>
      <div className="relative z-10 h-full flex items-center px-[7%]">
        <div className={`flex items-center gap-6 ${t.glassBg} backdrop-blur-md ring-1 ${t.glassRing} rounded-2xl px-7 py-6`}>
          <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={88} height={107} className={t.logoShadow} />
          <div className="flex flex-col gap-2.5">
            <div className={`${t.text} text-4xl lg:text-6xl font-bold tracking-tight leading-[0.9]`}>alodev</div>
            <div className={`${t.textHigh} text-sm lg:text-base`}>
              Founder-led studio — biến ý tưởng thành sản phẩm thật.
            </div>
            <div className={`pt-2 border-t ${t.borderLine}`}>
              <ContactStrip theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GroupMonogram({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const t = tokens(theme)
  const tiles: { x: string; y: string; rot: number; size: number; op: number }[] = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      tiles.push({
        x: `${(col / 8) * 100 + 6}%`,
        y: `${(row / 4) * 100 + 12}%`,
        rot: ((row + col) % 4) * 8 - 12,
        size: 32 + ((row + col) % 3) * 6,
        op: (isDark ? 0.06 : 0.10) + ((row * col) % 3) * 0.02,
      })
    }
  }
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: isDark ? '#080d22' : '#f4f7fd' }}>
      {tiles.map((tile, i) => (
        <Image
          key={i}
          src="/brand/logo-symbol.svg"
          alt=""
          aria-hidden="true"
          width={tile.size}
          height={Math.round(tile.size * 1.215)}
          className="absolute"
          style={{ left: tile.x, top: tile.y, opacity: tile.op, transform: `rotate(${tile.rot}deg)` }}
        />
      ))}
      <Bloom color={isDark ? 'rgba(60,92,186,0.5)' : 'rgba(95,148,247,0.30)'} x="50%" y="50%" size="55%" blur={80} />
      <div className="relative z-10 h-full flex items-center justify-center px-[7%]">
        <div className={`flex flex-col items-center gap-5 ${t.glassBg} backdrop-blur-md ring-1 ${t.glassRing} rounded-3xl px-10 lg:px-16 py-8 lg:py-10`}>
          <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={108} height={131} className={t.logoShadow} />
          <div className={`${t.text} text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9]`}>alodev</div>
          <div className={`${t.textHigh} text-sm lg:text-base text-center max-w-md`}>
            Studio thiết kế &amp; phát triển web/app — founder-led, source-code-yours.
          </div>
          <div className={`pt-3 border-t ${t.borderLine} w-full flex justify-center`}>
            <ContactStrip theme={theme} />
          </div>
        </div>
      </div>
    </div>
  )
}

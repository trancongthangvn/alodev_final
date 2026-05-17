'use client'

import Image from 'next/image'
import { useRef, useState, type ReactNode } from 'react'

/**
 * Brand assets - designer-pro card collection. 7 distinct compositions
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
 * 0364 234 936 · @alodevvn (avatars stay clean - they're profile pics).
 */

type Theme = 'dark' | 'light'

const EXPORT_W = {
  avatar: 1080,
  cover: 1640,
  group: 1920,
  og: 1200, // Open Graph standard 1200×630
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
            Tám biến thể. Hai sắc thái. Một bộ nhận diện.
          </h2>
          <p className="mt-4 text-base lg:text-lg text-gray-600 dark:text-ink-400 leading-relaxed">
            Mỗi card có toggle <strong>Tối / Sáng</strong> để khớp page Facebook của bạn,
            và nút <strong>Tải</strong> xuất PNG đúng resolution chuẩn social.
            Contact: <span className="font-mono">hello@alodev.vn · 0364 234 936 · @alodevvn</span>.
          </p>
        </div>

        <SubHead label="Avatar 1:1" hint="1080×1080 · FB profile · Zalo · LinkedIn personal" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
          <BrandCard
            id="brand-avatar-mono"
            label="Avatar Mono"
            sublabel="Logo trung tâm - clean, kỷ luật brand"
            aspect="aspect-square"
            exportW={EXPORT_W.avatar}
            renderDesign={(t) => <AvatarMono theme={t} />}
          />
          <BrandCard
            id="brand-avatar-seal"
            label="Avatar Seal"
            sublabel="Notary seal - concentric rings + cardinal marks"
            aspect="aspect-square"
            exportW={EXPORT_W.avatar}
            renderDesign={(t) => <AvatarBracket theme={t} />}
          />
        </div>

        <SubHead label="Cover 1.91:1" hint="1640×856 · FB cover · LinkedIn page banner" />
        <div className="grid grid-cols-1 gap-6 lg:gap-8 mb-12 lg:mb-16">
          <BrandCard
            id="brand-cover-editorial"
            label="Cover A - Editorial"
            sublabel="Oversized wordmark, logo làm initial accent"
            aspect="aspect-[820/428]"
            exportW={EXPORT_W.cover}
            renderDesign={(t) => <CoverEditorial theme={t} />}
          />
          <BrandCard
            id="brand-cover-riso"
            label="Cover B - Riso 2-color"
            sublabel="Risograph print, halftone, saffron block accent"
            aspect="aspect-[820/428]"
            exportW={EXPORT_W.cover}
            renderDesign={(t) => <CoverMesh theme={t} />}
          />
          <BrandCard
            id="brand-cover-code"
            label="Cover C - Code Snippet"
            sublabel="Code-glyph wallpaper, kỹ sư-forward"
            aspect="aspect-[820/428]"
            exportW={EXPORT_W.cover}
            renderDesign={(t) => <CoverCode theme={t} />}
          />
          <BrandCard
            id="brand-cover-split"
            label="Cover D - Split Panel"
            sublabel="2 cột bất đối xứng - brand block + value props"
            aspect="aspect-[820/428]"
            exportW={EXPORT_W.cover}
            renderDesign={(t) => <CoverSplit theme={t} />}
          />
          <BrandCard
            id="brand-cover-masthead"
            label="Cover E - Newspaper Masthead"
            sublabel="Editorial print - masthead + ruled lines + serial"
            aspect="aspect-[820/428]"
            exportW={EXPORT_W.cover}
            renderDesign={(t) => <CoverMasthead theme={t} />}
          />
        </div>

        <SubHead label="Group cover 16:9" hint="1920×1080 · FB group · LinkedIn org · YouTube channel" />
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          <BrandCard
            id="brand-group-manifesto"
            label="Group A - Manifesto"
            sublabel="Bold statement chiếm sân"
            aspect="aspect-video"
            exportW={EXPORT_W.group}
            renderDesign={(t) => <GroupManifesto theme={t} />}
          />
          <BrandCard
            id="brand-group-stats"
            label="Group B - Stats Grid"
            sublabel="Số khổng lồ làm wallpaper, brand block overlay"
            aspect="aspect-video"
            exportW={EXPORT_W.group}
            renderDesign={(t) => <GroupStats theme={t} />}
          />
          <BrandCard
            id="brand-group-monogram"
            label="Group C - Monogram Repeat"
            sublabel="Logo lặp tiled, brand block trung tâm"
            aspect="aspect-video"
            exportW={EXPORT_W.group}
            renderDesign={(t) => <GroupMonogram theme={t} />}
          />
          <BrandCard
            id="brand-group-blueprint"
            label="Group D - Blueprint Technical"
            sublabel="ISO drawing - fine grid, dimension labels, sheet borders"
            aspect="aspect-video"
            exportW={EXPORT_W.group}
            renderDesign={(t) => <GroupBlueprint theme={t} />}
          />
        </div>

        {/* ═══ OG IMAGE CANDIDATES ═══ - pick 1, then apply to opengraph-image.tsx */}
        <div className="mt-12 lg:mt-20 mb-4 lg:mb-6">
          <SubHead label="OG image · 1200×630" hint="Bản preview khi share alodev.vn lên FB/X/LinkedIn - pick 1 concept duyệt rồi áp dụng" />
          <p className="text-xs text-gray-500 dark:text-ink-500 max-w-2xl">
            3 phương án dưới đây <strong>chưa</strong> active. Bạn pick concept nào,
            tôi áp dụng vào <code className="font-mono text-[11px]">/opengraph-image</code> route
            (sẽ replace OG image hiện tại trên alodev.vn).
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          <BrandCard
            id="brand-og-editorial"
            label="OG A - Editorial Bold"
            sublabel="Type-as-hero, oversized statement, restrained palette"
            aspect="aspect-[1200/630]"
            exportW={EXPORT_W.og}
            renderDesign={(t) => <OgEditorial theme={t} />}
          />
          <BrandCard
            id="brand-og-split"
            label="OG B - Split + Saffron Block"
            sublabel="Brand block left, bold saffron geometry right"
            aspect="aspect-[1200/630]"
            exportW={EXPORT_W.og}
            renderDesign={(t) => <OgSplit theme={t} />}
          />
          <BrandCard
            id="brand-og-monogram"
            label="OG C - Monogram Center"
            sublabel="Logo monumental, minimal type, brand identity focus"
            aspect="aspect-[1200/630]"
            exportW={EXPORT_W.og}
            renderDesign={(t) => <OgMonogram theme={t} />}
          />
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
   BRAND CARD FRAME - toggle + download + caption
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

/* Contact strip - adapts to theme. */
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
    { icon: <IconPhone />, label: '0364 234 936' },
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

/* Avatar Bracket - RE-CONCEIVED as a NOTARY SEAL.
   No glow, no AI-vibe halo. Concentric solid rings + tight dotted
   border + circular text path = official-document feel. Restrained
   2-color palette (cream + navy on light, ink-black + saffron on dark). */
function AvatarBracket({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const bg = isDark ? '#0a0a0a' : '#f5f3ec'
  const ink = isDark ? '#fbfcff' : '#0a1226'
  const inkDim = isDark ? 'rgba(251,252,255,0.55)' : 'rgba(10,18,38,0.55)'
  const accent = isDark ? '#f4811a' : '#d96b09'
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: bg }}>
      {/* Outer ring */}
      <span
        className="absolute aspect-square w-[80%] rounded-full"
        style={{ border: `2px solid ${ink}` }}
      />
      {/* Inner ring */}
      <span
        className="absolute aspect-square w-[68%] rounded-full"
        style={{ border: `1px solid ${ink}` }}
      />
      {/* Dotted concentric border between rings */}
      <span
        className="absolute aspect-square w-[74%] rounded-full"
        style={{ border: `1px dashed ${inkDim}` }}
      />
      {/* Saffron accent dots at cardinal points */}
      {[0, 90, 180, 270].map((deg) => (
        <span
          key={deg}
          className="absolute w-[40%] aspect-square flex items-center justify-center"
          style={{ transform: `rotate(${deg}deg)` }}
        >
          <span
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ background: accent, top: '0', transform: 'translateY(-100%)' }}
          />
        </span>
      ))}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={120} height={146} />
        <div style={{ color: ink }} className="text-4xl font-bold tracking-tight">
          alodev
        </div>
        <div className="w-12 h-px" style={{ background: ink, opacity: 0.5 }} />
        <div
          style={{ color: inkDim }}
          className="text-[9px] font-mono uppercase tracking-[0.42em]"
        >
          est. 31·03·2025
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
        <span className={`${t.textLow} text-[10px] font-mono uppercase tracking-[0.32em]`}>
          alodev studio · est. 2025
        </span>
      </div>
      <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center px-[6%]">
        <div className={`${t.text} font-bold tracking-[-0.05em] leading-[0.85]`} style={{ fontSize: 'clamp(4.5rem, 13vw, 12rem)' }}>
          alodev
        </div>
        <div className={`mt-3 ${t.textMid} text-base lg:text-xl font-medium tracking-wide`}>
          Thiết kế web · Lập trình app · CRM/ERP · Tự động hoá AI
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

/* Cover B - RE-CONCEIVED as RISOGRAPH 2-COLOR PRINT.
   Drops the multi-bloom mesh (read as AI-synthwave). Now a print-grade
   2-color riso poster: cream paper + halftone dot texture + navy-on-
   cream typography + saffron stamp accent. Restrained palette discipline. */
function CoverMesh({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const bg = isDark ? '#0a0a0a' : '#faf8f1'
  const ink = isDark ? '#fbfcff' : '#0a1226'
  const inkSoft = isDark ? 'rgba(251,252,255,0.70)' : 'rgba(10,18,38,0.70)'
  const inkDim = isDark ? 'rgba(251,252,255,0.45)' : 'rgba(10,18,38,0.45)'
  const accent = isDark ? '#f4811a' : '#d96b09'
  // Halftone dot pattern: small dots on cream paper, gives riso feel
  const dotColor = isDark ? 'rgba(244,129,26,0.18)' : 'rgba(217,107,9,0.16)'
  return (
    <div className="absolute inset-0 overflow-hidden flex" style={{ background: bg }}>
      {/* Halftone dot texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${dotColor} 1.5px, transparent 1.6px)`,
          backgroundSize: '14px 14px',
          maskImage: 'radial-gradient(ellipse at 30% 50%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 30% 50%, #000 30%, transparent 80%)',
        }}
      />
      {/* Saffron offset block - left edge accent (riso print signature) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[14%]"
        style={{ background: accent }}
      />
      {/* Hand-stamped EDITION mark, top-right */}
      <div
        className="absolute top-[10%] right-[5%] inline-flex items-center gap-2 px-3 py-1.5 border-2"
        style={{ borderColor: ink, color: ink }}
      >
        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.28em]">
          Edition · Q2/2026
        </span>
      </div>
      {/* Vertical mark on the saffron stripe */}
      <div className="absolute left-[14%] top-1/2 -translate-y-1/2 -translate-x-1/2 origin-center" style={{ transform: 'translateX(-50%) translateY(-50%) rotate(-90deg)', whiteSpace: 'nowrap' }}>
        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.4em] text-white">
          est. 31·03·2025
        </span>
      </div>
      {/* Main content right of saffron stripe */}
      <div className="relative z-10 h-full flex items-center pl-[20%] pr-[8%]" style={{ color: ink }}>
        <div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px]" style={{ background: ink }} />
            <span className="text-[10px] font-mono uppercase tracking-[0.32em]" style={{ color: inkDim }}>
              Year 02 · Q2/2026
            </span>
          </div>
          <div
            className="font-bold tracking-[-0.04em] leading-[0.85] mt-3"
            style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)' }}
          >
            alodev
          </div>
          <div className="mt-3 text-base lg:text-xl font-medium" style={{ color: inkSoft }}>
            Web · App · CRM/ERP · Tự động hoá AI
          </div>
          <div className="mt-5 pt-3 border-t" style={{ borderColor: inkDim, maxWidth: '38rem' }}>
            <ContactStrip theme={theme} size="xs" />
          </div>
        </div>
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
            <div className={`mt-3 ${t.textHigh} text-sm lg:text-base font-mono`}>
              <span className="text-brand-500">{'<>'}</span> code is craft -{' '}
              <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>{'/* shipped */'}</span>
            </div>
            <div className="mt-4">
              <ContactStrip theme={theme} />
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

/* Cover D - Split Panel: 60/40 asymmetric split. Left side bold dark
   brand block (always dark for accent contrast); right side adapts to
   theme, holding 3 quick value props + contact. The split itself is the
   design gesture. */
function CoverSplit({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const t = tokens(theme)
  return (
    <div className="absolute inset-0 flex">
      {/* LEFT 60% - always dark brand panel */}
      <div className="relative w-[58%] h-full overflow-hidden" style={{ background: '#06091a' }}>
        <Bloom color="rgba(95,148,247,0.45)" x="35%" y="55%" size="80%" blur={70} />
        <Bloom color="rgba(244,129,26,0.18)" x="85%" y="20%" size="50%" blur={60} />
        <Grid opacity={0.10} lineColor="rgba(255,255,255,0.4)" size={56} maskImage="radial-gradient(ellipse at 35% 55%, #000 30%, transparent 80%)" />
        <div className="relative z-10 h-full flex flex-col justify-between p-[6%]">
          <div className="flex items-center gap-3">
            <span className="w-6 h-px bg-white/40" />
            <span className="text-white/55 text-[10px] font-mono uppercase tracking-[0.32em]">est. 31·03·2025</span>
          </div>
          <div className="flex items-center gap-5">
            <Image
              src="/brand/logo-symbol.svg"
              alt="Alodev logo"
              width={120}
              height={146}
              className="drop-shadow-[0_8px_24px_rgba(95,148,247,0.5)]"
            />
            <div>
              <div className="text-white text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
                alodev
              </div>
              <div className="mt-2 text-white/85 text-sm lg:text-base font-medium">
                Web · App · CRM/ERP · Tự động hoá AI
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-white/70 text-[10px] font-mono uppercase tracking-[0.22em]">
              Đang nhận dự án Q2/2026
            </span>
          </div>
        </div>
        {/* Slanted divider - brand color stripe */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[6%]"
          style={{
            background: 'linear-gradient(180deg, rgba(244,129,26,0.7) 0%, rgba(95,148,247,0.5) 100%)',
            clipPath: 'polygon(70% 0, 100% 0, 30% 100%, 0% 100%)',
          }}
        />
      </div>

      {/* RIGHT 42% - theme-adaptive panel */}
      <div
        className="relative w-[42%] h-full overflow-hidden flex flex-col justify-between p-[5%]"
        style={{ background: isDark ? '#10172e' : '#f3f6fc' }}
      >
        <Bloom color={isDark ? 'rgba(95,148,247,0.18)' : 'rgba(95,148,247,0.20)'} x="80%" y="20%" size="60%" blur={60} />
        <Grid
          opacity={isDark ? 0.06 : 0.14}
          lineColor={t.gridLine}
          size={36}
          maskImage="radial-gradient(circle at 60% 50%, #000 40%, transparent 90%)"
        />

        <div className="relative z-10">
          <div className={`${t.textLow} text-[10px] font-mono uppercase tracking-[0.32em] mb-3`}>
            ─── cam kết bàn giao
          </div>
          <ul className={`space-y-1.5 ${t.textHigh} text-sm lg:text-base font-medium`}>
            <li className="flex items-start gap-2">
              <span className="text-brand-500 mt-1">▸</span>
              <span>Tốc độ tải nhanh · Chuẩn SEO</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-500 mt-1">▸</span>
              <span>Source code thuộc về bạn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-500 mt-1">▸</span>
              <span>Bàn giao đúng hạn · Bảo hành 6–12 tháng</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10">
          <div className={`pt-3 border-t ${t.borderLine}`}>
            <ContactStrip theme={theme} layout="stack" size="xs" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* Cover E - Newspaper Masthead.
   Editorial print: serif-mood masthead bar, dateline, columns. Real
   designers use newsprint references for tech publications (Wired,
   MIT Tech Review, Monocle). Off-cream paper + ink + saffron reserve. */
function CoverMasthead({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const bg = isDark ? '#0d0d0d' : '#f5f3ec'
  const ink = isDark ? '#fbfcff' : '#0a1226'
  const inkDim = isDark ? 'rgba(251,252,255,0.55)' : 'rgba(10,18,38,0.55)'
  const accent = isDark ? '#f4811a' : '#d96b09'
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg, color: ink }}>
      {/* Top masthead bar */}
      <div className="absolute top-[6%] inset-x-[5%] flex items-center justify-between border-y" style={{ borderColor: ink }}>
        <div className="py-1.5 text-[9px] font-mono uppercase tracking-[0.32em]" style={{ color: inkDim }}>
          Year 02 - Q2/2026
        </div>
        <div className="py-1.5 text-[9px] font-mono uppercase tracking-[0.32em]" style={{ color: inkDim }}>
          Est. 31·03·2025
        </div>
        <div className="py-1.5 text-[9px] font-mono uppercase tracking-[0.32em]" style={{ color: inkDim }}>
          alodev.vn
        </div>
      </div>
      {/* Headline */}
      <div className="absolute inset-x-[5%] top-[20%]">
        <div className="flex items-center gap-3 mb-3">
          <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={42} height={51} />
          <span className="text-[10px] font-mono uppercase tracking-[0.32em]" style={{ color: inkDim }}>
            Studio Issue
          </span>
        </div>
        <div
          className="font-bold tracking-[-0.04em] leading-[0.86]"
          style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
        >
          alodev
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.22em]" style={{ background: accent, color: '#fff' }}>
            Open
          </span>
          <span className="text-sm lg:text-base font-medium" style={{ color: inkDim }}>
            Web · App · CRM/ERP · Tự động hoá AI
          </span>
        </div>
      </div>
      {/* 3-column footer (newsprint feel) */}
      <div className="absolute bottom-[8%] inset-x-[5%] grid grid-cols-3 gap-6 pt-3 border-t" style={{ borderColor: ink }}>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.32em] mb-1" style={{ color: inkDim }}>
            Tốc độ
          </div>
          <div className="text-xs font-medium" style={{ color: ink }}>
            Tải nhanh · Chuẩn SEO
          </div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.32em] mb-1" style={{ color: inkDim }}>
            Bảo hành
          </div>
          <div className="text-xs font-medium" style={{ color: ink }}>
            6–12 tháng · 99.9% uptime
          </div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.32em] mb-1" style={{ color: inkDim }}>
            Liên hệ
          </div>
          <div className="text-xs font-mono" style={{ color: ink }}>
            hello@alodev.vn
          </div>
          <div className="text-xs font-mono" style={{ color: ink }}>
            0364 234 936
          </div>
        </div>
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
          Code chuẩn. Bàn giao đúng hạn.<br />
          <span className="text-brand-500">Source code thuộc về bạn.</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-[#3c5cba]/10'} backdrop-blur ${t.textHigh} text-xs font-mono`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Đang nhận dự án Q2/2026
          </span>
          <span className={`${t.textXLow} text-xs font-mono uppercase tracking-[0.2em]`}>est. 31·03·2025</span>
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
  // English-only labels for international scan-readability - Vietnamese
  // labels were dropped per design feedback. Each label is a short,
  // industry-standard term so the figure parses across languages.
  const stats = [
    { num: '11+',  label: 'products' },
    { num: '2025', label: 'established' },
    { num: '99.9', label: 'uptime  %' },
    { num: '24h',  label: 'response' },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: isDark ? '#06091a' : '#f5f7fc' }}>
      <Bloom color={t.bloomBlue} x="50%" y="30%" size="80%" blur={90} />
      <Grid opacity={isDark ? 0.08 : 0.16} lineColor={t.gridLine} size={72} />
      <div className="absolute inset-0 flex items-center justify-around pointer-events-none">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1"
            style={{ transform: `translateY(${i % 2 === 0 ? '-8%' : '12%'})` }}
          >
            <div
              className="font-bold tracking-tight leading-none"
              style={{
                fontSize: 'clamp(5rem, 14vw, 13rem)',
                WebkitTextStroke: `2px ${isDark ? 'white' : '#3c5cba'}`,
                color: 'transparent',
                opacity: 0.18,
              }}
            >
              {s.num}
            </div>
            <div
              className="text-[10px] lg:text-xs font-mono uppercase tracking-[0.32em]"
              style={{
                color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(60,92,186,0.50)',
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div className="relative z-10 h-full flex items-center px-[7%]">
        <div className={`flex items-center gap-6 ${t.glassBg} backdrop-blur-md ring-1 ${t.glassRing} rounded-2xl px-7 py-6`}>
          <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={88} height={107} className={t.logoShadow} />
          <div className="flex flex-col gap-2.5">
            <div className={`${t.text} text-4xl lg:text-6xl font-bold tracking-tight leading-[0.9]`}>alodev</div>
            <div className={`${t.textHigh} text-sm lg:text-base font-mono uppercase tracking-[0.18em]`}>
              Web · App · CRM/ERP · AI Automation
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
            Web · App · CRM/ERP · Tự động hoá AI - source code thuộc về bạn.
          </div>
          <div className={`pt-3 border-t ${t.borderLine} w-full flex justify-center`}>
            <ContactStrip theme={theme} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* Group D - Blueprint Technical.
   ISO drawing aesthetic: fine grid + dimension labels + sheet border +
   serial number. Print-design influence (NASA tech specs, architecture
   sheets). 2-color discipline: ink + saffron only. */
function GroupBlueprint({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const bg = isDark ? '#0a0a0a' : '#f5f3ec'
  const ink = isDark ? '#fbfcff' : '#0a1226'
  const inkDim = isDark ? 'rgba(251,252,255,0.55)' : 'rgba(10,18,38,0.55)'
  const accent = isDark ? '#f4811a' : '#d96b09'
  const gridLine = isDark ? 'rgba(251,252,255,0.10)' : 'rgba(10,18,38,0.10)'
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg, color: ink }}>
      {/* Fine grid (small, ISO-paper feel) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      {/* Major grid lines every 6 cells */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 1,
          backgroundImage: `linear-gradient(to right, ${gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
          backgroundSize: '144px 144px',
        }}
      />
      {/* Sheet border */}
      <div
        className="absolute inset-[3.5%]"
        style={{ border: `1px solid ${ink}` }}
      />
      <div
        className="absolute inset-[4.5%]"
        style={{ border: `1px solid ${inkDim}` }}
      />

      {/* Top-left brand block */}
      <div className="absolute top-[7%] left-[6%] flex items-center gap-3">
        <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={56} height={68} />
        <div>
          <div style={{ color: ink }} className="text-3xl lg:text-5xl font-bold tracking-tight leading-none">
            alodev
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.32em] mt-1" style={{ color: inkDim }}>
            studio · technical sheet
          </div>
        </div>
      </div>

      {/* Right-side dimension column */}
      <div className="absolute top-[8%] right-[6%] flex flex-col items-end gap-3">
        <div className="text-right">
          <div className="text-[9px] font-mono uppercase tracking-[0.32em]" style={{ color: inkDim }}>Sheet</div>
          <div className="font-mono text-sm" style={{ color: ink }}>A · 1/1</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-mono uppercase tracking-[0.32em]" style={{ color: inkDim }}>Scale</div>
          <div className="font-mono text-sm" style={{ color: ink }}>1 : 1</div>
        </div>
      </div>

      {/* Center - large statement with dimension lines */}
      <div className="absolute inset-x-[10%] top-[40%] -translate-y-1/2">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-12 h-px" style={{ background: ink }} />
          <span className="text-[10px] font-mono uppercase tracking-[0.32em]" style={{ color: inkDim }}>
            Spec · 001
          </span>
        </div>
        <div
          className="font-bold tracking-[-0.03em] leading-[0.92]"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          Web · App · Hệ thống.
        </div>
        <div
          className="font-bold tracking-[-0.03em] leading-[0.92]"
          style={{ color: accent, fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          Bàn giao đúng hạn.
        </div>
      </div>

      {/* Bottom-left - title block (engineering drawing convention) */}
      <div
        className="absolute bottom-[7%] left-[6%] right-[6%] flex items-center justify-between gap-6 pt-3 border-t"
        style={{ borderColor: ink }}
      >
        <div className="grid grid-cols-3 gap-x-8 text-[10px] font-mono uppercase tracking-[0.22em]">
          <div>
            <div style={{ color: inkDim }}>Email</div>
            <div className="font-sans normal-case tracking-normal text-xs" style={{ color: ink }}>
              hello@alodev.vn
            </div>
          </div>
          <div>
            <div style={{ color: inkDim }}>Phone</div>
            <div className="font-sans normal-case tracking-normal text-xs" style={{ color: ink }}>
              0364 234 936
            </div>
          </div>
          <div>
            <div style={{ color: inkDim }}>Telegram</div>
            <div className="font-sans normal-case tracking-normal text-xs" style={{ color: ink }}>
              @alodevvn
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-mono uppercase tracking-[0.32em]" style={{ color: inkDim }}>
            Drawn by · Est. 31·03·2025
          </div>
          <div className="text-sm font-bold" style={{ color: ink }}>alodev studio</div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   OG IMAGE CANDIDATES - 1200×630
   These are previews. Once user approves one, port the chosen design
   to src/app/opengraph-image.tsx (Next.js OG image route).
   ════════════════════════════════════════════════════════════════════ */

/* OG A - Editorial Bold.
   Single-page magazine cover. Off-cream paper or deep navy, oversized
   wordmark + brand statement, restrained 2-color palette. Reads at
   thumbnail (300×157) without losing the brand. */
function OgEditorial({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const bg = isDark ? '#0a0a0a' : '#f5f3ec'
  const ink = isDark ? '#fbfcff' : '#0a1226'
  const inkDim = isDark ? 'rgba(251,252,255,0.55)' : 'rgba(10,18,38,0.55)'
  const accent = isDark ? '#f4811a' : '#d96b09'
  return (
    <div className="absolute inset-0 overflow-hidden flex" style={{ background: bg, color: ink }}>
      {/* Top dateline bar */}
      <div className="absolute top-[8%] inset-x-[6%] flex items-center justify-between border-b pb-2" style={{ borderColor: ink }}>
        <div className="flex items-center gap-3">
          <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={32} height={39} />
          <span className="text-[11px] font-mono uppercase tracking-[0.32em]" style={{ color: ink }}>
            alodev studio
          </span>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-[0.32em]" style={{ color: inkDim }}>
          est. 31·03·2025
        </span>
      </div>
      {/* Big editorial statement */}
      <div className="absolute inset-x-[6%] top-1/2 -translate-y-1/2">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-12 h-px" style={{ background: ink }} />
          <span className="text-[11px] font-mono uppercase tracking-[0.32em]" style={{ color: inkDim }}>
            Web · App · CRM/ERP · AI
          </span>
        </div>
        <div
          className="font-bold tracking-[-0.05em] leading-[0.86]"
          style={{ fontSize: 'clamp(4rem, 11vw, 9rem)', color: ink }}
        >
          Code is craft.
        </div>
        <div
          className="font-bold tracking-[-0.05em] leading-[0.86]"
          style={{ fontSize: 'clamp(4rem, 11vw, 9rem)', color: accent }}
        >
          Shipped.
        </div>
      </div>
      {/* Bottom URL bar */}
      <div className="absolute bottom-[8%] inset-x-[6%] flex items-center justify-between border-t pt-2" style={{ borderColor: ink }}>
        <span className="text-sm lg:text-base font-bold tracking-tight" style={{ color: ink }}>
          alodev
        </span>
        <span className="text-[11px] font-mono uppercase tracking-[0.32em]" style={{ color: inkDim }}>
          alodev.vn
        </span>
      </div>
    </div>
  )
}

/* OG B - Split + Saffron Block.
   Left: deep ink with logo + brand statement. Right: bold saffron
   geometric block with white wordmark + service keywords.
   Pure 2-color discipline, no gradients. */
function OgSplit({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const bgL = isDark ? '#0a0a0a' : '#0a1226'
  const bgR = '#d96b09' // saffron block - same in both themes for brand consistency
  return (
    <div className="absolute inset-0 flex">
      {/* LEFT 58% - ink panel */}
      <div className="relative w-[58%] h-full overflow-hidden flex flex-col justify-between p-[5%]" style={{ background: bgL }}>
        <div className="flex items-center gap-3">
          <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={56} height={68} />
          <span className="text-white/55 text-[11px] font-mono uppercase tracking-[0.32em]">
            est. 31·03·2025
          </span>
        </div>
        <div>
          <div
            className="text-white font-bold tracking-[-0.04em] leading-[0.88]"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
          >
            alodev
          </div>
          <div className="mt-3 text-white/85 text-base lg:text-xl font-mono uppercase tracking-[0.18em]">
            Studio · Web · App · CRM/ERP
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/55 text-[11px] font-mono uppercase tracking-[0.32em]">
          <span className="w-6 h-px bg-white/40" />
          alodev.vn
        </div>
      </div>
      {/* SLANTED EDGE between panels */}
      <div
        className="absolute top-0 bottom-0 w-[3%]"
        style={{
          left: '57%',
          background: '#fbfcff',
          opacity: 0.95,
          clipPath: 'polygon(80% 0, 100% 0, 20% 100%, 0% 100%)',
        }}
      />
      {/* RIGHT 42% - saffron block with reversed brand */}
      <div className="relative w-[42%] h-full overflow-hidden flex flex-col justify-between p-[6%]" style={{ background: bgR }}>
        <div className="flex justify-end">
          <span className="text-white/85 text-[11px] font-mono uppercase tracking-[0.32em]">
            Q2 / 2026
          </span>
        </div>
        <div>
          <div className="text-white font-bold tracking-[-0.02em] leading-[1.05] uppercase text-2xl lg:text-3xl">
            Code is craft.
          </div>
          <div className="text-white font-bold tracking-[-0.02em] leading-[1.05] uppercase text-2xl lg:text-3xl">
            Shipped.
          </div>
          <div className="mt-3 text-white/80 text-xs lg:text-sm font-mono uppercase tracking-[0.22em]">
            Web · App · AI · Auto
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="text-white/85 text-[11px] font-mono uppercase tracking-[0.32em]">
            now open
          </span>
        </div>
      </div>
    </div>
  )
}

/* OG C - Monogram Center.
   Logo monumental in middle of canvas, sparse type around. Most
   "iconic" feel - works extra well at very small thumbnail sizes
   because the logo dominates. */
function OgMonogram({ theme }: { theme: Theme }) {
  const isDark = theme === 'dark'
  const bg = isDark ? '#0a0a0a' : '#f5f3ec'
  const ink = isDark ? '#fbfcff' : '#0a1226'
  const inkDim = isDark ? 'rgba(251,252,255,0.55)' : 'rgba(10,18,38,0.55)'
  const inkXDim = isDark ? 'rgba(251,252,255,0.22)' : 'rgba(10,18,38,0.22)'
  const accent = isDark ? '#f4811a' : '#d96b09'
  const dotColor = isDark ? 'rgba(244,129,26,0.07)' : 'rgba(217,107,9,0.06)'

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg, color: ink }}>
      {/* Halftone dot paper texture (riso/print grade) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${dotColor} 1.2px, transparent 1.4px)`,
          backgroundSize: '12px 12px',
        }}
      />

      {/* Inner hairline frame */}
      <div className="absolute inset-[3.5%]" style={{ border: `1px solid ${inkXDim}` }} />

      {/* Slim saffron accent bar - left edge, runs vertically inside the
          frame. Single brand color signal, very thin (3px) so it reads
          as a print-bound spine, not decoration. */}
      <div
        className="absolute"
        style={{
          left: '3.5%',
          top: '14%',
          bottom: '14%',
          width: 3,
          background: accent,
        }}
      />

      {/* Printer registration marks (crosshair + circle) at 4 corners */}
      {[
        { top: '5.5%', left: '4.5%' },
        { top: '5.5%', right: '4.5%' },
        { bottom: '5.5%', left: '4.5%' },
        { bottom: '5.5%', right: '4.5%' },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{ ...pos, width: 28, height: 28, color: ink, opacity: 0.55 }}
        >
          <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="14" y1="2" x2="14" y2="11" />
            <line x1="14" y1="17" x2="14" y2="26" />
            <line x1="2" y1="14" x2="11" y2="14" />
            <line x1="17" y1="14" x2="26" y2="14" />
            <circle cx="14" cy="14" r="6.5" />
          </svg>
        </div>
      ))}

      {/* Top eyebrow line - single source of dateline truth */}
      <div className="absolute top-[12%] inset-x-0 flex items-center justify-center gap-4">
        <span className="w-8 h-px" style={{ background: ink, opacity: 0.45 }} />
        <span className="text-[10px] lg:text-[11px] font-mono uppercase tracking-[0.42em]" style={{ color: inkDim }}>
          alodev studio · est. 31·03·2025
        </span>
        <span className="w-8 h-px" style={{ background: ink, opacity: 0.45 }} />
      </div>

      {/* Center brand block - logo + wordmark + tagline.
          International-standard restraint: no ornament rules, no diamond
          marks. Brand mark breathes. Reference: Vercel, Linear, Stripe,
          Pentagram, Aesop. */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-7">
        <Image src="/brand/logo-symbol.svg" alt="Alodev logo" width={160} height={195} />
        <div
          className="font-bold leading-[0.8]"
          style={{
            fontSize: 'clamp(4.5rem, 12vw, 10.5rem)',
            letterSpacing: '-0.045em',
            color: ink,
          }}
        >
          alodev
        </div>
        <div
          className="text-[11px] lg:text-xs font-mono uppercase"
          style={{ color: inkDim, letterSpacing: '0.46em', paddingLeft: '0.46em' }}
        >
          Web · App · CRM/ERP · AI
        </div>
      </div>

      {/* Bottom - URL only, no contact / edition / serial.
          OG image is a "knock on the door" - its job is to make viewers
          click. Contact lives on the website, not on the share thumbnail
          (Vercel/Linear/Stripe convention). */}
      <div className="absolute bottom-[12%] inset-x-0 flex items-center justify-center">
        <span className="text-base lg:text-lg font-bold tracking-[-0.02em]" style={{ color: ink }}>
          alodev.vn
        </span>
      </div>
    </div>
  )
}

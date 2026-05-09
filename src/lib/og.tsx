import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Shared OG card template for alodev.vn — used by every route's
 * `opengraph-image.tsx`. Vietnamese diacritics render correctly because
 * we ship the Be Vietnam Pro TTF (full VN coverage) at build time;
 * Satori's default Inter has limited diacritic support.
 *
 * Visual language mirrors the dark-theme hero pocket (#07080c bg with
 * saffron radial accent top-right) so social previews feel like a
 * continuation of the site, not a generic share card.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'

let _fontCache: { bold: ArrayBuffer; semibold: ArrayBuffer } | null = null
async function loadFonts() {
  if (_fontCache) return _fontCache
  const cwd = process.cwd()
  const [bold, semibold] = await Promise.all([
    readFile(join(cwd, 'public/fonts/og/BeVietnamPro-Bold.ttf')),
    readFile(join(cwd, 'public/fonts/og/BeVietnamPro-SemiBold.ttf')),
  ])
  _fontCache = {
    bold: bold.buffer.slice(bold.byteOffset, bold.byteOffset + bold.byteLength) as ArrayBuffer,
    semibold: semibold.buffer.slice(semibold.byteOffset, semibold.byteOffset + semibold.byteLength) as ArrayBuffer,
  }
  return _fontCache
}

export type OgCardProps = {
  /** ALL-CAPS section label, e.g. "DỊCH VỤ" or "PORTFOLIO". */
  eyebrow: string
  /** Big headline. Aim ≤ 60 chars for legibility at thumbnail size. */
  title: string
  /** One-line tagline below the title. */
  tagline?: string
  /** Optional bottom-left price/badge string, e.g. "Từ 8 triệu". */
  badge?: string
}

/**
 * Renders the shared OG card. Each route's `opengraph-image.tsx` calls
 * this with route-specific props and exports the result.
 */
export async function renderOg({ eyebrow, title, tagline, badge }: OgCardProps) {
  const fonts = await loadFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#07080c',
          // Saffron atmospheric pocket top-right (mirrors hero-resend dark theme)
          backgroundImage: [
            'radial-gradient(ellipse 60% 55% at 78% 22%, rgba(244,129,26,0.20) 0%, transparent 65%)',
            'radial-gradient(ellipse 55% 65% at 12% 78%, rgba(150,170,210,0.08) 0%, transparent 70%)',
          ].join(', '),
          color: '#fff',
          fontFamily: 'BeVNPro',
          position: 'relative',
        }}
      >
        {/* Subtle 3×3 grid mark top-right — visual nod to Rubik metaphor */}
        <div
          style={{
            position: 'absolute',
            top: 64,
            right: 80,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            opacity: 0.35,
          }}
        >
          {[0, 1, 2].map((row) => (
            <div key={row} style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2].map((col) => (
                <div
                  key={col}
                  style={{
                    width: 18,
                    height: 18,
                    background: row === 1 && col === 1 ? '#f4811a' : '#3a3a44',
                    borderRadius: 3,
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* TOP — wordmark + saffron accent line */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: '#fff',
            }}
          >
            ALODEV
          </div>
          <div
            style={{
              marginTop: 6,
              width: 56,
              height: 3,
              background: '#f4811a',
              borderRadius: 2,
            }}
          />
        </div>

        {/* MIDDLE — eyebrow + title + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 980 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: '#f4811a',
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#fff',
            }}
          >
            {title}
          </div>
          {tagline && (
            <div
              style={{
                marginTop: 22,
                fontSize: 28,
                fontWeight: 600,
                lineHeight: 1.4,
                color: '#9ca3af',
                maxWidth: 880,
              }}
            >
              {tagline}
            </div>
          )}
        </div>

        {/* BOTTOM — domain + optional badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: '#f4811a',
              letterSpacing: '0.04em',
            }}
          >
            alodev.vn
          </div>
          {badge && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 22,
                fontWeight: 700,
                color: '#fff',
                background: 'rgba(244,129,26,0.16)',
                border: '1.5px solid rgba(244,129,26,0.5)',
                padding: '10px 22px',
                borderRadius: 999,
              }}
            >
              {badge}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'BeVNPro', data: fonts.semibold, style: 'normal', weight: 600 },
        { name: 'BeVNPro', data: fonts.bold, style: 'normal', weight: 700 },
      ],
    },
  )
}

/**
 * renderOgHome — homepage OG image (Monogram Center / Studio Plate).
 *
 * International-standard restraint: logo + wordmark + tagline + URL.
 * Print-craft refinements: 4 corner registration marks, inner hairline
 * frame, slim saffron stripe at the left edge, halftone paper texture.
 *
 * Reference: Vercel / Linear / Stripe / Pentagram / Aesop OG conventions.
 */
export async function renderOgHome() {
  const fonts = await loadFonts()
  // Read logo SVG and inline as data URI so Satori can rasterize it.
  const logoBuf = await readFile(join(process.cwd(), 'public/brand/logo-symbol.svg'))
  const logoDataUri = `data:image/svg+xml;base64,${logoBuf.toString('base64')}`

  // Palette — light cream paper, deep navy ink, saffron accent.
  // Light theme reads cleaner at thumbnail size in social feeds where
  // most platforms surround the preview with their own dark chrome.
  const bg = '#f5f3ec'
  const ink = '#0a1226'
  const inkDim = 'rgba(10, 18, 38, 0.55)'
  const inkXDim = 'rgba(10, 18, 38, 0.22)'
  const accent = '#d96b09'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: bg,
          color: ink,
          fontFamily: 'BeVNPro',
          position: 'relative',
        }}
      >
        {/* Halftone dot paper texture — subtle riso warmth */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: 'radial-gradient(rgba(217,107,9,0.06) 1.2px, transparent 1.4px)',
            backgroundSize: '14px 14px',
          }}
        />

        {/* Inner hairline frame */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 22,
            right: 22,
            bottom: 22,
            left: 22,
            border: `1px solid ${inkXDim}`,
          }}
        />

        {/* Slim saffron stripe — left edge, mid-section */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 22,
            top: 88,
            bottom: 88,
            width: 3,
            background: accent,
          }}
        />

        {/* Four printer registration marks (inline SVG) */}
        {[
          { top: 32, left: 32 },
          { top: 32, right: 32 },
          { bottom: 32, left: 32 },
          { bottom: 32, right: 32 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              position: 'absolute',
              ...pos,
              width: 32,
              height: 32,
              opacity: 0.55,
            }}
          >
            <svg viewBox="0 0 28 28" width="32" height="32" fill="none" stroke={ink} strokeWidth="1">
              <line x1="14" y1="2" x2="14" y2="11" />
              <line x1="14" y1="17" x2="14" y2="26" />
              <line x1="2" y1="14" x2="11" y2="14" />
              <line x1="17" y1="14" x2="26" y2="14" />
              <circle cx="14" cy="14" r="6.5" />
            </svg>
          </div>
        ))}

        {/* Top eyebrow line */}
        <div
          style={{
            position: 'absolute',
            top: 78,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div style={{ display: 'flex', width: 50, height: 1, background: ink, opacity: 0.45 }} />
          <div
            style={{
              display: 'flex',
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              color: inkDim,
            }}
          >
            alodev studio · est. 31·03·2025
          </div>
          <div style={{ display: 'flex', width: 50, height: 1, background: ink, opacity: 0.45 }} />
        </div>

        {/* Center brand block — logo + wordmark + tagline */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUri} alt="" width={140} height={170} />
          <div
            style={{
              display: 'flex',
              marginTop: 36,
              fontSize: 168,
              fontWeight: 700,
              letterSpacing: '-0.045em',
              lineHeight: 0.8,
              color: ink,
            }}
          >
            alodev
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 38,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '0.46em',
              paddingLeft: '0.46em',
              textTransform: 'uppercase',
              color: inkDim,
            }}
          >
            Web · App · CRM/ERP · AI
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 78,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: ink,
            }}
          >
            alodev.vn
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'BeVNPro', data: fonts.semibold, style: 'normal', weight: 600 },
        { name: 'BeVNPro', data: fonts.bold, style: 'normal', weight: 700 },
      ],
    },
  )
}

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

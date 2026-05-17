import { renderOgHome, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

// Dark variant of the homepage Studio Plate. Served by the time-aware
// Pages Function (functions/opengraph-image.ts) when ICT hour falls in
// the night window [18:00, 06:00). Otherwise the static light variant
// at /opengraph-image is served directly.
export const alt = 'Alodev - Studio thiết kế & phát triển Web/App (dark)'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgHome('dark')
}

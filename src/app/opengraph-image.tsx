import { renderOgHome, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Alodev - Studio thiết kế & phát triển Web/App'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Homepage OG uses the "Monogram Center · Studio Plate" composition -
// international-standard restraint per /ve-chung-toi#brand-og-monogram
// (logo + wordmark + tagline + URL, with print-craft refinements).
// Per-route OG images (du-an, dich-vu, etc.) keep the renderOg() editorial
// template since they need eyebrow/title/tagline that vary by route.
export default function Image() {
  return renderOgHome()
}

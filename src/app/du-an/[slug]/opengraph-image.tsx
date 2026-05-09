import { renderOgHome, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { projects } from '@/data/projects'

export const alt = 'Case study Alodev'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/**
 * Pre-render an OG image for every project slug at build time.
 * Mirrors the [slug] page's generateStaticParams so static export emits
 * one PNG per project. All slugs share the same Monogram Center / Studio
 * Plate composition for brand consistency across share previews.
 */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default function Image() {
  return renderOgHome()
}

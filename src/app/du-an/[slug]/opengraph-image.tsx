import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { getProject, projects } from '@/data/projects'

export const alt = 'Case study Alodev'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/**
 * Pre-render an OG image for every project slug at build time.
 * Mirrors the [slug] page's generateStaticParams so static export emits
 * one PNG per project.
 */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) {
    return renderOg({
      eyebrow: 'Case study',
      title: 'Không tìm thấy dự án.',
      badge: 'alodev.vn',
    })
  }
  return renderOg({
    eyebrow: `Case study · ${project.category}`,
    title: project.name,
    tagline: project.shortDesc,
    badge: project.domain,
  })
}

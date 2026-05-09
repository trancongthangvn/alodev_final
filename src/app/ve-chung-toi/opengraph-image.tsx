import { renderOgHome, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Về Alodev — Hồ sơ năng lực founder-led studio'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgHome()
}

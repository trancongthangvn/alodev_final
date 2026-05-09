import { renderOgHome, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Dịch vụ Alodev — Web · App · Hệ thống · AI · Bảo trì · UI/UX'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgHome()
}

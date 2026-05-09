import { renderOgHome, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Thiết kế website chuyên nghiệp — Alodev, từ 8 triệu'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgHome()
}

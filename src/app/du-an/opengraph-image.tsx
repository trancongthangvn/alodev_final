import { renderOgHome, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Portfolio Alodev — 11+ sản phẩm đang vận hành thực tế'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgHome()
}

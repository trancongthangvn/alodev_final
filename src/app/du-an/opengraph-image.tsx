import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Portfolio Alodev — 11+ sản phẩm đang vận hành thực tế'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg({
    eyebrow: 'Portfolio',
    title: 'Sản phẩm Alodev đã triển khai.',
    tagline: '11+ sản phẩm đang vận hành thực tế — giáo dục, tin tức, e-commerce, hệ thống quản trị. Mỗi dự án có metric đo được.',
    badge: 'Lập trình · Thiết kế · SEO',
  })
}

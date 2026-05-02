import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Thiết kế website chuyên nghiệp — Alodev, từ 8 triệu'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg({
    eyebrow: 'Dịch vụ · Web',
    title: 'Thiết kế website chuyên nghiệp.',
    tagline: 'Landing · doanh nghiệp · e-commerce · blog. Chuẩn SEO, tốc độ tải <1s, source code thuộc về bạn.',
    badge: 'Từ 8 triệu',
  })
}

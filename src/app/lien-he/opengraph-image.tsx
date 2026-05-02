import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Liên hệ Alodev — Yêu cầu báo giá web/app trong 24h'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg({
    eyebrow: 'Liên hệ',
    title: 'Trao đổi trực tiếp với founder.',
    tagline: 'Zalo · Email · Form yêu cầu báo giá. Phản hồi kèm báo giá sơ bộ trong 24h — không qua sales/middleman.',
    badge: 'Phản hồi 24h',
  })
}

import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Báo giá web/app — Tự cấu hình & xem giá real-time | Alodev'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg({
    eyebrow: 'Báo giá tự cấu hình',
    title: 'Tick tính năng — xem giá real-time.',
    tagline: 'Calculator interactive cho web/app/hệ thống. Gửi cấu hình thẳng — báo giá chi tiết kèm timeline trong 24h.',
    badge: 'Real-time',
  })
}

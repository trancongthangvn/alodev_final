import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Dịch vụ Alodev — Web · App · Hệ thống · AI · Bảo trì · UI/UX'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg({
    eyebrow: 'Dịch vụ',
    title: 'Bảng giá & phạm vi dịch vụ.',
    tagline: 'Web · App · Hệ thống quản trị · AI · Bảo trì · UI/UX. Sáu nhóm dịch vụ với mức giá khởi điểm minh bạch.',
    badge: 'Founder-led',
  })
}

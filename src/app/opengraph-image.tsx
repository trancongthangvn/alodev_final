import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Alodev — Studio thiết kế & phát triển Web/App'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg({
    eyebrow: 'Founder-led studio',
    title: 'Thiết kế web & lập trình app — biến ý tưởng thành sản phẩm thật.',
    tagline: 'Studio phát triển phần mềm tại Hà Nội. Kiến trúc sư phần mềm trực tiếp phụ trách từng dự án — số lượng giới hạn mỗi quý.',
    badge: 'alodev.vn',
  })
}

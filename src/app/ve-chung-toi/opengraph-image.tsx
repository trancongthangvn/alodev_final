import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Về Alodev — Hồ sơ năng lực founder-led studio'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg({
    eyebrow: 'Về Alodev',
    title: 'Một founder, một studio, mười một sản phẩm.',
    tagline: 'Founder-led studio tại Hà Nội. 5+ năm phát triển và vận hành sản phẩm thực tế cho doanh nghiệp Việt.',
    badge: 'Hồ sơ năng lực',
  })
}

import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Lập trình app mobile iOS / Android — Alodev, từ 60 triệu'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg({
    eyebrow: 'Dịch vụ · Mobile',
    title: 'Lập trình app iOS & Android.',
    tagline: 'Native (Swift/Kotlin) hoặc cross-platform (RN, Flutter). Publish App Store + Play, source code thuộc về bạn.',
    badge: 'Từ 60 triệu',
  })
}

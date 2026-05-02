import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = 'Lập trình hệ thống quản trị CRM / ERP — Alodev, từ 25 triệu'
export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg({
    eyebrow: 'Dịch vụ · Hệ thống',
    title: 'Lập trình CRM, ERP, hệ thống quản trị.',
    tagline: 'Viết riêng theo nghiệp vụ thực tế. Phân quyền, báo cáo, API, backup tự động. Source code thuộc về bạn.',
    badge: 'Từ 25 triệu',
  })
}

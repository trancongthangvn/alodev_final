import QuoteBuilder from './QuoteBuilder'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata = {
  title: 'Tự cấu hình & xem báo giá ngay',
  description: 'Tick các tính năng web/app/hệ thống bạn cần, giá cập nhật real-time. Gửi cấu hình thẳng cho Alodev — phản hồi báo giá chi tiết trong 24h.',
  alternates: { canonical: '/bao-gia' },
  openGraph: {
    url: '/bao-gia',
    title: 'Tự cấu hình & xem báo giá — Alodev',
    description: 'Calculator interactive: chọn tính năng → xem giá ngay → gửi cấu hình.',
  },
}

export default function BaoGiaPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Trang chủ', url: '/' },
        { name: 'Báo giá', url: '/bao-gia' },
      ])} />
      <QuoteBuilder />
    </>
  )
}

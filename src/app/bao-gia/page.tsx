import QuoteBuilder from './QuoteBuilder'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata = {
  title: 'Báo giá web/app — Tự cấu hình & xem giá real-time',
  // 156 chars
  description: 'Tự cấu hình báo giá web/app/hệ thống: tick tính năng cần, giá cập nhật real-time. Gửi cấu hình thẳng cho Alodev — báo giá chi tiết kèm timeline trong 24h.',
  alternates: { canonical: '/bao-gia' },
  openGraph: {
    url: '/bao-gia',
    title: 'Báo giá web/app tự cấu hình — Alodev',
    description: 'Calculator interactive: tick tính năng → xem giá real-time → gửi cấu hình. Phản hồi 24h kèm timeline.',
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

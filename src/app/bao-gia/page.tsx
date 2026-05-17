import { Suspense } from 'react'
import QuoteBuilder from './QuoteBuilder'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata = {
  title: 'Báo giá web/app - Tự xem giá, không cần nhắn tin',
  description: 'Tự cấu hình web / app / hệ thống - xem giá, timeline, chi phí bảo trì ngay. Copy hoặc share link báo giá. Liên hệ chỉ khi cần.',
  alternates: { canonical: '/bao-gia' },
  openGraph: {
    url: '/bao-gia',
    title: 'Báo giá tự cấu hình - Alodev',
    description: 'Calculator real-time: chọn tính năng → giá + timeline + bảo trì. Copy/share/print, không cần liên hệ trước.',
  },
}

export default function BaoGiaPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Trang chủ', url: '/' },
        { name: 'Báo giá', url: '/bao-gia' },
      ])} />
      <Suspense fallback={<div className="py-20 text-center text-sm text-gray-500">Đang tải báo giá…</div>}>
        <QuoteBuilder />
      </Suspense>
    </>
  )
}

import LienHeClient from './Client'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata = {
  title: 'Yêu cầu báo giá web/app',
  description: 'Gửi yêu cầu báo giá thiết kế website, app mobile, hệ thống quản trị. Alodev phản hồi kèm báo giá sơ bộ trong 24h. Liên hệ Zalo 0364 234 936 hoặc hello@alodev.vn.',
  alternates: { canonical: '/lien-he' },
  openGraph: { url: '/lien-he', title: 'Yêu cầu báo giá web/app — Alodev', description: 'Phản hồi trong 24h kèm báo giá sơ bộ. Zalo · Email · Form.' },
}

export default function Page() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Liên hệ', url: '/lien-he' },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          url: 'https://alodev.vn/lien-he',
          name: 'Liên hệ Alodev',
          description: 'Form yêu cầu báo giá. Phản hồi trong 24h.',
        },
      ]} />
      <LienHeClient />
    </>
  )
}

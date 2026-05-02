import LienHeClient from './Client'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, contactPageSchema } from '@/lib/schema'

export const metadata = {
  // `absolute` skips the root layout's '%s — Alodev' template (otherwise this
  // title would emit "Liên hệ Alodev — ... — Alodev" with a duplicate suffix).
  title: { absolute: 'Liên hệ Alodev — Yêu cầu báo giá web/app trong 24h' },
  // 159 chars
  description: 'Liên hệ Alodev — studio web/app/hệ thống tại Hà Nội. Trao đổi trực tiếp với founder qua Zalo 0364 234 936, email hello@alodev.vn. Báo giá sơ bộ trong 24h.',
  alternates: { canonical: '/lien-he' },
  openGraph: {
    url: '/lien-he',
    title: 'Liên hệ Alodev — Báo giá web/app trong 24h',
    description: 'Zalo · Email · Form yêu cầu báo giá. Phản hồi kèm báo giá sơ bộ trong 24h, trao đổi trực tiếp với founder.',
  },
}

export default function Page() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Liên hệ', url: '/lien-he' },
        ]),
        contactPageSchema({
          name: 'Liên hệ Alodev — Yêu cầu báo giá',
          description: 'Form yêu cầu báo giá web/app/hệ thống. Phản hồi kèm báo giá sơ bộ trong 24h. Zalo · email · trao đổi trực tiếp với founder.',
        }),
      ]} />
      <LienHeClient />
    </>
  )
}

// Schema.org JSON-LD generators. Centralized so URL/contact info changes in one place.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alodev.vn'
const ORG_ID = `${SITE_URL}/#organization`
const SITE_ID = `${SITE_URL}/#website`

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'LocalBusiness', 'Organization'],
    '@id': ORG_ID,
    name: 'Alodev',
    alternateName: ['Alodev Studio', 'alodev.vn'],
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg`, width: 512, height: 512 },
    image: `${SITE_URL}/og.png`,
    description: 'Founder-led studio chuyên thiết kế website doanh nghiệp, lập trình app mobile (iOS / Android), xây dựng hệ thống quản trị (CRM, ERP) và tự động hoá AI cho doanh nghiệp Việt Nam.',
    slogan: 'Thiết kế website & lập trình app chuyên nghiệp — source code thuộc về bạn',
    foundingDate: '2021-01-01',
    founder: { '@type': 'Person', name: 'Trần Công Thắng' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hà Nội',
      addressRegion: 'Hà Nội',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.0285,
      longitude: 105.8542,
    },
    areaServed: [
      { '@type': 'Country', name: 'Việt Nam' },
      { '@type': 'City', name: 'Hà Nội' },
      { '@type': 'City', name: 'Hồ Chí Minh' },
      { '@type': 'City', name: 'Đà Nẵng' },
    ],
    serviceType: [
      'Thiết kế website',
      'Lập trình website',
      'Phát triển app mobile',
      'Thiết kế UI/UX',
      'SEO',
      'Hệ thống quản trị (CRM/ERP)',
      'Tự động hoá & AI',
      'Bảo trì & nâng cấp website',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: '+84-364-234-936',
        email: 'hello@alodev.vn',
        availableLanguage: ['Vietnamese', 'English'],
        areaServed: 'VN',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: '+84-364-234-936',
        email: 'hello@alodev.vn',
        availableLanguage: ['Vietnamese'],
      },
    ],
    sameAs: [
      // Add when real social profiles exist
    ],
    priceRange: '8.000.000₫ – 200.000.000₫',
    paymentAccepted: ['Bank Transfer', 'VNPay', 'MoMo'],
    knowsAbout: [
      'Web Development', 'Mobile App Development', 'UI/UX Design', 'SEO', 'Cloud Infrastructure',
      'Next.js', 'React', 'Vue.js', 'Node.js', 'PostgreSQL', 'Cloudflare', 'AWS', 'Docker',
      'Swift', 'Kotlin', 'Flutter', 'React Native',
    ],
    knowsLanguage: ['vi', 'en'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Dịch vụ thiết kế & phát triển web/app',
      itemListElement: [
        offerItem('Thiết kế website doanh nghiệp', 8_000_000, 'Landing page, website giới thiệu công ty, blog, e-commerce — chuẩn SEO, responsive, tốc độ tải nhanh.', '/dich-vu/thiet-ke-website'),
        offerItem('Lập trình app mobile (iOS / Android)', 60_000_000, 'Native (Swift/Kotlin) hoặc cross-platform (React Native, Flutter). Push, payment, analytics tích hợp đầy đủ.', '/dich-vu/lap-trinh-app-mobile'),
        offerItem('Hệ thống quản trị (CRM / ERP)', 25_000_000, 'Dashboard, CRM, ERP, hệ thống đặt hàng — viết riêng theo nghiệp vụ thực tế của doanh nghiệp.', '/dich-vu/he-thong-quan-tri'),
        offerItem('Tự động hoá & AI', 5_000_000, 'Bot Zalo/Telegram, tích hợp ChatGPT/Claude, scraping dữ liệu, workflow tự động.', '/dich-vu#automation'),
        offerItem('Bảo trì & nâng cấp website', 1_000_000, 'Tiếp nhận website cũ, vá lỗi, tăng tốc, chuyển host, hỗ trợ kỹ thuật theo gói tháng.', '/dich-vu#maintenance'),
        offerItem('Thiết kế UI/UX', 3_000_000, 'Figma mockup, design system, prototype tương tác — bàn giao trọn gói hoặc kết hợp đội dev nội bộ.', '/dich-vu#design'),
      ],
    },
  }
}

function offerItem(name: string, priceMin: number, description: string, urlPath: string) {
  return {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name,
      description,
      provider: { '@id': ORG_ID },
      areaServed: 'VN',
      url: `${SITE_URL}${urlPath}`,
    },
    price: priceMin,
    priceCurrency: 'VND',
    priceSpecification: {
      '@type': 'PriceSpecification',
      minPrice: priceMin,
      priceCurrency: 'VND',
    },
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}${urlPath}`,
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE_URL,
    name: 'Alodev',
    inLanguage: 'vi-VN',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/du-an?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
    })),
  }
}

export function serviceSchema(input: { name: string; description: string; url?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Việt Nam' },
    ...(input.url ? { url: input.url.startsWith('http') ? input.url : `${SITE_URL}${input.url}` } : {}),
  }
}

export function faqPageSchema(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

export function itemListSchema(items: Array<{ name: string; url: string; description?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
      name: it.name,
      ...(it.description ? { description: it.description } : {}),
    })),
  }
}

export function projectSchema(p: {
  slug: string
  name: string
  domain: string
  category: string
  shortDesc: string
  longDesc?: string
  code: { stack: string[] }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.name,
    description: p.longDesc || p.shortDesc,
    url: `${SITE_URL}/du-an/${p.slug}`,
    sameAs: `https://${p.domain}`,
    creator: { '@id': ORG_ID },
    keywords: p.code.stack.join(', '),
    inLanguage: 'vi-VN',
    genre: p.category,
  }
}

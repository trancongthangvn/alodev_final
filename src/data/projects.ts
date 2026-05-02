// Single source of truth for portfolio.
// Adding a case study later? Set `caseStudy` on the project — the route
// /du-an/[slug] auto-renders it. Without one, that route shows a placeholder.

export type ProjectMetric = { label: string; value: string }

export type ProjectCaseStudySection = {
  title: string
  body: string
}

export type Project = {
  slug: string
  name: string
  domain: string
  category: string
  shortDesc: string
  longDesc?: string
  colorClass: string // tailwind gradient classes for thumbnail
  /**
   * Optional ISO-8601 dates for SEO Article schema + visible byline on
   * case study pages. When absent, the route falls back to the projects.ts
   * file mtime so crawlers always see a real date — but explicit values
   * are far better for E-E-A-T signal stability across deploys.
   */
  publishedAt?: string  // 'YYYY-MM-DD'
  updatedAt?: string    // 'YYYY-MM-DD'
  code: {
    stack: string[]
    highlights: string[]
    metrics?: ProjectMetric[]
  }
  design: {
    highlights: string[]
    metrics?: ProjectMetric[]
  }
  seo: {
    highlights: string[]
    metrics?: ProjectMetric[]
  }
  caseStudy?: {
    summary?: string
    sections: ProjectCaseStudySection[]
  }
}

export const projects: Project[] = [
  {
    slug: 'onthi365',
    name: 'OnThi365',
    domain: 'onthi365.com',
    category: 'Giáo dục · Live stream',
    shortDesc: 'Nền tảng ôn thi THPT — khoá học video, ngân hàng đề thi, đấu trường lý thuyết real-time, livestream giảng dạy đa nền tảng.',
    longDesc: 'Hệ sinh thái học trực tuyến đầy đủ: khoá học HD, ngân hàng đề thi chấm tự động, đấu trường lý thuyết PvP real-time có bảng xếp hạng XP/streak, livestream HLS đa nền tảng (YouTube + Facebook + native), mobile app Capacitor (iOS + Android).',
    colorClass: 'from-amber-50 via-orange-50 to-red-50 dark:from-amber-500/10 dark:via-orange-500/5 dark:to-red-500/10',
    code: {
      stack: ['Next.js 16', 'PostgreSQL', 'Express', 'Capacitor (iOS/Android)', 'HLS / FFmpeg', 'Redis'],
      highlights: [
        'Live restream multi-platform: 1 nguồn → 3 đích đồng thời (YouTube + FB + native)',
        'Đấu trường real-time qua WebSocket — match ngẫu nhiên, ELO, anti-cheat cơ bản',
        'PM2 cluster cho admin API, fork riêng cho live restream service (rolling deploy không gián đoạn)',
        'Static export Next.js + ISR cho trang bài viết, ngày deploy <60s',
      ],
      metrics: [
        { label: 'Concurrent users (peak)', value: '2,400' },
        { label: 'Uptime 90 ngày', value: '99.94%' },
        { label: 'API P95', value: '180ms' },
      ],
    },
    design: {
      highlights: [
        'Design system tự xây với token Tailwind v4 (không dùng UI kit bên ngoài)',
        'Dark mode có session persist — phục vụ học buổi tối',
        'Mobile-first: arena PvP tối ưu cho điện thoại, một tay cầm chơi được',
        'Animation đếm ngược kỳ thi mượt, không jitter, dùng `requestAnimationFrame`',
      ],
    },
    seo: {
      highlights: [
        'Schema.org: Course + ExamAlbum + LiveBroadcastEvent đầy đủ',
        'Sitemap.xml tự sinh tách theo loại nội dung (course, exam, post, channel)',
        'Open Graph + Twitter Card + Vietnamese-specific meta (locale vi_VN)',
        'Internal linking dày từ trang chủ → khoá → bài → đề liên quan',
      ],
      metrics: [
        { label: 'PageSpeed Insights mobile', value: '94' },
        { label: 'CLS', value: '0.02' },
        { label: 'LCP', value: '1.4s' },
      ],
    },
  },
  {
    slug: 'ganday',
    name: 'Gần Đây',
    domain: 'ganday.com.vn',
    category: 'Tin tức · Multi-site CMS',
    shortDesc: 'Mạng tin tức tổng hợp đa khu vực — đăng 1 lần, phân phối tới 4 site khác nhau (ganday, hongbienduongpho, vn247, lammmo).',
    colorClass: 'from-stone-100 via-stone-50 to-amber-50 dark:from-stone-500/10 dark:via-stone-500/5 dark:to-amber-500/10',
    code: {
      stack: ['Next.js 16', 'PostgreSQL', 'Express', 'Block-based editor'],
      highlights: [
        'CMS multi-site: 1 backend phân phối nội dung tới 4 frontend tách biệt',
        'Block-based editor tự xây — paragraph / heading / image / quote / embed',
        'Static export với generateStaticParams cho mọi bài + chuyên mục',
        'Image pipeline: upload gốc → resize 4 kích thước, lưu WebP + AVIF',
      ],
      metrics: [
        { label: 'Số site phân phối', value: '4' },
        { label: 'TTFB trung bình', value: '95ms' },
      ],
    },
    design: {
      highlights: [
        'Mỗi site có theme/logo riêng nhưng dùng chung component library',
        'Layout tin tức 3 cột truyền thống có ảnh nổi bật, tag, author',
        'Reading mode tự đếm thời gian đọc, hiện progress bar',
      ],
    },
    seo: {
      highlights: [
        'NewsArticle schema cho mọi bài viết (Google News ready)',
        'Sitemap-news.xml + sitemap-index theo Google Search Console spec',
        'AMP fallback cho mobile traffic chậm',
        'Canonical chính xác qua 4 site — không trùng lặp content',
      ],
      metrics: [
        { label: 'Index hoá GSC (28 ngày)', value: '98%' },
        { label: 'PSI mobile', value: '92' },
      ],
    },
  },
  {
    slug: 'vn247',
    name: 'VN247',
    domain: 'vn247.vn',
    category: 'Cổng thông tin · Edge',
    shortDesc: 'Cổng tin tức 24/7 — sync nội dung từ Cloudflare D1, deploy edge worldwide với Cloudflare Pages.',
    colorClass: 'from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-500/10 dark:via-amber-500/5 dark:to-yellow-500/10',
    code: {
      stack: ['Next.js 16', 'Cloudflare Pages', 'Cloudflare D1 (SQLite edge)', 'Wrangler'],
      highlights: [
        'Edge-first: deploy lên 300+ POP của Cloudflare worldwide',
        'D1 SQLite ngay tại edge — query <10ms từ mọi region',
        'Sitemap tự sinh sau mỗi build, push tới Search Console qua Indexing API',
        'Build deterministic với `generateBuildId` để cache invalidation chuẩn',
      ],
      metrics: [
        { label: 'TTFB toàn cầu', value: '< 100ms' },
        { label: 'Bandwidth/tháng', value: '~50GB' },
      ],
    },
    design: {
      highlights: [
        'Layout magazine-style — featured + grid chuyên mục',
        'Typography tối ưu đọc dài (line-height 1.7, max-width 65ch)',
        'Dark mode tự động theo system preference, override được',
      ],
    },
    seo: {
      highlights: [
        'Tự động ping Google Indexing API mỗi khi xuất bản',
        'Schema NewsArticle + BreadcrumbList + Organization',
        'Hreflang chuẩn cho phiên bản tiếng Việt',
      ],
      metrics: [
        { label: 'PSI desktop', value: '99' },
        { label: 'PSI mobile', value: '95' },
      ],
    },
  },
  {
    slug: 'lammmo',
    name: 'Lammmo',
    domain: 'lammmo.vn',
    category: 'Tools · Automation',
    shortDesc: 'Hướng dẫn kiếm tiền online + bộ công cụ Facebook (fb-tools subdomain) — quản lý fanpage, lên lịch bài, scrape comment.',
    colorClass: 'from-rose-50 via-stone-50 to-amber-50 dark:from-rose-500/10 dark:via-stone-500/5 dark:to-amber-500/10',
    code: {
      stack: ['Next.js 16', 'Facebook Graph API', 'Express', 'PostgreSQL'],
      highlights: [
        'Tích hợp Facebook Graph API quản lý nhiều page/account đồng thời',
        'Cron scheduler đăng bài tự động, retry exponential khi FB rate limit',
        'Subdomain riêng `fb-tools.lammmo.vn` cho khu công cụ — tách hẳn nginx vhost',
        'Webhook receiver xử lý event từ FB realtime',
      ],
    },
    design: {
      highlights: [
        'Tool dashboard cảm giác giống native desktop app — sidebar + workspace',
        'Form builder cho schedule post — drag drop ảnh, preview live',
      ],
    },
    seo: {
      highlights: [
        'Trang nội dung được tách hẳn khỏi tools (subdomain) → SEO không bị ảnh hưởng',
        'Long-form guide tối ưu cho keyword "kiếm tiền online", "facebook tool"',
        'Schema HowTo cho bài hướng dẫn từng bước',
      ],
    },
  },
  {
    slug: 'thitruongkinhte',
    name: 'Thị trường Kinh tế',
    domain: 'thitruongkinhte.net',
    category: 'Tin tức tài chính · Realtime',
    shortDesc: 'Tin tức tài chính, bất động sản, chứng khoán Việt Nam. Cập nhật giá vàng, tỷ giá, chỉ số VN-Index theo thời gian thực.',
    colorClass: 'from-yellow-50 via-stone-50 to-amber-50 dark:from-yellow-500/10 dark:via-stone-500/5 dark:to-amber-500/10',
    code: {
      stack: ['Next.js 16', 'PostgreSQL', 'WebSocket', 'Crawler workers'],
      highlights: [
        'Realtime ticker giá vàng/tỷ giá/chứng khoán qua WebSocket',
        'Crawler chạy nền theo cron — đa nguồn, dedupe content bằng SimHash',
        'Push notification breaking news qua Web Push API + Service Worker',
        'AMP fallback tự động cho mobile chậm',
      ],
      metrics: [
        { label: 'Latency tick → UI', value: '< 500ms' },
      ],
    },
    design: {
      highlights: [
        'Ticker dải trên cùng — luôn hiển thị các chỉ số chính',
        'Color-coded green/red đồng nhất theo direction giá',
        'Layout tin chính + sidebar tin liên quan + box quảng cáo native',
      ],
    },
    seo: {
      highlights: [
        'Schema NewsArticle + FinancialProduct cho dữ liệu giá',
        'Sitemap-news + Google News publisher đã verify',
        'Internal link dày giữa bài tin và trang chỉ số liên quan',
      ],
    },
  },
  {
    slug: 'shopaccgame',
    name: 'Shop Acc Game',
    domain: 'shopaccgame.net',
    category: 'E-commerce · Payment',
    shortDesc: 'Sàn giao dịch tài khoản game — upload, kiểm duyệt, thanh toán tự động, giao hàng số tức thì sau khi user trả tiền.',
    colorClass: 'from-stone-100 via-amber-50 to-orange-50 dark:from-stone-500/10 dark:via-amber-500/5 dark:to-orange-500/10',
    code: {
      stack: ['Vue 3', 'Pinia', 'Express', 'PostgreSQL', 'VNPAY / MoMo / Zalopay'],
      highlights: [
        'Tích hợp 3 cổng thanh toán Việt Nam (VNPAY, MoMo, Zalopay) đồng thời',
        'Anti-fraud: device fingerprint + velocity check + manual review queue',
        'Escrow flow — tiền hold cho tới khi buyer confirm nhận hàng',
        'Multi-tenant — 3 shop (shopaccgame, freefiremienphi, robloxmienphi) chung backend',
      ],
      metrics: [
        { label: 'Tỷ lệ giao dịch thành công', value: '96.8%' },
        { label: 'Số shop dùng chung backend', value: '3' },
      ],
    },
    design: {
      highlights: [
        'Card sản phẩm preview screenshot game + skin/level lớn nhất',
        'Checkout 1 trang — chọn cổng → nhập số → xác nhận',
        'Trust badges: bảo hành, hoàn tiền, escrow',
      ],
    },
    seo: {
      highlights: [
        'Schema Product + Offer + AggregateRating',
        'URL slug có game name + level (tốt cho long-tail keyword)',
        'Sitemap split: products / categories / static',
      ],
    },
  },
  {
    slug: 'hongbienduongpho',
    name: 'Hồng Biên Đường Phố',
    domain: 'hongbienduongpho.vn',
    category: 'Tin tức · Văn hoá',
    shortDesc: 'Trang tin chuyên đề về đời sống, văn hoá đường phố. Tích hợp chung CMS với Gần Đây.',
    colorClass: 'from-rose-50 via-amber-50 to-yellow-50 dark:from-rose-500/10 dark:via-amber-500/5 dark:to-yellow-500/10',
    code: {
      stack: ['Next.js 16', 'Cloudflare Pages', 'CMS chia sẻ với Gần Đây'],
      highlights: [
        'Site con trong hệ thống multi-site — share backend, theme khác',
        'Static export deploy edge với Cloudflare Pages',
      ],
    },
    design: {
      highlights: [
        'Theme hồng/violet tạo cảm giác văn hoá-lifestyle riêng',
        'Photo gallery với lazy load + lightbox tự xây',
      ],
    },
    seo: {
      highlights: [
        'Schema NewsArticle với tag chuyên đề rõ ràng',
        'Canonical chuẩn — không cạnh tranh với site mẹ Gần Đây',
      ],
    },
  },
  {
    slug: 'trancongthang',
    name: 'Trần Công Thắng',
    domain: 'trancongthang.vn',
    category: 'Personal brand · Internal tools',
    shortDesc: 'Website cá nhân + blog + công cụ nội bộ (auto, claw, datacenter, stream-au) phục vụ vận hành các site con.',
    colorClass: 'from-stone-100 via-stone-50 to-stone-100 dark:from-stone-500/10 dark:via-stone-500/5 dark:to-stone-500/10',
    code: {
      stack: ['Vue 3', 'Express', 'SQLite', 'Subdomain routing'],
      highlights: [
        '5 subdomain cho 5 tool nội bộ độc lập, share auth',
        'Internal dashboard quản lý toàn hệ thống fleet',
      ],
    },
    design: {
      highlights: [
        'Personal brand trang chủ tối giản, focus thông điệp + portfolio',
        'Internal tools UI dày, dense — ưu tiên thao tác nhanh',
      ],
    },
    seo: {
      highlights: [
        'Trang public chỉ index personal brand, tools subdomain `noindex`',
        'Schema Person cho trang chủ',
      ],
    },
  },
  {
    slug: 'datacenter',
    name: 'Datacenter (nội bộ)',
    domain: 'datacenter.trancongthang.vn',
    category: 'Hệ thống quản trị',
    shortDesc: 'Dashboard quản trị tập trung cho cả fleet — health check 11 site, explorer Postgres, planner content, upload YouTube tự động.',
    colorClass: 'from-stone-100 via-orange-50 to-amber-50 dark:from-stone-500/10 dark:via-orange-500/5 dark:to-amber-500/10',
    code: {
      stack: ['Vue 3', 'Express', 'SQLite (better-sqlite3)', 'PostgreSQL pool', 'YouTube Data API v3'],
      highlights: [
        'Connection pool tới 11 PostgreSQL database khác nhau (mỗi site 1 db)',
        'Health check toàn fleet song song — DB ping + HTTP probe',
        'YouTube uploader: upload video + metadata + thumbnail tự động qua API',
        'Cron scheduler in-process cho mọi định kỳ task',
      ],
      metrics: [
        { label: 'Site quản lý', value: '11' },
        { label: 'Database song song', value: '11' },
      ],
    },
    design: {
      highlights: [
        'Dashboard dày — sidebar collapsible, multi-pane',
        'Table với sort/filter/export inline, không cần modal',
        'Internal tool nên ưu tiên density > whitespace',
      ],
    },
    seo: {
      highlights: [
        'Tool nội bộ — toàn site `noindex, nofollow`',
        'Auth required, không expose endpoint công cộng',
      ],
    },
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

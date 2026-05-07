// Single source of truth for portfolio.
// Adding a case study later? Set `caseStudy` on the project — the route
// /du-an/[slug] auto-renders it. Without one, that route shows a placeholder.

export type ProjectMetric = { label: string; value: string }

export type ProjectCaseStudySection = {
  title: string
  body: string
}

/**
 * - live     : sản phẩm public-facing đang chạy trên domain riêng
 * - internal : công cụ nội bộ vận hành fleet (noindex, có auth)
 * - lab      : thí nghiệm / sub-tool / design study — không phải sản phẩm chính
 */
export type ProjectStatus = 'live' | 'internal' | 'lab'

export type Project = {
  slug: string
  name: string
  domain: string
  category: string
  shortDesc: string
  longDesc?: string
  colorClass: string // tailwind gradient classes for thumbnail
  status?: ProjectStatus // default 'live'
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
    slug: 'maxmin',
    name: 'MAXMIN',
    domain: 'maxmin.vn',
    category: 'SaaS · Cloud restream',
    shortDesc: 'Nền tảng restream cloud cho người livestream bán hàng — phát đồng thời lên Shopee, TikTok, Facebook từ một nguồn duy nhất, không cần PC mạnh hay OBS.',
    longDesc: 'SaaS phục vụ seller live đa nền tảng: 1 video gốc → fan-out tới 3 đích đồng thời qua FFmpeg server-side. Auto-bitrate theo đường truyền, scheduler đặt lịch phát, dashboard realtime peak viewer chart, billing 3 gói (Free / Pro / Enterprise) với invoice tự động.',
    publishedAt: '2026-03-15',
    colorClass: 'from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-500/10 dark:via-purple-500/5 dark:to-fuchsia-500/10',
    code: {
      stack: ['Vue 3', 'Pinia', 'Tailwind v4', 'Express', 'FFmpeg', 'PostgreSQL'],
      highlights: [
        'Pipeline FFmpeg server-side fan-out: 1 RTMP input → 3 đích song song, copy codec khi trùng để tiết kiệm CPU',
        'Auto-bitrate theo upstream user (probe + ABR ladder) — mạng dao động không drop frame',
        'Scheduler đặt lịch phát: worker pool + retry exponential khi nền tảng đích trả 429 / timeout',
        'Billing multi-tenant 3 gói — invoice tự động qua webhook thanh toán, dunning 3 lần trước khi suspend',
      ],
      metrics: [
        { label: 'Đích phát song song', value: '3' },
        { label: 'Service tách (PM2 fork)', value: '4' },
      ],
    },
    design: {
      highlights: [
        'Stream wizard 3 bước: kết nối kênh → chọn video → go live, từ login đến on-air ≤60 giây',
        'Dashboard realtime: timeline live, chart peak viewer (Chart.js), engagement breakdown từng nền tảng',
        'Mobile-first cho seller live tại chỗ — không cần laptop, không cần OBS, vuốt ngang giữa Shopee/TikTok/FB',
      ],
    },
    seo: {
      highlights: [
        'Schema SoftwareApplication + AggregateRating + Offer cho 3 gói pricing',
        'Pricing & blog tách bạch — tối ưu cho long-tail "restream shopee tiktok cùng lúc"',
        'Internal link dày từ blog hướng dẫn → trang pricing, schema HowTo cho từng bài',
      ],
      metrics: [
        { label: 'PSI mobile', value: '93' },
      ],
    },
  },
  {
    slug: 'vietnamid',
    name: 'VietnamID',
    domain: 'vietnamid.vn',
    category: 'Social commerce · PWA',
    shortDesc: 'Mạng xã hội thương mại cho người Việt — feed bài viết, shop của seller, đơn hàng, leaderboard điểm thưởng, chat realtime trong cùng một PWA cài được homescreen.',
    longDesc: 'Hybrid social + commerce: user vừa post nội dung kiếm điểm, vừa mua bán trong shop riêng. Hệ thống XP, leaderboard, follow/follower, wishlist, cart, order tracking, seller dashboard tách biệt với customer flow. Chạy như PWA trên iOS/Android — install homescreen, status bar override, offline-first cho feed đã cache.',
    publishedAt: '2025-12-10',
    colorClass: 'from-blue-50 via-cyan-50 to-sky-50 dark:from-blue-500/10 dark:via-cyan-500/5 dark:to-sky-500/10',
    code: {
      stack: ['Vue 3', 'Pinia', 'Vue Router', 'PWA', 'lucide-vue-next', 'Tailwind v4'],
      highlights: [
        '30+ route lazy-load, code splitting theo view — initial bundle < 80KB gz',
        'PWA install homescreen iOS/Android, manifest custom theme-color, offline-first cho feed cache',
        'Pinia store tách feed / cart / chat / leaderboard, hydrate từ localStorage có versioning để không vỡ schema khi deploy',
        'Subdomain admin + seller dashboard tách auth scope — không trộn với customer app',
      ],
    },
    design: {
      highlights: [
        'Bottom-nav mobile 5 tab giống native, gesture swipe chuyển tab',
        'Avatar generated qua DiceBear API — không cần CDN cho user-generated avatar, không tốn storage',
        'Shop UI dày: card sản phẩm có wishlist quick-add, comparison side-by-side, rating sao tổng hợp',
      ],
    },
    seo: {
      highlights: [
        'Schema Person + Product + Offer cho profile và shop',
        'Open Graph riêng từng post — share Facebook hiển thị thumbnail bài viết user',
        'Sitemap tách: users / shops / posts / topics — index từng nhóm độc lập',
      ],
    },
  },
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
    status: 'internal',
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
  // ───────────────────────── Studio Lab ─────────────────────────
  // Sub-tools, internal apps, design studies — không phải sản phẩm chính
  // nhưng minh chứng phạm vi kỹ thuật: extension, gateway, 3D, vanilla CSS.
  {
    slug: 'dabong',
    name: 'Dabong Scoreboard',
    domain: 'dabong.vn247.vn',
    category: 'Lab · OBS overlay',
    status: 'lab',
    shortDesc: 'Bảng tỷ số bóng đá tuỳ biến + overlay trong suốt cho OBS streamer — sub-domain của VN247, single-file HTML, không build pipeline.',
    colorClass: 'from-rose-50 via-red-50 to-orange-50 dark:from-rose-500/10 dark:via-red-500/5 dark:to-orange-500/10',
    code: {
      stack: ['HTML5', 'CSS', 'Vanilla JS'],
      highlights: [
        'Single-file HTML — copy lên CDN là chạy, không build step, không runtime dependency',
        'URL params điều khiển scoreboard: tên đội, tỷ số, hiệp đấu, đồng hồ — trigger được từ remote',
        'Background trong suốt sẵn cho OBS browser source, dark theme phù hợp overlay',
      ],
    },
    design: {
      highlights: [
        'Typography Barlow Condensed cho con số tỷ số — đọc rõ ở stream 1080p',
        'Gradient đỏ branding bóng đá Việt, không lệ thuộc thư viện CSS',
      ],
    },
    seo: {
      highlights: ['Tool nội bộ — noindex, nofollow'],
    },
  },
  {
    slug: 'openclaw',
    name: 'OpenClaw',
    domain: 'claw (nội bộ)',
    category: 'Lab · AI gateway',
    status: 'lab',
    shortDesc: 'Dashboard quản trị AI gateway — channels, messages, cron job, usage cost. Next.js 16 admin app phục vụ ops cho fleet.',
    colorClass: 'from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-500/10 dark:via-teal-500/5 dark:to-cyan-500/10',
    code: {
      stack: ['Next.js 16', 'TypeScript', 'Tailwind', 'Express gateway'],
      highlights: [
        'Single-pane control AI gateway: channels / messages / cron / usage / logs',
        'Auth context client + axios interceptor — gateway up/down trạng thái realtime',
        'Doctor page chạy diagnostic: ping gateway, kiểm tra cron, dump logs',
      ],
    },
    design: {
      highlights: ['Dense dashboard UI — ưu tiên density > whitespace'],
    },
    seo: {
      highlights: ['Tool nội bộ — noindex'],
    },
  },
  {
    slug: 'autofb',
    name: 'AutoFB',
    domain: 'Chrome Extension MV3',
    category: 'Lab · Browser extension',
    status: 'lab',
    shortDesc: 'Chrome extension Manifest v3 — trợ lý engagement Facebook: lập lịch task, content script + background service worker chuẩn Google.',
    colorClass: 'from-indigo-50 via-blue-50 to-sky-50 dark:from-indigo-500/10 dark:via-blue-500/5 dark:to-sky-500/10',
    code: {
      stack: ['Chrome MV3', 'Service Worker', 'Storage API', 'Alarms API'],
      highlights: [
        'Manifest v3 chuẩn Google: service worker thay background page, host_permissions tối thiểu',
        'Content script chỉ chạy ở document_idle để không block Facebook native render',
        'Storage API + Alarms API cho schedule task — không cần server backend',
      ],
    },
    design: {
      highlights: ['Popup compact 360×500, options page riêng cho config phức tạp'],
    },
    seo: {
      highlights: ['Distribution qua Chrome Web Store, không phải web SEO'],
    },
  },
  {
    slug: 'rubik-resend',
    name: 'Rubik Resend',
    domain: 'design study',
    category: 'Lab · Design study',
    status: 'lab',
    shortDesc: 'Bài tập tự code lại landing Resend với điểm nhấn khối Rubik 3D Three.js — học pipeline material PBR, glassmorphism, hero cinematics.',
    colorClass: 'from-zinc-100 via-stone-100 to-neutral-100 dark:from-zinc-500/10 dark:via-stone-500/5 dark:to-neutral-500/10',
    code: {
      stack: ['HTML5', 'CSS', 'Three.js'],
      highlights: [
        'Cube 3×3×3 tự build từ BoxGeometry, 4 material variant: glossy onyx / matte void / granite / micro-grain',
        'Sobel filter sinh normal map runtime cho granite tile — không asset đính kèm',
        'Original implementation từ quan sát hình ảnh public — không sao chép code/asset Resend',
      ],
    },
    design: {
      highlights: [
        'Phong cách tối + gradient text + glassmorphism — học từ Resend, áp dụng cho client riêng',
        'Hero cinematics: cube xoay nhẹ, lighting clearcoat khoá vào palette đen',
      ],
    },
    seo: {
      highlights: ['Study artifact — không public deployment'],
    },
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

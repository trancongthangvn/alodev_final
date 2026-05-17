// Quote calculator data - designed for non-technical users.
// Every technical term has a plain Vietnamese name + real-world example.

import type { IconName } from '@/components/Icon'

export type Feature = {
  id: string
  name: string         // plain Vietnamese, no jargon
  desc: string         // 1-line concrete example
  price: number        // VND
  required?: boolean   // base feature, can't toggle
  popular?: boolean    // badge "phổ biến"
}

export type FeatureGroup = {
  id: string
  title: string        // plain category name
  features: Feature[]
}

export type Preset = {
  id: string
  name: string
  desc: string
  icon: IconName
  features: string[]   // feature IDs to auto-toggle on
}

export type ProjectType = {
  id: 'website' | 'app' | 'system'
  name: string
  tagline: string
  icon: IconName
  example: string      // "Như shopee.vn, vinmec.com..."
  basePrice: number
  baseDesc: string
  presets: Preset[]
  groups: FeatureGroup[]
}

export const projectTypes: ProjectType[] = [
  // ═══════════════════════ WEBSITE ═══════════════════════
  {
    id: 'website',
    name: 'Website',
    tagline: 'Trang web giới thiệu, bán hàng, blog…',
    icon: 'globe',
    example: 'Như tiki.vn, vinmec.com, một website công ty bất kỳ',
    basePrice: 8_000_000,
    baseDesc: '1 trang chủ đẹp + form liên hệ + chạy được trên điện thoại + đăng ký domain',
    presets: [
      {
        id: 'business',
        name: 'Web giới thiệu công ty',
        desc: 'Trang chủ + giới thiệu + dịch vụ + tin tức + liên hệ',
        icon: 'briefcase',
        features: ['multipage', 'blog', 'newsletter', 'zalo-chat', 'seo-onpage', 'gsc', 'analytics'],
      },
      {
        id: 'ecommerce',
        name: 'Web bán hàng online',
        desc: 'Sản phẩm + giỏ hàng + thanh toán + quản lý đơn',
        icon: 'package',
        features: ['multipage', 'ecommerce', 'vnpay', 'admin-order', 'search', 'zalo-chat', 'seo-onpage', 'gsc', 'analytics'],
      },
      {
        id: 'landing',
        name: 'Landing page bán 1 sản phẩm',
        desc: '1 trang dài tập trung 1 sản phẩm/dịch vụ - chạy ads',
        icon: 'target',
        features: ['zalo-chat', 'seo-onpage', 'analytics'],
      },
      {
        id: 'blog',
        name: 'Blog / Trang tin tức',
        desc: 'Đăng bài, chuyên mục, SEO, theo dõi qua email',
        icon: 'newspaper',
        features: ['multipage', 'blog', 'newsletter', 'search', 'seo-onpage', 'cwv', 'gsc', 'analytics'],
      },
    ],
    groups: [
      {
        id: 'pages',
        title: 'Cấu trúc trang',
        features: [
          { id: 'multipage', name: 'Nhiều trang đầy đủ', desc: 'Trang chủ, Giới thiệu, Dịch vụ, Sản phẩm, Liên hệ… (5–10 trang)', price: 6_000_000, popular: true },
          { id: 'blog',      name: 'Khu vực blog/tin tức',  desc: 'Đăng bài như báo điện tử, có chuyên mục và tags', price: 4_000_000 },
          { id: 'ecommerce', name: 'Bán hàng online',        desc: 'Danh mục sản phẩm, giỏ hàng, đặt hàng - như Shopee mini', price: 12_000_000 },
        ],
      },
      {
        id: 'features',
        title: 'Tính năng thông dụng',
        features: [
          { id: 'multilang',  name: 'Đa ngôn ngữ',           desc: 'Hỗ trợ Tiếng Việt + Tiếng Anh, user chọn được', price: 3_000_000 },
          { id: 'zalo-chat',  name: 'Khung chat Zalo nổi',   desc: 'Người xem bấm để chat với bạn qua Zalo / Messenger', price: 800_000, popular: true },
          { id: 'search',     name: 'Tìm kiếm trên trang',    desc: 'Ô tìm kiếm - gõ keyword tìm bài viết, sản phẩm', price: 1_500_000 },
          { id: 'newsletter', name: 'Đăng ký nhận email',     desc: 'Khách để lại email, gửi tin tức định kỳ qua Mailchimp', price: 1_200_000 },
        ],
      },
      {
        id: 'payment',
        title: 'Thanh toán & Đơn hàng',
        features: [
          { id: 'vnpay',       name: 'Thanh toán online',     desc: 'Tích hợp VNPay, MoMo, Zalopay - khách bấm trả tiền ngay', price: 3_500_000, popular: true },
          { id: 'stripe',      name: 'Thanh toán quốc tế',    desc: 'Stripe / PayPal - nhận thẻ Visa/Master từ nước ngoài', price: 2_500_000 },
          { id: 'admin-order', name: 'Trang quản lý đơn hàng', desc: 'Bạn xem đơn mới, đổi trạng thái, in hoá đơn - như shop owner Shopee', price: 5_000_000 },
        ],
      },
      {
        id: 'ai',
        title: 'AI thông minh',
        features: [
          { id: 'chatbot',    name: 'Chatbot trả lời tự động', desc: 'AI trả lời khách 24/7 dựa trên thông tin của bạn - như chatbot ngân hàng', price: 8_000_000 },
          { id: 'ai-content', name: 'AI viết bài tự động',     desc: 'Bạn nhập keyword, AI viết blog/mô tả sản phẩm', price: 5_000_000 },
          { id: 'ai-search',  name: 'Tìm kiếm thông minh',     desc: 'Hiểu nghĩa câu hỏi, không chỉ khớp chữ - như Google', price: 6_000_000 },
        ],
      },
      {
        id: 'seo',
        title: 'SEO & Tốc độ',
        features: [
          { id: 'seo-onpage', name: 'SEO chuẩn từ ngày đầu',  desc: 'Tối ưu để Google tìm thấy, hiện cao trên kết quả search', price: 1_500_000, popular: true },
          { id: 'cwv',        name: 'Tăng tốc tải trang',       desc: 'Dưới 1 giây - quan trọng cho cả SEO lẫn trải nghiệm', price: 2_000_000 },
          { id: 'gsc',        name: 'Đăng ký Google Search Console', desc: 'Theo dõi keyword + traffic Google miễn phí', price: 500_000, popular: true },
          { id: 'analytics',  name: 'Theo dõi truy cập',         desc: 'Google Analytics - biết bao nhiêu người vào, từ đâu', price: 700_000, popular: true },
        ],
      },
      {
        id: 'mobile',
        title: 'Mobile',
        features: [
          { id: 'pwa',  name: 'Cài web như app trên điện thoại', desc: 'User bấm "Add to home screen", icon hiện như app - không cần Store', price: 2_500_000 },
          { id: 'push', name: 'Thông báo đẩy',                    desc: 'Gửi tin mới về điện thoại user - như Facebook báo có comment', price: 3_500_000 },
        ],
      },
    ],
  },

  // ═══════════════════════ APP MOBILE ═══════════════════════
  {
    id: 'app',
    name: 'App Mobile',
    tagline: 'Ứng dụng cho điện thoại iOS / Android',
    icon: 'phone',
    example: 'Như app Grab, Be, Zalo, MyVietel…',
    basePrice: 60_000_000,
    baseDesc: 'App cài được trên cả iOS + Android, có 5–7 màn hình + đăng nhập + giao file .ipa/.apk',
    presets: [
      {
        id: 'booking',
        name: 'App đặt lịch / dịch vụ',
        desc: 'Khách đặt lịch nail / spa / khám / sửa chữa qua app',
        icon: 'clock',
        features: ['ios-publish', 'android-publish', 'social-login', 'push', 'in-app-pay', 'maps', 'api', 'admin', 'crashlytics'],
      },
      {
        id: 'delivery',
        name: 'App giao hàng / đặt món',
        desc: 'Khách đặt món, shipper giao, có bản đồ tracking',
        icon: 'rocket',
        features: ['ios-publish', 'android-publish', 'otp', 'push', 'in-app-pay', 'maps', 'chat', 'api', 'admin', 'crashlytics'],
      },
      {
        id: 'shop',
        name: 'App bán hàng / e-commerce',
        desc: 'App version của shop online - sản phẩm, giỏ hàng, thanh toán',
        icon: 'package',
        features: ['ios-publish', 'android-publish', 'social-login', 'push', 'in-app-pay', 'camera', 'api', 'admin', 'cms-headless'],
      },
      {
        id: 'internal',
        name: 'App nội bộ công ty',
        desc: 'App cho nhân viên - chấm công, báo cáo, chat nội bộ',
        icon: 'briefcase',
        features: ['ios-publish', 'android-publish', 'biometric', 'push', 'chat', 'api', 'admin', 'crashlytics', 'monitoring'],
      },
    ],
    groups: [
      {
        id: 'platforms',
        title: 'Phát hành',
        features: [
          { id: 'ios-publish',     name: 'Đưa lên App Store (iPhone)',     desc: 'Tạo tài khoản Apple Dev (99 USD/năm), chuẩn bị review', price: 5_000_000, popular: true },
          { id: 'android-publish', name: 'Đưa lên Google Play (Android)',  desc: 'Tạo Play Console (25 USD 1 lần), submit review', price: 3_000_000, popular: true },
        ],
      },
      {
        id: 'auth',
        title: 'Cách user đăng nhập',
        features: [
          { id: 'social-login', name: 'Đăng nhập Google/Facebook',     desc: 'User bấm 1 nút, không cần nhập email/password', price: 5_000_000, popular: true },
          { id: 'otp',          name: 'Đăng nhập bằng SMS OTP',         desc: 'Nhập số ĐT → nhận tin nhắn mã OTP - như Grab', price: 6_000_000 },
          { id: 'biometric',    name: 'Mở khóa bằng vân tay / Face ID', desc: 'User dùng Face ID / vân tay vào app', price: 3_000_000 },
        ],
      },
      {
        id: 'features',
        title: 'Tính năng chính',
        features: [
          { id: 'push',       name: 'Gửi thông báo cho user',  desc: 'App của bạn báo "đơn hàng đã giao" qua thanh thông báo điện thoại', price: 5_000_000, popular: true },
          { id: 'in-app-pay', name: 'Thanh toán trong app',     desc: 'VNPay/MoMo/Zalopay/thẻ Visa - user trả tiền không rời app', price: 12_000_000, popular: true },
          { id: 'chat',       name: 'Nhắn tin trong app',        desc: 'User nhắn nhau hoặc nhắn admin - như chat Grab với tài xế', price: 18_000_000 },
          { id: 'maps',       name: 'Bản đồ + định vị GPS',     desc: 'Hiện map, tìm gần đây, theo dõi vị trí - như Grab/Be', price: 6_000_000 },
          { id: 'camera',     name: 'Chụp ảnh / quét QR',         desc: 'User chụp ảnh sản phẩm hoặc quét mã QR thanh toán', price: 3_000_000 },
          { id: 'offline',    name: 'Dùng được khi mất mạng',    desc: 'App vẫn hoạt động khi không có 4G, đồng bộ khi có lại mạng', price: 8_000_000 },
        ],
      },
      {
        id: 'backend',
        title: 'Hệ thống đứng sau',
        features: [
          { id: 'api',          name: 'Server riêng cho app',     desc: 'Lưu user, đơn hàng, dữ liệu - không thể thiếu cho app có database', price: 25_000_000, required: true },
          { id: 'admin',        name: 'Trang quản trị web',        desc: 'Bạn ngồi laptop quản lý app - duyệt đơn, xem báo cáo', price: 15_000_000, popular: true },
          { id: 'cms-headless', name: 'Trang đăng nội dung',       desc: 'Bạn đăng tin/khuyến mãi - hiện trong app ngay không cần code lại', price: 8_000_000 },
        ],
      },
      {
        id: 'quality',
        title: 'Chất lượng & vận hành',
        features: [
          { id: 'crashlytics', name: 'Báo lỗi tự động khi app crash', desc: 'Khi app lỗi trên điện thoại user, bạn nhận log để fix', price: 2_000_000, popular: true },
          { id: 'e2e',         name: 'Test tự động trước khi release',  desc: 'Mỗi update không sợ vỡ tính năng cũ - bot tự test', price: 8_000_000 },
          { id: 'monitoring',  name: 'Theo dõi server 24/7',            desc: 'Server chết → bot báo Telegram cho bạn lập tức', price: 3_000_000 },
        ],
      },
    ],
  },

  // ═══════════════════════ HỆ THỐNG QUẢN TRỊ ═══════════════════════
  {
    id: 'system',
    name: 'Hệ thống quản trị',
    tagline: 'Phần mềm quản lý nội bộ công ty / SaaS',
    icon: 'cpu',
    example: 'Như Misa, KiotViet, Sapo, Notion - phần mềm doanh nghiệp dùng',
    basePrice: 25_000_000,
    baseDesc: 'Đăng nhập + 5 loại dữ liệu CRUD + biểu đồ thống kê + chạy trên web',
    presets: [
      {
        id: 'crm',
        name: 'CRM - Quản lý khách hàng',
        desc: 'Lưu data khách, theo dõi liên hệ, ghi chú, deal, doanh thu',
        icon: 'handshake',
        features: ['rbac', 'reports', 'audit-log', 'notify', 'search-full', 'backup', 'monitoring'],
      },
      {
        id: 'inventory',
        name: 'Quản lý kho / bán hàng',
        desc: 'Sản phẩm, tồn kho, đơn nhập/xuất, công nợ, báo cáo',
        icon: 'package',
        features: ['rbac', 'reports', 'audit-log', 'notify', 'search-full', 'api-public', 'backup', 'monitoring'],
      },
      {
        id: 'hr',
        name: 'Hệ thống nhân sự / HR',
        desc: 'Chấm công, lương, đơn nghỉ phép, hợp đồng',
        icon: 'briefcase',
        features: ['rbac', 'sso', 'reports', 'audit-log', 'workflow', 'notify', 'backup', 'monitoring', 'docs'],
      },
      {
        id: 'saas',
        name: 'SaaS - Bán cho nhiều khách',
        desc: 'Hệ thống của bạn cho thuê, mỗi khách 1 không gian riêng',
        icon: 'cpu',
        features: ['multi-tenant', 'rbac', 'sso', 'reports', 'audit-log', 'notify', 'api-public', 'backup', 'monitoring'],
      },
    ],
    groups: [
      {
        id: 'scale',
        title: 'Quy mô sử dụng',
        features: [
          { id: 'multi-tenant', name: 'Cho nhiều công ty dùng chung',  desc: 'Hệ thống của bạn bán cho nhiều khách, mỗi khách thấy data riêng - như Shopify cho nhiều shop', price: 20_000_000 },
          { id: 'rbac',         name: 'Phân quyền nhân viên',           desc: 'Admin / Manager / Nhân viên / Khách - mỗi vai trò thấy gì làm gì khác nhau', price: 8_000_000, popular: true },
          { id: 'sso',          name: 'Đăng nhập 1 lần (Google Workspace)', desc: 'Nhân viên login Gmail công ty là vào được, không cần password riêng', price: 10_000_000 },
        ],
      },
      {
        id: 'features',
        title: 'Tính năng quan trọng',
        features: [
          { id: 'reports',     name: 'Báo cáo + xuất Excel/PDF',  desc: 'Dashboard biểu đồ, click 1 nút tải Excel báo cáo doanh thu/tồn kho', price: 6_000_000, popular: true },
          { id: 'audit-log',   name: 'Lưu lịch sử mọi thao tác',   desc: 'Ai đã sửa gì lúc mấy giờ - chống nhân viên gian lận, có proof', price: 4_000_000 },
          { id: 'workflow',    name: 'Quy trình duyệt nhiều cấp',  desc: 'Đơn xin → trưởng phòng duyệt → giám đốc duyệt → done', price: 10_000_000 },
          { id: 'notify',      name: 'Thông báo qua email + Telegram', desc: 'Có đơn mới → tin Telegram, có lỗi → email cho bạn', price: 3_000_000, popular: true },
          { id: 'search-full', name: 'Tìm kiếm thông minh',         desc: 'Gõ từ khóa tìm trong toàn bộ data - như Notion search', price: 5_000_000 },
        ],
      },
      {
        id: 'integration',
        title: 'Kết nối hệ thống khác',
        features: [
          { id: 'api-public', name: 'Cho app mobile/site khác kết nối', desc: 'Mở API REST để app/website khác lấy data', price: 8_000_000 },
          { id: 'webhooks',   name: 'Tự động chạy khi có sự kiện',     desc: 'Có đơn mới → tự động post lên Sheet, Slack, Discord', price: 3_000_000 },
          { id: 'migration',  name: 'Chuyển data từ hệ thống cũ',      desc: 'Bạn có Excel / phần mềm cũ → import sạch sang hệ thống mới', price: 15_000_000 },
          { id: 'ai-assist',  name: 'AI gợi ý hành động',               desc: 'AI tóm tắt báo cáo dài, gợi ý xử lý đơn - như ChatGPT trong hệ thống', price: 12_000_000 },
        ],
      },
      {
        id: 'quality',
        title: 'Vận hành ổn định',
        features: [
          { id: 'backup',     name: 'Sao lưu data tự động hằng ngày', desc: 'Lỡ xoá nhầm hay server cháy vẫn khôi phục được', price: 2_000_000, popular: true },
          { id: 'monitoring', name: 'Báo lỗi 24/7 qua Telegram',       desc: 'Server chậm/lỗi → tin nhắn ngay, không phải đợi user phàn nàn', price: 3_000_000, popular: true },
          { id: 'docs',       name: 'Tài liệu hướng dẫn user',          desc: 'PDF / video hướng dẫn nhân viên dùng, không cần training trực tiếp', price: 4_000_000 },
        ],
      },
    ],
  },
]

// Modifiers applied multiplicatively
export type Modifier = { id: string; label: string; desc: string; multiplier: number }

export const designTiers: Modifier[] = [
  { id: 'std',     label: 'Tiêu chuẩn',           desc: 'Dùng giao diện có sẵn, đẹp, gọn - đủ chuyên nghiệp', multiplier: 1.0 },
  { id: 'custom',  label: 'Thiết kế riêng',        desc: 'Designer Figma riêng theo brand của bạn - khác biệt thị trường', multiplier: 1.25 },
  { id: 'system',  label: 'Bộ nhận diện đầy đủ',   desc: 'Logo + bộ nhận diện + design system tái sử dụng nhiều năm', multiplier: 1.5 },
]

export const timelineModes: Modifier[] = [
  { id: 'standard', label: 'Bình thường', desc: 'Theo timeline chuẩn - Alodev có thời gian test kỹ', multiplier: 1.0 },
  { id: 'rush',     label: 'Cần gấp',     desc: 'Rút ngắn 30–50% - làm cuối tuần / tăng team', multiplier: 1.3 },
]

// Format VND, e.g. 12_500_000 -> "12.500.000 ₫"
export function formatVND(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(n)) + ' ₫'
}

export function formatVNDCompact(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace('.', ',') + ' tỷ'
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1).replace('.', ',')) + ' triệu'
  }
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ'
}

/* ════════════════════════════════════════════════════════════════
   ALGORITHM - calculate full quote bundle from selection state
   ════════════════════════════════════════════════════════════════

   Inputs:
     typeId      - 'website' | 'app' | 'system'
     selected    - Set<feature_id> of toggled features
     designId    - 'std' | 'custom' | 'system'
     timelineId  - 'standard' | 'rush'

   Outputs:
     subtotal      - base + features (raw VND sum)
     total         - subtotal × designMul × timelineMul (mid estimate)
     range         - [low, high] = total × [0.85, 1.15] (±15% scope variance)
     items         - itemized line breakdown
     weeks         - [min, max] estimated timeline
     maintenance   - monthly post-launch cost (hosting, monitoring)
     clientCosts   - recurring fees client pays directly (domain, store fees)

   Pricing logic:
     - Each feature has a flat VND price
     - basePrice is the floor that includes baseline deliverables
     - designMul scales effort proportionally (custom = 25% more design time)
     - timelineMul charges urgency (rush = 30% premium for overtime/parallelism)
     - ±15% range reflects honest scope variance (B2B reality)

   Timeline logic:
     - minWeeks per type = floor (e.g., 2 wk website, 8 wk app)
     - additional weeks = total / 12M VND (heuristic: 12M ≈ 1 dev-week)
     - rush mode shrinks output ×0.7 but ×1.3 cost
     ════════════════════════════════════════════════════════════════ */

const MIN_WEEKS: Record<ProjectType['id'], number> = {
  website: 2,
  app: 8,
  system: 6,
}

// Monthly post-launch maintenance estimate (hosting + monitoring + minor patches)
// Inside the 6-12 month warranty period: bug fixes are free. This is for ongoing
// operational cost. Client typically pays this even after warranty ends.
const MAINTENANCE_MONTHLY: Record<ProjectType['id'], number> = {
  website: 250_000,    // shared hosting + domain + Cloudflare + monitoring
  app: 600_000,        // backend server + push + crashlytics + small backend ops
  system: 900_000,     // dedicated server + backup storage + uptime + monitoring
}

export type ClientCost = {
  label: string
  amount: string   // formatted (covers USD fees too)
  frequency: 'one-time' | 'annual' | 'monthly'
  note?: string
  conditional?: string  // feature id that triggers this cost (optional)
}

// Recurring fees the CLIENT pays directly to third parties (not Alodev).
// Listed here so the buyer has the FULL true cost, not just dev fee.
export const CLIENT_COSTS: Record<ProjectType['id'], ClientCost[]> = {
  website: [
    { label: 'Tên miền .vn / .com',  amount: '350.000–800.000 ₫', frequency: 'annual', note: 'Đăng ký 1 lần / 1–10 năm tuỳ chọn' },
    { label: 'Hosting / Cloudflare',  amount: '0–500.000 ₫',       frequency: 'monthly', note: 'Cloudflare Pages free cho hầu hết site' },
    { label: 'Email business (tuỳ chọn)', amount: '30.000 ₫',     frequency: 'monthly', note: 'Google Workspace / Zoho' },
  ],
  app: [
    { label: 'Apple Developer Program', amount: '99 USD (~2.5tr ₫)', frequency: 'annual', conditional: 'ios-publish', note: 'Bắt buộc để publish iOS' },
    { label: 'Google Play Console',     amount: '25 USD (~620k ₫)',  frequency: 'one-time', conditional: 'android-publish', note: 'Phí 1 lần, account vĩnh viễn' },
    { label: 'Server VPS',              amount: '300.000–1.500.000 ₫', frequency: 'monthly', note: 'Tuỳ scale: DigitalOcean, AWS Lightsail' },
    { label: 'Push notification (FCM)', amount: 'Miễn phí',         frequency: 'monthly', note: 'Firebase Cloud Messaging' },
  ],
  system: [
    { label: 'Server / Cloud',          amount: '500.000–3.000.000 ₫', frequency: 'monthly', note: 'Tuỳ user concurrent + data size' },
    { label: 'Backup storage (S3)',     amount: '50.000–200.000 ₫',    frequency: 'monthly', note: 'S3 / Backblaze tuỳ data volume' },
    { label: 'Domain công ty',          amount: '350.000–800.000 ₫', frequency: 'annual' },
  ],
}

export type QuoteResult = {
  items: { id: string; name: string; price: number }[]
  subtotal: number
  total: number
  low: number
  high: number
  designMul: number
  timelineMul: number
  weeks: [number, number]    // [min, max] timeline in weeks
  maintenanceMonthly: number  // estimated post-launch monthly cost
  clientCosts: ClientCost[]   // filtered by selected features
}

export function calculateQuote(args: {
  typeId: ProjectType['id']
  selected: Set<string>
  designId: string
  timelineId: string
}): QuoteResult | null {
  const t = projectTypes.find((x) => x.id === args.typeId)
  if (!t) return null

  // Line items: base + every selected feature (required auto-included)
  const items: { id: string; name: string; price: number }[] = [
    { id: '_base', name: `${t.name} - gói cơ bản`, price: t.basePrice },
  ]
  for (const g of t.groups) {
    for (const f of g.features) {
      if (f.required || args.selected.has(f.id)) {
        items.push({ id: f.id, name: f.name, price: f.price })
      }
    }
  }

  const subtotal = items.reduce((s, l) => s + l.price, 0)
  const designMul = designTiers.find((d) => d.id === args.designId)?.multiplier ?? 1
  const timelineMul = timelineModes.find((m) => m.id === args.timelineId)?.multiplier ?? 1
  const total = subtotal * designMul * timelineMul

  // Timeline: minWeeks floor + scaled by total (12M VND ≈ 1 dev-week)
  const baseWeeks = MIN_WEEKS[t.id]
  const addWeeks = total / 12_000_000
  const minW = Math.max(baseWeeks, Math.round(baseWeeks + addWeeks * 0.7))
  const maxW = Math.max(minW + 2, Math.round(baseWeeks + addWeeks * 1.2))
  // Rush mode shrinks calendar 30% (more parallelism)
  const rushFactor = args.timelineId === 'rush' ? 0.7 : 1
  const weeks: [number, number] = [
    Math.max(1, Math.round(minW * rushFactor)),
    Math.max(2, Math.round(maxW * rushFactor)),
  ]

  // Filter client costs to those triggered by selection (or unconditional)
  const clientCosts = CLIENT_COSTS[t.id].filter(
    (c) => !c.conditional || args.selected.has(c.conditional)
  )

  return {
    items,
    subtotal,
    total,
    low: total * 0.85,
    high: total * 1.15,
    designMul,
    timelineMul,
    weeks,
    maintenanceMonthly: MAINTENANCE_MONTHLY[t.id],
    clientCosts,
  }
}

/* ════════════════════════════════════════════════════════════════
   STATE SERIALIZATION - URL-shareable quote
   ════════════════════════════════════════════════════════════════
   Encodes selection state to compact URL params:
     ?t=website&p=ecommerce&f=multipage,vnpay,seo-onpage&d=custom&u=standard

   Allows: bookmark, share via Zalo/email, revisit later.
   ════════════════════════════════════════════════════════════════ */

export type SerializedQuote = {
  t: ProjectType['id']
  p?: string             // preset id (optional)
  f: string[]            // feature ids
  d: string              // design id
  u: string              // timeline id (u = "urgency")
}

export function serializeQuote(state: SerializedQuote): URLSearchParams {
  const p = new URLSearchParams()
  p.set('t', state.t)
  if (state.p) p.set('p', state.p)
  if (state.f.length) p.set('f', state.f.join(','))
  if (state.d !== 'std') p.set('d', state.d)
  if (state.u !== 'standard') p.set('u', state.u)
  return p
}

export function deserializeQuote(params: URLSearchParams): SerializedQuote | null {
  const t = params.get('t') as ProjectType['id'] | null
  if (!t || !projectTypes.find((x) => x.id === t)) return null
  return {
    t,
    p: params.get('p') ?? undefined,
    f: (params.get('f') ?? '').split(',').filter(Boolean),
    d: params.get('d') ?? 'std',
    u: params.get('u') ?? 'standard',
  }
}

/* ════════════════════════════════════════════════════════════════
   SUMMARY GENERATION - human-readable text for clipboard / Zalo
   ════════════════════════════════════════════════════════════════ */

export function buildQuoteSummary(args: {
  typeId: ProjectType['id']
  presetId: string | null
  selected: Set<string>
  designId: string
  timelineId: string
  quote: QuoteResult
}): string {
  const t = projectTypes.find((x) => x.id === args.typeId)
  if (!t) return ''
  const lines: string[] = []
  lines.push(`━━━ BÁO GIÁ ${t.name.toUpperCase()} - Alodev Studio ━━━`)
  lines.push('')
  if (args.presetId && args.presetId !== '_blank') {
    const p = t.presets.find((x) => x.id === args.presetId)
    if (p) lines.push(`Loại: ${p.name}`)
  }
  lines.push('')
  lines.push('TÍNH NĂNG ĐÃ CHỌN:')
  lines.push(`  • Gói cơ bản - ${formatVNDCompact(t.basePrice)}`)
  for (const g of t.groups) {
    for (const f of g.features) {
      if (args.selected.has(f.id) && !f.required) {
        lines.push(`  • ${f.name} - +${formatVNDCompact(f.price)}`)
      }
    }
  }
  const dt = designTiers.find((d) => d.id === args.designId)
  const tm = timelineModes.find((m) => m.id === args.timelineId)
  lines.push('')
  if (dt && dt.multiplier !== 1) lines.push(`Thiết kế: ${dt.label} (×${dt.multiplier})`)
  if (tm && tm.multiplier !== 1) lines.push(`Tiến độ: ${tm.label} (×${tm.multiplier})`)
  lines.push('')
  lines.push(`💰 ƯỚC TÍNH: ${formatVND(args.quote.low)} - ${formatVND(args.quote.high)}`)
  lines.push(`⏱️  TIMELINE: ${args.quote.weeks[0]}–${args.quote.weeks[1]} tuần`)
  lines.push(`🔧 BẢO TRÌ: ~${formatVNDCompact(args.quote.maintenanceMonthly)}/tháng (sau bảo hành)`)
  lines.push('')
  lines.push('Báo giá chính thức ±15% sau khi xác nhận scope chi tiết.')
  lines.push('Liên hệ: 0364 234 936 · hello@alodev.vn')
  return lines.join('\n')
}

export function pickBudgetBucket(total: number): string {
  if (total < 10_000_000) return '< 10 triệu'
  if (total < 30_000_000) return '10–30 triệu'
  if (total < 80_000_000) return '30–80 triệu'
  if (total < 200_000_000) return '80–200 triệu'
  return '> 200 triệu'
}

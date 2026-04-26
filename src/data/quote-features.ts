// Quote calculator data — designed for non-technical users.
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
        desc: '1 trang dài tập trung 1 sản phẩm/dịch vụ — chạy ads',
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
          { id: 'ecommerce', name: 'Bán hàng online',        desc: 'Danh mục sản phẩm, giỏ hàng, đặt hàng — như Shopee mini', price: 12_000_000 },
        ],
      },
      {
        id: 'features',
        title: 'Tính năng thông dụng',
        features: [
          { id: 'multilang',  name: 'Đa ngôn ngữ',           desc: 'Hỗ trợ Tiếng Việt + Tiếng Anh, user chọn được', price: 3_000_000 },
          { id: 'zalo-chat',  name: 'Khung chat Zalo nổi',   desc: 'Người xem bấm để chat với bạn qua Zalo / Messenger', price: 800_000, popular: true },
          { id: 'search',     name: 'Tìm kiếm trên trang',    desc: 'Ô tìm kiếm — gõ keyword tìm bài viết, sản phẩm', price: 1_500_000 },
          { id: 'newsletter', name: 'Đăng ký nhận email',     desc: 'Khách để lại email, gửi tin tức định kỳ qua Mailchimp', price: 1_200_000 },
        ],
      },
      {
        id: 'payment',
        title: 'Thanh toán & Đơn hàng',
        features: [
          { id: 'vnpay',       name: 'Thanh toán online',     desc: 'Tích hợp VNPay, MoMo, Zalopay — khách bấm trả tiền ngay', price: 3_500_000, popular: true },
          { id: 'stripe',      name: 'Thanh toán quốc tế',    desc: 'Stripe / PayPal — nhận thẻ Visa/Master từ nước ngoài', price: 2_500_000 },
          { id: 'admin-order', name: 'Trang quản lý đơn hàng', desc: 'Bạn xem đơn mới, đổi trạng thái, in hoá đơn — như shop owner Shopee', price: 5_000_000 },
        ],
      },
      {
        id: 'ai',
        title: 'AI thông minh',
        features: [
          { id: 'chatbot',    name: 'Chatbot trả lời tự động', desc: 'AI trả lời khách 24/7 dựa trên thông tin của bạn — như chatbot ngân hàng', price: 8_000_000 },
          { id: 'ai-content', name: 'AI viết bài tự động',     desc: 'Bạn nhập keyword, AI viết blog/mô tả sản phẩm', price: 5_000_000 },
          { id: 'ai-search',  name: 'Tìm kiếm thông minh',     desc: 'Hiểu nghĩa câu hỏi, không chỉ khớp chữ — như Google', price: 6_000_000 },
        ],
      },
      {
        id: 'seo',
        title: 'SEO & Tốc độ',
        features: [
          { id: 'seo-onpage', name: 'SEO chuẩn từ ngày đầu',  desc: 'Tối ưu để Google tìm thấy, hiện cao trên kết quả search', price: 1_500_000, popular: true },
          { id: 'cwv',        name: 'Tăng tốc tải trang',       desc: 'Dưới 1 giây — quan trọng cho cả SEO lẫn trải nghiệm', price: 2_000_000 },
          { id: 'gsc',        name: 'Đăng ký Google Search Console', desc: 'Theo dõi keyword + traffic Google miễn phí', price: 500_000, popular: true },
          { id: 'analytics',  name: 'Theo dõi truy cập',         desc: 'Google Analytics — biết bao nhiêu người vào, từ đâu', price: 700_000, popular: true },
        ],
      },
      {
        id: 'mobile',
        title: 'Mobile',
        features: [
          { id: 'pwa',  name: 'Cài web như app trên điện thoại', desc: 'User bấm "Add to home screen", icon hiện như app — không cần Store', price: 2_500_000 },
          { id: 'push', name: 'Thông báo đẩy',                    desc: 'Gửi tin mới về điện thoại user — như Facebook báo có comment', price: 3_500_000 },
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
        desc: 'App version của shop online — sản phẩm, giỏ hàng, thanh toán',
        icon: 'package',
        features: ['ios-publish', 'android-publish', 'social-login', 'push', 'in-app-pay', 'camera', 'api', 'admin', 'cms-headless'],
      },
      {
        id: 'internal',
        name: 'App nội bộ công ty',
        desc: 'App cho nhân viên — chấm công, báo cáo, chat nội bộ',
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
          { id: 'otp',          name: 'Đăng nhập bằng SMS OTP',         desc: 'Nhập số ĐT → nhận tin nhắn mã OTP — như Grab', price: 6_000_000 },
          { id: 'biometric',    name: 'Mở khóa bằng vân tay / Face ID', desc: 'User dùng Face ID / vân tay vào app', price: 3_000_000 },
        ],
      },
      {
        id: 'features',
        title: 'Tính năng chính',
        features: [
          { id: 'push',       name: 'Gửi thông báo cho user',  desc: 'App của bạn báo "đơn hàng đã giao" qua thanh thông báo điện thoại', price: 5_000_000, popular: true },
          { id: 'in-app-pay', name: 'Thanh toán trong app',     desc: 'VNPay/MoMo/Zalopay/thẻ Visa — user trả tiền không rời app', price: 12_000_000, popular: true },
          { id: 'chat',       name: 'Nhắn tin trong app',        desc: 'User nhắn nhau hoặc nhắn admin — như chat Grab với tài xế', price: 18_000_000 },
          { id: 'maps',       name: 'Bản đồ + định vị GPS',     desc: 'Hiện map, tìm gần đây, theo dõi vị trí — như Grab/Be', price: 6_000_000 },
          { id: 'camera',     name: 'Chụp ảnh / quét QR',         desc: 'User chụp ảnh sản phẩm hoặc quét mã QR thanh toán', price: 3_000_000 },
          { id: 'offline',    name: 'Dùng được khi mất mạng',    desc: 'App vẫn hoạt động khi không có 4G, đồng bộ khi có lại mạng', price: 8_000_000 },
        ],
      },
      {
        id: 'backend',
        title: 'Hệ thống đứng sau',
        features: [
          { id: 'api',          name: 'Server riêng cho app',     desc: 'Lưu user, đơn hàng, dữ liệu — không thể thiếu cho app có database', price: 25_000_000, required: true },
          { id: 'admin',        name: 'Trang quản trị web',        desc: 'Bạn ngồi laptop quản lý app — duyệt đơn, xem báo cáo', price: 15_000_000, popular: true },
          { id: 'cms-headless', name: 'Trang đăng nội dung',       desc: 'Bạn đăng tin/khuyến mãi — hiện trong app ngay không cần code lại', price: 8_000_000 },
        ],
      },
      {
        id: 'quality',
        title: 'Chất lượng & vận hành',
        features: [
          { id: 'crashlytics', name: 'Báo lỗi tự động khi app crash', desc: 'Khi app lỗi trên điện thoại user, bạn nhận log để fix', price: 2_000_000, popular: true },
          { id: 'e2e',         name: 'Test tự động trước khi release',  desc: 'Mỗi update không sợ vỡ tính năng cũ — bot tự test', price: 8_000_000 },
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
    example: 'Như Misa, KiotViet, Sapo, Notion — phần mềm doanh nghiệp dùng',
    basePrice: 25_000_000,
    baseDesc: 'Đăng nhập + 5 loại dữ liệu CRUD + biểu đồ thống kê + chạy trên web',
    presets: [
      {
        id: 'crm',
        name: 'CRM — Quản lý khách hàng',
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
        name: 'SaaS — Bán cho nhiều khách',
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
          { id: 'multi-tenant', name: 'Cho nhiều công ty dùng chung',  desc: 'Hệ thống của bạn bán cho nhiều khách, mỗi khách thấy data riêng — như Shopify cho nhiều shop', price: 20_000_000 },
          { id: 'rbac',         name: 'Phân quyền nhân viên',           desc: 'Admin / Manager / Nhân viên / Khách — mỗi vai trò thấy gì làm gì khác nhau', price: 8_000_000, popular: true },
          { id: 'sso',          name: 'Đăng nhập 1 lần (Google Workspace)', desc: 'Nhân viên login Gmail công ty là vào được, không cần password riêng', price: 10_000_000 },
        ],
      },
      {
        id: 'features',
        title: 'Tính năng quan trọng',
        features: [
          { id: 'reports',     name: 'Báo cáo + xuất Excel/PDF',  desc: 'Dashboard biểu đồ, click 1 nút tải Excel báo cáo doanh thu/tồn kho', price: 6_000_000, popular: true },
          { id: 'audit-log',   name: 'Lưu lịch sử mọi thao tác',   desc: 'Ai đã sửa gì lúc mấy giờ — chống nhân viên gian lận, có proof', price: 4_000_000 },
          { id: 'workflow',    name: 'Quy trình duyệt nhiều cấp',  desc: 'Đơn xin → trưởng phòng duyệt → giám đốc duyệt → done', price: 10_000_000 },
          { id: 'notify',      name: 'Thông báo qua email + Telegram', desc: 'Có đơn mới → tin Telegram, có lỗi → email cho bạn', price: 3_000_000, popular: true },
          { id: 'search-full', name: 'Tìm kiếm thông minh',         desc: 'Gõ từ khóa tìm trong toàn bộ data — như Notion search', price: 5_000_000 },
        ],
      },
      {
        id: 'integration',
        title: 'Kết nối hệ thống khác',
        features: [
          { id: 'api-public', name: 'Cho app mobile/site khác kết nối', desc: 'Mở API REST để app/website khác lấy data', price: 8_000_000 },
          { id: 'webhooks',   name: 'Tự động chạy khi có sự kiện',     desc: 'Có đơn mới → tự động post lên Sheet, Slack, Discord', price: 3_000_000 },
          { id: 'migration',  name: 'Chuyển data từ hệ thống cũ',      desc: 'Bạn có Excel / phần mềm cũ → import sạch sang hệ thống mới', price: 15_000_000 },
          { id: 'ai-assist',  name: 'AI gợi ý hành động',               desc: 'AI tóm tắt báo cáo dài, gợi ý xử lý đơn — như ChatGPT trong hệ thống', price: 12_000_000 },
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
  { id: 'std',     label: 'Tiêu chuẩn',           desc: 'Dùng giao diện có sẵn, đẹp, gọn — đủ chuyên nghiệp', multiplier: 1.0 },
  { id: 'custom',  label: 'Thiết kế riêng',        desc: 'Designer Figma riêng theo brand của bạn — khác biệt thị trường', multiplier: 1.25 },
  { id: 'system',  label: 'Bộ nhận diện đầy đủ',   desc: 'Logo + bộ nhận diện + design system tái sử dụng nhiều năm', multiplier: 1.5 },
]

export const timelineModes: Modifier[] = [
  { id: 'standard', label: 'Bình thường', desc: 'Theo timeline chuẩn — Alodev có thời gian test kỹ', multiplier: 1.0 },
  { id: 'rush',     label: 'Cần gấp',     desc: 'Rút ngắn 30–50% — làm cuối tuần / tăng team', multiplier: 1.3 },
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

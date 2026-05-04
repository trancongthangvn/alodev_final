import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"
import LayoutShell from "@/components/layout/LayoutShell"
import JsonLd from "@/components/JsonLd"
import Analytics from "@/components/Analytics"
import AnalyticsBeacon from "@/components/AnalyticsBeacon"
import { organizationSchema, websiteSchema } from "@/lib/schema"

// SVN-Gilroy — bản Vietnamese-extended của Gilroy (đã subset xuống latin + vietnamese,
// đủ tổ hợp dấu ế/ử/ợ/ặ/ờ/ẫ...). 4 file × ~20KB.
// Source: github.com/trancongthangvn/font-svn-giroy
// Split-preload: Regular (body) + Bold (heading hero) preload với priority cao
// vì xuất hiện above-the-fold. Medium + SemiBold KHÔNG preload — browser tự
// fetch khi gặp text cần weight đó. Tiết kiệm ~40KB priority bandwidth trên
// mobile (LCP win).
//
// Phải gọi localFont() 2 lần vì option `preload` áp dụng cho cả call,
// không thể set per-src. Cả 2 cùng map vào --font-sans variable → CSS không
// đổi, hệ font-family `font-sans` vẫn hoạt động bình thường.
const sansFontPreload = localFont({
  src: [
    { path: "./fonts/SVN-Gilroy-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/SVN-Gilroy-Bold.woff2",    weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
})

// Medium + SemiBold: same family, no preload. Khi CSS yêu cầu font-weight 500/600,
// browser fetch on-demand từ /_next/static/media/. Không block LCP.
const sansFontLazy = localFont({
  src: [
    { path: "./fonts/SVN-Gilroy-Medium.woff2",   weight: "500", style: "normal" },
    { path: "./fonts/SVN-Gilroy-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans-extra",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alodev.vn"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Alodev",
  title: {
    default: "Alodev — Studio thiết kế & phát triển Web/App",
    template: "%s — Alodev",
  },
  // 154 chars — fits Google SERP cap (~160), keeps three primary services + USP.
  description: "Founder-led studio thiết kế website, lập trình app mobile, xây dựng hệ thống CRM/ERP cho doanh nghiệp Việt. 11+ sản phẩm đang vận hành — source code thuộc về bạn.",
  keywords: [
    "thiết kế website", "lập trình website", "thiết kế web doanh nghiệp",
    "lập trình app mobile", "lập trình app ios android", "thiết kế app",
    "lập trình crm", "lập trình erp", "hệ thống quản trị doanh nghiệp",
    "studio web app", "agency hà nội", "founder-led studio việt nam",
    "next.js vietnam", "react việt nam",
  ],
  authors: [{ name: "Trần Công Thắng", url: `${siteUrl}/ve-chung-toi#founder` }],
  creator: "Alodev",
  publisher: "Alodev",
  category: "Web design and development",
  formatDetection: {
    // Stop iOS Safari auto-linking strings that look like phone numbers /
    // email / dates — they get wrapped in <a> with default link styles, which
    // breaks brand-styled CTAs and inline copy that mentions "0364 234 936".
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "Alodev",
    title: "Alodev — Studio thiết kế & phát triển Web/App",
    description: "Founder-led studio chuyên thiết kế & phát triển website, app mobile, hệ thống quản trị. 11+ sản phẩm đang vận hành.",
    // Next 16 quirk: openGraph.images with object form ({url, width, height})
    // silently fails to emit <meta property="og:image"/> in some build configs
    // (verified locally — twitter.images with string form worked, og did not).
    // Using mixed format below: string for the URL emission + width/height
    // metadata in a separate string entry. Simplest reliable shape is just
    // the string URL — Facebook/LinkedIn/Slack only need the URL anyway,
    // they probe the image dimensions themselves.
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alodev — Studio thiết kế & phát triển Web/App",
    description: "Founder-led studio chuyên thiết kế & phát triển website, app mobile, hệ thống quản trị.",
    images: ["/og.png"],
  },
  // canonical is set per-page; root only provides metadataBase so relative URLs resolve.
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  // theme-color is now in the dedicated `viewport` export below — Next 16
  // moved it out of metadata for proper Lighthouse PWA detection.
  // (verification stays below — themeColor handled in viewport export)
  verification: {
    // Đặt giá trị thật khi nhận được từ GSC / Bing Webmaster.
    // Lý tưởng nhất là verify qua DNS TXT (đã set trong Cloudflare) thay vì meta tag.
    // Meta tag chỉ là backup nếu DNS lag hoặc verification fail.
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION } : {}),
      ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ? { 'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_VERIFICATION } : {}),
    },
  },
}

/**
 * Mobile-first viewport + theme color.
 * The two themeColor entries match the body bg of each scheme so the iOS
 * Safari status bar (and Android Chrome top bar) blends seamlessly with
 * the page instead of showing the default white/grey strip on dark theme.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f7f9' }, // cream-50 hero bg
    { media: '(prefers-color-scheme: dark)',  color: '#07080c' }, // hero-resend bg dark
  ],
  width: 'device-width',
  initialScale: 1,
  // iOS notch / home-indicator: the safe-area inset variables below in
  // globals.css depend on this being declared.
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // No className on <html> — when React's expected className differs from
    // what the inline theme script wrote (e.g. 'dark' added by script vs
    // empty in JSX), React hydration RESETS html.classList, stripping our
    // 'dark' class. suppressHydrationWarning only silences the warning,
    // not the reconciliation. Moving the font variable + base utilities
    // to <body> (which IS rendered with className from JSX) keeps React
    // happy AND lets the inline script own html.classList for theme.
    <html lang="vi" suppressHydrationWarning>
      {/* Resource hints — Plausible đã loại bỏ (không dùng trong code).
          GA gtag.js bây giờ load lazyOnload (sau window load), nên KHÔNG cần
          preload/preconnect early. dns-prefetch đủ rẻ (~1 lookup) để tận dụng
          khi gtag finally fire. */}
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* og:image is now per-route via opengraph-image.tsx files (next/og
            ImageResponse). Each route emits its own dynamic 1200×630 PNG with
            the page-specific title rendered in Be Vietnam Pro (full VN
            diacritic coverage). The static /og.png remains the layout-level
            fallback for routes that don't declare their own opengraph-image
            (e.g. /lien-he, /bao-gia — low share-traffic surfaces). */}

        {/* Apply theme before paint to prevent FOUC.

            Three-layer system:
            1. Version-based migration (alodev-theme-ver). Bumping THEME_VER
               forces a one-time wipe of ALL theme keys for every user on
               next visit. Used here to clear values left over from earlier
               testing where ThemeToggle was triggered programmatically —
               those values look identical to real user toggles, so the only
               way to clear them is a forced migration.
            2. Two-key contract: alodev-theme-v2 + alodev-theme-explicit.
               The explicit flag is set ONLY by a real ThemeToggle UI click.
               Without it, any v2 value is treated as stale and cleaned.
            3. Time-based default: dark 18:00–06:00, else light.

            Future-proof: any DevTools / extension / scripting that writes
            v2 alone (no explicit) gets auto-cleaned. Real user toggles
            persist forever. Bumping THEME_VER again resets everyone. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var V='3';if(localStorage.getItem('alodev-theme-ver')!==V){localStorage.removeItem('alodev-theme');localStorage.removeItem('alodev-theme-day');localStorage.removeItem('alodev-theme-v2');localStorage.removeItem('alodev-theme-explicit');localStorage.setItem('alodev-theme-ver',V);}var t=localStorage.getItem('alodev-theme-v2');var x=localStorage.getItem('alodev-theme-explicit');var d;if((t==='dark'||t==='light')&&x==='1'){d=(t==='dark');}else{if(t!==null)localStorage.removeItem('alodev-theme-v2');if(x!==null)localStorage.removeItem('alodev-theme-explicit');var h=new Date().getHours();d=(h>=18||h<6);}document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${sansFontPreload.variable} ${sansFontLazy.variable} h-full antialiased min-h-full flex flex-col bg-white text-gray-900 dark:bg-ink-950 dark:text-ink-200 font-sans transition-colors`}>
        {/* Skip-to-content for keyboard users — visually hidden until focus
            lands on it. Lets screen readers / keyboard navigators jump past
            the navbar in a single tab. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-ink-900 focus:text-white focus:dark:bg-white focus:dark:text-ink-900 focus:font-semibold focus:shadow-lg focus:outline-none"
        >
          Bỏ qua đến nội dung chính
        </a>
        <LayoutShell>{children}</LayoutShell>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Analytics />
        <AnalyticsBeacon />
      </body>
    </html>
  )
}

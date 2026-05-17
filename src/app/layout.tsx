import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"
import LayoutShell from "@/components/layout/LayoutShell"
import JsonLd from "@/components/JsonLd"
import Analytics from "@/components/Analytics"
import AnalyticsBeacon from "@/components/AnalyticsBeacon"
import { organizationSchema, websiteSchema } from "@/lib/schema"

// SVN-Gilroy - Vietnamese-extended Gilroy, converted from OTF (full set, không subset).
// Source: github.com/trancongthangvn/font-svn-gilroy - 7 weights × ~43KB/file.
//
// Split-preload pattern (Next.js localFont chỉ cho preload per-call):
//   Preload:  400 Regular + 700 Bold - xuất hiện above-the-fold → priority fetch.
//   On-demand: 500/600/800/900 + italic - browser fetch khi CSS yêu cầu weight đó.
//
// Cả 3 call map vào --font-sans → Tailwind `font-sans` dùng 1 family duy nhất.
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

// Mid weights - on-demand, không block LCP.
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

// Heavy + Black + Bold Italic - display weights, on-demand.
const sansFontDisplay = localFont({
  src: [
    { path: "./fonts/SVN-Gilroy-Heavy.woff2",      weight: "800", style: "normal" },
    { path: "./fonts/SVN-Gilroy-Black.woff2",      weight: "900", style: "normal" },
    { path: "./fonts/SVN-Gilroy-Bold-Italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-sans-display",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alodev.vn"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Alodev",
  title: {
    default: "Alodev - Studio thiết kế & phát triển Web/App",
    template: "%s - Alodev",
  },
  // 154 chars - fits Google SERP cap (~160), keeps three primary services + USP.
  description: "Founder-led studio thiết kế website, lập trình app mobile, xây dựng hệ thống CRM/ERP cho doanh nghiệp Việt. 11+ sản phẩm đang vận hành - source code thuộc về bạn.",
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
    // email / dates - they get wrapped in <a> with default link styles, which
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
    title: "Alodev - Studio thiết kế & phát triển Web/App",
    description: "Founder-led studio chuyên thiết kế & phát triển website, app mobile, hệ thống quản trị. 11+ sản phẩm đang vận hành.",
    // Next 16 quirk: openGraph.images with object form ({url, width, height})
    // silently fails to emit <meta property="og:image"/> in some build configs
    // (verified locally - twitter.images with string form worked, og did not).
    // Using mixed format below: string for the URL emission + width/height
    // metadata in a separate string entry. Simplest reliable shape is just
    // the string URL - Facebook/LinkedIn/Slack only need the URL anyway,
    // they probe the image dimensions themselves.
    // Points to the dynamic /opengraph-image route (Cloudflare Pages
    // Function intercepts and serves light or dark variant by ICT time:
    // day → light cream Studio Plate, night → dark ink variant). Per-
    // route opengraph-image.tsx files were removed - every page on
    // alodev.vn inherits this single time-aware OG.
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alodev - Studio thiết kế & phát triển Web/App",
    description: "Founder-led studio chuyên thiết kế & phát triển website, app mobile, hệ thống quản trị.",
    images: ["/opengraph-image"],
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
  // theme-color is now in the dedicated `viewport` export below - Next 16
  // moved it out of metadata for proper Lighthouse PWA detection.
  // (verification stays below - themeColor handled in viewport export)
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
    // Font variable classes MUST be on <html> (= :root) so that
    // --default-font-family in @theme can reference var(--font-sans) at the
    // :root level. CSS custom properties only cascade DOWN - if --font-sans
    // were only on <body>, :root's --default-font-family var() would be
    // undefined and Tailwind's preflight would fall back to ui-sans-serif.
    //
    // Theme safety: the inline script uses setAttribute('data-theme', ...)
    // only - no classList ops on <html>. React's suppressHydrationWarning
    // suppresses the data-theme mismatch. The font variable className comes
    // from JSX on both server and client, so no hydration conflict.
    <html lang="vi"
      className={`${sansFontPreload.variable} ${sansFontLazy.variable} ${sansFontDisplay.variable}`}
      suppressHydrationWarning>
      {/* Resource hints - Plausible đã loại bỏ (không dùng trong code).
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
            (e.g. /lien-he, /bao-gia - low share-traffic surfaces). */}

        {/* Apply theme before paint to prevent FOUC.

            Three-layer system:
            1. Version-based migration (alodev-theme-ver). Bumping THEME_VER
               forces a one-time wipe of ALL theme keys for every user on
               next visit. Used here to clear values left over from earlier
               testing where ThemeToggle was triggered programmatically -
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
      <body className={`${sansFontPreload.variable} ${sansFontLazy.variable} ${sansFontDisplay.variable} h-full antialiased min-h-full flex flex-col bg-white text-gray-900 dark:bg-ink-950 dark:text-ink-200 font-sans transition-colors`}>
        {/* Skip-to-content for keyboard users - visually hidden until focus
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

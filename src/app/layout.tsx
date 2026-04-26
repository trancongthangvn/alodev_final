import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import LayoutShell from "@/components/layout/LayoutShell"
import JsonLd from "@/components/JsonLd"
import Analytics from "@/components/Analytics"
import { organizationSchema, websiteSchema } from "@/lib/schema"

// SVN-Gilroy — bản Vietnamese-extended của Gilroy (đã subset xuống latin + vietnamese,
// đủ tổ hợp dấu ế/ử/ợ/ặ/ờ/ẫ...). 4 file × ~20KB.
// Source: github.com/trancongthangvn/font-svn-giroy
const sansFont = localFont({
  src: [
    { path: "./fonts/SVN-Gilroy-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/SVN-Gilroy-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/SVN-Gilroy-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/SVN-Gilroy-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alodev.vn"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alodev — Studio thiết kế & phát triển Web/App",
    template: "%s — Alodev",
  },
  description: "Founder-led studio chuyên thiết kế & phát triển website, app mobile, hệ thống quản trị cho doanh nghiệp Việt. 11+ sản phẩm vận hành thật, source code thuộc về bạn.",
  keywords: ["thiết kế website", "lập trình app", "phát triển web", "agency hà nội", "next.js việt nam", "studio web app"],
  authors: [{ name: "Alodev" }],
  creator: "Alodev",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "Alodev",
    title: "Alodev — Studio thiết kế & phát triển Web/App",
    description: "Founder-led studio chuyên thiết kế & phát triển website, app mobile, hệ thống quản trị. 11+ sản phẩm vận hành thật.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Alodev — Studio Web/App" }],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${sansFont.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Apply theme before paint to prevent FOUC.
            Two-key system:
              alodev-theme-v2       → 'dark' | 'light'
              alodev-theme-explicit → '1' iff written by ThemeToggle UI click
            Logic:
              1. Both keys set + explicit='1' → real user toggle, respect forever
              2. Otherwise → time-based default (dark 18:00–06:00 local, else light)
                 AND auto-clean any orphan v2 value (could be from DevTools,
                 stale testing, browser extension, prior session before this
                 contract). This is what makes the fix "triệt để" — we no
                 longer trust v2 alone as proof of user intent.
            Also migrate old 'alodev-theme' (v1) keys for backward compat. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('alodev-theme')!==null){localStorage.removeItem('alodev-theme');localStorage.removeItem('alodev-theme-day');}var t=localStorage.getItem('alodev-theme-v2');var x=localStorage.getItem('alodev-theme-explicit');var d;if((t==='dark'||t==='light')&&x==='1'){d=(t==='dark');}else{if(t!==null)localStorage.removeItem('alodev-theme-v2');if(x!==null)localStorage.removeItem('alodev-theme-explicit');var h=new Date().getHours();d=(h>=18||h<6);}if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900 dark:bg-ink-950 dark:text-ink-200 font-sans transition-colors">
        <LayoutShell>{children}</LayoutShell>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Analytics />
      </body>
    </html>
  )
}

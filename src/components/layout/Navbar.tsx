'use client'

/**
 * Navbar - Studio masthead, không phải SaaS header.
 *
 * Anti-AI-vibe moves:
 *  · Logo cluster = SVG mark + wordmark + "Studio · Hà Nội" meta line.
 *    Real studios (Pentagram, Field, Brave) đều dùng cluster có địa danh,
 *    không phải logo trơn theo template Linear/Vercel.
 *  · Bỏ backdrop-blur - backdrop-blur trên sticky header = signature SaaS
 *    2023-2025. Thay bằng solid bg + hairline border, đọc như giấy in báo.
 *  · Status pill "● Đang nhận dự án" - human presence indicator. Một
 *    studio thật sẽ cho biết có đang nhận việc không.
 *  · Bỏ ⌘K command palette khỏi navbar - rất SaaS pattern.
 *    Feature vẫn available qua bàn phím nếu cần (CommandPalette mount global).
 *  · Nav link nhỏ hơn (text-[13px]), tracking âm nhẹ - editorial feel.
 *  · Số điện thoại visible trên desktop xl+ - local studio signal.
 */

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import QuoteCTA from '@/components/QuoteCTA'

const navLinks = [
  { href: '/dich-vu', label: 'Dịch vụ' },
  { href: '/quy-trinh', label: 'Quy trình' },
  { href: '/du-an', label: 'Dự án' },
  { href: '/blog', label: 'Bài viết' },
  { href: '/ve-chung-toi', label: 'Về chúng tôi' },
  { href: '/lien-he', label: 'Liên hệ' },
]

/* ── Logo SVG inline - official Alodev mark
   Source: /public/brand/logo-symbol.svg
   Inline để control size + tránh extra request.       */
function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size * (71.76 / 87.26)}
      height={size}
      viewBox="0 0 71.76 87.26"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="nav-lg-1" x1="29.22" y1="14.37" x2="20.62" y2="5.5" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#83cbf7" /><stop offset="1" stopColor="#5f94f7" />
        </linearGradient>
        <linearGradient id="nav-lg-2" x1="7.33" y1="29.85" x2="-1.26" y2="20.98" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#83cbf7" /><stop offset="1" stopColor="#5f94f7" />
        </linearGradient>
        <linearGradient id="nav-lg-3" x1="11.65" y1="10.94" x2=".3" y2="-.78" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#83cbf7" /><stop offset="1" stopColor="#5f94f7" />
        </linearGradient>
        <linearGradient id="nav-lg-4" x1="5.1" y1="57.31" x2="34.62" y2="57.31" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#83a6f7" /><stop offset="1" stopColor="#5f73f7" />
        </linearGradient>
        <linearGradient id="nav-lg-5" x1="29.44" y1="76.51" x2="1.19" y2="48.26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5f94f7" /><stop offset="1" stopColor="#3c5cba" />
        </linearGradient>
        <linearGradient id="nav-lg-6" x1="1986" y1="29.96" x2="2015.52" y2="29.96" gradientTransform="translate(2057.7592) scale(-1 1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#83a6f7" /><stop offset="1" stopColor="#5f73f7" />
        </linearGradient>
        <linearGradient id="nav-lg-7" x1="2010.34" y1="49.16" x2="1982.09" y2="20.91" gradientTransform="translate(2057.7592) scale(-1 1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5f94f7" /><stop offset="1" stopColor="#3c5cba" />
        </linearGradient>
      </defs>
      <rect fill="url(#nav-lg-1)" x="21.88" y="6.92" width="6.85" height="6.85" rx=".99" />
      <rect fill="url(#nav-lg-2)" y="22.39" width="6.85" height="6.85" rx=".99" />
      <rect fill="url(#nav-lg-3)" x="1.97" y="1.09" width="9.05" height="9.05" rx="1.3" />
      <path fill="url(#nav-lg-4)" d="M5.1,57.31l24.92-29.04c1.58-1.84,4.6-.72,4.6,1.7v6.83c0,1.86-.67,3.66-1.88,5.08l-13.23,15.42,13.23,15.42c1.21,1.41,1.88,3.21,1.88,5.08v6.83c0,2.43-3.02,3.55-4.6,1.7L5.1,57.31Z" />
      <path fill="url(#nav-lg-5)" d="M5.1,57.31l24.92,29.04c1.58,1.84,4.6.72,4.6-1.7v-6.83c0-1.86-.67-3.66-1.88-5.08l-13.23-15.42H5.1Z" />
      <path fill="url(#nav-lg-6)" d="M71.76,29.96L46.84.92c-1.58-1.84-4.6-.72-4.6,1.7v6.83c0,1.86.67,3.66,1.88,5.08l13.23,15.42-13.23,15.42c-1.21,1.41-1.88,3.21-1.88,5.08v6.83c0,2.43,3.02,3.55,4.6,1.7l24.92-29.04Z" />
      <path fill="url(#nav-lg-7)" d="M71.76,29.96l-24.92,29.04c-1.58,1.84-4.6.72-4.6-1.7v-6.83c0-1.86.67-3.66,1.88-5.08l13.23-15.42h14.41Z" />
    </svg>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <header className="bg-white dark:bg-ink-950 border-b border-gray-200/80 dark:border-ink-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 md:gap-6">

          {/* ── LOGO CLUSTER - mark + wordmark + studio meta ── */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 min-h-11 -mx-1 px-1 group"
            aria-label="Alodev - trang chủ"
          >
            <LogoMark size={22} />
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tighter">
                <span className="text-brand-600 dark:text-brand-400">alo</span>
                <span className="text-gray-900 dark:text-white">dev</span>
              </span>
              {/* Studio meta - pencil-fine, only shows on sm+ */}
              <span className="hidden sm:block mt-1 text-[9px] font-mono uppercase tracking-[0.18em] text-gray-400 dark:text-ink-500">
                Studio · Hà Nội
              </span>
            </span>
          </Link>

          {/* ── CENTER NAV ── */}
          <nav className="hidden md:flex items-center" aria-label="Điều hướng chính">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-[13px] font-medium tracking-[-0.005em] transition ${
                    active
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-ink-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute left-3 right-3 bottom-1 h-px bg-brand-500 dark:bg-brand-400" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* ── RIGHT CLUSTER - status + theme + CTA ── */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {/* Status pill - local studio is open & accepting work.
                This single line says more about humanness than 10 testimonials. */}
            <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-500 dark:text-ink-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400/50 dark:bg-emerald-500/50 animate-pulse" />
                <span className="relative rounded-full bg-emerald-500 dark:bg-emerald-400 h-1.5 w-1.5" />
              </span>
              Đang nhận dự án
            </span>

            {/* Local phone - real-world handle, not a contact-form abstraction */}
            <a
              href="tel:0364234936"
              className="hidden lg:inline-block text-[12px] font-mono tracking-tight text-gray-500 dark:text-ink-400 hover:text-gray-900 dark:hover:text-white transition"
              aria-label="Gọi 0364 234 936"
            >
              0364 234 936
            </a>

            <ThemeToggle />
            <QuoteCTA size="sm" showArrow={false}>Báo giá</QuoteCTA>
          </div>

          {/* Mobile right cluster */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              className="inline-flex items-center justify-center w-11 h-11 -mr-2 text-ink-700 dark:text-ink-200 rounded-lg hover:bg-ink-100/60 dark:hover:bg-ink-800/60 transition"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white dark:bg-ink-950 animate-[mfade_.15s_ease]" role="dialog" aria-modal="true" aria-label="Menu điều hướng">
          <div className="flex flex-col h-full overflow-y-auto px-4 pt-6 pb-8 safe-bottom">

            {/* Studio meta + status - mobile version */}
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-ink-800">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-ink-500">
                Studio · Hà Nội · Est. 2025
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono text-gray-600 dark:text-ink-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                Đang nhận dự án
              </p>
            </div>

            <nav className="space-y-1" aria-label="Điều hướng mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between py-4 px-4 rounded-xl text-base font-semibold transition ${
                    isActive(link.href)
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'
                      : 'text-ink-900 dark:text-white hover:bg-cream-100 dark:hover:bg-ink-900'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <svg className="w-5 h-5 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </nav>

            <hr className="my-4 border-ink-100 dark:border-ink-800" />

            <div onClick={() => setMenuOpen(false)}>
              <QuoteCTA size="lg" showArrow={false} className="w-full">Yêu cầu báo giá</QuoteCTA>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
              <a href="tel:0364234936" className="flex items-center gap-2 px-4 py-3 rounded-xl border border-ink-100 dark:border-ink-800 text-ink-700 dark:text-ink-200 hover:bg-cream-50 dark:hover:bg-ink-900 transition">
                <svg className="w-4 h-4 text-brand-700 dark:text-brand-400" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                0364 234 936
              </a>
              <a href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 rounded-xl border border-ink-100 dark:border-ink-800 text-ink-700 dark:text-ink-200 hover:bg-cream-50 dark:hover:bg-ink-900 transition">
                <svg className="w-4 h-4 text-brand-700 dark:text-brand-400" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" /></svg>
                Zalo
              </a>
            </div>

            <div className="mt-auto pt-6 text-xs text-ink-500 dark:text-ink-400 text-center">
              © {new Date().getFullYear()} Alodev - Studio Web/App
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

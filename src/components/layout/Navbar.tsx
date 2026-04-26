'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import QuoteCTA from '@/components/QuoteCTA'

const navLinks = [
  { href: '/dich-vu', label: 'Dịch vụ' },
  { href: '/du-an', label: 'Dự án' },
  { href: '/ve-chung-toi', label: 'Về chúng tôi' },
  { href: '/lien-he', label: 'Liên hệ' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const linkBase = 'nav-link px-3 py-2 rounded-lg text-sm font-medium transition'
  const linkActive = 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'
  const linkIdle = 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-ink-400 dark:hover:text-white dark:hover:bg-ink-800/60'

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/70 sticky top-0 z-50 dark:bg-ink-950/75 dark:border-ink-800/70 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-ink-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-brand-600 dark:text-brand-400">alo</span>
            <span className="text-gray-900 dark:text-white">dev</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`${linkBase} ${isActive(link.href) ? linkActive : linkIdle}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('alodev:open-palette'))}
              className="hidden lg:inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-ink-800 bg-gray-50 dark:bg-ink-900 px-2.5 py-1 text-xs text-gray-500 dark:text-ink-500 hover:border-gray-300 dark:hover:border-ink-700 transition"
              title="Mở quick search"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span>Tìm kiếm</span>
              <span className="kbd">⌘K</span>
            </button>
            <ThemeToggle />
            <QuoteCTA size="sm" showArrow={false}>Yêu cầu báo giá</QuoteCTA>
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

      {/* Mobile fullscreen drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-white dark:bg-ink-950 animate-[mfade_.15s_ease]">
          <div className="flex flex-col h-full overflow-y-auto px-4 pt-6 pb-8 safe-bottom">
            <nav className="space-y-1">
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
              <a href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 rounded-xl border border-ink-100 dark:border-ink-800 text-ink-700 dark:text-ink-200 hover:bg-cream-50 dark:hover:bg-ink-900 transition">
                <svg className="w-4 h-4 text-brand-700 dark:text-brand-400" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" /></svg>
                Zalo
              </a>
              <a href={'mailto:' + 'hello' + '@' + 'alodev.vn'} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-ink-100 dark:border-ink-800 text-ink-700 dark:text-ink-200 hover:bg-cream-50 dark:hover:bg-ink-900 transition">
                <svg className="w-4 h-4 text-brand-700 dark:text-brand-400" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                Email
              </a>
            </div>

            <div className="mt-auto pt-6 text-xs text-ink-500 dark:text-ink-400 text-center">
              © {new Date().getFullYear()} Alodev — Studio Web/App
            </div>
          </div>
          <style>{`@keyframes mfade { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: translateY(0) } }`}</style>
        </div>
      )}
    </header>
  )
}

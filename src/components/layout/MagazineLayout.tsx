'use client'

/**
 * MagazineLayout - shared fixed-frame layout for all magazine pages.
 *
 * Used by: /, /dich-vu, /quy-trinh, /du-an, /ve-chung-toi, /blog, /lien-he, /bao-gia
 *
 * Structure:
 *  ┌──────────────────────────────────────────────┐
 *  │ NAVBAR (above)                               │
 *  ├──────────────────────────────────────────────┤
 *  │ ┌──────────┐ ┌─────────────────────────────┐ │  ← .mag-wrap fixed frame
 *  │ │ RAIL     │ │ SCROLL                      │ │
 *  │ │ logo     │ │  · page sections            │ │
 *  │ │ ──       │ │  · scrollable internally    │ │
 *  │ │ visual   │ │                             │ │
 *  │ │ ──       │ │                             │ │
 *  │ │ tagline  │ │                             │ │
 *  │ │ TOC      │ │                             │ │
 *  │ │ contact  │ │                             │ │
 *  │ │ CTA      │ │                             │ │
 *  │ └──────────┘ └─────────────────────────────┘ │
 *  └──────────────────────────────────────────────┘
 *
 * Mobile (< 1024px): rail hidden, content flows as normal page.
 *
 * Body class `home-mag-page` is added on mount to disable window scroll
 * on desktop (`overflow: hidden` via globals.css). Class is shared across
 * all magazine pages - name kept for backward compat with existing CSS.
 */

import { useEffect } from 'react'
import Link from 'next/link'
import QuoteCTA from '@/components/QuoteCTA'

export type MagazineTocItem = {
  num: string  // "01", "02", … - visible in rail
  name: string // section label
  hash: string // anchor target "#some-section-id"
}

interface MagazineLayoutProps {
  toc: MagazineTocItem[]
  /** Bold tagline shown above TOC. Default: "Phần mềm cho doanh nghiệp Việt." */
  tagline?: React.ReactNode
  /** Optional middle visual (cube on homepage, decorative SVG elsewhere). */
  visual?: React.ReactNode
  /** Mobile-only hero block (above content). If omitted, no mobile rail shows. */
  mobileHero?: React.ReactNode
  /** Page content - sections rendered inside .mag-scroll. */
  children: React.ReactNode
}

const DEFAULT_TAGLINE = (
  <>
    Phần mềm cho<br />doanh nghiệp Việt.
  </>
)

export default function MagazineLayout({
  toc,
  tagline = DEFAULT_TAGLINE,
  visual,
  mobileHero,
  children,
}: MagazineLayoutProps) {
  useEffect(() => {
    document.body.classList.add('home-mag-page')
    return () => document.body.classList.remove('home-mag-page')
  }, [])

  return (
    <>
      {/* Atmospheric background - fixed full-viewport */}
      <div className="mag-page-bg" aria-hidden="true" />
      {/* Film grain texture overlay */}
      <div className="mag-grain" aria-hidden="true" />

      <div className="mag-wrap">
        {/* ── IDENTITY COLUMN ── */}
        <aside className="mag-rail" aria-label="Alodev studio identity">

          {/* Top: logo + studio meta */}
          <div className="mag-rail-top">
            <Link href="/" className="inline-block">
              <span className="text-sm font-bold tracking-tighter text-gray-900 dark:text-white">
                alodev<span className="text-brand-600 dark:text-brand-400">.vn</span>
              </span>
            </Link>
            <p className="mt-1 text-[10px] font-mono text-gray-400 dark:text-ink-600 tracking-wide">
              Studio · Hà Nội · 2025
            </p>
          </div>

          {/* Middle: optional visual.
              Homepage passes <HeroCube/>. Other pages get RailInfoBlock -
              real signal (status, stats, current work) instead of decoration. */}
          {visual ? (
            <div className="mag-rail-cube">{visual}</div>
          ) : (
            <div className="mag-rail-cube mag-rail-cube--info">
              <RailInfoBlock />
            </div>
          )}

          {/* Bottom: tagline + TOC + contact + CTA */}
          <div className="mag-rail-bottom">
            {tagline && (
              <p className="text-sm font-bold leading-snug tracking-tight text-gray-900 dark:text-white">
                {tagline}
              </p>
            )}

            <nav
              className={tagline ? 'mt-5 pt-4 border-t border-slate-200 dark:border-ink-800' : 'mt-2'}
              aria-label="Mục lục"
            >
              <ul className="space-y-1.5">
                {toc.map((t) => (
                  <li key={t.hash}>
                    <a
                      href={t.hash}
                      className="mag-toc-link group flex items-baseline gap-2 text-xs font-mono text-gray-400 dark:text-ink-600 hover:text-gray-900 dark:hover:text-white transition"
                    >
                      <span className="opacity-70 group-hover:opacity-100">{t.num}</span>
                      <span className="mag-toc-name">{t.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-ink-800 space-y-0.5">
              <a
                href="tel:0364234936"
                className="block text-xs font-semibold text-gray-700 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-400 transition"
              >
                0364 234 936
              </a>
              <a
                href="https://zalo.me/0364234936"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-gray-400 dark:text-ink-600 hover:text-brand-600 dark:hover:text-brand-400 transition"
              >
                Zalo →
              </a>
            </div>

            {/* CTA */}
            <div className="magnetic mt-3">
              <QuoteCTA size="sm" variant="solid" className="w-full justify-center text-xs">
                Báo giá
              </QuoteCTA>
            </div>
          </div>
        </aside>

        {/* ── CONTENT COLUMN ── */}
        <div className="mag-scroll">
          {/* Mobile-only identity (rail hidden on mobile) */}
          {mobileHero && (
            <div className="lg:hidden border-b border-gray-200 dark:border-ink-800">
              {mobileHero}
            </div>
          )}
          {children}
        </div>
      </div>
    </>
  )
}

/* ── Rail info block ──
   Sub-page replacement for the homepage cube. Uses the rail's middle
   real-estate to surface high-value signal:
     · Live status - "Đang nhận dự án" pulse dot + slot info
     · Trust stats - 11+ / 24h / 100% mini-grid
     · "Đang làm" - current sprint focus (founder-edited, signals alive studio)
   Removes the cube weight (~723KB three.js bundle) from sub-page routes. */
function RailInfoBlock() {
  return (
    <div className="flex flex-col gap-4 py-1">
      {/* Live status */}
      <div>
        <p className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-gray-400 dark:text-ink-500">
          Trạng thái
        </p>
        <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-700 dark:text-ink-200">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400/50 dark:bg-emerald-500/50 animate-pulse" />
            <span className="relative rounded-full bg-emerald-500 dark:bg-emerald-400 h-1.5 w-1.5" />
          </span>
          Đang nhận dự án
        </div>
        <p className="mt-0.5 text-[10px] text-gray-400 dark:text-ink-500">
          Q2/2026 · còn slot
        </p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-200 dark:border-ink-800">
        <RailStat num="11+"  label="dự án" />
        <RailStat num="24h"  label="phản hồi" />
        <RailStat num="100%" label="code của bạn" />
      </div>

      {/* Now - what's shipping this week */}
      <div className="pt-3 border-t border-slate-200 dark:border-ink-800">
        <p className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-gray-400 dark:text-ink-500">
          Đang làm
        </p>
        <ul className="mt-1.5 space-y-1 text-[10.5px] text-gray-600 dark:text-ink-300 leading-snug">
          <li className="flex items-baseline gap-1.5">
            <span className="text-brand-500 dark:text-brand-400 shrink-0">›</span>
            <span>Sprint cuối OnThi365 v3</span>
          </li>
          <li className="flex items-baseline gap-1.5">
            <span className="text-brand-500 dark:text-brand-400 shrink-0">›</span>
            <span>Demo MAXMIN Phase 2</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function RailStat({ num, label }: { num: string; label: string }) {
  return (
    <div className="text-left">
      <div className="tabular text-sm font-bold text-gray-900 dark:text-white leading-none font-mono">
        {num}
      </div>
      <div className="mt-1 text-[9px] font-mono uppercase tracking-wider text-gray-400 dark:text-ink-500 leading-tight">
        {label}
      </div>
    </div>
  )
}

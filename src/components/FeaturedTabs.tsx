'use client'

import Link from 'next/link'
import { useState } from 'react'
import Counter from '@/components/Counter'

type Tab = {
  slug: string
  name: string
  domain: string
  tag: string
  metrics: { v: string; l: string }[]
  blurb: string
  pitch: string
  ctaLabel: string
}

const tabs: Tab[] = [
  {
    slug: 'onthi365',
    name: 'OnThi365',
    domain: 'onthi365.com',
    tag: 'Live · PvP · Mobile',
    blurb: 'OnThi365 — nền tảng ôn thi THPT',
    pitch:
      'Yêu cầu cả 3 chiều: live stream HLS đa nền tảng, đấu trường PvP real-time, mobile app + web. Build full stack từ infra đến animation đếm ngược.',
    metrics: [
      { v: '2,400', l: 'Concurrent peak' },
      { v: '99.94%', l: 'Uptime 90 ngày' },
      { v: '180ms', l: 'API P95' },
    ],
    ctaLabel: 'Xem case study',
  },
  {
    slug: 'datacenter',
    name: 'Datacenter',
    domain: 'datacenter.trancongthang.vn',
    tag: 'Internal · Fleet ops',
    blurb: 'Dashboard vận hành 11 site cùng lúc',
    pitch:
      'Connection pool tới 11 Postgres database khác nhau, health check song song, YouTube uploader, cron scheduler — một dashboard cho toàn fleet.',
    metrics: [
      { v: '11', l: 'Site quản lý' },
      { v: '11', l: 'DB song song' },
      { v: '< 60s', l: 'Deploy time' },
    ],
    ctaLabel: 'Xem case study',
  },
  {
    slug: 'shopaccgame',
    name: 'Shop Acc Game',
    domain: 'shopaccgame.net',
    tag: 'E-commerce · Payment',
    blurb: 'Sàn giao dịch + 3 cổng thanh toán',
    pitch:
      'VNPAY · MoMo · Zalopay đồng thời. Escrow hold tiền tới khi buyer confirm. Anti-fraud: device fingerprint + velocity check. Multi-tenant 3 shop chung backend.',
    metrics: [
      { v: '96.8%', l: 'Giao dịch thành công' },
      { v: '3', l: 'Cổng thanh toán' },
      { v: '3', l: 'Shop chung backend' },
    ],
    ctaLabel: 'Xem case study',
  },
]

export default function FeaturedTabs() {
  const [active, setActive] = useState(0)
  const t = tabs[active]

  return (
    <section className="py-10 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800" data-section-name="Featured">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal flex flex-wrap items-end justify-between gap-4 mb-6 lg:mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Featured · {t.name}</span>
            </div>
            <h2 className="h-section mt-3 text-gray-900 dark:text-white">
              Khi case study là phép thử <span className="text-brand-600 dark:text-brand-400">stress test</span>.
            </h2>
            <p className="mt-5 text-lg text-gray-600 dark:text-ink-400 leading-relaxed">{t.pitch}</p>
          </div>

          {/* Tab selector — pill row. Horizontally scrollable on mobile so the
              6 project names don't overflow the 390px viewport edge with no
              way to reach hidden tabs. -mx- pulls the scroll edges out to the
              page edge so swipes still feel natural near the screen border. */}
          <div className="w-full lg:w-auto -mx-4 sm:-mx-6 lg:mx-0 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            <div role="tablist" aria-label="Featured projects" className="inline-flex p-1 rounded-xl border border-gray-200 dark:border-ink-800 bg-white/60 dark:bg-ink-900/60 backdrop-blur mx-4 sm:mx-6 lg:mx-0">
              {tabs.map((tab, i) => (
                <button
                  key={tab.slug}
                  role="tab"
                  aria-selected={i === active}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`tab-trigger shrink-0 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white`}
                  {...(i === active ? { 'data-active': '' } : {})}
                >
                  <span className="tabular text-[10px] mr-1.5 opacity-50">0{i + 1}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left column: metrics + CTAs (fade-cycle on tab switch) */}
          <div className="lg:col-span-5 relative min-h-[260px]">
            {tabs.map((tab, i) => (
              <div
                key={tab.slug}
                className="tab-panel absolute inset-0"
                {...(i === active ? { 'data-active': '' } : {})}
                aria-hidden={i !== active}
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                  {tab.tag}
                </div>
                <p className="mt-3 text-base text-ink-700 dark:text-ink-200 font-medium">{tab.blurb}</p>
                <div className="mt-5 sm:mt-7 grid grid-cols-3 gap-2 sm:gap-3">
                  {tab.metrics.map((m) => (
                    <div key={m.l} className="rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-3 sm:p-4">
                      <Counter value={m.v} className="tabular text-lg sm:text-2xl font-bold text-gray-900 dark:text-white block" />
                      <div className="text-[11px] sm:text-xs text-gray-500 dark:text-ink-500 mt-1 leading-tight">{m.l}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 sm:mt-7 flex flex-wrap gap-3">
                  <Link href={`/du-an/${tab.slug}`} className="inline-flex items-center gap-2 min-h-11 rounded-xl bg-gray-900 dark:bg-white px-5 py-3 text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition">
                    {tab.ctaLabel}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                  <a href={`https://${tab.domain}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 min-h-11 rounded-xl bg-white dark:bg-ink-900 border border-gray-200 dark:border-ink-800 px-5 py-3 text-gray-900 dark:text-white text-sm font-semibold hover:border-gray-300 dark:hover:border-ink-700 transition">
                    Mở trang live
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Right column: browser-frame mockup, content swaps per tab */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-ink-800 bg-gradient-to-br from-cream-100 via-white to-brand-50 dark:from-brand-500/10 dark:via-ink-900 dark:to-ink-900 shadow-2xl shadow-brand-500/10">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200/60 dark:border-ink-800/80 bg-white/60 dark:bg-ink-900/60 backdrop-blur">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="rounded-md bg-gray-100 dark:bg-ink-800 px-3 py-1 text-xs text-gray-600 dark:text-ink-400 font-mono inline-flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {t.domain}
                  </div>
                </div>
              </div>

              <div className="aspect-[16/10] relative">
                {/* OnThi365 panel */}
                <div className="tab-panel absolute inset-0 p-4 sm:p-8 grid grid-cols-3 gap-2 sm:gap-3" {...(active === 0 ? { 'data-active': '' } : {})}>
                  <div className="col-span-2 rounded-xl bg-white/70 dark:bg-ink-900/70 backdrop-blur p-2.5 sm:p-4 border border-white/50 dark:border-ink-800/50">
                    <div className="text-xs font-semibold text-gray-500 dark:text-ink-500">KỲ THI SẮP TỚI</div>
                    <div className="mt-2 font-bold text-gray-900 dark:text-white">TSA Đánh giá tư duy</div>
                    <div className="mt-3 grid grid-cols-4 gap-1.5">
                      {['12','23','45','08'].map((n, i) => (
                        <div key={i} className="rounded-md bg-gray-900 dark:bg-ink-800 text-white text-center py-2">
                          <div className="tabular font-bold text-sm">{n}</div>
                          <div className="text-[9px] opacity-60">{['NGÀY','GIỜ','PHÚT','GIÂY'][i]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/70 dark:bg-ink-900/70 backdrop-blur p-2.5 sm:p-4 border border-white/50 dark:border-ink-800/50 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 dark:text-ink-500">ĐẤU TRƯỜNG</div>
                      <div className="mt-2 font-bold text-gray-900 dark:text-white text-sm">Live PvP</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      247 đang online
                    </div>
                  </div>
                  <div className="col-span-3 rounded-xl bg-white/70 dark:bg-ink-900/70 backdrop-blur p-2.5 sm:p-4 border border-white/50 dark:border-ink-800/50">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-gray-500 dark:text-ink-500">KHÓA HỌC NỔI BẬT</div>
                      <div className="text-xs text-brand-600 dark:text-brand-400 font-medium">Xem tất cả →</div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {[1,2,3].map((i) => (
                        <div key={i} className="rounded-lg bg-gradient-to-br from-brand-100 to-cream-200 dark:from-brand-500/20 dark:to-ink-800 aspect-video" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Datacenter panel */}
                <div className="tab-panel absolute inset-0 p-4 sm:p-8" {...(active === 1 ? { 'data-active': '' } : {})}>
                  <div className="grid grid-cols-12 gap-2 sm:gap-3 h-full">
                    {/* Sidebar */}
                    <div className="col-span-3 rounded-xl bg-white/70 dark:bg-ink-900/70 backdrop-blur p-3 border border-white/50 dark:border-ink-800/50 space-y-1.5">
                      {['Fleet', 'Sites', 'Postgres', 'Cron', 'YT Upload', 'Logs'].map((s, i) => (
                        <div key={s} className={`text-[10px] sm:text-xs px-2 py-1.5 rounded-md ${i === 0 ? 'bg-brand-500/10 text-brand-700 dark:text-brand-400 font-semibold' : 'text-ink-500 dark:text-ink-500'}`}>
                          {s}
                        </div>
                      ))}
                    </div>
                    {/* Main: fleet health table */}
                    <div className="col-span-9 rounded-xl bg-white/70 dark:bg-ink-900/70 backdrop-blur p-3 sm:p-4 border border-white/50 dark:border-ink-800/50">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-gray-500 dark:text-ink-500">FLEET HEALTH · 11 SITES</div>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          11/11 OK
                        </div>
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {[
                          { n: 'onthi365', p: 24, ok: true },
                          { n: 'shopaccgame', p: 18, ok: true },
                          { n: 'ganday', p: 11, ok: true },
                          { n: 'vn247', p: 9, ok: true },
                          { n: 'lammmo', p: 7, ok: true },
                        ].map((r) => (
                          <div key={r.n} className="grid grid-cols-12 items-center text-[10px] sm:text-xs gap-2">
                            <div className="col-span-3 font-mono text-ink-700 dark:text-ink-300 truncate">{r.n}</div>
                            <div className="col-span-7 h-1.5 rounded-full bg-gray-200 dark:bg-ink-800 overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${r.p * 4}%` }} />
                            </div>
                            <div className="col-span-2 text-right tabular text-ink-500 dark:text-ink-500">{r.p}ms</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-ink-800 grid grid-cols-3 gap-2 text-[10px]">
                        <div><div className="font-bold text-gray-900 dark:text-white">11</div><div className="text-ink-500">Postgres pools</div></div>
                        <div><div className="font-bold text-gray-900 dark:text-white">14</div><div className="text-ink-500">Cron jobs</div></div>
                        <div><div className="font-bold text-emerald-600 dark:text-emerald-400">99.94%</div><div className="text-ink-500">Avg uptime</div></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ShopAccGame panel */}
                <div className="tab-panel absolute inset-0 p-4 sm:p-8" {...(active === 2 ? { 'data-active': '' } : {})}>
                  <div className="grid grid-cols-12 gap-2 sm:gap-3 h-full">
                    {/* Order summary card */}
                    <div className="col-span-7 rounded-xl bg-white/80 dark:bg-ink-900/70 backdrop-blur p-3 sm:p-4 border border-white/50 dark:border-ink-800/50">
                      <div className="text-xs font-semibold text-gray-500 dark:text-ink-500">ĐƠN HÀNG #SAG-48127</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">Acc LMHT · Cao Thủ Đông Nam Á</div>
                          <div className="mt-0.5 text-xs text-ink-500">100+ skin · Rank cao thủ</div>
                        </div>
                        <div className="tabular font-bold text-base text-brand-600 dark:text-brand-400">12.500.000₫</div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-ink-800">
                        <div className="text-[10px] font-semibold text-gray-500 dark:text-ink-500 mb-1.5">PHƯƠNG THỨC THANH TOÁN</div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { n: 'VNPAY', sel: true },
                            { n: 'MoMo', sel: false },
                            { n: 'Zalopay', sel: false },
                          ].map((p) => (
                            <div key={p.n} className={`text-[10px] sm:text-xs text-center py-1.5 rounded-md font-semibold ${p.sel ? 'bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-500/30' : 'bg-gray-100 dark:bg-ink-800 text-ink-500 border border-transparent'}`}>
                              {p.n}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Escrow status */}
                    <div className="col-span-5 rounded-xl bg-white/80 dark:bg-ink-900/70 backdrop-blur p-3 sm:p-4 border border-white/50 dark:border-ink-800/50 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 dark:text-ink-500">ESCROW</div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span className="font-semibold text-amber-700 dark:text-amber-400">Đang giữ tiền</span>
                        </div>
                        <div className="mt-3 space-y-1 text-[10px]">
                          {[
                            { l: 'Buyer thanh toán', ok: true },
                            { l: 'Seller giao acc', ok: true },
                            { l: 'Buyer xác nhận', ok: false },
                          ].map((s) => (
                            <div key={s.l} className="flex items-center gap-1.5">
                              <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${s.ok ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-ink-800 text-ink-500'}`}>
                                {s.ok ? '✓' : ''}
                              </span>
                              <span className={s.ok ? 'text-ink-700 dark:text-ink-300' : 'text-ink-500'}>{s.l}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button type="button" className="mt-3 text-[10px] sm:text-xs font-semibold py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-default">
                        Xác nhận đã nhận
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

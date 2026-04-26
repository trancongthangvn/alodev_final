import React from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              <span className="text-brand-400">alo</span><span className="text-white">dev</span>
            </Link>
            <p className="mt-3 text-sm text-slate-400 max-w-md leading-relaxed">
              Founder-led studio chuyên <b className="text-white">thiết kế website</b>, <b className="text-white">lập trình app mobile</b> và xây dựng hệ thống quản trị cho doanh nghiệp Việt Nam.
              11+ sản phẩm vận hành thật, source code thuộc sở hữu của bạn.
            </p>
            <div className="mt-4 text-xs text-slate-500 flex items-center gap-2">
              <Icon name="map-pin" className="w-3.5 h-3.5" />
              <span>Hà Nội · Việt Nam · Phục vụ toàn quốc qua remote</span>
            </div>
            <div className="mt-5 flex gap-2 flex-wrap">
              <a href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white text-ink-900 px-4 py-2 text-sm font-semibold hover:bg-ink-100 transition">
                <Icon name="message-circle" className="w-4 h-4" /> Chat Zalo
              </a>
              <Link href="/lien-he" className="inline-flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white text-sm font-semibold hover:bg-slate-700 transition">
                Yêu cầu báo giá
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Dịch vụ chính</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dich-vu/thiet-ke-website" className="hover:text-white transition">Thiết kế website doanh nghiệp</Link></li>
              <li><Link href="/dich-vu/lap-trinh-app-mobile" className="hover:text-white transition">Lập trình app mobile iOS/Android</Link></li>
              <li><Link href="/dich-vu/he-thong-quan-tri" className="hover:text-white transition">Hệ thống quản trị CRM/ERP</Link></li>
              <li><Link href="/dich-vu#automation" className="hover:text-white transition">Tự động hoá &amp; AI</Link></li>
              <li><Link href="/dich-vu#maintenance" className="hover:text-white transition">Bảo trì &amp; nâng cấp</Link></li>
              <li><Link href="/dich-vu#design" className="hover:text-white transition">Thiết kế UI/UX Figma</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Khám phá</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/du-an" className="hover:text-white transition">Portfolio dự án</Link></li>
              <li><Link href="/dich-vu" className="hover:text-white transition">Tất cả dịch vụ &amp; bảng giá</Link></li>
              <li><Link href="/bao-gia" className="hover:text-white transition">Tự cấu hình báo giá</Link></li>
              <li><Link href="/ve-chung-toi" className="hover:text-white transition">Về Alodev</Link></li>
              <li><Link href="/lien-he" className="hover:text-white transition">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:0364234936" className="hover:text-white transition inline-flex items-center gap-1.5">
                  <Icon name="phone" className="w-3.5 h-3.5 opacity-60" /> 0364 234 936
                </a>
              </li>
              <li>
                <a href="mailto:hello@alodev.vn" className="hover:text-white transition inline-flex items-center gap-1.5">
                  <Icon name="mail" className="w-3.5 h-3.5 opacity-60" /> hello@alodev.vn
                </a>
              </li>
              <li>
                <a href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer" className="hover:text-white transition inline-flex items-center gap-1.5">
                  <Icon name="message-circle" className="w-3.5 h-3.5 opacity-60" /> Zalo OA
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO long-tail keyword cluster */}
        <div className="mt-10 pt-6 border-t border-slate-800/60">
          <div className="text-[11px] text-slate-500 leading-loose">
            <span className="text-slate-400 font-semibold">Alodev nhận:</span>{' '}
            <Link href="/dich-vu/thiet-ke-website" className="hover:text-slate-300">thiết kế website doanh nghiệp</Link> ·{' '}
            <Link href="/dich-vu/thiet-ke-website" className="hover:text-slate-300">làm website bán hàng</Link> ·{' '}
            <Link href="/dich-vu/thiet-ke-website" className="hover:text-slate-300">landing page chuyên nghiệp</Link> ·{' '}
            <Link href="/dich-vu/lap-trinh-app-mobile" className="hover:text-slate-300">lập trình app iOS</Link> ·{' '}
            <Link href="/dich-vu/lap-trinh-app-mobile" className="hover:text-slate-300">app Android theo yêu cầu</Link> ·{' '}
            <Link href="/dich-vu/lap-trinh-app-mobile" className="hover:text-slate-300">app đặt lịch / giao hàng</Link> ·{' '}
            <Link href="/dich-vu/he-thong-quan-tri" className="hover:text-slate-300">phần mềm CRM khách hàng</Link> ·{' '}
            <Link href="/dich-vu/he-thong-quan-tri" className="hover:text-slate-300">hệ thống ERP doanh nghiệp</Link> ·{' '}
            <Link href="/dich-vu/he-thong-quan-tri" className="hover:text-slate-300">SaaS multi-tenant</Link> ·{' '}
            <Link href="/dich-vu#automation" className="hover:text-slate-300">tích hợp AI ChatGPT/Claude</Link> ·{' '}
            <Link href="/dich-vu#automation" className="hover:text-slate-300">bot Zalo Telegram tự động</Link> ·{' '}
            <Link href="/dich-vu#maintenance" className="hover:text-slate-300">bảo trì website wordpress</Link> ·{' '}
            <Link href="/du-an" className="hover:text-slate-300">studio web app Hà Nội</Link>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div>© {year} alodev.vn — Founder-led studio Hà Nội. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@alodev.vn" className="hover:text-slate-300 transition">hello@alodev.vn</a>
            <span className="text-slate-700">·</span>
            <a href="tel:0364234936" className="hover:text-slate-300 transition">0364 234 936</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

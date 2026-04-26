'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '@/components/Icon'

/**
 * Single global modal that asks the user how they want to request a quote.
 * Mount once in LayoutShell. Open from anywhere by dispatching:
 *   window.dispatchEvent(new Event('alodev:open-quote'))
 */
export default function QuoteChoice() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    function onOpen() { setOpen(true) }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        e.preventDefault()
        close()
      }
    }
    window.addEventListener('alodev:open-quote', onOpen)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('alodev:open-quote', onOpen)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  // Lock body scroll when modal open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  function go(path: string) {
    close()
    router.push(path)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby="quote-choice-title">
      <div className="absolute inset-0 bg-ink-950/40 dark:bg-black/60 backdrop-blur-sm animate-[qcFade_.18s_ease]" onClick={close} />

      <div className="relative w-full max-w-2xl rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-2xl overflow-hidden animate-[qcSlide_.22s_cubic-bezier(0.22,1,0.36,1)]">
        <button
          type="button"
          aria-label="Đóng"
          onClick={close}
          className="absolute right-3 top-3 inline-flex w-8 h-8 items-center justify-center rounded-lg text-ink-400 hover:text-ink-700 dark:text-ink-500 dark:hover:text-ink-200 hover:bg-ink-100/60 dark:hover:bg-ink-800 transition"
        >
          <Icon name="x" className="w-4 h-4" />
        </button>

        <div className="px-6 sm:px-8 pt-7 pb-2">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">Báo giá</span>
          </div>
          <h2 id="quote-choice-title" className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white tracking-tight">
            Cách nào phù hợp với bạn?
          </h2>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
            Cả hai đều miễn phí, phản hồi trong 24h. Chọn theo lượng thông tin bạn đã có.
          </p>
        </div>

        <div className="px-6 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Quick request */}
          <button
            type="button"
            onClick={() => go('/lien-he')}
            className="group text-left rounded-xl border border-ink-100 dark:border-ink-800 bg-cream-50 dark:bg-ink-950/60 p-5 hover:border-brand-300 dark:hover:border-brand-500/40 hover:bg-white dark:hover:bg-ink-900 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cream-100 dark:bg-ink-800 text-ink-700 dark:text-ink-100 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">
                <Icon name="mail" className="w-5 h-5" />
              </div>
              <span className="tabular text-[10px] font-mono text-ink-400 dark:text-ink-500">~2 phút</span>
            </div>
            <h3 className="text-base font-bold text-ink-900 dark:text-white">Gửi yêu cầu nhanh</h3>
            <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">
              Mô tả ngắn nhu cầu — Alodev gọi lại để tư vấn scope &amp; báo giá phù hợp.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-ink-600 dark:text-ink-300">
              <li className="flex gap-1.5"><Icon name="check" className="w-3.5 h-3.5 mt-0.5 text-brand-700 dark:text-brand-400 shrink-0" strokeWidth={2.25} /> Phù hợp khi chưa rõ scope</li>
              <li className="flex gap-1.5"><Icon name="check" className="w-3.5 h-3.5 mt-0.5 text-brand-700 dark:text-brand-400 shrink-0" strokeWidth={2.25} /> Cần tư vấn từ đầu</li>
              <li className="flex gap-1.5"><Icon name="check" className="w-3.5 h-3.5 mt-0.5 text-brand-700 dark:text-brand-400 shrink-0" strokeWidth={2.25} /> Có deadline gấp</li>
            </ul>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">
              Mở form liên hệ <Icon name="arrow-right" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" strokeWidth={2.25} />
            </div>
          </button>

          {/* Custom configurator */}
          <button
            type="button"
            onClick={() => go('/bao-gia')}
            className="group relative text-left rounded-xl border border-ink-900 dark:border-white bg-ink-900 dark:bg-white p-5 hover:bg-ink-800 dark:hover:bg-ink-100 transition"
          >
            <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-brand-500/20 dark:bg-brand-400/15 backdrop-blur px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-200 dark:text-brand-700">
              Khuyên dùng
            </span>
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/15 dark:bg-brand-500/15 text-brand-300 dark:text-brand-700 group-hover:bg-brand-500/25 transition">
                <Icon name="gauge" className="w-5 h-5" />
              </div>
              <span className="tabular text-[10px] font-mono text-white/40 dark:text-ink-400">~5 phút</span>
            </div>
            <h3 className="text-base font-bold text-white dark:text-ink-900">Tự cấu hình &amp; xem giá ngay</h3>
            <p className="mt-1.5 text-sm text-white/70 dark:text-ink-600 leading-relaxed">
              Tick tính năng — giá update real-time. Gửi cấu hình kèm form.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-white/80 dark:text-ink-700">
              <li className="flex gap-1.5"><Icon name="check" className="w-3.5 h-3.5 mt-0.5 text-brand-300 dark:text-brand-600 shrink-0" strokeWidth={2.25} /> Biết giá ngay không cần chờ</li>
              <li className="flex gap-1.5"><Icon name="check" className="w-3.5 h-3.5 mt-0.5 text-brand-300 dark:text-brand-600 shrink-0" strokeWidth={2.25} /> Tự khám phá tính năng có thể thêm</li>
              <li className="flex gap-1.5"><Icon name="check" className="w-3.5 h-3.5 mt-0.5 text-brand-300 dark:text-brand-600 shrink-0" strokeWidth={2.25} /> Tiết kiệm 10 phút trao đổi sau</li>
            </ul>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white dark:text-ink-900">
              Mở calculator <Icon name="arrow-right" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" strokeWidth={2.25} />
            </div>
          </button>
        </div>

        <div className="px-6 sm:px-8 py-4 border-t border-ink-100 dark:border-ink-800 bg-cream-50 dark:bg-ink-950/40 flex items-center justify-between gap-3 flex-wrap text-xs text-ink-500 dark:text-ink-400">
          <span>Hoặc chat Zalo nếu muốn trao đổi nhanh</span>
          <a href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer" onClick={close} className="inline-flex items-center gap-1.5 font-semibold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300">
            <Icon name="message-circle" className="w-3.5 h-3.5" /> Zalo 0364 234 936
          </a>
        </div>
      </div>

      <style>{`
        @keyframes qcFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes qcSlide { from { opacity: 0; transform: translateY(12px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  )
}

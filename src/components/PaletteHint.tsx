'use client'

import { useEffect, useState } from 'react'
import Icon from '@/components/Icon'

const STORAGE_KEY = 'alodev-palette-hint-shown'

export default function PaletteHint() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(STORAGE_KEY)) return

    // Don't show on touch-primary devices (no keyboard)
    if (window.matchMedia('(pointer: coarse)').matches) return

    // Show later (8s vs 4s) so the user has time to read the hero before
    // we show a peripheral tip, then auto-dismiss after 10s if ignored.
    const showT = setTimeout(() => setShow(true), 8000)
    const hideT = setTimeout(() => {
      setShow(false)
      try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
    }, 18000)
    return () => { clearTimeout(showT); clearTimeout(hideT) }
  }, [])

  function dismiss() {
    setShow(false)
    try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
  }

  function open() {
    dismiss()
    window.dispatchEvent(new Event('alodev:open-palette'))
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-40 sm:max-w-xs safe-bottom animate-[hintIn_.4s_ease]">
      <div className="rounded-xl border border-ink-100 dark:border-ink-800 bg-white/95 dark:bg-ink-900/95 backdrop-blur shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 shrink-0">
            <Icon name="zap" className="w-4 h-4" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-ink-900 dark:text-white">Tip nhanh</div>
            <p className="mt-1 text-xs text-ink-500 dark:text-ink-300 leading-relaxed">
              Bấm <span className="kbd">⌘</span> <span className="kbd">K</span> (hoặc <span className="kbd">Ctrl</span> <span className="kbd">K</span>) bất kỳ lúc nào để tìm trang, dự án, dịch vụ.
            </p>
            <div className="mt-3 flex gap-2">
              <button onClick={open} className="text-xs font-semibold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 inline-flex items-center gap-1">
                Thử ngay <Icon name="arrow-right" className="w-3 h-3" />
              </button>
              <button onClick={dismiss} className="text-xs text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-200">
                Đóng
              </button>
            </div>
          </div>
          <button onClick={dismiss} aria-label="Đóng" className="text-ink-400 hover:text-ink-700 dark:text-ink-500 dark:hover:text-ink-200">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
      </div>
      <style>{`@keyframes hintIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }`}</style>
    </div>
  )
}

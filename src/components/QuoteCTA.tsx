'use client'

// Reusable button that opens the global QuoteChoice modal.
// Use anywhere a "Yêu cầu báo giá" CTA is needed.
//
// Usage:
//   <QuoteCTA>Yêu cầu báo giá</QuoteCTA>
//   <QuoteCTA variant="solid" size="lg">Bắt đầu</QuoteCTA>
//   <QuoteCTA variant="ghost">Liên hệ</QuoteCTA>

import Icon from '@/components/Icon'

type Variant = 'solid' | 'outline' | 'ghost' | 'inverted'
type Size = 'sm' | 'md' | 'lg'

const VARIANT_CLASS: Record<Variant, string> = {
  // Solid: black on light, white on dark — the primary CTA style
  solid:    'bg-ink-900 dark:bg-white text-white dark:text-ink-900 hover:bg-ink-800 dark:hover:bg-ink-100 shadow-lg shadow-ink-900/10',
  // Outline: light border ink card, secondary
  outline:  'bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-ink-900 dark:text-white hover:border-ink-300 dark:hover:border-ink-700',
  // Ghost: text-only with hover bg
  ghost:    'text-ink-700 dark:text-ink-200 hover:bg-cream-100 dark:hover:bg-ink-800/60',
  // Inverted: for use on dark sections (bg gradient blue/saffron) — white solid
  inverted: 'bg-white text-ink-900 hover:bg-ink-100 shadow-lg',
}

const SIZE_CLASS: Record<Size, string> = {
  // All sizes enforce a 44px (WCAG/Apple HIG floor) touch target on mobile.
  // `sm` is desktop-dense (used only in the navbar at md+ where it shrinks
  // back to 36px), but the floor still applies because touch laptops do tap
  // navbar buttons.
  sm: 'min-h-11 md:min-h-9 px-4 py-2 text-sm',
  md: 'min-h-11 px-5 py-3 text-sm',
  lg: 'min-h-12 px-6 py-3.5 text-base',
}

export default function QuoteCTA({
  children = 'Yêu cầu báo giá',
  variant = 'solid',
  size = 'lg',
  className = '',
  showArrow = true,
}: {
  children?: React.ReactNode
  variant?: Variant
  size?: Size
  className?: string
  showArrow?: boolean
}) {
  function open() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('alodev:open-quote'))
    }
  }
  return (
    <button
      type="button"
      onClick={open}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}
    >
      {children}
      {showArrow && <Icon name="arrow-right" className="w-4 h-4 group-hover:translate-x-0.5 transition" strokeWidth={2.25} />}
    </button>
  )
}

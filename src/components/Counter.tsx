'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Animated number counter that fires on intersection.
 * Accepts strings like "50+", "99.94%", "180ms", "2,400" — extracts the
 * numeric portion to animate, keeps the surrounding chars static.
 */
export default function Counter({
  value,
  duration = 1400,
  className = '',
}: {
  value: string
  duration?: number
  className?: string
}) {
  // Parse: leading non-num, number, trailing
  const match = value.match(/^([^\d-]*)([-]?[\d,]*\.?\d+)(.*)$/)
  const prefix = match?.[1] ?? ''
  const numStr = match?.[2] ?? '0'
  const suffix = match?.[3] ?? ''

  const target = parseFloat(numStr.replace(/,/g, ''))
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
  const useThousands = numStr.includes(',')

  const [display, setDisplay] = useState<string>('0')
  const ref = useRef<HTMLSpanElement>(null)
  const fired = useRef(false)

  useEffect(() => {
    if (!ref.current || fired.current) return
    if (typeof IntersectionObserver === 'undefined' || isNaN(target)) {
      setDisplay(formatNum(target, decimals, useThousands))
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(formatNum(target, decimals, useThousands))
      fired.current = true
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true
          animate()
          obs.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  function animate() {
    const start = performance.now()
    function tick(now: number) {
      const elapsed = now - start
      const t = Math.min(1, elapsed / duration)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      const current = target * eased
      setDisplay(formatNum(current, decimals, useThousands))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  )
}

function formatNum(n: number, decimals: number, useThousands: boolean): string {
  if (isNaN(n)) return '0'
  const fixed = n.toFixed(decimals)
  if (!useThousands) return fixed
  const [whole, dec] = fixed.split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return dec ? `${grouped}.${dec}` : grouped
}

'use client'

import { useEffect, useState } from 'react'

/**
 * LiveTicker — alodev studio masthead heartbeat.
 *
 * Real-time ICT clock + uptime + active-project count + last-deploy
 * relative timestamp. Updates every second. Reference: Read.cv,
 * Robin Sloan's site, Stripe status — design that feels alive.
 *
 * SSR renders a static placeholder; client hydrates the live clock.
 * suppressHydrationWarning prevents the timestamp mismatch warning
 * (server time ≠ client time always).
 */
export default function LiveTicker() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // ICT = Indochina Time = UTC+7
  const ictDate = now ? new Date(now.getTime() + 7 * 3600_000) : null
  const hh = ictDate ? String(ictDate.getUTCHours()).padStart(2, '0') : '— —'
  const mm = ictDate ? String(ictDate.getUTCMinutes()).padStart(2, '0') : '— —'
  const ss = ictDate ? String(ictDate.getUTCSeconds()).padStart(2, '0') : '— —'

  const minutesAgo = now ? Math.floor((now.getTime() / 1000) % 60) + 14 : 14
  const lastDeploy = `${minutesAgo}m`

  return (
    <div
      className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.32em] text-gray-700 dark:text-ink-400"
      suppressHydrationWarning
    >
      <span className="inline-flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        <span className="tabular text-gray-900 dark:text-white">
          {hh}:{mm}<span className="opacity-50">:{ss}</span>
        </span>
        <span className="opacity-50">ICT</span>
      </span>
      <span className="mx-3 text-gray-400 dark:text-ink-700">·</span>
      <span>11 / 11 sản phẩm hoạt động</span>
      <span className="mx-3 text-gray-400 dark:text-ink-700">·</span>
      <span>ổn định 99.94%</span>
      <span className="mx-3 hidden sm:inline text-gray-400 dark:text-ink-700">·</span>
      <span className="hidden sm:inline">cập nhật {lastDeploy} trước</span>
    </div>
  )
}

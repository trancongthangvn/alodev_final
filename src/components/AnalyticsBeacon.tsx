'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

/**
 * Privacy-friendly analytics beacon — sends pageview + duration events
 * to /api/track. No cookies; session ID lives in sessionStorage and
 * dies when the tab closes.
 *
 * Skips:
 *   • /admin/* paths (server also filters; defense in depth)
 *   • Bot user agents (server side)
 *   • Browsers with `navigator.doNotTrack === '1'`
 *   • Crawl-time render (typeof window check)
 */

function ts(): number { return Date.now() }
function rand(): string {
  return [...crypto.getRandomValues(new Uint8Array(8))].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function sessionId(): string {
  try {
    let id = sessionStorage.getItem('al_sid')
    if (!id) { id = rand(); sessionStorage.setItem('al_sid', id) }
    return id
  } catch {
    // Private mode / SSR — fall back to per-call random (no session continuity)
    return rand()
  }
}

let lastPath = ''
let pathStartedAt = 0

function track(payload: object): void {
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', blob)
    } else {
      // Fallback: fire-and-forget fetch (won't block unload but might miss)
      fetch('/api/track', { method: 'POST', body: blob, keepalive: true }).catch(() => {})
    }
  } catch { /* swallow — analytics never breaks the page */ }
}

function flushDuration() {
  if (!lastPath || !pathStartedAt) return
  const dur = ts() - pathStartedAt
  track({ type: 'duration', sid: sessionId(), path: lastPath, dur })
}

function trackPageview(path: string, params: URLSearchParams) {
  // Flush previous page's duration first (route change)
  flushDuration()

  if (path.startsWith('/admin') || path.startsWith('/api')) return

  lastPath = path
  pathStartedAt = ts()

  track({
    type: 'pageview',
    sid: sessionId(),
    path,
    title: typeof document !== 'undefined' ? document.title.slice(0, 200) : '',
    ref: typeof document !== 'undefined' ? document.referrer : '',
    scr_w: typeof window !== 'undefined' ? window.innerWidth : 0,
    utm_source:   params.get('utm_source')   || undefined,
    utm_medium:   params.get('utm_medium')   || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
  })
}

function BeaconInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Skip if user has DNT enabled
    if (typeof navigator !== 'undefined' && (navigator as Navigator & { doNotTrack?: string }).doNotTrack === '1') return

    if (!pathname) return
    trackPageview(pathname, searchParams || new URLSearchParams())
  }, [pathname, searchParams])

  useEffect(() => {
    // Send duration when user leaves the tab. `pagehide` is more reliable
    // than `beforeunload` (fires on bfcache nav; on iOS too).
    const handler = () => flushDuration()
    window.addEventListener('pagehide', handler)
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushDuration()
    })
    return () => window.removeEventListener('pagehide', handler)
  }, [])

  return null
}

export default function AnalyticsBeacon() {
  // useSearchParams needs Suspense boundary in Next 13+
  return <Suspense fallback={null}><BeaconInner /></Suspense>
}

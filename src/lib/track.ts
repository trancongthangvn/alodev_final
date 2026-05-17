/**
 * Client-side analytics helper — fire generic events and web vitals to
 * /api/track without blocking page interaction. Uses sendBeacon when
 * available so events survive page unload (e.g. user clicks Zalo CTA
 * which navigates away).
 *
 * Session ID is shared with AnalyticsBeacon via sessionStorage('al_sid')
 * so events and pageviews join on the same session.
 */

function sessionId(): string {
  try {
    let id = sessionStorage.getItem('al_sid')
    if (!id) {
      id = [...crypto.getRandomValues(new Uint8Array(8))]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      sessionStorage.setItem('al_sid', id)
    }
    return id
  } catch {
    return [...crypto.getRandomValues(new Uint8Array(8))]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
}

function send(payload: object): void {
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', blob)
    } else if (typeof fetch !== 'undefined') {
      fetch('/api/track', { method: 'POST', body: blob, keepalive: true }).catch(() => {})
    }
  } catch { /* analytics never throws into the page */ }
}

/**
 * Track a named event. `meta` is a small JSON blob (<1KB).
 *
 * Examples:
 *   trackEvent('cta_popup_shown')
 *   trackEvent('cta_popup_clicked', { variant: 'primary' })
 *   trackEvent('contact_submitted', { source: 'lien-he' })
 */
export function trackEvent(name: string, meta?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') return
  send({
    type: 'event',
    sid: sessionId(),
    path: window.location.pathname,
    name: name.slice(0, 80),
    meta: meta ? JSON.stringify(meta).slice(0, 1000) : undefined,
  })
}

/**
 * Track a Web Vital reading. Called from useReportWebVitals hook.
 */
export function trackVital(metric: { name: string; value: number; rating?: string; id?: string }): void {
  if (typeof window === 'undefined') return
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') return
  send({
    type: 'vital',
    sid: sessionId(),
    path: window.location.pathname,
    metric: metric.name,
    value: Math.round(metric.value * 1000) / 1000,
    rating: metric.rating,
  })
}

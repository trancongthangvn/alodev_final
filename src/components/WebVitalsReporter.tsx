'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { trackVital } from '@/lib/track'

/**
 * Hooks into Next.js's built-in vitals reporter and fans each reading out
 * to /api/track. Next bundles the `web-vitals` library internally so no
 * extra dependency is needed.
 *
 * Metrics reported:
 *   - LCP (Largest Contentful Paint)
 *   - INP (Interaction to Next Paint) — replaces FID in CWV
 *   - CLS (Cumulative Layout Shift)
 *   - FCP (First Contentful Paint)
 *   - TTFB (Time To First Byte)
 */
export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    trackVital({ name: metric.name, value: metric.value, rating: metric.rating, id: metric.id })
  })
  return null
}

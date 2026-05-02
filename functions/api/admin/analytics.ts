/**
 * GET /api/admin/analytics?range=7d|30d|90d
 *
 * Aggregates raw pageview events into a dashboard payload:
 *   • totals           — pageviews, unique visitors, sessions, avg duration, bounce rate
 *   • daily            — array of {date, pageviews, visitors} for sparkline
 *   • top_pages        — by pageview count
 *   • top_referrers    — by pageview count (excluding direct)
 *   • top_countries    — by visitor count
 *   • devices          — pageview share by mobile/tablet/desktop
 *   • browsers         — top 6
 *   • os               — top 6
 *   • utm              — by source
 *   • realtime         — visitors active in last 5 minutes
 *
 * Auth: ../_middleware.ts gates.
 *
 * D1 rate consideration: this endpoint runs ~10 queries per call. Admin
 * dashboard polls every 30s in foreground — comfortably within free tier.
 */

import { jsonResponse } from '../../_lib/d1-utils'

interface Env { LEADS: D1Database }

const RANGE_DAYS: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url)
  const range = url.searchParams.get('range') || '7d'
  const days = RANGE_DAYS[range] ?? 7

  // Date math — start of range in YYYY-MM-DD UTC.
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString().slice(0, 10)
  const realtimeISO = new Date(Date.now() - 5 * 60 * 1000).toISOString()

  const db = ctx.env.LEADS

  // ─── Totals ───────────────────────────────────────────────────────────
  const totals = await db.prepare(`
    SELECT
      COUNT(*)                              AS pageviews,
      COUNT(DISTINCT visitor_hash || ts_date) AS visitors,
      COUNT(DISTINCT session_id)            AS sessions,
      ROUND(AVG(NULLIF(duration_ms, 0)))    AS avg_duration_ms,
      ROUND(100.0 * SUM(is_bounce) / NULLIF(COUNT(DISTINCT session_id), 0), 1) AS bounce_rate
    FROM analytics_pageviews
    WHERE ts_date >= ?
  `).bind(startDate).first<{
    pageviews: number; visitors: number; sessions: number;
    avg_duration_ms: number | null; bounce_rate: number | null;
  }>()

  // ─── Daily breakdown ──────────────────────────────────────────────────
  const daily = await db.prepare(`
    SELECT ts_date AS date,
           COUNT(*) AS pageviews,
           COUNT(DISTINCT visitor_hash || ts_date) AS visitors
    FROM analytics_pageviews
    WHERE ts_date >= ?
    GROUP BY ts_date
    ORDER BY ts_date ASC
  `).bind(startDate).all<{ date: string; pageviews: number; visitors: number }>()

  // Fill missing dates with zero rows so sparkline has continuous x-axis.
  const dailyFilled: { date: string; pageviews: number; visitors: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const row = (daily.results || []).find((r) => r.date === d)
    dailyFilled.push(row || { date: d, pageviews: 0, visitors: 0 })
  }

  // ─── Top tables ───────────────────────────────────────────────────────
  const [top_pages, top_referrers, top_countries, devices, browsers, os, utm] = await Promise.all([
    db.prepare(`
      SELECT path,
             COUNT(*) AS pageviews,
             COUNT(DISTINCT visitor_hash || ts_date) AS visitors,
             ROUND(AVG(NULLIF(duration_ms, 0))) AS avg_duration_ms
      FROM analytics_pageviews
      WHERE ts_date >= ?
      GROUP BY path
      ORDER BY pageviews DESC
      LIMIT 15
    `).bind(startDate).all(),

    db.prepare(`
      SELECT referrer_host AS host, COUNT(*) AS pageviews
      FROM analytics_pageviews
      WHERE ts_date >= ? AND referrer_host IS NOT NULL AND referrer_host <> ''
      GROUP BY referrer_host
      ORDER BY pageviews DESC
      LIMIT 10
    `).bind(startDate).all(),

    db.prepare(`
      SELECT country, COUNT(DISTINCT visitor_hash || ts_date) AS visitors
      FROM analytics_pageviews
      WHERE ts_date >= ? AND country IS NOT NULL
      GROUP BY country
      ORDER BY visitors DESC
      LIMIT 10
    `).bind(startDate).all(),

    db.prepare(`
      SELECT device, COUNT(*) AS pageviews
      FROM analytics_pageviews
      WHERE ts_date >= ?
      GROUP BY device
      ORDER BY pageviews DESC
    `).bind(startDate).all(),

    db.prepare(`
      SELECT browser, COUNT(*) AS pageviews
      FROM analytics_pageviews
      WHERE ts_date >= ? AND browser <> 'unknown'
      GROUP BY browser
      ORDER BY pageviews DESC
      LIMIT 6
    `).bind(startDate).all(),

    db.prepare(`
      SELECT os, COUNT(*) AS pageviews
      FROM analytics_pageviews
      WHERE ts_date >= ? AND os <> 'unknown'
      GROUP BY os
      ORDER BY pageviews DESC
      LIMIT 6
    `).bind(startDate).all(),

    db.prepare(`
      SELECT utm_source AS source, COUNT(*) AS pageviews
      FROM analytics_pageviews
      WHERE ts_date >= ? AND utm_source IS NOT NULL
      GROUP BY utm_source
      ORDER BY pageviews DESC
      LIMIT 10
    `).bind(startDate).all(),
  ])

  // ─── Realtime: visitors in last 5 minutes ─────────────────────────────
  const realtime = await db.prepare(`
    SELECT COUNT(DISTINCT visitor_hash) AS visitors_now
    FROM analytics_pageviews
    WHERE ts >= ?
  `).bind(realtimeISO).first<{ visitors_now: number }>()

  return jsonResponse(200, {
    range,
    days,
    totals: {
      pageviews:       totals?.pageviews ?? 0,
      visitors:        totals?.visitors ?? 0,
      sessions:        totals?.sessions ?? 0,
      avg_duration_ms: totals?.avg_duration_ms ?? 0,
      bounce_rate:     totals?.bounce_rate ?? 0,
    },
    realtime: { visitors_now: realtime?.visitors_now ?? 0 },
    daily: dailyFilled,
    top_pages:     top_pages.results || [],
    top_referrers: top_referrers.results || [],
    top_countries: top_countries.results || [],
    devices:       devices.results || [],
    browsers:      browsers.results || [],
    os:            os.results || [],
    utm:           utm.results || [],
  })
}

import { Router } from 'express'
import db from '../db.js'

const router = Router()

function ulid() {
  const ts = Date.now().toString(32).padStart(11, '0')
  const rnd = new Uint8Array(10)
  crypto.getRandomValues(rnd)
  return (ts + Array.from(rnd).map((b) => b.toString(32).padStart(2, '0')).join('').slice(0, 15)).toUpperCase()
}

async function sha256Hex(input) {
  const buf = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 24)
}

function todaySalt() { return new Date().toISOString().slice(0, 10) }

function parseUA(ua) {
  const lc = ua.toLowerCase()
  const isTablet = /ipad|tablet|playbook|silk/.test(lc) && !/mobile/.test(lc)
  const isMobile = !isTablet && /mobi|iphone|android|phone|silk/.test(lc)
  const device = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

  let browser = 'unknown'
  if (/edg\//.test(lc)) browser = 'Edge'
  else if (/chrome\//.test(lc) && !/edg|opr|samsung/.test(lc)) browser = 'Chrome'
  else if (/safari\//.test(lc) && !/chrome/.test(lc)) browser = 'Safari'
  else if (/firefox\//.test(lc)) browser = 'Firefox'
  else if (/opr\/|opera\//.test(lc)) browser = 'Opera'
  else if (/samsungbrowser/.test(lc)) browser = 'Samsung'

  let os = 'unknown'
  if (/iphone os|ipad/.test(lc)) os = 'iOS'
  else if (/mac os x/.test(lc)) os = 'macOS'
  else if (/android/.test(lc)) os = 'Android'
  else if (/windows nt/.test(lc)) os = 'Windows'
  else if (/linux/.test(lc)) os = 'Linux'

  return { device, browser, os }
}

function refererHost(ref) {
  if (!ref) return null
  try {
    const u = new URL(ref)
    if (u.hostname === 'alodev.vn' || u.hostname === 'www.alodev.vn') return null
    return u.hostname.slice(0, 100)
  } catch { return null }
}

function normPath(p) {
  if (!p) return '/'
  if (!p.startsWith('/')) p = '/' + p
  const q = p.indexOf('?'); if (q >= 0) p = p.slice(0, q)
  const h = p.indexOf('#'); if (h >= 0) p = p.slice(0, h)
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p.slice(0, 500)
}

function clean(s, max) {
  if (typeof s !== 'string') return ''
  return s.replace(/[ -]/g, '').slice(0, max).trim()
}

const BOT_RE = /bot|crawler|spider|scrape|google|bing|yandex|baidu|duckduck|slurp|facebookexternalhit|whatsapp|telegram|discord|slack|linkedin/i

router.post('/', async (req, res) => {
  if (req.headers['dnt'] === '1') return res.status(204).send()

  const body = req.body
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid JSON' })

  const sid = clean(body.sid, 32)
  if (!sid) return res.status(400).json({ error: 'sid required' })

  const path = normPath(clean(body.path, 500))
  if (!path || path.startsWith('/admin') || path.startsWith('/api/')) return res.status(204).send()

  if (body.type === 'duration') {
    const dur = typeof body.dur === 'number' && body.dur > 0 && body.dur < 86400000
      ? Math.round(body.dur) : 0
    if (!dur) return res.status(204).send()
    try {
      db.prepare(`
        UPDATE analytics_pageviews SET duration_ms = ?
        WHERE id = (
          SELECT id FROM analytics_pageviews
          WHERE session_id = ? AND path = ? ORDER BY ts DESC LIMIT 1
        )
      `).run(dur, sid, path)
    } catch { /* best-effort */ }
    return res.status(204).send()
  }

  // CF-forwarded headers → country detection works via proxy
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || ''
  const ua = req.headers['user-agent'] || ''
  const country = req.headers['cf-ipcountry'] || null

  if (BOT_RE.test(ua)) return res.status(204).send()

  const visitor_hash = await sha256Hex(`${ip}|${ua}|${todaySalt()}`)
  const id = ulid()
  const now = new Date()
  const ts = now.toISOString()
  const ts_date = ts.slice(0, 10)
  const title = clean(body.title, 200) || null
  const referrer_host = refererHost(clean(body.ref, 200))
  const utm_source = clean(body.utm_source, 100) || null
  const utm_medium = clean(body.utm_medium, 100) || null
  const utm_campaign = clean(body.utm_campaign, 100) || null
  const screen_w = typeof body.scr_w === 'number' && body.scr_w > 0 && body.scr_w < 10000 ? Math.round(body.scr_w) : null
  const { device, browser, os } = parseUA(ua)

  let isFirst = true
  try {
    isFirst = !db.prepare('SELECT 1 FROM analytics_pageviews WHERE session_id = ? LIMIT 1').get(sid)
  } catch { /* ignore */ }

  try {
    db.prepare(`
      INSERT INTO analytics_pageviews
        (id, ts, ts_date, session_id, visitor_hash, path, title, referrer_host,
         country, device, browser, os, screen_w, utm_source, utm_medium, utm_campaign,
         duration_ms, is_bounce)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL,1)
    `).run(id, ts, ts_date, sid, visitor_hash, path, title, referrer_host,
      country, device, browser, os, screen_w, utm_source, utm_medium, utm_campaign)

    if (!isFirst) {
      db.prepare('UPDATE analytics_pageviews SET is_bounce = 0 WHERE session_id = ?').run(sid)
    }
  } catch { /* swallow — drops 1 event in worst case */ }

  res.status(204).send()
})

router.all('/', (req, res) => res.status(405).send())

export default router

import { Router } from 'express'
import db from '../db.js'

const router = Router()

// ─── Shared utils ────────────────────────────────────────────────────────────

function ulid() {
  const ts = Date.now().toString(32).padStart(11, '0')
  const rnd = new Uint8Array(10)
  crypto.getRandomValues(rnd)
  const rndStr = Array.from(rnd)
    .map((b) => b.toString(32).padStart(2, '0'))
    .join('')
    .slice(0, 15)
  return (ts + rndStr).toUpperCase()
}

function slugify(input) {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function readingTime(text) {
  const stripped = (text || '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*`>\[\]()_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return Math.max(1, Math.round(stripped.split(' ').filter(Boolean).length / 200))
}

function nowISO() {
  return new Date().toISOString()
}

function trunc(s, n) {
  if (typeof s !== 'string') return ''
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

function jsonOrNull(v) {
  if (v == null) return null
  if (typeof v === 'string') return v.trim() ? v : null
  try { return JSON.stringify(v) } catch { return null }
}

const CONTENT_TYPES = new Set(['guide', 'listicle', 'how-to', 'review', 'comparison', 'news'])
const PRIMARY_INTENTS = new Set(['informational', 'commercial', 'transactional', 'navigational'])
const BLOG_STATUSES = new Set(['draft', 'published', 'archived'])
const LEAD_STATUSES = new Set(['new', 'reading', 'replied', 'qualified', 'won', 'lost', 'spam'])

// ─── Basic Auth ───────────────────────────────────────────────────────────────

function timingSafeEq(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

router.use((req, res, next) => {
  const expectedUser = process.env.ADMIN_USER || '1'
  const expectedPass = process.env.ADMIN_PASS || '1'
  const header = req.headers['authorization'] || ''
  if (!header.startsWith('Basic ')) {
    return res.status(401).set('WWW-Authenticate', 'Basic realm="Alodev Admin"').json({ error: 'Unauthorized' })
  }
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
    const colon = decoded.indexOf(':')
    if (colon === -1) throw new Error('bad format')
    const user = decoded.slice(0, colon)
    const pass = decoded.slice(colon + 1)
    if (!timingSafeEq(user, expectedUser) || !timingSafeEq(pass, expectedPass)) throw new Error('bad creds')
    next()
  } catch {
    res.status(401).set('WWW-Authenticate', 'Basic realm="Alodev Admin"').json({ error: 'Unauthorized' })
  }
})

// ─── Leads ───────────────────────────────────────────────────────────────────

router.get('/leads', (req, res) => {
  const { status, source, search } = req.query
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 100, 1), 500)
  const offset = Math.max(parseInt(req.query.offset) || 0, 0)

  const where = []
  const binds = []
  if (status) { where.push('status = ?'); binds.push(status) }
  if (source) { where.push('source = ?'); binds.push(source) }
  if (search) {
    where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)')
    const term = `%${search.replace(/[%_]/g, '')}%`
    binds.push(term, term, term, term)
  }
  const w = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const total = db.prepare(`SELECT COUNT(*) AS n FROM leads ${w}`).get(...binds).n
  const leads = db.prepare(`
    SELECT id, source, name, email, phone, company, service, budget, budget_vnd,
           message, status, country, created_at, replied_at
    FROM leads ${w}
    ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(...binds, limit, offset)

  res.json({ leads, total, limit, offset })
})

router.patch('/leads/:id', (req, res) => {
  const { id } = req.params
  const body = req.body || {}
  const sets = []
  const binds = []

  if ('status' in body && LEAD_STATUSES.has(body.status)) { sets.push('status = ?'); binds.push(body.status) }
  if ('notes' in body) { sets.push('notes = ?'); binds.push(typeof body.notes === 'string' ? body.notes.slice(0, 2000) : null) }
  if ('replied_at' in body) { sets.push('replied_at = ?'); binds.push(body.replied_at || null) }

  if (!sets.length) return res.status(400).json({ error: 'No updatable fields' })
  binds.push(id)

  const r = db.prepare(`UPDATE leads SET ${sets.join(', ')} WHERE id = ?`).run(...binds)
  if (r.changes === 0) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

// ─── Blog ─────────────────────────────────────────────────────────────────────

router.get('/blog', (req, res) => {
  const { status, search } = req.query
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 200)
  const offset = Math.max(parseInt(req.query.offset) || 0, 0)

  const where = []
  const binds = []
  if (status) { where.push('status = ?'); binds.push(status) }
  if (search) {
    where.push('(title LIKE ? OR description LIKE ? OR tags LIKE ?)')
    const term = `%${search.replace(/[%_]/g, '')}%`
    binds.push(term, term, term)
  }
  const w = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const total = db.prepare(`SELECT COUNT(*) AS n FROM blog_posts ${w}`).get(...binds).n
  const posts = db.prepare(`
    SELECT id, slug, title, description, cover_image, tags, status,
           author_name, reading_min, published_at, created_at, updated_at,
           seo_title, focus_keyword, content_type, primary_intent
    FROM blog_posts ${w}
    ORDER BY updated_at DESC LIMIT ? OFFSET ?
  `).all(...binds, limit, offset)

  res.json({ posts, total, limit, offset })
})

router.post('/blog', (req, res) => {
  const body = req.body || {}
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  if (!title) return res.status(400).json({ error: 'title required' })

  const rawSlug = typeof body.slug === 'string' && body.slug.trim() ? body.slug.trim() : slugify(title)
  const clash = db.prepare('SELECT id FROM blog_posts WHERE slug = ?').get(rawSlug)
  const slug = clash ? `${rawSlug}-${Date.now().toString(36)}` : rawSlug

  const now = nowISO()
  const content = typeof body.content === 'string' ? body.content : ''
  const id = ulid()

  db.prepare(`
    INSERT INTO blog_posts (
      id, slug, title, description, content, content_html, cover_image, tags,
      status, author_name, reading_min, published_at, created_at, updated_at,
      seo_title, focus_keyword, content_type, primary_intent,
      lsi_keywords, faq, key_takeaways, related_entities
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    id, slug, title,
    trunc(body.description, 300) || null,
    content,
    typeof body.content_html === 'string' ? body.content_html : null,
    trunc(body.cover_image, 500) || null,
    trunc(body.tags, 300) || null,
    'draft',
    trunc(body.author_name, 100) || 'Trần Công Thắng',
    readingTime(body.content_html || content),
    null,
    now, now,
    trunc(body.seo_title, 200) || null,
    trunc(body.focus_keyword, 100) || null,
    CONTENT_TYPES.has(body.content_type) ? body.content_type : null,
    PRIMARY_INTENTS.has(body.primary_intent) ? body.primary_intent : null,
    jsonOrNull(body.lsi_keywords),
    jsonOrNull(body.faq),
    jsonOrNull(body.key_takeaways),
    jsonOrNull(body.related_entities),
  )

  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id)
  res.json({ ok: true, post })
})

router.get('/blog/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id)
  if (!post) return res.status(404).json({ error: 'Not found' })
  res.json({ post })
})

router.patch('/blog/:id', (req, res) => {
  const { id } = req.params
  const existing = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id)
  if (!existing) return res.status(404).json({ error: 'Not found' })

  const body = req.body || {}
  const now = nowISO()
  const fields = {}

  if ('title' in body && typeof body.title === 'string') fields.title = body.title.trim()
  if ('slug' in body && typeof body.slug === 'string') fields.slug = body.slug.trim()
  if ('description' in body) fields.description = trunc(body.description, 300) || null
  if ('content' in body) {
    fields.content = typeof body.content === 'string' ? body.content : ''
    fields.reading_min = readingTime(body.content_html || fields.content || existing.content || '')
  }
  if ('content_html' in body) fields.content_html = typeof body.content_html === 'string' ? body.content_html : null
  if ('cover_image' in body) fields.cover_image = trunc(body.cover_image, 500) || null
  if ('tags' in body) fields.tags = trunc(body.tags, 300) || null
  if ('author_name' in body) fields.author_name = trunc(body.author_name, 100) || existing.author_name
  if ('seo_title' in body) fields.seo_title = trunc(body.seo_title, 200) || null
  if ('focus_keyword' in body) fields.focus_keyword = trunc(body.focus_keyword, 100) || null
  if ('content_type' in body) fields.content_type = CONTENT_TYPES.has(body.content_type) ? body.content_type : null
  if ('primary_intent' in body) fields.primary_intent = PRIMARY_INTENTS.has(body.primary_intent) ? body.primary_intent : null
  if ('lsi_keywords' in body) fields.lsi_keywords = jsonOrNull(body.lsi_keywords)
  if ('faq' in body) fields.faq = jsonOrNull(body.faq)
  if ('key_takeaways' in body) fields.key_takeaways = jsonOrNull(body.key_takeaways)
  if ('related_entities' in body) fields.related_entities = jsonOrNull(body.related_entities)

  if ('status' in body && BLOG_STATUSES.has(body.status)) {
    fields.status = body.status
    if (body.status === 'published' && !existing.published_at) {
      fields.published_at = now
    }
  }

  fields.updated_at = now

  const keys = Object.keys(fields)
  if (keys.length <= 1) return res.json({ ok: true, post: existing }) // only updated_at

  const sets = keys.map((k) => `${k} = ?`).join(', ')
  db.prepare(`UPDATE blog_posts SET ${sets} WHERE id = ?`).run(...Object.values(fields), id)
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id)
  res.json({ ok: true, post })
})

router.delete('/blog/:id', (req, res) => {
  const r = db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id)
  if (r.changes === 0) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

// ─── Analytics ────────────────────────────────────────────────────────────────

router.get('/analytics', (req, res) => {
  const RANGE_DAYS = { '7d': 7, '30d': 30, '90d': 90 }
  const range = req.query.range || '7d'
  const days = RANGE_DAYS[range] ?? 7
  const startDate = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10)
  const realtimeISO = new Date(Date.now() - 5 * 60000).toISOString()

  const totals = db.prepare(`
    SELECT COUNT(*) AS pageviews,
           COUNT(DISTINCT visitor_hash || ts_date) AS visitors,
           COUNT(DISTINCT session_id) AS sessions,
           ROUND(AVG(NULLIF(duration_ms,0))) AS avg_duration_ms,
           ROUND(100.0*SUM(is_bounce)/NULLIF(COUNT(DISTINCT session_id),0),1) AS bounce_rate
    FROM analytics_pageviews WHERE ts_date >= ?
  `).get(startDate)

  const dailyRaw = db.prepare(`
    SELECT ts_date AS date, COUNT(*) AS pageviews,
           COUNT(DISTINCT visitor_hash || ts_date) AS visitors
    FROM analytics_pageviews WHERE ts_date >= ?
    GROUP BY ts_date ORDER BY ts_date ASC
  `).all(startDate)

  const dailyMap = new Map(dailyRaw.map((r) => [r.date, r]))
  const daily = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    daily.push(dailyMap.get(d) || { date: d, pageviews: 0, visitors: 0 })
  }

  const top_pages = db.prepare(`
    SELECT path, COUNT(*) AS pageviews,
           COUNT(DISTINCT visitor_hash || ts_date) AS visitors,
           ROUND(AVG(NULLIF(duration_ms,0))) AS avg_duration_ms
    FROM analytics_pageviews WHERE ts_date >= ?
    GROUP BY path ORDER BY pageviews DESC LIMIT 15
  `).all(startDate)

  const top_referrers = db.prepare(`
    SELECT referrer_host AS host, COUNT(*) AS pageviews
    FROM analytics_pageviews
    WHERE ts_date >= ? AND referrer_host IS NOT NULL AND referrer_host <> ''
    GROUP BY referrer_host ORDER BY pageviews DESC LIMIT 10
  `).all(startDate)

  const top_countries = db.prepare(`
    SELECT country, COUNT(DISTINCT visitor_hash || ts_date) AS visitors
    FROM analytics_pageviews WHERE ts_date >= ? AND country IS NOT NULL
    GROUP BY country ORDER BY visitors DESC LIMIT 10
  `).all(startDate)

  const devices = db.prepare(`
    SELECT device, COUNT(*) AS pageviews FROM analytics_pageviews
    WHERE ts_date >= ? GROUP BY device ORDER BY pageviews DESC
  `).all(startDate)

  const browsers = db.prepare(`
    SELECT browser, COUNT(*) AS pageviews FROM analytics_pageviews
    WHERE ts_date >= ? AND browser <> 'unknown'
    GROUP BY browser ORDER BY pageviews DESC LIMIT 6
  `).all(startDate)

  const os_rows = db.prepare(`
    SELECT os, COUNT(*) AS pageviews FROM analytics_pageviews
    WHERE ts_date >= ? AND os <> 'unknown'
    GROUP BY os ORDER BY pageviews DESC LIMIT 6
  `).all(startDate)

  const utm = db.prepare(`
    SELECT utm_source AS source, COUNT(*) AS pageviews FROM analytics_pageviews
    WHERE ts_date >= ? AND utm_source IS NOT NULL
    GROUP BY utm_source ORDER BY pageviews DESC LIMIT 10
  `).all(startDate)

  const realtime = db.prepare(`
    SELECT COUNT(DISTINCT visitor_hash) AS visitors_now
    FROM analytics_pageviews WHERE ts >= ?
  `).get(realtimeISO)

  res.json({
    range, days,
    totals: {
      pageviews: totals?.pageviews ?? 0,
      visitors: totals?.visitors ?? 0,
      sessions: totals?.sessions ?? 0,
      avg_duration_ms: totals?.avg_duration_ms ?? 0,
      bounce_rate: totals?.bounce_rate ?? 0,
    },
    realtime: { visitors_now: realtime?.visitors_now ?? 0 },
    daily, top_pages, top_referrers, top_countries,
    devices, browsers, os: os_rows, utm,
  })
})

// ─── Settings ─────────────────────────────────────────────────────────────────

router.get('/settings', (req, res) => {
  const rows = db.prepare('SELECT key, value, updated_at FROM site_settings').all()
  const settings = {}
  for (const r of rows) {
    try { settings[r.key] = JSON.parse(r.value) } catch { settings[r.key] = r.value }
  }
  res.json({ settings })
})

router.patch('/settings', (req, res) => {
  const body = req.body
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Body must be an object' })
  }
  const now = nowISO()
  const allowed = new Set(db.prepare('SELECT key FROM site_settings').all().map((r) => r.key))
  const upd = db.prepare('UPDATE site_settings SET value = ?, updated_at = ? WHERE key = ?')
  const changed = []

  for (const [key, value] of Object.entries(body)) {
    if (!allowed.has(key)) continue
    const json = JSON.stringify(value)
    if (json.length > 5000) return res.status(400).json({ error: `Value for ${key} too large` })
    upd.run(json, now, key)
    changed.push(key)
  }
  res.json({ ok: true, changed })
})

export default router

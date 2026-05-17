import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import db from './db.js'
import contactRoutes from './routes/contact.js'
import deployWebhookRoutes from './routes/deploy-webhook.js'
import adminRoutes from './routes/admin.js'
import trackRoutes from './routes/track.js'

const app = express()
app.set('trust proxy', 1)
const PORT = process.env.PORT || 3014

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map((s) => s.trim())

// Minimal CSP — Express only returns JSON, so script-src/style-src can be empty.
// HTML headers are set by nginx on the static export (see /etc/nginx/sites-available/alodev.vn).
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  // API never needs to be framed.
  xFrameOptions: { action: 'deny' },
}))

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return cb(null, true)
    cb(null, false)
  },
  credentials: true,
}))
app.use(express.json({ limit: '64kb' }))

// CF Origin guard: requests reaching admin/deploy MUST come through Cloudflare
// (api.alodev.vn tunnel). CF sets `cf-connecting-ip` on every edge request;
// a raw request to the tunnel origin from a non-CF source won't have it.
// Disable via SKIP_CF_GUARD=1 for local dev.
function cfOriginOnly(req, res, next) {
  if (process.env.SKIP_CF_GUARD === '1') return next()
  if (!req.headers['cf-connecting-ip']) {
    return res.status(403).json({ error: 'forbidden_non_cf_origin' })
  }
  next()
}

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'too_many_requests' },
})

const deployLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 3,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'too_many_requests' },
})

// ─── Public routes ───────────────────────────────────────────────────────────

app.use('/api/contact', contactRoutes)
app.use('/api/track', trackRoutes)

// Public blog API — used by sync-blog.mjs at build time to generate static JSON
app.get('/api/blog', (req, res) => {
  function parseJsonArr(s) {
    if (!s) return []
    try { const v = JSON.parse(s); return Array.isArray(v) ? v : [] } catch { return [] }
  }

  const posts = db.prepare(`
    SELECT id, slug, title, description, content, content_html, cover_image, tags,
           author_name, reading_min, published_at, created_at, updated_at,
           seo_title, focus_keyword, content_type, primary_intent,
           lsi_keywords, faq, key_takeaways, related_entities
    FROM blog_posts
    WHERE status = 'published' AND published_at IS NOT NULL
    ORDER BY published_at DESC
  `).all()

  const settings_rows = db.prepare('SELECT key, value FROM site_settings').all()
  const settings = {}
  for (const r of settings_rows) {
    try { settings[r.key] = JSON.parse(r.value) } catch { settings[r.key] = r.value }
  }

  res.json({
    posts: posts.map((p) => ({
      ...p,
      tags: p.tags ? p.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      lsi_keywords: parseJsonArr(p.lsi_keywords),
      faq: parseJsonArr(p.faq),
      key_takeaways: parseJsonArr(p.key_takeaways),
      related_entities: parseJsonArr(p.related_entities),
    })),
    settings,
    synced_at: new Date().toISOString(),
  })
})

// ─── Health ──────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const out = { ok: true, service: 'alodev-api', uptime: process.uptime() }
  try {
    const blogStats = db.prepare(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status='published' AND published_at IS NOT NULL THEN 1 ELSE 0 END) AS published,
        MAX(updated_at) AS last_updated_at
      FROM blog_posts
    `).get()
    out.db = { ok: true, ...blogStats }
  } catch (err) {
    out.ok = false
    out.db = { ok: false, error: String(err).slice(0, 120) }
  }
  res.status(out.ok ? 200 : 503).json(out)
})

// ─── Admin (CF-only + rate limit + Basic Auth inside) ────────────────────────
app.use('/api/admin', cfOriginOnly, adminLimiter, adminRoutes)

// ─── Internal deploy webhook (CF-only + rate limit + token inside) ───────────
app.use('/api', cfOriginOnly, deployLimiter, deployWebhookRoutes)


app.use('/api', (req, res) => res.status(404).json({ error: 'not_found' }))
app.use((err, req, res, _next) => {
  console.error('Unhandled:', err)
  res.status(500).json({ error: 'internal_error' })
})

const server = app.listen(PORT, () => {
  console.log(`alodev-api listening on http://127.0.0.1:${PORT}`)
})

function shutdown(sig) {
  console.log(`${sig} received, shutting down…`)
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(1), 5000)
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

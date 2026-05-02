import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import db from './db.js'
import contactRoutes from './routes/contact.js'
import deployWebhookRoutes from './routes/deploy-webhook.js'
import adminRoutes from './routes/admin.js'
import trackRoutes from './routes/track.js'

const app = express()
app.set('trust proxy', 1)
const PORT = process.env.PORT || 3014

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map((s) => s.trim())

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }))
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return cb(null, true)
    cb(null, false)
  },
  credentials: true,
}))
app.use(express.json({ limit: '64kb' }))

// ─── Public routes ───────────────────────────────────────────────────────────

// Contact form (public — rate-limited inside)
app.use('/api/contact', contactRoutes)

// Analytics beacon (public — accepts pageview + duration events)
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

// ─── Admin API (Basic Auth enforced inside adminRoutes) ───────────────────────
app.use('/api/admin', adminRoutes)

// ─── Internal deploy webhook (called by CF Pages Function /api/admin/deploy) ──
app.use('/api', deployWebhookRoutes)

// ─── Health ──────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'alodev-api', uptime: process.uptime() })
})

// 404 + global error handler
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

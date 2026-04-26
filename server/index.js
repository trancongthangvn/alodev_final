// Minimal contact-form API for alodev.vn.
// After the agency pivot the only thing the backend needs to do is accept
// quote requests and forward them to a notification channel (Telegram).
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import contactRoutes from './routes/contact.js'

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
  credentials: false,
}))
app.use(express.json({ limit: '64kb' }))

// Contact form
app.use('/api/contact', contactRoutes)

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'alodev-api', uptime: process.uptime() })
})

// 404 for any other API path
app.use('/api', (req, res) => res.status(404).json({ error: 'not_found' }))

// Global error handler
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

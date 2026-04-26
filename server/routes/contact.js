import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = Router()

// 5 submissions per IP per hour
const limiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false })

const dataDir = path.join(__dirname, '..', 'data')
fs.mkdirSync(dataDir, { recursive: true })
const logFile = path.join(dataDir, 'contact-submissions.jsonl')

// Notify Telegram if env vars are set. Fire-and-forget — we don't fail the
// HTTP response if Telegram is down or not configured.
async function notifyTelegram(entry) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  const text = [
    '🟦 *LEAD MỚI — alodev.vn*',
    '',
    `*Họ tên:* ${entry.name}`,
    `*Phone:* ${entry.phone}`,
    `*Email:* ${entry.email}`,
    `*Dịch vụ:* ${entry.service || '—'}`,
    `*Ngân sách:* ${entry.budget || '—'}`,
    '',
    '*Mô tả:*',
    entry.message,
    '',
    `_${entry.at} · IP ${entry.ip}_`,
  ].join('\n')

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
      signal: AbortSignal.timeout(5000),
    })
    if (!r.ok) {
      const body = await r.text().catch(() => '')
      console.warn('telegram notify failed', r.status, body)
    }
  } catch (err) {
    console.warn('telegram notify error', err?.message || err)
  }
}

router.post('/', limiter, async (req, res) => {
  const { name, email, phone, service, budget, message } = req.body || {}
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'missing_fields' })
  }
  if (String(name).length > 200 || String(email).length > 200 || String(message).length > 5000) {
    return res.status(400).json({ error: 'too_long' })
  }
  // Cheap honeypot: reject obvious spam patterns
  if (/<script|http:\/\/|https:\/\/.+https:\/\//i.test(String(message))) {
    return res.status(400).json({ error: 'rejected' })
  }
  const entry = {
    at: new Date().toISOString(),
    ip: req.ip,
    ua: (req.get('user-agent') || '').slice(0, 200),
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    phone: String(phone).slice(0, 50),
    service: String(service || '').slice(0, 100),
    budget: String(budget || '').slice(0, 100),
    message: String(message).slice(0, 5000),
  }
  try {
    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n')
  } catch (err) {
    console.error('contact write failed', err)
    return res.status(500).json({ error: 'storage_error' })
  }
  // Notify in background — don't block response
  notifyTelegram(entry).catch(() => {})
  res.json({ ok: true })
})

export default router

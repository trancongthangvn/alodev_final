import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit'
import db from '../db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = Router()

const limiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false })

const dataDir = path.join(__dirname, '..', 'data')
fs.mkdirSync(dataDir, { recursive: true })
const logFile = path.join(dataDir, 'contact-submissions.jsonl')

const PHONE_RE = /^0\d{9}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function ulid() {
  const ts = Date.now().toString(32).padStart(11, '0')
  const rnd = new Uint8Array(10)
  crypto.getRandomValues(rnd)
  return (ts + Array.from(rnd).map((b) => b.toString(32).padStart(2, '0')).join('').slice(0, 15)).toUpperCase()
}

function nowISO() { return new Date().toISOString() }

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
    if (!r.ok) console.warn('telegram notify failed', r.status, await r.text().catch(() => ''))
  } catch (err) {
    console.warn('telegram notify error', err?.message || err)
  }
}

async function notifyEmail(entry) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_EMAIL_TO || 'hello@alodev.vn'
  const from = process.env.NOTIFY_EMAIL_FROM || 'leads@alodev.vn'
  if (!apiKey) return

  const html = `
    <h2>Lead mới — alodev.vn</h2>
    <table>
      <tr><td><b>Họ tên</b></td><td>${entry.name}</td></tr>
      <tr><td><b>Phone</b></td><td>${entry.phone}</td></tr>
      <tr><td><b>Email</b></td><td>${entry.email}</td></tr>
      <tr><td><b>Dịch vụ</b></td><td>${entry.service || '—'}</td></tr>
      <tr><td><b>Ngân sách</b></td><td>${entry.budget || '—'}</td></tr>
    </table>
    <h3>Nội dung:</h3>
    <p>${entry.message.replace(/\n/g, '<br>')}</p>
    <hr><small>${entry.at} · IP ${entry.ip}</small>
  `

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject: `Lead mới: ${entry.name} – ${entry.service || 'alodev.vn'}`, html }),
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) console.warn('resend notify failed', r.status, await r.text().catch(() => ''))
  } catch (err) {
    console.warn('resend notify error', err?.message || err)
  }
}

router.post('/', limiter, async (req, res) => {
  const body = req.body || {}
  const name = String(body.name || '').trim().slice(0, 120)
  const email = String(body.email || '').trim().slice(0, 200)
  const phone = String(body.phone || '').replace(/\s/g, '').slice(0, 32)
  const service = String(body.service || '').trim().slice(0, 80)
  const budget = String(body.budget || '').trim().slice(0, 80)
  const message = String(body.message || '').trim().slice(0, 5000)
  const company = String(body.company || '').trim().slice(0, 200)

  if (!name) return res.status(400).json({ error: 'missing_field', field: 'name' })
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'invalid_email' })
  if (!phone || !PHONE_RE.test(phone)) return res.status(400).json({ error: 'invalid_phone' })
  if (!message) return res.status(400).json({ error: 'missing_field', field: 'message' })
  if (/<script|http:\/\/|https:\/\/.+https:\/\//i.test(message)) return res.status(400).json({ error: 'rejected' })

  const scope_json = body.scope_json ? JSON.stringify(body.scope_json) : null
  const budget_vnd = typeof body.budget_vnd === 'number' ? body.budget_vnd : null
  const utm_json = body.utm ? JSON.stringify(body.utm) : null
  const source = scope_json ? 'bao-gia' : 'lien-he'
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || ''
  const country = req.headers['cf-ipcountry'] || null
  const ua = (req.headers['user-agent'] || '').slice(0, 500)

  const id = ulid()
  const now = nowISO()

  // Store in SQLite
  try {
    db.prepare(`
      INSERT INTO leads (id, source, name, email, phone, company, service, budget, budget_vnd,
                         scope_json, message, status, utm_json, ip, country, user_agent, created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(id, source, name, email, phone, company || null, service || null,
      budget || null, budget_vnd, scope_json, message,
      'new', utm_json, ip, country, ua, now)
  } catch (err) {
    console.error('contact db write failed', err)
    // Fall through — notifications still fire even if DB fails
  }

  const entry = {
    id, at: now, ip, source, name, email, phone,
    company: company || null, service, budget, message,
  }

  // JSONL backup (legacy — keep for local audit)
  try { fs.appendFileSync(logFile, JSON.stringify(entry) + '\n') } catch { /* ignore */ }

  // Background notifications
  Promise.all([
    notifyTelegram(entry).catch(() => {}),
    notifyEmail(entry).catch(() => {}),
  ]).catch(() => {})

  res.json({ ok: true })
})

export default router

// POST /api/internal-deploy — runs `npm run build && wrangler pages deploy out`
// in the alodev project root, returning 200 immediately.
//
// Auth: bearer token in X-Deploy-Token header; must match INTERNAL_DEPLOY_TOKEN
// env var byte-for-byte. Anyone hitting the public tunnel hostname will need
// the token to trigger a deploy.
//
// The actual build is detached so the request returns fast even though the
// build takes ~15s. stdout/stderr go to server/data/deploy.log so we can
// debug failures without keeping the request open.
//
// On build completion, sends a Telegram message summarizing the result so a
// silent failure (build succeeds with 0 posts, etc) doesn't go unnoticed.
import { Router } from 'express'
import { spawn } from 'node:child_process'
import { timingSafeEqual } from 'node:crypto'
import { openSync, appendFileSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const router = Router()
const TOKEN = process.env.INTERNAL_DEPLOY_TOKEN || ''

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '../..')
const LOG_DIR = resolve(__dirname, '..', 'data')
const LOG_PATH = `${LOG_DIR}/deploy.log`

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  try { return timingSafeEqual(Buffer.from(a), Buffer.from(b)) } catch { return false }
}

// Best-effort Telegram notification — never throws into the request path.
async function notifyTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(5000),
    })
  } catch { /* swallow — Telegram is best-effort */ }
}

// Pull the post count from sync-blog's stdout line so the notification can
// flag obvious data regressions (e.g. "0 posts" after publish).
function extractPostCount(logTail) {
  const m = logTail.match(/\[sync-blog\]\s+(\d+)\s+bai/) || logTail.match(/\[sync-blog\]\s+(\d+)\s+published/)
  return m ? parseInt(m[1], 10) : null
}

function extractDeployUrl(logTail) {
  const m = logTail.match(/https?:\/\/[a-z0-9-]+\.alodev\.pages\.dev/)
  return m ? m[0] : null
}

router.post('/internal-deploy', (req, res) => {
  const sig = req.headers['x-deploy-token']
  if (!TOKEN || !safeEqual(sig, TOKEN)) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  try { mkdirSync(LOG_DIR, { recursive: true }) } catch { /* ignore */ }
  const logFd = openSync(LOG_PATH, 'a')

  const stamp = new Date().toISOString()
  const reason = (req.body && typeof req.body.reason === 'string') ? req.body.reason.slice(0, 100) : 'admin'

  const child = spawn(
    'bash',
    ['-c', 'npm run build && npx wrangler pages deploy out --project-name=alodev --branch=main --commit-dirty=true'],
    {
      cwd: PROJECT_ROOT,
      detached: true,
      stdio: ['ignore', logFd, logFd],
      env: {
        ...process.env,
        CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
        CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
      },
    },
  )

  try {
    appendFileSync(LOG_PATH, `\n=== ${stamp} deploy queued (reason=${reason}, pid=${child.pid}) ===\n`)
  } catch { /* ignore */ }

  // Wait for build completion to fire Telegram. We `unref` so this listener
  // doesn't keep Node alive on shutdown — server lifecycle wins.
  child.unref()
  child.on('exit', (code) => {
    const finished = new Date().toISOString()
    let tail = ''
    try { tail = readFileSync(LOG_PATH, 'utf8').slice(-4000) } catch { /* ignore */ }
    const posts = extractPostCount(tail)
    const url = extractDeployUrl(tail)

    const lines = []
    if (code === 0) {
      lines.push(`✅ <b>alodev deploy OK</b>`)
    } else {
      lines.push(`❌ <b>alodev deploy FAILED</b> (exit ${code})`)
    }
    lines.push(`Reason: <code>${reason}</code>`)
    if (posts !== null) lines.push(`Posts synced: <b>${posts}</b>`)
    if (url) lines.push(`Preview: ${url}`)
    lines.push(`Finished: ${finished}`)
    notifyTelegram(lines.join('\n'))
  })

  res.json({ ok: true, queued: true, pid: child.pid, started_at: stamp, reason })
})

router.get('/internal-deploy/health', (_req, res) => {
  res.json({ ok: true, configured: Boolean(TOKEN) })
})

export default router

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
import { Router } from 'express'
import { spawn } from 'node:child_process'
import { timingSafeEqual } from 'node:crypto'
import { openSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const router = Router()
const TOKEN = process.env.INTERNAL_DEPLOY_TOKEN || ''

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '../..')   // server/routes/.. /.. = project root
const LOG_DIR = resolve(__dirname, '..', 'data')
const LOG_PATH = `${LOG_DIR}/deploy.log`

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  try { return timingSafeEqual(Buffer.from(a), Buffer.from(b)) } catch { return false }
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

  // Pull deploy env (CLOUDFLARE_*, D1_DATABASE_ID) from server/.env via dotenv
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
        D1_DATABASE_ID: process.env.D1_DATABASE_ID,
      },
    },
  )
  child.unref()

  // Header-only marker in log so a single tail of deploy.log is enough to
  // correlate which publish click triggered which build.
  try {
    const fs = require('node:fs')
    fs.appendFileSync(LOG_PATH, `\n=== ${stamp} deploy queued (reason=${reason}, pid=${child.pid}) ===\n`)
  } catch { /* ignore */ }

  res.json({ ok: true, queued: true, pid: child.pid, started_at: stamp, reason })
})

router.get('/internal-deploy/health', (_req, res) => {
  res.json({ ok: true, configured: Boolean(TOKEN) })
})

export default router

#!/usr/bin/env node
/**
 * Build-time sync: fetch published blog posts + settings from the Express API
 * server → write to src/data/{blog,settings}.generated.json → Next.js static
 * export reads these at build time to render /blog/* pages.
 *
 * Required env (set in CI / CF Pages build settings):
 *   API_URL — base URL of the Express server, e.g. https://api.alodev.vn
 *
 * Local dev fallback: if API_URL is missing, writes empty stubs so the build
 * doesn't fail on first checkout.
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const OUT_DIR = join(ROOT, 'src', 'data')
const BLOG_OUT = join(OUT_DIR, 'blog.generated.json')
const SETTINGS_OUT = join(OUT_DIR, 'settings.generated.json')

const API_URL = (process.env.API_URL || '').replace(/\/$/, '')

function emptyStubs(reason) {
  console.warn(`[sync-blog] ${reason} — writing empty stubs.`)
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(BLOG_OUT, JSON.stringify({ posts: [], synced_at: new Date().toISOString() }, null, 2))
  writeFileSync(SETTINGS_OUT, JSON.stringify({ settings: {}, synced_at: new Date().toISOString() }, null, 2))
}

if (!API_URL) {
  if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN) {
    console.warn('[sync-blog] API_URL not set — falling back to D1 sync.')
    await import('./sync-blog-from-d1.mjs')
    process.exit(0)
  }
  emptyStubs('API_URL not set')
  process.exit(0)
}

try {
  const res = await fetch(`${API_URL}/api/blog`, {
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

  writeFileSync(BLOG_OUT, JSON.stringify({
    posts: data.posts || [],
    synced_at: data.synced_at || new Date().toISOString(),
  }, null, 2))

  const settings = data.settings || {}
  writeFileSync(SETTINGS_OUT, JSON.stringify({
    settings,
    synced_at: data.synced_at || new Date().toISOString(),
  }, null, 2))

  console.log(`[sync-blog] ${(data.posts || []).length} bài, ${Object.keys(settings).length} settings`)
} catch (err) {
  console.error('[sync-blog] Sync failed:', err.message)
  emptyStubs('API request failed')
}

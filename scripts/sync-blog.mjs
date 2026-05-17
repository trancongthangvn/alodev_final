#!/usr/bin/env node
/**
 * Build-time sync: fetch published blog posts + settings from the Express API
 * server → write to src/data/{blog,settings}.generated.json → Next.js static
 * export reads these at build time to render /blog/* pages.
 *
 * Required env (loaded via --env-file=.env in npm scripts):
 *   API_URL — base URL of the local Express server, e.g. http://localhost:3014
 *
 * Source of truth is the Express server's SQLite. D1 was retired in commit
 * 34e5814 — do not re-add a D1 fallback here, it caused silent divergence
 * (sync pulling from stale D1 while admin wrote to SQLite).
 *
 * SAFETY: never overwrites existing posts with empty data on sync failure.
 * If the API is unreachable or returns 0 posts but we have cached data, the
 * build continues with stale data rather than publishing an empty blog.
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const OUT_DIR = join(ROOT, 'src', 'data')
const BLOG_OUT = join(OUT_DIR, 'blog.generated.json')
const SETTINGS_OUT = join(OUT_DIR, 'settings.generated.json')

const API_URL = (process.env.API_URL || '').replace(/\/$/, '')

function existingPostCount() {
  try {
    const d = JSON.parse(readFileSync(BLOG_OUT, 'utf8'))
    return Array.isArray(d.posts) ? d.posts.length : 0
  } catch { return 0 }
}

function handleFailure(reason) {
  const count = existingPostCount()
  if (count > 0) {
    console.warn(`[sync-blog] ${reason} — keeping ${count} cached posts. Build will use stale data.`)
    process.exit(0)
  }
  // No cached data (first checkout) — write empty stubs so the build doesn't crash.
  console.warn(`[sync-blog] ${reason} — no cached data, writing empty stubs for first-checkout build.`)
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(BLOG_OUT, JSON.stringify({ posts: [], synced_at: new Date().toISOString() }, null, 2))
  writeFileSync(SETTINGS_OUT, JSON.stringify({ settings: {}, synced_at: new Date().toISOString() }, null, 2))
  process.exit(0)
}

if (!API_URL) {
  handleFailure('API_URL not set — add API_URL=http://localhost:3014 to .env')
  process.exit(0)
}

try {
  const res = await fetch(`${API_URL}/api/blog`, {
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const posts = data.posts || []

  if (posts.length === 0) {
    const cached = existingPostCount()
    if (cached > 0) {
      console.warn(`[sync-blog] API returned 0 posts but cache has ${cached} — keeping cached posts.`)
      process.exit(0)
    }
  }

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

  writeFileSync(BLOG_OUT, JSON.stringify({
    posts,
    synced_at: data.synced_at || new Date().toISOString(),
  }, null, 2))

  const settings = data.settings || {}
  writeFileSync(SETTINGS_OUT, JSON.stringify({
    settings,
    synced_at: data.synced_at || new Date().toISOString(),
  }, null, 2))

  console.log(`[sync-blog] ${posts.length} bai, ${Object.keys(settings).length} settings`)
} catch (err) {
  console.error('[sync-blog] Sync failed:', err.message)
  handleFailure(`API request failed: ${err.message}`)
}

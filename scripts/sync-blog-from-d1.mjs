#!/usr/bin/env node
/**
 * Build-time sync: pull published blog posts + site settings from D1
 * via Cloudflare HTTP API → write to src/data/{blog,settings}.generated.json
 * → Next.js static export reads these files during build.
 *
 * Why this two-step:
 *   • output: 'export' has no server runtime; can't bind D1 at request time
 *   • Pulling at build time once is cheaper than client-side fetch
 *   • JSON files in repo are diff-able for debugging stale content
 *   • Admin "Publish" triggers CF Pages deploy hook → re-runs this → rebuild
 *
 * Required env (set in CF Pages project Build settings, NOT in repo):
 *   CLOUDFLARE_ACCOUNT_ID  — account holding the D1 instance
 *   CLOUDFLARE_API_TOKEN   — token with D1:Read scope (token from this
 *                             session works during local dev)
 *   D1_DATABASE_ID         — the D1 database UUID
 *
 * Local dev fallback: if env vars missing, write empty stubs so `next build`
 * doesn't crash on first checkout. Admin still works once env configured.
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const OUT_DIR = join(ROOT, 'src', 'data')
const BLOG_OUT = join(OUT_DIR, 'blog.generated.json')
const SETTINGS_OUT = join(OUT_DIR, 'settings.generated.json')

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const DB_ID = process.env.D1_DATABASE_ID || '48b7781e-69a2-4cee-bf71-15ed99c893d0'

function emptyStubs(reason) {
  console.warn(`[sync-blog] ${reason} — writing empty stubs.`)
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(BLOG_OUT, JSON.stringify({ posts: [], synced_at: new Date().toISOString() }, null, 2))
  writeFileSync(SETTINGS_OUT, JSON.stringify({ settings: {}, synced_at: new Date().toISOString() }, null, 2))
}

if (!ACCOUNT_ID || !API_TOKEN) {
  emptyStubs('CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN not set')
  process.exit(0)
}

async function d1Query(sql, params = []) {
  const r = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params }),
    },
  )
  const j = await r.json()
  if (!j.success) throw new Error('D1 query failed: ' + JSON.stringify(j.errors))
  return j.result?.[0]?.results || []
}

try {
  const posts = await d1Query(`
    SELECT id, slug, title, description, content, content_html, cover_image, tags,
           author_name, reading_min, published_at, created_at, updated_at,
           seo_title, focus_keyword, content_type, primary_intent,
           lsi_keywords, faq, key_takeaways, related_entities
    FROM blog_posts
    WHERE status = 'published' AND published_at IS NOT NULL
    ORDER BY published_at DESC
  `)

  // JSON-string columns → parsed arrays for the static blog reader.
  function parseJsonArr(s) {
    if (!s) return []
    try { const v = JSON.parse(s); return Array.isArray(v) ? v : [] } catch { return [] }
  }

  const settingsRows = await d1Query(`SELECT key, value FROM site_settings`)
  const settings = {}
  for (const row of settingsRows) {
    try { settings[row.key] = JSON.parse(row.value) }
    catch { settings[row.key] = row.value }
  }

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(BLOG_OUT, JSON.stringify({
    posts: posts.map((p) => ({
      ...p,
      tags: p.tags ? p.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      // Parse stringified JSON arrays into actual arrays so the public page
      // can iterate without re-parsing on every render.
      lsi_keywords: parseJsonArr(p.lsi_keywords),
      faq: parseJsonArr(p.faq),
      key_takeaways: parseJsonArr(p.key_takeaways),
      related_entities: parseJsonArr(p.related_entities),
    })),
    synced_at: new Date().toISOString(),
  }, null, 2))
  writeFileSync(SETTINGS_OUT, JSON.stringify({
    settings,
    synced_at: new Date().toISOString(),
  }, null, 2))

  console.log(`[sync-blog] ${posts.length} published post${posts.length === 1 ? '' : 's'}, ${Object.keys(settings).length} settings`)
} catch (err) {
  console.error('[sync-blog] Sync failed:', err.message)
  emptyStubs('D1 query failed')
}

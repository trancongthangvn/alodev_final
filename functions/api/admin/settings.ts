/**
 * /api/admin/settings
 *   GET   → all settings as { key: parsed_value, ... }
 *   PATCH → bulk update (body is { key: value, ... })
 *
 * Auth: ../_middleware.ts gates.
 */

import { jsonResponse, nowISO } from '../../_lib/d1-utils'

interface Env { LEADS: D1Database }

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const rows = await ctx.env.LEADS.prepare(`SELECT key, value, updated_at FROM site_settings`).all<{ key: string; value: string; updated_at: string }>()
  const out: Record<string, unknown> = {}
  for (const r of rows.results || []) {
    try { out[r.key] = JSON.parse(r.value) } catch { out[r.key] = r.value }
  }
  return jsonResponse(200, { settings: out })
}

export const onRequestPatch: PagesFunction<Env> = async (ctx) => {
  let body: Record<string, unknown>
  try { body = await ctx.request.json() } catch { return jsonResponse(400, { error: 'Invalid JSON' }) }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse(400, { error: 'Body must be an object of {key: value}.' })
  }
  const now = nowISO()
  const user = ctx.request.headers.get('X-Admin-User') || null
  // Only allow keys that already exist (prevents random key spam — admin
  // adds new keys via direct migration, not API).
  const existing = await ctx.env.LEADS.prepare('SELECT key FROM site_settings').all<{ key: string }>()
  const allowed = new Set((existing.results || []).map((r) => r.key))

  const changed: string[] = []
  for (const [key, value] of Object.entries(body)) {
    if (!allowed.has(key)) continue
    const json = JSON.stringify(value)
    if (json.length > 5000) return jsonResponse(400, { error: `Value for ${key} too large.` })
    await ctx.env.LEADS.prepare('UPDATE site_settings SET value = ?, updated_at = ?, updated_by = ? WHERE key = ?')
      .bind(json, now, user, key).run()
    changed.push(key)
  }
  return jsonResponse(200, { ok: true, changed })
}

/**
 * /api/admin/blog/:id
 *   GET    → return full post (including markdown content)
 *   PATCH  → update fields (any subset)
 *   DELETE → hard delete (no soft-delete — admin can archive via status='archived')
 *
 * Auth: ../_middleware.ts gates this path.
 */

import { jsonResponse, slugify, readingTimeMinutes, nowISO } from '../../../_lib/d1-utils'

interface Env { LEADS: D1Database }

type Body = {
  title?: unknown
  slug?: unknown
  description?: unknown
  content?: unknown
  cover_image?: unknown
  tags?: unknown
  status?: unknown          // 'draft' | 'published' | 'archived'
  published_at?: unknown    // ISO string when transitioning to published
  // Paste-import SEO fields
  seo_title?: unknown
  focus_keyword?: unknown
  content_type?: unknown
  primary_intent?: unknown
  content_html?: unknown
  lsi_keywords?: unknown
  faq?: unknown
  key_takeaways?: unknown
  related_entities?: unknown
}

const CONTENT_TYPES_PATCH = new Set(['guide', 'listicle', 'how-to', 'review', 'comparison', 'news'])
const PRIMARY_INTENTS_PATCH = new Set(['informational', 'commercial', 'transactional', 'navigational'])

function jsonOrNullPatch(v: unknown): string | null {
  if (v == null) return null
  if (typeof v === 'string') return v.trim() ? v : null
  try { return JSON.stringify(v) } catch { return null }
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params.id as string
  const post = await ctx.env.LEADS.prepare(`
    SELECT * FROM blog_posts WHERE id = ?
  `).bind(id).first()
  if (!post) return jsonResponse(404, { error: 'Not found' })
  return jsonResponse(200, post)
}

export const onRequestPatch: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params.id as string
  let body: Body
  try { body = await ctx.request.json() as Body } catch { return jsonResponse(400, { error: 'Invalid JSON' }) }

  const updates: string[] = []
  const binds: (string | number | null)[] = []

  if (typeof body.title === 'string') {
    if (body.title.trim().length < 3) return jsonResponse(400, { error: 'Title quá ngắn.' })
    updates.push('title = ?'); binds.push(body.title.trim())
  }
  if (typeof body.slug === 'string') {
    const newSlug = slugify(body.slug)
    if (!newSlug) return jsonResponse(400, { error: 'Slug không hợp lệ.' })
    // Verify slug uniqueness (excluding self)
    const clash = await ctx.env.LEADS.prepare('SELECT id FROM blog_posts WHERE slug = ? AND id <> ?').bind(newSlug, id).first()
    if (clash) return jsonResponse(409, { error: 'Slug đã tồn tại — chọn slug khác.' })
    updates.push('slug = ?'); binds.push(newSlug)
  }
  if (typeof body.description === 'string') { updates.push('description = ?'); binds.push(body.description.trim().slice(0, 500)) }
  if (typeof body.content === 'string') {
    updates.push('content = ?'); binds.push(body.content)
    updates.push('reading_min = ?'); binds.push(readingTimeMinutes(body.content))
  }
  if (typeof body.cover_image === 'string' || body.cover_image === null) {
    updates.push('cover_image = ?'); binds.push(typeof body.cover_image === 'string' ? body.cover_image.trim().slice(0, 500) : null)
  }
  if (Array.isArray(body.tags) || typeof body.tags === 'string') {
    const tagsStr = Array.isArray(body.tags)
      ? body.tags.filter((t) => typeof t === 'string').map((t) => (t as string).trim()).filter(Boolean).join(',')
      : (body.tags as string).slice(0, 200)
    updates.push('tags = ?'); binds.push(tagsStr.slice(0, 200))
  }
  if (typeof body.status === 'string' && ['draft','published','archived'].includes(body.status)) {
    updates.push('status = ?'); binds.push(body.status)
    // First publish → set published_at automatically if not provided.
    if (body.status === 'published') {
      const at = typeof body.published_at === 'string' ? body.published_at : nowISO()
      updates.push('published_at = COALESCE(published_at, ?)'); binds.push(at)
    }
  }
  if (typeof body.published_at === 'string') {
    updates.push('published_at = ?'); binds.push(body.published_at)
  }

  // ── Paste-import SEO fields ────────────────────────────────────────────
  if (typeof body.content_html === 'string' || body.content_html === null) {
    updates.push('content_html = ?'); binds.push(typeof body.content_html === 'string' ? body.content_html : null)
    if (typeof body.content_html === 'string' && body.content_html) {
      updates.push('reading_min = ?'); binds.push(readingTimeMinutes(body.content_html))
    }
  }
  if (typeof body.seo_title === 'string' || body.seo_title === null) {
    updates.push('seo_title = ?'); binds.push(typeof body.seo_title === 'string' ? body.seo_title.trim().slice(0, 200) || null : null)
  }
  if (typeof body.focus_keyword === 'string' || body.focus_keyword === null) {
    updates.push('focus_keyword = ?'); binds.push(typeof body.focus_keyword === 'string' ? body.focus_keyword.trim().slice(0, 100) || null : null)
  }
  if (typeof body.content_type === 'string' && CONTENT_TYPES_PATCH.has(body.content_type)) {
    updates.push('content_type = ?'); binds.push(body.content_type)
  }
  if (typeof body.primary_intent === 'string' && PRIMARY_INTENTS_PATCH.has(body.primary_intent)) {
    updates.push('primary_intent = ?'); binds.push(body.primary_intent)
  }
  if (body.lsi_keywords !== undefined) { updates.push('lsi_keywords = ?'); binds.push(jsonOrNullPatch(body.lsi_keywords)) }
  if (body.faq !== undefined) { updates.push('faq = ?'); binds.push(jsonOrNullPatch(body.faq)) }
  if (body.key_takeaways !== undefined) { updates.push('key_takeaways = ?'); binds.push(jsonOrNullPatch(body.key_takeaways)) }
  if (body.related_entities !== undefined) { updates.push('related_entities = ?'); binds.push(jsonOrNullPatch(body.related_entities)) }

  if (!updates.length) return jsonResponse(400, { error: 'No updatable fields.' })

  updates.push('updated_at = ?'); binds.push(nowISO())
  binds.push(id)

  try {
    const r = await ctx.env.LEADS.prepare(`UPDATE blog_posts SET ${updates.join(', ')} WHERE id = ?`).bind(...binds).run()
    if (!r.meta?.changes) return jsonResponse(404, { error: 'Not found' })
  } catch (e) {
    return jsonResponse(500, { error: 'Update failed', detail: String((e as Error).message).slice(0, 200) })
  }
  return jsonResponse(200, { ok: true })
}

export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params.id as string
  const r = await ctx.env.LEADS.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run()
  if (!r.meta?.changes) return jsonResponse(404, { error: 'Not found' })
  return jsonResponse(200, { ok: true })
}

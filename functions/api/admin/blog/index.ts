/**
 * /api/admin/blog
 *   GET  → list all posts (any status)
 *   POST → create draft
 *
 * Auth: ../_middleware.ts gates this path.
 */

import { jsonResponse, ulid, slugify, readingTimeMinutes, nowISO } from '../../../_lib/d1-utils'

interface Env { LEADS: D1Database }   // same DB binding holds blog_posts

type CreateBody = {
  title?: unknown
  slug?: unknown
  description?: unknown
  content?: unknown
  cover_image?: unknown
  tags?: unknown
  // Paste-import SEO fields (Apr 2026 — see migrations/0004_blog_seo_fields.sql)
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

const CONTENT_TYPES = new Set(['guide', 'listicle', 'how-to', 'review', 'comparison', 'news'])
const PRIMARY_INTENTS = new Set(['informational', 'commercial', 'transactional', 'navigational'])

// Stringify JSON arrays/objects safely; null on empty/invalid.
function jsonOrNull(v: unknown): string | null {
  if (v == null) return null
  if (typeof v === 'string') return v.trim() ? v : null
  try { return JSON.stringify(v) } catch { return null }
}

function strOrNull(v: unknown, max = 200): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t ? t.slice(0, max) : null
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url)
  const status = url.searchParams.get('status') // 'draft'|'published'|'archived'|''(all)
  const where: string[] = []
  const binds: string[] = []
  if (status) { where.push('status = ?'); binds.push(status) }
  const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : ''
  const rows = await ctx.env.LEADS.prepare(`
    SELECT id, slug, title, description, status, tags, author_name, reading_min,
           published_at, created_at, updated_at
    FROM blog_posts
    ${whereSql}
    ORDER BY updated_at DESC
  `).bind(...binds).all()
  return jsonResponse(200, { results: rows.results })
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: CreateBody
  try { body = await ctx.request.json() as CreateBody } catch { return jsonResponse(400, { error: 'Invalid JSON' }) }

  const title = typeof body.title === 'string' ? body.title.trim() : ''
  if (!title || title.length < 3) return jsonResponse(400, { error: 'Title quá ngắn (cần ≥3 ký tự).' })

  const id = ulid()
  let slug = typeof body.slug === 'string' && body.slug.trim() ? slugify(body.slug) : slugify(title)
  if (!slug) slug = `bai-viet-${id.slice(-8).toLowerCase()}`

  // Slug collision: append short suffix if taken.
  const exists = await ctx.env.LEADS.prepare('SELECT id FROM blog_posts WHERE slug = ?').bind(slug).first()
  if (exists) slug = `${slug}-${id.slice(-6).toLowerCase()}`

  const description = typeof body.description === 'string' ? body.description.trim().slice(0, 500) : ''
  const content = typeof body.content === 'string' ? body.content : ''
  const cover_image = typeof body.cover_image === 'string' ? body.cover_image.trim().slice(0, 500) : null
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t) => typeof t === 'string' && t.trim()).map((t) => t.trim()).join(',').slice(0, 200)
    : (typeof body.tags === 'string' ? body.tags.slice(0, 200) : '')
  // Optional SEO-import payload (paste-import flow): all nullable.
  const content_html = typeof body.content_html === 'string' ? body.content_html : null
  const seo_title = strOrNull(body.seo_title, 200)
  const focus_keyword = strOrNull(body.focus_keyword, 100)
  const content_type = typeof body.content_type === 'string' && CONTENT_TYPES.has(body.content_type)
    ? body.content_type : null
  const primary_intent = typeof body.primary_intent === 'string' && PRIMARY_INTENTS.has(body.primary_intent)
    ? body.primary_intent : null
  const lsi_keywords = jsonOrNull(body.lsi_keywords)
  const faq = jsonOrNull(body.faq)
  const key_takeaways = jsonOrNull(body.key_takeaways)
  const related_entities = jsonOrNull(body.related_entities)

  // Reading time: prefer html length when provided (more accurate), fall back to markdown.
  const reading_min = readingTimeMinutes(content_html || content)
  const now = nowISO()

  try {
    await ctx.env.LEADS.prepare(`
      INSERT INTO blog_posts (id, slug, title, description, content, cover_image, tags,
                              status, reading_min, created_at, updated_at,
                              seo_title, focus_keyword, content_type, primary_intent,
                              content_html, lsi_keywords, faq, key_takeaways, related_entities)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?,
              ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, slug, title, description, content, cover_image, tags, reading_min, now, now,
      seo_title, focus_keyword, content_type, primary_intent,
      content_html, lsi_keywords, faq, key_takeaways, related_entities,
    ).run()
  } catch (e) {
    return jsonResponse(500, { error: 'Insert failed', detail: String((e as Error).message).slice(0, 200) })
  }

  return jsonResponse(200, { id, slug })
}

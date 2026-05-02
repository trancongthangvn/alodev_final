/**
 * GET /api/admin/leads — return lead inbox for the admin UI.
 *
 * Query params (all optional):
 *   • status   — filter by status enum ('new'|'reading'|'replied'|'qualified'|'won'|'lost'|'spam')
 *   • source   — filter by 'lien-he' | 'bao-gia'
 *   • search   — free-text match on name/email/phone/message
 *   • limit    — default 100, max 500
 *   • offset   — default 0
 *
 * Auth: handled by ../_middleware.ts (Basic Auth gate). If we reach this
 * function, the user is already authenticated.
 */

interface Env {
  LEADS: D1Database
}

const MAX_LIMIT = 500

function jsonResponse(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url)
  const status = url.searchParams.get('status')
  const source = url.searchParams.get('source')
  const search = url.searchParams.get('search')
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '100', 10) || 100, 1), MAX_LIMIT)
  const offset = Math.max(parseInt(url.searchParams.get('offset') || '0', 10) || 0, 0)

  // Build WHERE clause defensively — never interpolate raw input into SQL.
  const where: string[] = []
  const binds: (string | number)[] = []

  if (status)  { where.push('status = ?');  binds.push(status) }
  if (source)  { where.push('source = ?');  binds.push(source) }
  if (search) {
    where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)')
    const term = `%${search.replace(/[%_]/g, '')}%`
    binds.push(term, term, term, term)
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  try {
    const countRow = await ctx.env.LEADS
      .prepare(`SELECT COUNT(*) AS total FROM leads ${whereClause}`)
      .bind(...binds)
      .first<{ total: number }>()

    const list = await ctx.env.LEADS
      .prepare(`
        SELECT id, source, name, email, phone, company, service, budget, budget_vnd,
               message, status, country, created_at, replied_at
        FROM leads
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(...binds, limit, offset)
      .all()

    return jsonResponse(200, {
      total: countRow?.total ?? 0,
      limit,
      offset,
      results: list.results,
    })
  } catch (e) {
    return jsonResponse(500, { error: 'D1 query failed', detail: String((e as Error).message).slice(0, 200) })
  }
}

/**
 * Wildcard proxy: forwards /api/admin/* to the self-hosted Express API server.
 *
 * CF Pages routes specific files first, so:
 *   /api/admin/deploy  → deploy.ts  (no DB)
 *   /api/admin/images  → images.ts  (R2 binding)
 *   everything else    → this file  → Express + SQLite
 *
 * Auth is already verified by _middleware.ts before this handler runs.
 * Express also re-checks Basic Auth as defense-in-depth.
 *
 * Required env var (set in wrangler.toml [vars] or Pages dashboard):
 *   API_URL — base URL of the Express server, e.g. https://api.alodev.vn
 */

interface Env {
  API_URL: string
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const apiBase = (ctx.env.API_URL || '').replace(/\/$/, '')
  if (!apiBase) {
    return new Response(JSON.stringify({ error: 'API_URL not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  const url = new URL(ctx.request.url)
  const target = `${apiBase}${url.pathname}${url.search}`
  const method = ctx.request.method
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method)

  const headers: Record<string, string> = {}
  for (const key of ['authorization', 'content-type', 'user-agent']) {
    const v = ctx.request.headers.get(key)
    if (v) headers[key] = v
  }

  try {
    const resp = await fetch(target, {
      method,
      headers,
      body: hasBody ? ctx.request.body : undefined,
      // @ts-expect-error — required for streaming body passthrough in CF Workers
      duplex: hasBody ? 'half' : undefined,
    })

    return new Response(resp.body, {
      status: resp.status,
      headers: {
        'Content-Type': resp.headers.get('Content-Type') || 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'proxy_error', detail: String(err).slice(0, 200) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }
}

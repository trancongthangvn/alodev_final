/**
 * Shared Basic Auth helper for admin routes (admin pages + admin API).
 * Used by `functions/admin/_middleware.ts` and `functions/api/admin/_middleware.ts`.
 *
 * NOTE: Cloudflare Pages Functions don't auto-detect imports from sibling
 * top-level dirs by convention; we use a `_lib` prefix so the directory
 * is treated as a colocated module folder, not a route. CF Pages ignores
 * dirs starting with `_`.
 */

export interface AuthEnv {
  ADMIN_USER?: string
  ADMIN_PASS?: string
}

export const ADMIN_REALM = 'Alodev Admin'

export function unauthorized(): Response {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${ADMIN_REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/**
 * Returns the authenticated username if Basic Auth header is present and
 * matches env credentials; otherwise returns null. Defaults to `1`/`1`
 * for dev — override via wrangler secret put ADMIN_USER / ADMIN_PASS.
 */
export function checkBasicAuth(request: Request, env: AuthEnv): string | null {
  const expectedUser = env.ADMIN_USER || '1'
  const expectedPass = env.ADMIN_PASS || '1'

  const header = request.headers.get('Authorization')
  if (!header || !header.startsWith('Basic ')) return null

  try {
    const decoded = atob(header.slice(6))
    const idx = decoded.indexOf(':')
    if (idx === -1) return null
    const user = decoded.slice(0, idx)
    const pass = decoded.slice(idx + 1)
    if (timingSafeEqual(user, expectedUser) && timingSafeEqual(pass, expectedPass)) {
      return user
    }
  } catch { /* fall through */ }
  return null
}

/**
 * Basic Auth gate for /admin/* (both static pages and Pages Functions
 * underneath). Cloudflare Pages runs `_middleware.ts` BEFORE checking for
 * static assets, so we 401 the request before any HTML reaches the user.
 *
 * Credentials live in env vars (ADMIN_USER + ADMIN_PASS). Defaults are
 * `1` / `1` — explicit throwaway dev creds. Override in production via:
 *   wrangler pages secret put ADMIN_USER --project-name=alodev
 *   wrangler pages secret put ADMIN_PASS --project-name=alodev
 *
 * If you outgrow Basic Auth (multi-user team, audit trail, OAuth login),
 * rip this out and add Better-Auth or WorkOS — keep the same routing.
 */

import { checkBasicAuth, unauthorized, type AuthEnv } from '../_lib/auth'

export const onRequest: PagesFunction<AuthEnv> = async (ctx) => {
  const user = checkBasicAuth(ctx.request, ctx.env)
  if (!user) return unauthorized()

  // Auth passed — let the request continue to the static page or downstream
  // function handler.
  const response = await ctx.next()

  // Defense-in-depth: never let an admin page be cached at the edge or in
  // shared proxies. Each admin user pulls fresh data per request.
  response.headers.set('Cache-Control', 'no-store, private')
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  response.headers.set('X-Admin-User', user)
  return response
}

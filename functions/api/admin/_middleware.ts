/**
 * Same Basic Auth as /admin/* — guards the admin API endpoints. Browser
 * will send the same Authorization header automatically for same-origin
 * fetch() calls from /admin pages, so the user is prompted only once.
 */

import { checkBasicAuth, unauthorized, type AuthEnv } from '../../_lib/auth'

export const onRequest: PagesFunction<AuthEnv> = async (ctx) => {
  const user = checkBasicAuth(ctx.request, ctx.env)
  if (!user) return unauthorized()
  const response = await ctx.next()
  response.headers.set('Cache-Control', 'no-store, private')
  response.headers.set('X-Admin-User', user)
  return response
}

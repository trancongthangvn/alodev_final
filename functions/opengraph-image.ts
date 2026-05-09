/**
 * Time-aware OG image — homepage variant.
 *
 * Daytime (ICT 06:00–17:59) → serves the static cream/light variant
 *   at /opengraph-image (Next.js prerendered PNG).
 * Nighttime (ICT 18:00–05:59) → 302 redirect to /og-night/opengraph-image
 *   (the dark variant of the same Studio Plate composition).
 *
 * ICT = Indochina Time = UTC+7. Computed from server time at request.
 *
 * Cache-Control: short max-age (30 min) so social scrapers refetch
 * frequently enough that the day/night switch surfaces. Without this
 * override, Next.js's default 1-day cache would miss the transition.
 */

export const onRequestGet: PagesFunction = async ({ request, next }) => {
  const ictHour = (new Date().getUTCHours() + 7) % 24
  const isNight = ictHour < 6 || ictHour >= 18

  const url = new URL(request.url)

  if (isNight) {
    // 302 to the dark variant. FB / X / LinkedIn all follow OG redirects.
    return Response.redirect(new URL('/og-night/opengraph-image', url.origin).toString(), 302)
  }

  // Daytime — pass through to the static light PNG, but rewrite cache headers.
  const response = await next()
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', 'public, max-age=1800, s-maxage=1800')
  headers.set('X-Og-Variant', 'light')
  return new Response(response.body, { status: response.status, headers })
}

export const onRequest: PagesFunction = async () => new Response(null, { status: 405 })

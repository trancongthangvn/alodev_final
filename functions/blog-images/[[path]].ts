/**
 * GET /blog-images/<key>
 *   Public proxy that serves objects from the BLOG_IMAGES R2 bucket.
 *   Used by:
 *     - Blog post cover_image (set via /admin/blog upload)
 *     - Inline body images embedded in content_html
 *     - og:image meta tags (Facebook/LinkedIn/X crawlers fetch these)
 *
 *   Cache: R2 httpMetadata.cacheControl = "public, max-age=31536000, immutable"
 *   was set at upload time.  CF edge respects it → near-zero R2 ops on repeat
 *   serves of popular images.
 */

interface Env {
  BLOG_IMAGES: R2Bucket
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  // params.path is the dynamic segments after /blog-images/ as an array
  const path = (ctx.params.path as string[] | undefined) ?? []
  const key = path.join('/')

  if (!key || key.includes('..')) return new Response('Not Found', { status: 404 })

  const obj = await ctx.env.BLOG_IMAGES.get(key)
  if (!obj) return new Response('Not Found', { status: 404 })

  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('etag', obj.httpEtag)
  // Belt-and-suspenders cache: even if uploader forgot to set httpMetadata,
  // images are content-hashed in their key (sha-256[:12]) → safe to cache hard.
  if (!headers.has('cache-control')) {
    headers.set('cache-control', 'public, max-age=31536000, immutable')
  }
  // Prevent the response body from being interpreted as html (svg can carry script)
  headers.set('x-content-type-options', 'nosniff')

  return new Response(obj.body, { headers })
}

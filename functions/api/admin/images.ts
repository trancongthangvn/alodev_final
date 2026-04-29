/**
 * /api/admin/images
 *   POST   → upload image to R2, return public URL
 *   DELETE → remove image from R2 by key
 *
 * Auth: ../_middleware.ts gates this path (HTTP Basic).
 *
 * Upload flow:
 *   - Client POSTs multipart/form-data with field "file" (or raw body)
 *   - We hash file content (sha-256, first 12 hex chars) → dedupe-friendly key
 *   - Store under blog/<yyyy>/<mm>/<hash>-<safe-name>.<ext>
 *   - Return { url: "https://alodev.vn/blog-images/<key>", key, size, type }
 *
 * Why R2 over base64-in-D1:
 *   - D1 row size cap is 1MB. A single hero photo can be 500KB.
 *   - JSON.stringify(post) explodes when content_html embeds many images.
 *   - R2 served via Pages route → 1 hop, free egress, edge-cached.
 */

interface Env {
  BLOG_IMAGES: R2Bucket
}

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
])
const MAX_BYTES = 8 * 1024 * 1024 // 8 MB — generous for hero photos
const PUBLIC_BASE = 'https://alodev.vn/blog-images/'

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function safeName(name: string): string {
  // Strip diacritics, lowercase, replace spaces/punct with -, cap length.
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image'
}

async function sha256Hex(buf: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let file: File | null = null
  let originalName = 'upload'
  const contentType = ctx.request.headers.get('content-type') || ''

  try {
    if (contentType.includes('multipart/form-data')) {
      const form = await ctx.request.formData()
      const f = form.get('file')
      if (f instanceof File) {
        file = f
        originalName = f.name || 'upload'
      }
    } else if (contentType.startsWith('image/')) {
      // Raw body upload — filename comes from x-filename header.
      const buf = await ctx.request.arrayBuffer()
      const fname = ctx.request.headers.get('x-filename') || 'upload.bin'
      file = new File([buf], fname, { type: contentType })
      originalName = fname
    }
  } catch {
    return jsonResponse(400, { error: 'Không đọc được file upload' })
  }

  if (!file) return jsonResponse(400, { error: 'Thiếu field "file" (multipart) hoặc raw image body' })
  if (!ALLOWED_MIME.has(file.type)) return jsonResponse(400, { error: `Loại file ${file.type || 'unknown'} không hỗ trợ` })
  if (file.size === 0) return jsonResponse(400, { error: 'File rỗng' })
  if (file.size > MAX_BYTES) return jsonResponse(413, { error: `File quá lớn (${(file.size / 1024 / 1024).toFixed(1)}MB > ${MAX_BYTES / 1024 / 1024}MB)` })

  const buf = await file.arrayBuffer()
  const hash = (await sha256Hex(buf)).slice(0, 12)
  const ext = (originalName.match(/\.([a-z0-9]{2,5})$/i)?.[1] || file.type.split('/')[1] || 'bin').toLowerCase()
  const baseName = safeName(originalName.replace(/\.[a-z0-9]{2,5}$/i, ''))
  const now = new Date()
  const yyyy = now.getUTCFullYear()
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
  const key = `blog/${yyyy}/${mm}/${hash}-${baseName}.${ext}`

  // R2 .put is idempotent on key — same hash + same name = no duplicate.
  await ctx.env.BLOG_IMAGES.put(key, buf, {
    httpMetadata: {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000, immutable',
    },
    customMetadata: {
      originalName: originalName.slice(0, 200),
      uploadedAt: now.toISOString(),
    },
  })

  return jsonResponse(200, {
    ok: true,
    key,
    url: `${PUBLIC_BASE}${key}`,
    size: file.size,
    type: file.type,
  })
}

export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url)
  const key = url.searchParams.get('key')
  if (!key) return jsonResponse(400, { error: 'Thiếu ?key=' })
  // Defense: refuse path traversal or non-blog/ keys
  if (key.includes('..') || !key.startsWith('blog/')) return jsonResponse(400, { error: 'Key không hợp lệ' })
  await ctx.env.BLOG_IMAGES.delete(key)
  return jsonResponse(200, { ok: true })
}

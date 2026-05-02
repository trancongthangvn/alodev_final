/**
 * D1 + JSON utilities shared across admin Pages Functions.
 */

export function jsonResponse(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

/**
 * ULID-like ID — same generator as functions/api/contact.ts.
 * 11-char timestamp + 15-char random, base32, sortable.
 */
export function ulid(): string {
  const ts = Date.now().toString(32).padStart(11, '0')
  const rnd = crypto.getRandomValues(new Uint8Array(10))
  const rndStr = Array.from(rnd).map((b) => b.toString(32).padStart(2, '0')).join('').slice(0, 15)
  return (ts + rndStr).toUpperCase()
}

/**
 * Slugify Vietnamese / English title → URL-safe slug.
 * Strips diacritics → lowercase → non-alnum to dash → collapse → trim.
 *
 * Examples:
 *   "Thiết kế website 2026" → "thiet-ke-website-2026"
 *   "Vì sao Alodev chọn Next.js?" → "vi-sao-alodev-chon-next-js"
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')                       // separate base char + combining diacritic
    .replace(/[̀-ͯ]/g, '')        // strip combining marks
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')  // Vietnamese đ → d (NFD doesn't split this)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)                           // soft cap, leave room for collision suffix
}

/**
 * Compute reading time in minutes from markdown content.
 * Uses 200 wpm — accurate for Vietnamese mix; English-heavy posts read
 * a bit faster but the difference within tolerable estimate range.
 */
export function readingTimeMinutes(markdown: string): number {
  const text = markdown
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[#*`>\[\]()_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const words = text.split(' ').filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function nowISO(): string {
  return new Date().toISOString()
}

/**
 * Truncate string with ellipsis, defensive against undefined.
 */
export function truncate(s: unknown, n: number): string {
  if (typeof s !== 'string') return ''
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

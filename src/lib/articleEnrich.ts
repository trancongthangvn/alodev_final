/**
 * articleEnrich.ts — post-parse HTML enrichment.
 *
 * Transforms sanitized body HTML to add SEO + UX features the Claude output
 * doesn't include directly:
 *   - add `id="..."` to every H2/H3 (slugified)
 *   - build + inject TOC `<nav>` after sapo, before first H2
 *   - inject "Last updated + reading time + author" banner after H1
 *   - rewrite `<img>` → add srcset, sizes, loading, decoding, width/height
 *
 * Pure functions. No DOM dependency (string-based) so it works in both
 * browser and Node (SSR / tests).
 */

import { SRCSET_WIDTHS, IMAGE_SIZES } from '@/config/publisher';

export interface EnrichImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  role?: 'featured' | 'inline';
  loading?: 'lazy' | 'eager';
}

export interface EnrichAuthor {
  name: string;
  url?: string;
}

export interface EnrichOptions {
  author?: EnrichAuthor;
  modified?: string; // ISO date
  reading_time?: string; // e.g. "5 phút"
  images?: EnrichImage[]; // optional — URL → metadata hints for srcset
}

export interface EnrichResult {
  html: string;
  toc: Array<{ id: string; text: string; level: 2 | 3 }>;
}

/* ============================== slugify ============================== */

function slugifyId(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/** Ensure id uniqueness across one article. */
function uniqueId(base: string, used: Set<string>): string {
  let id = base || 'section';
  let i = 2;
  while (used.has(id)) {
    id = `${base}-${i}`;
    i++;
  }
  used.add(id);
  return id;
}

/* ============================ Add heading IDs ========================== */

export function addHeadingIds(html: string): {
  html: string;
  toc: Array<{ id: string; text: string; level: 2 | 3 }>;
} {
  const used = new Set<string>();
  const toc: Array<{ id: string; text: string; level: 2 | 3 }> = [];

  // Process H2 first, then H3 — replace in-place
  for (const level of [2, 3] as const) {
    const re = new RegExp(`<h${level}\\b([^>]*)>([\\s\\S]*?)<\\/h${level}>`, 'gi');
    html = html.replace(re, (_m, attrs: string, inner: string) => {
      const text = stripTags(inner);
      const idMatch = attrs.match(/\bid=["']([^"']+)["']/);
      let id: string;
      if (idMatch) {
        id = idMatch[1];
        used.add(id);
      } else {
        id = uniqueId(slugifyId(text), used);
        attrs = `${attrs} id="${id}"`.replace(/\s+/g, ' ').trim();
      }
      if (text) toc.push({ id, text, level });
      return `<h${level} ${attrs}>${inner}</h${level}>`;
    });
  }

  // H2 and H3 pushed in separate passes — reorder by original document position.
  // Simplification: re-extract in-order after the rewrite so toc matches flow.
  const tocFinal: Array<{ id: string; text: string; level: 2 | 3 }> = [];
  const finalRe = /<h([23])\b[^>]*\bid=["']([^"']+)["'][^>]*>([\s\S]*?)<\/h\1>/gi;
  let fm: RegExpExecArray | null;
  while ((fm = finalRe.exec(html)) !== null) {
    const lvl = Number(fm[1]) as 2 | 3;
    tocFinal.push({ level: lvl, id: fm[2], text: stripTags(fm[3]) });
  }
  return { html, toc: tocFinal };
}

/* ============================== TOC block ============================== */

export function buildTocHtml(toc: Array<{ id: string; text: string; level: 2 | 3 }>): string {
  if (toc.length < 3) return ''; // TOC useless < 3 items
  // Only render H2; keep tree simple for SEO snippets
  const h2 = toc.filter((t) => t.level === 2);
  if (h2.length < 3) return '';
  const items = h2
    .map((t) => `<li><a href="#${escapeAttr(t.id)}">${escapeHtml(t.text)}</a></li>`)
    .join('\n');
  return [
    '<nav class="toc" aria-label="Mục lục">',
    '  <h2 class="toc-title">Mục lục</h2>',
    `  <ol>\n${items}\n  </ol>`,
    '</nav>',
  ].join('\n');
}

/** Inject TOC after the first paragraph (sapo), before the first H2. */
export function injectToc(html: string, tocHtml: string): string {
  if (!tocHtml) return html;
  // Prefer after first </p> — that's usually the sapo
  const afterFirstP = html.indexOf('</p>');
  const firstH2 = html.search(/<h2\b/i);
  if (afterFirstP !== -1 && (firstH2 === -1 || afterFirstP < firstH2)) {
    const cut = afterFirstP + '</p>'.length;
    return html.slice(0, cut) + '\n' + tocHtml + '\n' + html.slice(cut);
  }
  if (firstH2 !== -1) {
    return html.slice(0, firstH2) + tocHtml + '\n' + html.slice(firstH2);
  }
  return html + '\n' + tocHtml;
}

/* =========================== Last Updated banner ======================== */

function formatDateVi(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function buildMetaBannerHtml(opts: EnrichOptions): string {
  const parts: string[] = [];
  if (opts.modified) {
    parts.push(
      `<time datetime="${escapeAttr(opts.modified)}">Cập nhật: ${escapeHtml(formatDateVi(opts.modified))}</time>`
    );
  }
  if (opts.reading_time) {
    parts.push(`<span class="reading-time">${escapeHtml(opts.reading_time)}</span>`);
  }
  if (opts.author?.name) {
    const url = opts.author.url;
    parts.push(
      url
        ? `<a class="author-link" href="${escapeAttr(url)}" rel="author">${escapeHtml(opts.author.name)}</a>`
        : `<span class="author-name">${escapeHtml(opts.author.name)}</span>`
    );
  }
  if (!parts.length) return '';
  return `<div class="article-meta" role="doc-subtitle">${parts.join(' <span class="sep" aria-hidden="true">•</span> ')}</div>`;
}

/** Inject banner right after </h1> (if present). */
export function injectMetaBanner(html: string, bannerHtml: string): string {
  if (!bannerHtml) return html;
  const m = html.match(/<\/h1>/i);
  if (!m || m.index === undefined) return bannerHtml + '\n' + html;
  const cut = m.index + '</h1>'.length;
  return html.slice(0, cut) + '\n' + bannerHtml + '\n' + html.slice(cut);
}

/* ============================= Image srcset ============================ */

/**
 * Given base URL `https://cdn.vn247.vn/u/2026/04/foo.webp` and widths [400, 800, 1200]
 * → srcset `"...foo-400w.webp 400w, ...foo-800w.webp 800w, ...foo-1200w.webp 1200w"`.
 *
 * Suffix convention (option "a"). Actual resized files need to be generated by
 * the image pipeline (e.g. Sharp middleware on upload server). Parser only
 * produces the URL strings — pipeline implementation is separate.
 */
export function buildSrcset(baseUrl: string, widths: readonly number[] = SRCSET_WIDTHS): string {
  if (!baseUrl) return '';
  // Only rewrite known image extensions
  const m = baseUrl.match(/^(.*)(\.(?:webp|jpe?g|png|avif))(\?.*)?$/i);
  if (!m) return '';
  const [, stem, ext, query = ''] = m;
  return widths.map((w) => `${stem}-${w}w${ext}${query} ${w}w`).join(', ');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}

/** Look up hint metadata (width/height/role) for a given URL — from YAML images array. */
function hintFor(url: string, hints: EnrichImage[] = []): EnrichImage | undefined {
  return hints.find((h) => h.url === url);
}

/** Rewrite `<img>` tags: add srcset, sizes, loading, decoding, and dimensions. */
export function enrichImages(html: string, hints: EnrichImage[] = []): string {
  return html.replace(/<img\b([^>]*)\/?\s*>/gi, (match, rawAttrs: string) => {
    const attrs = parseAttrs(rawAttrs);
    const src = attrs.src || attrs['data-src'];
    if (!src) return match; // leave as-is

    const hint = hintFor(src, hints);
    const role = hint?.role || 'inline';

    // Add srcset if not already present
    if (!attrs.srcset) {
      const srcset = buildSrcset(src);
      if (srcset) attrs.srcset = srcset;
    }
    // Add sizes if not already present
    if (!attrs.sizes) {
      attrs.sizes = IMAGE_SIZES[role];
    }
    // Add loading (featured = eager, inline = lazy)
    if (!attrs.loading) {
      attrs.loading = hint?.loading || (role === 'featured' ? 'eager' : 'lazy');
    }
    // Add decoding async
    if (!attrs.decoding) {
      attrs.decoding = 'async';
    }
    // Add width/height from hint (prevents CLS)
    if (!attrs.width && hint?.width) attrs.width = String(hint.width);
    if (!attrs.height && hint?.height) attrs.height = String(hint.height);
    // Preserve alt (or keep empty string for decorative)
    if (!('alt' in attrs)) attrs.alt = '';

    return `<img ${serializeAttrs(attrs)} />`;
  });
}

function parseAttrs(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /(\w[\w:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))|(\w[\w:-]*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const name = (m[1] || m[5] || '').toLowerCase();
    if (!name) continue;
    out[name] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return out;
}

function serializeAttrs(attrs: Record<string, string>): string {
  // Preferred attribute order for readability
  const order = ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'decoding', 'title', 'class'];
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const k of order) {
    if (k in attrs) {
      parts.push(`${k}="${escapeAttr(attrs[k])}"`);
      seen.add(k);
    }
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (!seen.has(k)) parts.push(`${k}="${escapeAttr(v)}"`);
  }
  return parts.join(' ');
}

/* ============================ Main entry point ========================= */

export function enrichArticle(html: string, opts: EnrichOptions = {}): EnrichResult {
  // 1) Add IDs to H2/H3, collect TOC
  const withIds = addHeadingIds(html);
  let out = withIds.html;

  // 2) Rewrite <img> with srcset + sizes + loading + dimensions
  out = enrichImages(out, opts.images || []);

  // 3) Inject TOC after sapo
  const tocHtml = buildTocHtml(withIds.toc);
  out = injectToc(out, tocHtml);

  // 4) Inject meta banner after H1
  const bannerHtml = buildMetaBannerHtml(opts);
  out = injectMetaBanner(out, bannerHtml);

  return { html: out, toc: withIds.toc };
}

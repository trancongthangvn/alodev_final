/**
 * articleImport.ts — orchestrator for parsing "YAML frontmatter + HTML body"
 * blocks (Hugo/Jekyll/Astro) into a fully-enriched, SEO-ready article object.
 *
 * Pipeline:
 *   1. strip markdown code fence (```...```)
 *   2. js-yaml → frontmatter (no Node deps, browser-safe)
 *   3. DOMPurify → sanitize HTML body
 *   4. derive fields (canonical, og, twitter, robots, hreflang, author_full)
 *   5. enrich HTML (heading IDs, TOC, Last Updated banner, img srcset/sizes)
 *   6. build JSON-LD schemas (Article, Breadcrumb, FAQ, HowTo, ItemList)
 *   7. compute stats from enriched body (word count, density, H2/H3, links, …)
 *   8. validate against SEO heuristics (density, length, missing fields, …)
 *
 * All pure functions — no React / DOM deps. Works in browser (admin PasteImport),
 * Node (tests / CI), and could be wrapped in a backend endpoint.
 */

import yaml from 'js-yaml';
import DOMPurify from 'isomorphic-dompurify';
import {
  PUBLISHER,
  DEFAULT_AUTHOR,
  DEFAULT_ROBOTS,
  OG_IMAGE,
  READING_WPM,
  CONTENT_TYPES,
  POST_PUBLISH_CHECKLIST,
  type ContentType,
  type PrimaryIntent,
} from '@/config/publisher';
import {
  buildAllSchemas,
  type SchemaArticleInput,
  type SchemaImage,
} from './articleSchema';
import { enrichArticle, buildSrcset, type EnrichImage } from './articleEnrich';

/* ================================ Types ================================ */

export interface ParsedImage {
  url: string;
  alt: string;
  role: 'featured' | 'inline';
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  srcset?: string;
  sizes?: string;
}

export interface ParsedLink {
  anchor_text: string;
  url?: string;
  topic?: string;
  authority?: string;
  rel?: string;
  is_verify_manually?: boolean;
}

export interface ParsedFAQ {
  q: string;
  a: string;
}

export interface ParsedEntity {
  name: string;
  url?: string;
}

export interface ParsedAuthor {
  name: string;
  bio?: string;
}

export interface ParsedAuthorFull {
  name: string;
  bio: string;
  job_title: string;
  expertise: string[];
  social_profiles: string[];
  url: string;
  avatar: string;
}

export interface ParsedOG {
  title: string;
  description: string;
  url: string;
  type: string;
  locale: string;
  site_name: string;
  image: string;
  image_width: number;
  image_height: number;
}

export interface ParsedTwitter {
  card: string;
  title: string;
  description: string;
  image: string;
  site: string;
}

export interface ParsedArticle {
  // --- User-supplied (from YAML) ---
  focus_keyword: string;
  lsi_keywords: string[];
  seo_title: string;
  meta_description: string;
  slug: string;
  h1: string;
  category?: string;
  tags: string[];
  published: string; // ISO
  content_type: ContentType | string;
  primary_intent: PrimaryIntent | string;
  key_takeaways: string[];
  author: ParsedAuthorFull;
  images: ParsedImage[];
  internal_links: ParsedLink[];
  external_links: ParsedLink[];
  related_entities: ParsedEntity[];
  faq: ParsedFAQ[];
  warning?: string; // from YAML — echoes "Claude couldn't search"

  // --- Auto-derived ---
  canonical_url: string;
  modified: string; // ISO
  reading_time: string; // "5 phút"
  featured_image?: ParsedImage;
  robots: string;
  hreflang: string;
  og: ParsedOG;
  twitter: ParsedTwitter;

  // --- Enriched HTML + structured data ---
  html_body: string; // sanitized + enriched (TOC, banner, srcset)
  html_body_raw: string; // sanitized only
  schema: object[]; // array of JSON-LD objects
  schema_article: object;
  schema_breadcrumb: object;
  schema_faq: object | null;
  schema_howto: object | null;
  schema_itemlist: object | null;
  toc: Array<{ id: string; text: string; level: 2 | 3 }>;
}

export interface ParseStats {
  word_count: number;
  reading_time_minutes: number;
  h2_count: number;
  h3_count: number;
  paragraph_count: number;
  image_count: number;
  internal_link_count: number;
  external_link_count: number;
  faq_count: number;
  key_takeaways_count: number;
  keyword_occurrences: number;
  keyword_density: number; // percentage (0..100)
}

export interface ParseResult {
  ok: boolean;
  article?: ParsedArticle;
  stats?: ParseStats;
  warnings: string[];
  errors: string[];
  missing_required: string[];
  post_publish_checklist: typeof POST_PUBLISH_CHECKLIST;
  raw: {
    frontmatter: Record<string, unknown>;
    html_body: string;
  };
}

export interface ParseOptions {
  site_url?: string;
  wpm?: number;
  skip_sanitize?: boolean;
  skip_enrich?: boolean;
  /** Additional HTML tags to allow after DOMPurify sanitize. */
  allowed_tags?: string[];
  allowed_attrs?: string[];
}

const DEFAULT_ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'article', 'section', 'aside', 'nav',
  'strong', 'em', 'b', 'i', 'u', 's', 'code', 'mark', 'sup', 'sub', 'kbd', 'small',
  'a',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'blockquote', 'cite', 'q',
  'img', 'picture', 'source',
  'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  'span', 'div', 'time',
];

const DEFAULT_ALLOWED_ATTRS = [
  'href', 'src', 'srcset', 'sizes', 'alt', 'title', 'target', 'rel',
  'id', 'class', 'role', 'aria-label', 'aria-hidden', 'aria-labelledby',
  'colspan', 'rowspan', 'scope', 'datetime',
  'width', 'height', 'loading', 'decoding',
  'data-src', 'data-alt', 'data-srcset',
];

/* ============================== Main API =============================== */

export function parseArticleBlock(input: string, opts: ParseOptions = {}): ParseResult {
  try {
    return parseArticleBlockInner(input, opts);
  } catch (e) {
    return {
      ok: false,
      errors: [`Parse exception: ${e instanceof Error ? e.message : String(e)}`],
      warnings: [],
      missing_required: [],
      post_publish_checklist: POST_PUBLISH_CHECKLIST,
      raw: { frontmatter: {}, html_body: '' },
    };
  }
}

function parseArticleBlockInner(input: string, opts: ParseOptions): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missing_required: string[] = [];

  const siteUrl = (opts.site_url || PUBLISHER.url).replace(/\/+$/, '');
  const wpm = opts.wpm || READING_WPM;

  if (typeof input !== 'string' || !input.trim()) {
    errors.push('Input rỗng');
    return {
      ok: false,
      errors,
      warnings,
      missing_required,
      post_publish_checklist: POST_PUBLISH_CHECKLIST,
      raw: { frontmatter: {}, html_body: '' },
    };
  }

  // 1) strip outer code fence
  const src = stripCodeFence(input.trim());

  // 2) parse YAML frontmatter
  let fm: { data: Record<string, unknown>; content: string };
  try {
    fm = splitFrontmatter(src);
  } catch (e) {
    const msg = (e as Error).message;
    const lineMatch = msg.match(/line (\d+)/i);
    errors.push(
      `YAML parse error${lineMatch ? ` (line ${lineMatch[1]})` : ''}: ${msg}`
    );
    return {
      ok: false,
      errors,
      warnings,
      missing_required,
      post_publish_checklist: POST_PUBLISH_CHECKLIST,
      raw: { frontmatter: {}, html_body: '' },
    };
  }

  const meta = fm.data || {};
  const rawBody = (fm.content || '').trim();

  if (!Object.keys(meta).length) {
    errors.push('Thiếu YAML frontmatter — cần --- ... --- ở đầu');
  }
  if (!rawBody) {
    errors.push('Thiếu HTML body — phần sau --- rỗng');
  }

  // Required fields check
  const REQ: Array<[keyof ParsedArticle | string, string[]]> = [
    ['focus_keyword', ['focus_keyword']],
    ['seo_title', ['seo_title', 'seoTitle']],
    ['meta_description', ['meta_description', 'metaDescription', 'description']],
    ['slug', ['slug']],
    ['h1', ['h1']],
    ['content_type', ['content_type', 'contentType']],
    ['key_takeaways', ['key_takeaways', 'keyTakeaways']],
  ];
  for (const [label, keys] of REQ) {
    if (!anyPresent(meta, keys)) missing_required.push(String(label));
  }
  if (missing_required.length) {
    errors.push(`Thiếu field required: ${missing_required.join(', ')}`);
  }

  if (errors.length) {
    return {
      ok: false,
      errors,
      warnings,
      missing_required,
      post_publish_checklist: POST_PUBLISH_CHECKLIST,
      raw: { frontmatter: meta, html_body: rawBody },
    };
  }

  // 3) sanitize HTML body
  const sanitized = opts.skip_sanitize
    ? rawBody
    : DOMPurify.sanitize(rawBody, {
        ALLOWED_TAGS: opts.allowed_tags ?? DEFAULT_ALLOWED_TAGS,
        ALLOWED_ATTR: opts.allowed_attrs ?? DEFAULT_ALLOWED_ATTRS,
        ALLOW_DATA_ATTR: false,
      });

  // 4) Extract user fields
  const focus_keyword = pickString(meta, ['focus_keyword']) || '';
  const lsi_keywords = toStringArray(meta.lsi_keywords ?? meta.lsiKeywords);
  const seo_title = pickString(meta, ['seo_title', 'seoTitle']) || '';
  const meta_description =
    pickString(meta, ['meta_description', 'metaDescription', 'description']) || '';
  const slug = pickString(meta, ['slug', 'permalink']) || slugify(seo_title);
  const h1 = pickString(meta, ['h1']) || seo_title;
  const category = pickString(meta, ['category', 'section']);
  const tags = toStringArray(meta.tags);
  const published = normalizeDate(pickString(meta, ['published', 'published_at', 'date'])) ||
    new Date().toISOString();
  const content_type = pickString(meta, ['content_type', 'contentType']) || 'guide';
  const primary_intent = pickString(meta, ['primary_intent', 'primaryIntent']) || 'informational';
  const key_takeaways = toStringArray(meta.key_takeaways ?? meta.keyTakeaways);

  const authorRaw = toAuthor(meta.author);
  const images = toImages(meta.images);
  const internal_links = toLinks(meta.internal_links ?? meta.internalLinks, 'internal');
  const external_links = toLinks(meta.external_links ?? meta.externalLinks, 'external');
  const related_entities = toEntities(meta.related_entities ?? meta.relatedEntities);
  const faq = toFAQ(meta.faq ?? meta.faqs);
  const warning = pickString(meta, ['warning']);

  // 5) Auto-derive fields
  const canonical_url = `${siteUrl}/bai-viet/${slug}`;
  const modified =
    normalizeDate(pickString(meta, ['modified', 'modified_at', 'updated_at'])) || published;
  const featured_image = images.find((i) => i.role === 'featured') || images[0];

  // stats (from sanitized body)
  const plain = stripTags(sanitized);
  const word_count = countWords(plain);
  const reading_time_minutes = word_count > 0 ? Math.max(1, Math.ceil(word_count / wpm)) : 0;
  const reading_time = reading_time_minutes > 0 ? `${reading_time_minutes} phút đọc` : '—';

  // full author (merge Claude + defaults)
  const author: ParsedAuthorFull = {
    name: authorRaw.name || 'Biên tập VN247',
    bio: authorRaw.bio || DEFAULT_AUTHOR.bio_fallback,
    job_title: DEFAULT_AUTHOR.job_title,
    expertise: DEFAULT_AUTHOR.expertise,
    social_profiles: DEFAULT_AUTHOR.social_profiles,
    url: `${siteUrl}/author/${slugify(authorRaw.name || 'bien-tap')}`,
    avatar: DEFAULT_AUTHOR.avatar,
  };

  // Populate srcset on images
  for (const img of images) {
    if (!img.srcset) img.srcset = buildSrcset(img.url);
    if (!img.sizes) {
      img.sizes = img.role === 'featured' ? '(max-width: 768px) 100vw, 1200px' : '(max-width: 768px) 100vw, 800px';
    }
    if (!img.loading) img.loading = img.role === 'featured' ? 'eager' : 'lazy';
  }

  // og + twitter
  const featuredUrl = featured_image?.url || '';
  const og: ParsedOG = {
    title: seo_title,
    description: meta_description,
    url: canonical_url,
    type: 'article',
    locale: PUBLISHER.locale,
    site_name: PUBLISHER.site_name,
    image: featuredUrl,
    image_width: OG_IMAGE.width,
    image_height: OG_IMAGE.height,
  };
  const twitter: ParsedTwitter = {
    card: 'summary_large_image',
    title: seo_title,
    description: meta_description,
    image: featuredUrl,
    site: PUBLISHER.twitter_handle,
  };

  // 6) Enrich HTML (TOC, banner, srcset rewrite)
  const enrichHints: EnrichImage[] = images.map((i) => ({
    url: i.url,
    alt: i.alt,
    width: i.width,
    height: i.height,
    role: i.role,
    loading: i.loading,
  }));
  const enriched = opts.skip_enrich
    ? { html: sanitized, toc: [] as Array<{ id: string; text: string; level: 2 | 3 }> }
    : enrichArticle(sanitized, {
        author: { name: author.name, url: author.url },
        modified,
        reading_time,
        images: enrichHints,
      });

  // 7) Schema JSON-LD
  const schemaInput: SchemaArticleInput = {
    headline: seo_title || h1,
    description: meta_description,
    slug,
    canonical_url,
    published,
    modified,
    category,
    tags,
    lsi_keywords,
    focus_keyword,
    author: {
      name: author.name,
      bio: author.bio,
      job_title: author.job_title,
      expertise: author.expertise,
      social_profiles: author.social_profiles,
      avatar: author.avatar,
      url: author.url,
    },
    featured_image: featured_image
      ? ({
          url: featured_image.url,
          alt: featured_image.alt,
          width: featured_image.width,
          height: featured_image.height,
        } as SchemaImage)
      : undefined,
    content_type,
    primary_intent,
    faq,
    key_takeaways,
    related_entities,
    html_body: enriched.html,
    word_count,
    reading_time_minutes,
  };
  const schemas = buildAllSchemas(schemaInput);

  // 8) Stats — counted from SANITIZED body (pre-enrichment) so that injected TOC
  // and meta banner don't inflate h2_count / paragraph_count.
  const keyword_occurrences = focus_keyword ? countOccurrences(plain, focus_keyword) : 0;
  const keyword_density = word_count > 0 ? (keyword_occurrences / word_count) * 100 : 0;
  const stats: ParseStats = {
    word_count,
    reading_time_minutes,
    h2_count: countTag(sanitized, 'h2'),
    h3_count: countTag(sanitized, 'h3'),
    paragraph_count: countTag(sanitized, 'p'),
    image_count: images.length,
    internal_link_count: internal_links.length,
    external_link_count: external_links.length,
    faq_count: faq.length,
    key_takeaways_count: key_takeaways.length,
    keyword_occurrences,
    keyword_density,
  };

  // 9) SEO validation
  runValidation({
    seo_title,
    meta_description,
    word_count,
    keyword_density,
    h2_count: stats.h2_count,
    faq_count: stats.faq_count,
    key_takeaways_count: stats.key_takeaways_count,
    external_links,
    images,
    featured_image,
    related_entities,
    key_takeaways,
    focus_keyword,
    warning,
    content_type,
  }, warnings);

  const article: ParsedArticle = {
    focus_keyword,
    lsi_keywords,
    seo_title,
    meta_description,
    slug,
    h1,
    category,
    tags,
    published,
    content_type,
    primary_intent,
    key_takeaways,
    author,
    images,
    internal_links,
    external_links,
    related_entities,
    faq,
    warning,

    canonical_url,
    modified,
    reading_time,
    featured_image,
    robots: DEFAULT_ROBOTS,
    hreflang: PUBLISHER.hreflang,
    og,
    twitter,

    html_body: enriched.html,
    html_body_raw: sanitized,
    schema: schemas.all,
    schema_article: schemas.article,
    schema_breadcrumb: schemas.breadcrumb,
    schema_faq: schemas.faq,
    schema_howto: schemas.howto,
    schema_itemlist: schemas.itemList,
    toc: enriched.toc,
  };

  return {
    ok: true,
    article,
    stats,
    warnings,
    errors,
    missing_required,
    post_publish_checklist: POST_PUBLISH_CHECKLIST,
    raw: { frontmatter: meta, html_body: sanitized },
  };
}

/* ============================ Helpers ============================ */

function stripCodeFence(s: string): string {
  const m = s.match(/^```[a-zA-Z0-9_-]*\s*\r?\n([\s\S]*?)\r?\n```\s*$/);
  if (m) return m[1];
  const loose = s.match(/```[a-zA-Z0-9_-]*\s*\r?\n([\s\S]*?)\r?\n```/);
  if (loose && loose[1].includes('---')) return loose[1];
  return s;
}

// Quote unquoted list-item values that contain ": " where the part before the
// colon has whitespace (e.g. "Công thức: S = √(p(p-a)(p-b)(p-c))").  js-yaml
// misparses these as block-mapping entries, causing "bad indentation" errors.
//
// Two patterns we cover:
//
// (A) List item with prose value containing ": "
//     `  - Tính góc bằng pháp tuyến: cos α = ...`
//     → `  - "Tính góc bằng pháp tuyến: cos α = ..."`
//
// (B) FAQ-style mapping value with prose containing ": "
//     `  - q: Như thế nào...`
//     `    a: Tính bằng công thức: cos α = ...`   ← second line breaks
//     → `    a: "Tính bằng công thức: cos α = ..."`
//
// Heuristic for "prose key": contains whitespace OR non-ASCII.  Real YAML
// keys are short snake_case ASCII words, so this rarely false-fires.
function sanitizeYamlListItems(yamlStr: string): string {
  // Test if `value` contains a problematic ": " (key part is prose-y).
  // Returns the index of ": " or -1 if value is fine.
  const findProseColon = (value: string): number => {
    if (/^["'{[|>]/.test(value)) return -1; // already quoted / complex / block scalar
    const colonIdx = value.indexOf(': ');
    if (colonIdx < 0) return -1;
    const key = value.slice(0, colonIdx);
    return /\s|[^\x00-\x7F]/.test(key) ? colonIdx : -1;
  };
  const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  return yamlStr
    .split('\n')
    .map((line) => {
      // (A) list item: "  - prose: value"
      const listMatch = line.match(/^(\s*-\s+)(.+)$/);
      if (listMatch) {
        const [, prefix, value] = listMatch;
        if (findProseColon(value) >= 0) return `${prefix}"${escape(value)}"`;
        return line;
      }
      // (B) mapping value: "  key: prose with: colon"  (typical for faq.a)
      // Match indented "<short_key>: " followed by content.  Short_key must
      // be plain ASCII word chars to avoid mis-quoting valid prose-y mapping
      // entries (which would already be the "outer" key of this rule).
      const mapMatch = line.match(/^(\s+[A-Za-z_][A-Za-z0-9_]*:\s+)(.+)$/);
      if (mapMatch) {
        const [, prefix, value] = mapMatch;
        if (findProseColon(value) >= 0) return `${prefix}"${escape(value)}"`;
      }
      return line;
    })
    .join('\n');
}

function splitFrontmatter(src: string): { data: Record<string, unknown>; content: string } {
  const m = src.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n([\s\S]*))?$/);
  if (!m) return { data: {}, content: src };
  const yamlStr = m[1];
  const content = m[2] ?? '';
  let raw: unknown;
  try {
    raw = yaml.load(yamlStr) ?? {};
  } catch {
    // Retry with prose-colon sanitization (handles BOTH list items and
    // FAQ-style mapping values with embedded ": " — see sanitizer comment).
    raw = yaml.load(sanitizeYamlListItems(yamlStr)) ?? {};
  }
  if (typeof raw !== 'object' || Array.isArray(raw)) return { data: {}, content };
  return { data: raw as Record<string, unknown>, content };
}

function anyPresent(o: Record<string, unknown>, keys: string[]): boolean {
  return keys.some((k) => {
    const v = o[k];
    if (v == null) return false;
    if (typeof v === 'string') return v.trim().length > 0 && !isPlaceholder(v);
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.keys(v as object).length > 0;
    return true;
  });
}

function isPlaceholder(s: string): boolean {
  return /^(verify_manually|todo|fixme|xxx|placeholder)$/i.test(String(s || '').trim());
}

function isPlaceholderUrl(url: string): boolean {
  return /VERIFY[_\s]?MANUALLY|TODO|FIXME|XXX_URL|\{\{[^}]+\}\}|placeholder/i.test(url);
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const s = coerceString(obj[k]);
    if (s) return s;
  }
  return undefined;
}

function coerceString(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === 'string') {
    const t = v.trim();
    return !t || isPlaceholder(t) ? undefined : t;
  }
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'object' && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    for (const prop of ['name', 'value', 'text', 'title', 'url']) {
      const inner = o[prop];
      if (typeof inner === 'string') {
        const t = inner.trim();
        if (t && !isPlaceholder(t)) return t;
      }
    }
  }
  return undefined;
}

function toStringArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) {
    return v
      .map((x) => (typeof x === 'string' ? x.trim() : String(x)))
      .filter((x) => x && !isPlaceholder(x));
  }
  if (typeof v === 'string') {
    return v.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function toImages(v: unknown): ParsedImage[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item): ParsedImage | null => {
      if (typeof item === 'string') {
        return { url: item, alt: '', role: 'inline' };
      }
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>;
        const url = coerceString(o.url ?? o.src ?? o.image);
        if (!url) return null;
        const role = (String(o.role || 'inline').toLowerCase() === 'featured' ? 'featured' : 'inline') as
          | 'featured'
          | 'inline';
        return {
          url,
          alt: typeof o.alt === 'string' ? o.alt : '',
          role,
          width: toNumber(o.width),
          height: toNumber(o.height),
          loading: o.loading === 'eager' ? 'eager' : o.loading === 'lazy' ? 'lazy' : undefined,
        };
      }
      return null;
    })
    .filter((x): x is ParsedImage => x !== null);
}

function toNumber(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function toLinks(v: unknown, kind: 'internal' | 'external'): ParsedLink[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item): ParsedLink | null => {
      if (typeof item === 'string') {
        return {
          anchor_text: item,
          url: isPlaceholderUrl(item) ? undefined : item,
          is_verify_manually: isPlaceholderUrl(item),
          rel: kind === 'external' ? 'noopener noreferrer' : undefined,
        };
      }
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>;
        const anchor_text =
          coerceString(o.anchor_text ?? o.anchor ?? o.text ?? o.title) || '(no anchor)';
        const rawUrl = coerceString(o.url ?? o.href ?? o.link);
        const is_verify = !!(rawUrl && isPlaceholderUrl(rawUrl)) ||
          (typeof o.url === 'string' && isPlaceholderUrl(o.url));
        return {
          anchor_text,
          url: is_verify ? undefined : rawUrl,
          topic: coerceString(o.topic),
          authority: coerceString(o.authority),
          rel: coerceString(o.rel) || (kind === 'external' ? 'noopener noreferrer' : undefined),
          is_verify_manually: is_verify,
        };
      }
      return null;
    })
    .filter((x): x is ParsedLink => x !== null);
}

function toEntities(v: unknown): ParsedEntity[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item): ParsedEntity | null => {
      if (typeof item === 'string') return { name: item };
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>;
        const name = coerceString(o.name ?? o.title);
        if (!name) return null;
        const url = coerceString(o.url ?? o.sameAs ?? o.link);
        return { name, url };
      }
      return null;
    })
    .filter((x): x is ParsedEntity => x !== null);
}

function toFAQ(v: unknown): ParsedFAQ[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item): ParsedFAQ | null => {
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>;
        const q = coerceString(o.q ?? o.question);
        const a = coerceString(o.a ?? o.answer);
        if (!q || !a) return null;
        return { q, a };
      }
      return null;
    })
    .filter((x): x is ParsedFAQ => x !== null);
}

function toAuthor(v: unknown): ParsedAuthor {
  if (!v) return { name: '' };
  if (typeof v === 'string') return { name: v };
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>;
    return {
      name: coerceString(o.name) || '',
      bio: coerceString(o.bio ?? o.description),
    };
  }
  return { name: '' };
}

function normalizeDate(d?: string): string | undefined {
  if (!d) return undefined;
  if (/^\d{4}-\d{2}-\d{2}T/.test(d)) return d;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return `${d}T00:00:00.000Z`;
  const t = Date.parse(d);
  return Number.isFinite(t) ? new Date(t).toISOString() : d;
}

/* ============================ Text / counting ============================ */

function stripTags(html: string): string {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  try {
    const Seg = (Intl as typeof Intl & {
      Segmenter?: new (locale: string, o: { granularity: 'word' }) => {
        segment: (s: string) => Iterable<{ isWordLike?: boolean }>;
      };
    }).Segmenter;
    if (Seg) {
      const seg = new Seg('vi', { granularity: 'word' });
      let n = 0;
      for (const p of seg.segment(t)) if (p.isWordLike) n++;
      return n;
    }
  } catch {
    /* fallthrough */
  }
  return t.split(/[\s\u00A0,.;:!?()\[\]{}"“”‘’'—–\-/\\|]+/u).filter(Boolean).length;
}

function countTag(html: string, tag: string): number {
  const re = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
  return (html.match(re) || []).length;
}

// Strip Vietnamese accents so "tìm" matches "tim", "học" matches "hoc", etc.
// Required because authors mix accent styles in body copy and the keyword
// density check would otherwise underreport (false "<0.5%" warnings).
function stripVietnameseAccents(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function countOccurrences(text: string, keyword: string): number {
  if (!keyword) return 0;
  const haystack = stripVietnameseAccents(text);
  const needle = stripVietnameseAccents(keyword);
  const esc = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${esc}(?![\\p{L}\\p{N}])`, 'giu');
  return (haystack.match(re) || []).length;
}

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ============================== Validation =============================== */

interface ValidationInput {
  seo_title: string;
  meta_description: string;
  word_count: number;
  keyword_density: number;
  h2_count: number;
  faq_count: number;
  key_takeaways_count: number;
  external_links: ParsedLink[];
  images: ParsedImage[];
  featured_image?: ParsedImage;
  related_entities: ParsedEntity[];
  key_takeaways: string[];
  focus_keyword: string;
  warning?: string;
  content_type: string;
}

function runValidation(v: ValidationInput, warnings: string[]): void {
  // Title length
  if (v.seo_title.length > 60) warnings.push(`SEO title ${v.seo_title.length} ký tự (>60) — sẽ bị Google truncate`);
  if (v.seo_title.length < 30) warnings.push(`SEO title ${v.seo_title.length} ký tự — hơi ngắn, nên 30-60`);

  // Meta description
  if (v.meta_description.length < 140 || v.meta_description.length > 160) {
    warnings.push(`Meta description ${v.meta_description.length} ký tự — nên 140-160`);
  }

  // Word count
  if (v.word_count > 0 && v.word_count < 1000) {
    warnings.push(`Bài ${v.word_count} từ (<1000) — thin content, khó rank`);
  }
  if (v.word_count > 2500) {
    warnings.push(`Bài ${v.word_count} từ (>2500) — có thể quá dài, chia thành series`);
  }

  // Keyword density
  if (v.keyword_density < 0.5) {
    warnings.push(`Keyword density ${v.keyword_density.toFixed(2)}% (<0.5%) — focus keyword quá loãng`);
  }
  if (v.keyword_density > 2) {
    warnings.push(`Keyword density ${v.keyword_density.toFixed(2)}% (>2%) — over-optimization`);
  }

  // Heading structure
  if (v.h2_count < 3) {
    warnings.push(`Chỉ ${v.h2_count} H2 (<3) — nên có ≥3 H2 để dễ scan + Featured Snippet`);
  }

  // FAQ
  if (v.faq_count < 3) {
    warnings.push(`FAQ ${v.faq_count} (<3) — nên ≥3 để có FAQPage schema đầy đủ`);
  }

  // Key takeaways
  if (v.key_takeaways_count < 3) {
    warnings.push(`Key takeaways ${v.key_takeaways_count} (<3) — cần 3-5 để AI Overviews pick up`);
  }
  if (v.focus_keyword && v.key_takeaways.length > 0) {
    const needle = stripVietnameseAccents(v.focus_keyword).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${needle}(?![\\p{L}\\p{N}])`, 'iu');
    const hasKw = v.key_takeaways.some((kt) => re.test(stripVietnameseAccents(kt)));
    if (!hasKw) {
      warnings.push(`Key takeaways không chứa focus keyword "${v.focus_keyword}"`);
    }
  }

  // External links
  for (const l of v.external_links) {
    if (l.is_verify_manually) {
      warnings.push(`External link "${l.anchor_text}" có URL = VERIFY_MANUALLY — cần verify tay`);
    }
  }

  // Images
  if (!v.featured_image) {
    warnings.push('Thiếu featured image (images[] không có role="featured")');
  }
  for (const img of v.images) {
    if (isPlaceholderUrl(img.url)) warnings.push(`Image URL chưa verify: "${img.alt || img.url}"`);
    if (!img.alt) warnings.push(`Image thiếu alt: ${img.url}`);
  }

  // Related entities
  if (v.related_entities.length < 2) {
    warnings.push(`Related entities ${v.related_entities.length} (<2) — giảm E-E-A-T signals`);
  }

  // YAML warning field (Claude couldn't search)
  if (v.warning) {
    warnings.push(`YAML có field warning: "${v.warning}" — verify dữ liệu thực tế`);
  }

  // Content type validity
  if (!CONTENT_TYPES.includes(v.content_type as ContentType)) {
    warnings.push(`content_type "${v.content_type}" không thuộc ${CONTENT_TYPES.join('|')}`);
  }
}

// Re-export for backward compat with old tests
export { buildSrcset } from './articleEnrich';

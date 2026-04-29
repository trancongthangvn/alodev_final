/**
 * articleSchema.ts — JSON-LD (Schema.org) generators for parsed articles.
 *
 * Outputs structured data Google Search, AI Overviews, Featured Snippets,
 * Rich Results consume. Builders are pure functions — given parsed article
 * input, return a plain object ready for `<script type="application/ld+json">`.
 *
 * Covered types:
 *   - Article           — always emitted
 *   - BreadcrumbList    — always emitted (3-level: home → category → article)
 *   - FAQPage           — when faq array present
 *   - HowTo             — when content_type="how-to" (steps from body H2s)
 *   - ItemList          — when content_type="listicle"|"comparison"
 *   - (Review/Product   — stubs, needs extra YAML fields to populate)
 */

import { PUBLISHER, DEFAULT_AUTHOR, CATEGORY_LABELS } from '@/config/publisher';

export interface SchemaAuthor {
  name: string;
  bio?: string;
  job_title?: string;
  expertise?: string[];
  social_profiles?: string[];
  avatar?: string;
  url?: string;
}

export interface SchemaImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface SchemaFAQ {
  q: string;
  a: string;
}

export interface SchemaRelatedEntity {
  name: string;
  url?: string;
}

export interface SchemaArticleInput {
  headline: string; // SEO title or H1
  description: string;
  slug: string;
  canonical_url: string;
  published: string; // ISO
  modified: string; // ISO
  category?: string; // slug, used for breadcrumb + articleSection
  tags?: string[];
  lsi_keywords?: string[];
  focus_keyword?: string;
  author: SchemaAuthor;
  featured_image?: SchemaImage;
  content_type?: string;
  primary_intent?: string;
  faq?: SchemaFAQ[];
  key_takeaways?: string[];
  related_entities?: SchemaRelatedEntity[];
  /** Raw HTML body — used to count list items / extract steps. */
  html_body?: string;
  /** Word count of body — emitted as schema.org/wordCount. */
  word_count?: number;
  /** Reading time in minutes — emitted as schema.org/timeRequired ISO 8601. */
  reading_time_minutes?: number;
}

/* ============================== Publisher ============================== */

function publisherNode() {
  return {
    '@type': 'Organization',
    '@id': `${PUBLISHER.url}/#organization`,
    name: PUBLISHER.name,
    legalName: PUBLISHER.legal_name,
    url: PUBLISHER.url,
    logo: {
      '@type': 'ImageObject',
      url: PUBLISHER.logo,
      width: 600,
      height: 60,
    },
    sameAs: PUBLISHER.twitter_handle
      ? [`https://twitter.com/${PUBLISHER.twitter_handle.replace(/^@/, '')}`]
      : [],
  };
}

function authorNode(a: SchemaAuthor) {
  const url = a.url || `${PUBLISHER.url}/author/${slugifyLocal(a.name)}`;
  return {
    '@type': 'Person',
    '@id': `${url}#person`,
    name: a.name,
    url,
    image: a.avatar || DEFAULT_AUTHOR.avatar,
    jobTitle: a.job_title || DEFAULT_AUTHOR.job_title,
    knowsAbout: a.expertise && a.expertise.length ? a.expertise : DEFAULT_AUTHOR.expertise,
    description: a.bio || DEFAULT_AUTHOR.bio_fallback,
    sameAs: a.social_profiles && a.social_profiles.length ? a.social_profiles : DEFAULT_AUTHOR.social_profiles,
  };
}

/* ================================ Article ================================ */

export function buildArticleSchema(a: SchemaArticleInput): object {
  const keywords = [
    ...(a.focus_keyword ? [a.focus_keyword] : []),
    ...(a.lsi_keywords || []),
    ...(a.tags || []),
  ].filter(Boolean);

  const mentions =
    a.related_entities && a.related_entities.length
      ? a.related_entities.map((e) => ({
          '@type': 'Thing',
          name: e.name,
          ...(e.url ? { sameAs: e.url } : {}),
        }))
      : undefined;

  const image = a.featured_image
    ? {
        '@type': 'ImageObject',
        url: a.featured_image.url,
        ...(a.featured_image.width ? { width: a.featured_image.width } : {}),
        ...(a.featured_image.height ? { height: a.featured_image.height } : {}),
        ...(a.featured_image.alt ? { caption: a.featured_image.alt } : {}),
      }
    : undefined;

  const articleSection = a.category ? CATEGORY_LABELS[a.category] || a.category : undefined;

  // Tech-studio blog: TechArticle subtype tells Google + AI Overviews this
  // is technical content (better for "Next.js", "CRM", "Cloudflare" queries).
  // proficiencyLevel helps disambiguate audience for code-heavy posts.
  const techFields = {
    proficiencyLevel: 'expert',
    isAccessibleForFree: true as const,
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${a.canonical_url}#article`,
    headline: a.headline,
    description: a.description,
    ...(image ? { image } : {}),
    datePublished: a.published,
    dateModified: a.modified || a.published,
    author: authorNode(a.author),
    publisher: publisherNode(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': a.canonical_url,
    },
    url: a.canonical_url,
    inLanguage: PUBLISHER.hreflang,
    ...(articleSection ? { articleSection } : {}),
    ...(keywords.length ? { keywords } : {}),
    ...(mentions ? { mentions } : {}),
    ...(a.word_count && a.word_count > 0 ? { wordCount: a.word_count } : {}),
    ...(a.reading_time_minutes && a.reading_time_minutes > 0
      ? { timeRequired: `PT${a.reading_time_minutes}M` }
      : {}),
    ...techFields,
  };
}

/* ============================ BreadcrumbList ============================ */

export function buildBreadcrumbSchema(input: {
  headline: string;
  canonical_url: string;
  category?: string;
}): object {
  const items: Array<{ '@type': string; position: number; name: string; item: string }> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Trang chủ',
      item: PUBLISHER.url,
    },
  ];
  if (input.category) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: CATEGORY_LABELS[input.category] || input.category,
      item: `${PUBLISHER.url}/chuyen-muc/${input.category}`,
    });
  }
  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: input.headline,
    item: input.canonical_url,
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

/* ================================ FAQPage ================================ */

export function buildFAQSchema(faq: SchemaFAQ[]): object | null {
  if (!faq || faq.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };
}

/* ================================ HowTo ================================ */

export function buildHowToSchema(input: SchemaArticleInput): object | null {
  if (input.content_type !== 'how-to' || !input.html_body) return null;
  const steps = extractH2Steps(input.html_body);
  if (steps.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.headline,
    description: input.description,
    ...(input.featured_image
      ? {
          image: {
            '@type': 'ImageObject',
            url: input.featured_image.url,
          },
        }
      : {}),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
    totalTime: undefined, // optional — YAML doesn't currently provide
  };
}

function extractH2Steps(html: string): Array<{ name: string; text: string; url?: string }> {
  const steps: Array<{ name: string; text: string; url?: string }> = [];
  // Match <h2[...attrs]>...</h2> capturing id + inner text
  const re = /<h2\b([^>]*)>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2\b|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const nameHtml = m[2];
    const bodyHtml = m[3];
    const idMatch = attrs.match(/\bid=["']([^"']+)["']/);
    const name = stripTags(nameHtml).trim();
    const text = stripTags(bodyHtml).trim().slice(0, 500);
    if (name && text) {
      steps.push({
        name,
        text,
        url: idMatch ? `#${idMatch[1]}` : undefined,
      });
    }
  }
  return steps;
}

/* ================================ ItemList =============================== */

export function buildItemListSchema(input: SchemaArticleInput): object | null {
  if (!(input.content_type === 'listicle' || input.content_type === 'comparison')) return null;
  if (!input.html_body) return null;
  const items = extractListItems(input.html_body);
  if (items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: input.headline,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it,
    })),
  };
}

function extractListItems(html: string): string[] {
  // Prefer H2 (listicle) — fall back to H3 if < 3 H2s
  let re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  let items: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const t = stripTags(m[1]).trim();
    if (t) items.push(t);
  }
  if (items.length < 3) {
    re = /<h3\b[^>]*>([\s\S]*?)<\/h3>/gi;
    items = [];
    while ((m = re.exec(html)) !== null) {
      const t = stripTags(m[1]).trim();
      if (t) items.push(t);
    }
  }
  return items;
}

/* ================================ Aggregator ============================= */

export function buildAllSchemas(input: SchemaArticleInput): {
  article: object;
  breadcrumb: object;
  faq: object | null;
  howto: object | null;
  itemList: object | null;
  /** Array ready to embed — each element is one JSON-LD block. */
  all: object[];
} {
  const article = buildArticleSchema(input);
  const breadcrumb = buildBreadcrumbSchema({
    headline: input.headline,
    canonical_url: input.canonical_url,
    category: input.category,
  });
  const faq = buildFAQSchema(input.faq || []);
  const howto = buildHowToSchema(input);
  const itemList = buildItemListSchema(input);
  const all: object[] = [article, breadcrumb];
  if (faq) all.push(faq);
  if (howto) all.push(howto);
  if (itemList) all.push(itemList);
  return { article, breadcrumb, faq, howto, itemList, all };
}

/* ================================ helpers ================================ */

function slugifyLocal(s: string): string {
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
    .replace(/\s+/g, ' ');
}

/**
 * Build-time blog content reader. Pulls from `src/data/blog.generated.json`
 * which is produced by `scripts/sync-blog-from-d1.mjs` before next build.
 *
 * If the JSON doesn't exist (fresh checkout, no D1 sync), returns empty
 * arrays — pages render "no posts yet" instead of crashing the build.
 */

import generated from '@/data/blog.generated.json'

export type BlogPost = {
  id: string
  slug: string
  title: string
  description: string | null
  content: string
  /** Enriched HTML body from paste-import.  Null for legacy markdown-only posts. */
  content_html: string | null
  cover_image: string | null
  tags: string[]
  author_name: string
  reading_min: number | null
  published_at: string
  created_at: string
  updated_at: string
  // Paste-import SEO fields (Apr 2026, migration 0004)
  seo_title: string | null
  focus_keyword: string | null
  content_type: string | null
  primary_intent: string | null
  lsi_keywords: string[]
  faq: Array<{ q: string; a: string }>
  key_takeaways: string[]
  related_entities: Array<{ name: string; url?: string }>
}

// Raw row shape from sync-blog-from-d1.mjs.  Fields added in migration 0004
// may be absent from older snapshots, so we default them here rather than
// requiring a re-sync to be valid.
type RawPost = Partial<BlogPost> & {
  id: string
  slug: string
  title: string
  content: string
  published_at: string
  created_at: string
  updated_at: string
  author_name: string
}

const data = generated as { posts: RawPost[]; synced_at: string }

function normalize(p: RawPost): BlogPost {
  return {
    ...p,
    description: p.description ?? null,
    content_html: p.content_html ?? null,
    cover_image: p.cover_image ?? null,
    tags: p.tags ?? [],
    reading_min: p.reading_min ?? null,
    seo_title: p.seo_title ?? null,
    focus_keyword: p.focus_keyword ?? null,
    content_type: p.content_type ?? null,
    primary_intent: p.primary_intent ?? null,
    lsi_keywords: p.lsi_keywords ?? [],
    faq: p.faq ?? [],
    key_takeaways: p.key_takeaways ?? [],
    related_entities: p.related_entities ?? [],
  }
}

export function getAllPosts(): BlogPost[] {
  return (data.posts || []).map(normalize)
}

export function getPost(slug: string): BlogPost | null {
  const p = data.posts.find((p) => p.slug === slug)
  return p ? normalize(p) : null
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  return data.posts.filter((p) => p.slug !== currentSlug).slice(0, limit).map(normalize)
}

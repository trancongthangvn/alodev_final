-- alodev-leads · v4: enrich blog_posts with SEO fields fed by paste-import
--
-- The /admin paste-import flow ("Dán block SEO từ Claude Project") parses
-- a YAML+HTML block, extracts dozens of structured SEO fields, and stores
-- them on the post row. Public /blog/[slug] reads these to:
--   • render the enriched HTML body (preserves heading IDs, srcset, banner)
--   • emit Article + Breadcrumb + FAQ + HowTo + ItemList JSON-LD
--   • auto-fill OG / Twitter / canonical / hreflang
--
-- All new columns are nullable so existing markdown-only posts still work
-- unchanged.  Triggers below mirror updated_at on UPDATE so sitemap.lastmod
-- reflects edits, not just published_at.

-- ─── SEO meta ──────────────────────────────────────────────────────────
ALTER TABLE blog_posts ADD COLUMN seo_title         TEXT;
ALTER TABLE blog_posts ADD COLUMN focus_keyword     TEXT;
ALTER TABLE blog_posts ADD COLUMN content_type      TEXT;     -- guide | listicle | how-to | review | comparison | news
ALTER TABLE blog_posts ADD COLUMN primary_intent    TEXT;     -- informational | commercial | transactional

-- ─── Body alternative ──────────────────────────────────────────────────
-- content (existing) holds markdown.  content_html holds enriched HTML
-- from paste-import.  The public page prefers content_html when set.
ALTER TABLE blog_posts ADD COLUMN content_html      TEXT;

-- ─── Structured arrays (stored as JSON strings — D1/SQLite has no JSONB) ──
ALTER TABLE blog_posts ADD COLUMN lsi_keywords      TEXT;     -- JSON array of strings
ALTER TABLE blog_posts ADD COLUMN faq               TEXT;     -- JSON array of {q, a}
ALTER TABLE blog_posts ADD COLUMN key_takeaways     TEXT;     -- JSON array of strings
ALTER TABLE blog_posts ADD COLUMN related_entities  TEXT;     -- JSON array of {name, url?}

-- ─── Indexes for SEO discovery ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_blog_focus_keyword
  ON blog_posts (focus_keyword)
  WHERE focus_keyword IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_blog_content_type
  ON blog_posts (content_type)
  WHERE content_type IS NOT NULL;

-- alodev-leads · v2: add blog + site_settings tables
--
-- Why both in one DB: CF D1 free tier = 5GB total, single-DB queries are
-- cheaper than cross-DB (no joins anyway across separate D1s). Blog +
-- settings are low-volume; they share storage with leads cleanly.

-- ─── blog_posts ─────────────────────────────────────────────────────────
-- Source of truth for /blog content. Build script syncs to JSON at build
-- time so Next.js static export can render /blog/* pages without runtime
-- DB access. Admin UI does CRUD; "publish" → triggers CF Pages deploy.

CREATE TABLE IF NOT EXISTS blog_posts (
  id            TEXT    PRIMARY KEY,             -- ULID
  slug          TEXT    NOT NULL UNIQUE,         -- URL-safe, /blog/<slug>
  title         TEXT    NOT NULL,
  description   TEXT,                            -- meta description (155 chars)
  content       TEXT    NOT NULL DEFAULT '',     -- markdown body
  cover_image   TEXT,                            -- URL or path to /og or asset
  tags          TEXT,                            -- comma-separated, e.g. "seo,case-study"
  status        TEXT    NOT NULL DEFAULT 'draft',-- draft | published | archived
  author_name   TEXT    NOT NULL DEFAULT 'Trần Công Thắng',
  reading_min   INTEGER,                         -- estimated read time, mins
  published_at  TEXT,                            -- ISO datetime; NULL until published
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_blog_status_published ON blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_updated ON blog_posts(updated_at DESC);

-- ─── site_settings ──────────────────────────────────────────────────────
-- Key-value store for global config that admin needs to control without
-- code changes: site title, default OG, contact info, etc.
-- Each row = one settings key. Value is JSON (stringified) so a single
-- key can hold structured data (e.g. ContactPoint object).

CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT    PRIMARY KEY,
  value       TEXT    NOT NULL,                  -- JSON-encoded value
  updated_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_by  TEXT
);

-- Seed default settings — these mirror the values currently hardcoded in
-- src/app/layout.tsx so the admin UI shows sane defaults on first load.
INSERT OR IGNORE INTO site_settings (key, value) VALUES
  ('site.title_default',        '"Alodev — Studio thiết kế & phát triển Web/App"'),
  ('site.title_template',       '"%s — Alodev"'),
  ('site.description',          '"Founder-led studio thiết kế website, lập trình app mobile, xây dựng hệ thống CRM/ERP cho doanh nghiệp Việt. 11+ sản phẩm đang vận hành — source code thuộc về bạn."'),
  ('site.url',                  '"https://alodev.vn"'),
  ('site.locale',               '"vi_VN"'),
  ('contact.email',             '"hello@alodev.vn"'),
  ('contact.phone',             '"+84-364-234-936"'),
  ('contact.zalo',              '"https://zalo.me/0364234936"'),
  ('contact.address',           '"Hà Nội, Việt Nam"'),
  ('contact.hours',             '"8h–22h hằng ngày"'),
  ('blog.enabled',              'true'),
  ('blog.posts_per_page',       '12');

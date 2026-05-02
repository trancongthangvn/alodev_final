-- alodev-leads · v3: add analytics_pageviews
--
-- Privacy-first design (Plausible-style):
--   • No cookies — session_id stored in sessionStorage only (lost on tab close)
--   • visitor_hash = SHA-256(IP + UA + daily_salt) — rotates daily, can't
--     re-identify across days, can count unique visitors per day
--   • IP itself NEVER stored
--   • referrer reduced to hostname only (no full URL → no leak of source path)
--
-- Volume estimate: 500 pageviews/day × 30 = 15k rows/month.
-- D1 free tier limit: 100k writes/day. Comfortable headroom for years.
-- Long-term: aggregate to daily summary table to keep raw event table small.

CREATE TABLE IF NOT EXISTS analytics_pageviews (
  id              TEXT    PRIMARY KEY,                   -- ULID
  ts              TEXT    NOT NULL,                      -- ISO 8601 UTC
  ts_date         TEXT    NOT NULL,                      -- YYYY-MM-DD (for fast day grouping)
  session_id      TEXT    NOT NULL,                      -- random per browser tab
  visitor_hash    TEXT    NOT NULL,                      -- daily-rotating hash for unique count
  path            TEXT    NOT NULL,                      -- normalized URL path
  title           TEXT,                                  -- page title at view time
  referrer_host   TEXT,                                  -- hostname only, e.g. 'google.com'
  country         TEXT,                                  -- CF-IPCountry, e.g. 'VN'
  device          TEXT,                                  -- mobile|tablet|desktop
  browser         TEXT,                                  -- e.g. 'Chrome'
  os              TEXT,                                  -- e.g. 'iOS'
  screen_w        INTEGER,                               -- viewport pixel width
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  duration_ms     INTEGER,                               -- updated on pagehide via second beacon
  is_bounce       INTEGER NOT NULL DEFAULT 1             -- 1 if no other pageview in this session yet
);

CREATE INDEX IF NOT EXISTS idx_pv_ts          ON analytics_pageviews(ts DESC);
CREATE INDEX IF NOT EXISTS idx_pv_date        ON analytics_pageviews(ts_date);
CREATE INDEX IF NOT EXISTS idx_pv_session     ON analytics_pageviews(session_id);
CREATE INDEX IF NOT EXISTS idx_pv_path        ON analytics_pageviews(path);
CREATE INDEX IF NOT EXISTS idx_pv_visitor     ON analytics_pageviews(visitor_hash, ts_date);

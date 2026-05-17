-- Generic analytics events table — separate from pageviews so the high-write
-- pageview table stays narrow. Events here: cta_popup_shown/dismissed/clicked,
-- contact_submitted, etc. Schema-on-write via `meta` JSON column.
CREATE TABLE IF NOT EXISTS analytics_events (
  id          TEXT    PRIMARY KEY,
  ts          TEXT    NOT NULL,
  ts_date     TEXT    NOT NULL,            -- ISO yyyy-mm-dd for fast daily rollups
  session_id  TEXT    NOT NULL,
  name        TEXT    NOT NULL,            -- e.g. cta_popup_shown, contact_submitted
  path        TEXT,                        -- page where event fired
  meta        TEXT,                        -- JSON-encoded extras, max 1KB
  country     TEXT,
  device      TEXT
);

CREATE INDEX IF NOT EXISTS idx_evt_name_date ON analytics_events(name, ts_date DESC);
CREATE INDEX IF NOT EXISTS idx_evt_session ON analytics_events(session_id);

-- Web Vitals — store latest reading per session+metric so we can compute
-- p75/p95 over time without bloat.
CREATE TABLE IF NOT EXISTS analytics_vitals (
  id          TEXT    PRIMARY KEY,
  ts          TEXT    NOT NULL,
  ts_date     TEXT    NOT NULL,
  session_id  TEXT    NOT NULL,
  path        TEXT    NOT NULL,
  metric      TEXT    NOT NULL,            -- LCP / INP / CLS / TTFB / FCP
  value       REAL    NOT NULL,
  rating      TEXT,                        -- good / needs-improvement / poor
  device      TEXT
);

CREATE INDEX IF NOT EXISTS idx_vit_metric_date ON analytics_vitals(metric, ts_date DESC);
CREATE INDEX IF NOT EXISTS idx_vit_path ON analytics_vitals(path);

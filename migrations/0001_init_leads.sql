-- alodev-leads · D1 schema v1
-- Lead inbox capture for /lien-he and /bao-gia form submissions.
--
-- Design notes:
--   • TEXT primary key = ULID-style (sortable + globally unique without server)
--   • status enum lives in app code, not a CHECK constraint, so we can add
--     statuses without migrating
--   • scope_json keeps /bao-gia calculator detail in original shape for replay
--   • utm_json + ip + ua = attribution for sales follow-up; never PII-share
--   • created_at indexed DESC for inbox listing (newest first)

CREATE TABLE IF NOT EXISTS leads (
  id          TEXT    PRIMARY KEY,
  source      TEXT    NOT NULL,                      -- 'lien-he' | 'bao-gia' | future channels
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  phone       TEXT    NOT NULL,
  company     TEXT,
  service     TEXT,                                  -- /lien-he dropdown OR derived from /bao-gia
  budget      TEXT,                                  -- bucket label or numeric VND if known
  budget_vnd  INTEGER,                               -- /bao-gia known total
  scope_json  TEXT,                                  -- /bao-gia full feature list snapshot
  message     TEXT    NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'new',        -- new | reading | replied | qualified | won | lost | spam
  utm_json    TEXT,                                  -- {source, medium, campaign, term, content}
  referer     TEXT,
  ip          TEXT,
  country     TEXT,                                  -- CF cf-ipcountry
  user_agent  TEXT,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  replied_at  TEXT,
  notes       TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_desc ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status      ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source      ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_email       ON leads(email);

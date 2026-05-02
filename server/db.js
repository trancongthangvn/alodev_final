import { createRequire } from 'module'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, readdirSync, mkdirSync, existsSync } from 'fs'

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const DB_PATH = join(DATA_DIR, 'alodev.db')
const MIGRATIONS_DIR = join(__dirname, '..', 'migrations')

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS _migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )
`)

const applied = new Set(
  db.prepare('SELECT name FROM _migrations').all().map((r) => r.name),
)

const migrationFiles = readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith('.sql'))
  .sort()

for (const file of migrationFiles) {
  if (applied.has(file)) continue
  const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8')

  // Strip SQL comments first (they can contain semicolons that confuse split),
  // then split on semicolons so ALTER TABLE errors can be caught per-statement.
  const stripped = sql
    .replace(/--[^\n]*/g, '')        // remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
  const stmts = stripped.split(';').map((s) => s.trim()).filter(Boolean)

  let ok = true
  for (const stmt of stmts) {
    try {
      db.exec(stmt)
    } catch (err) {
      const msg = err.message || ''
      if (
        msg.includes('duplicate column name') ||
        msg.includes('already exists') ||
        msg.includes('table already exists')
      ) {
        continue // idempotent — already applied
      }
      console.error(`[db] ${file} failed:`, msg, '\n  stmt:', stmt.slice(0, 120))
      ok = false
      break
    }
  }

  if (ok) {
    db.prepare('INSERT INTO _migrations (name) VALUES (?)').run(file)
    console.log(`[db] applied: ${file}`)
  }
}

export default db

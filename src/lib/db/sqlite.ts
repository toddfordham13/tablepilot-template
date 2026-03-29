import Database from "better-sqlite3"
import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const dbPath = path.join(dataDir, "tablepilot.db")

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(dbPath)

db.pragma("journal_mode = WAL")

db.exec(`
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  concept TEXT NOT NULL,
  event_type TEXT NOT NULL,
  session_id TEXT,
  path TEXT,
  created_at TEXT NOT NULL,
  payload_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_concept_created
ON analytics_events (concept, created_at);

CREATE INDEX IF NOT EXISTS idx_concept_event_created
ON analytics_events (concept, event_type, created_at);

CREATE TABLE IF NOT EXISTS gallery_overrides (
  concept TEXT PRIMARY KEY,
  data TEXT NOT NULL
);
`)

export default db
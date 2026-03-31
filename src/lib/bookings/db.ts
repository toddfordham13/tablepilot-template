import Database from "better-sqlite3"
import path from "path"

const dbPath =
  process.env.SQLITE_PATH ||
  path.join(process.cwd(), "tablepilot.db")

export const db = new Database(dbPath)

export function initBookingsDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      restaurant_slug TEXT NOT NULL,

      status TEXT NOT NULL,
      source TEXT NOT NULL,

      guest_name TEXT NOT NULL,
      guest_email TEXT NOT NULL,
      guest_phone TEXT NOT NULL,

      guests INTEGER NOT NULL,

      booking_date TEXT NOT NULL,
      booking_time TEXT NOT NULL,

      service_key TEXT NOT NULL,

      allergies TEXT,
      celebration TEXT,
      seating_preference TEXT,
      accessibility_notes TEXT,
      highchair INTEGER,

      guest_notes TEXT,
      internal_notes TEXT,

      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS booking_status_history (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS booking_services (
      id TEXT PRIMARY KEY,
      restaurant_slug TEXT NOT NULL,

      service_key TEXT NOT NULL,
      label TEXT NOT NULL,

      days TEXT NOT NULL,

      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,

      slot_interval INTEGER NOT NULL,

      max_covers INTEGER,
      max_party_size INTEGER,

      cutoff_hours INTEGER,

      active INTEGER NOT NULL,

      sort_order INTEGER NOT NULL
    );
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS booking_settings (
      restaurant_slug TEXT PRIMARY KEY,
      booking_email TEXT NOT NULL,
      timezone TEXT NOT NULL,
      max_advance_days INTEGER NOT NULL,
      default_slot_interval INTEGER NOT NULL,
      default_max_party_size INTEGER NOT NULL,
      default_cutoff_hours INTEGER NOT NULL
    );
  `)
}
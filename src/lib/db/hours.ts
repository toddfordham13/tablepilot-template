import db from "@/lib/db/sqlite"

export type DbOpeningHour = {
  id: number
  restaurant_slug: string
  day_key: string
  label: string
  is_closed: number
  open_time: string | null
  close_time: string | null
  sort_order: number
  updated_at: string
}

export type OpeningHourInput = {
  dayKey: string
  label: string
  isClosed: boolean
  openTime: string
  closeTime: string
  sortOrder: number
}

export function ensureOpeningHoursTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS opening_hours_overrides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_slug TEXT NOT NULL,
      day_key TEXT NOT NULL,
      label TEXT NOT NULL,
      is_closed INTEGER NOT NULL DEFAULT 0,
      open_time TEXT,
      close_time TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(restaurant_slug, day_key)
    )
  `)
}

export function getOpeningHoursByRestaurantSlug(
  restaurantSlug: string
): DbOpeningHour[] {
  ensureOpeningHoursTable()

  const rows = db
    .prepare(
      `
        SELECT
          id,
          restaurant_slug,
          day_key,
          label,
          is_closed,
          open_time,
          close_time,
          sort_order,
          updated_at
        FROM opening_hours_overrides
        WHERE restaurant_slug = ?
        ORDER BY sort_order ASC, id ASC
      `
    )
    .all(restaurantSlug)

  return rows as DbOpeningHour[]
}

export function replaceOpeningHoursForRestaurant(
  restaurantSlug: string,
  hours: OpeningHourInput[]
) {
  ensureOpeningHoursTable()

  const deleteStatement = db.prepare(`
    DELETE FROM opening_hours_overrides
    WHERE restaurant_slug = ?
  `)

  const insertStatement = db.prepare(`
    INSERT INTO opening_hours_overrides (
      restaurant_slug,
      day_key,
      label,
      is_closed,
      open_time,
      close_time,
      sort_order,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `)

  const transaction = db.transaction(() => {
    deleteStatement.run(restaurantSlug)

    for (const hour of hours) {
      insertStatement.run(
        restaurantSlug,
        hour.dayKey,
        hour.label,
        hour.isClosed ? 1 : 0,
        hour.isClosed ? null : hour.openTime,
        hour.isClosed ? null : hour.closeTime,
        hour.sortOrder
      )
    }
  })

  transaction()
}
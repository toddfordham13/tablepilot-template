import db from "@/lib/db/sqlite"

export type DbUser = {
  id: number
  restaurant_slug: string
  email: string
  password_hash: string
  created_at: string
}

export function ensureUsersTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_slug TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export function getUserByEmail(email: string): DbUser | null {
  ensureUsersTable()

  const row = db
    .prepare(
      `
        SELECT id, restaurant_slug, email, password_hash, created_at
        FROM users
        WHERE email = ?
        LIMIT 1
      `
    )
    .get(email)

  return (row as DbUser | undefined) ?? null
}

export function createUser(input: {
  restaurantSlug: string
  email: string
  passwordHash: string
}) {
  ensureUsersTable()

  const result = db
    .prepare(
      `
        INSERT INTO users (restaurant_slug, email, password_hash)
        VALUES (?, ?, ?)
      `
    )
    .run(input.restaurantSlug, input.email, input.passwordHash)

  return {
    id: Number(result.lastInsertRowid),
    restaurant_slug: input.restaurantSlug,
    email: input.email,
  }
}
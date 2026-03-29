import fs from "node:fs"
import path from "node:path"

import Database from "better-sqlite3"

import { getDefaultMenuForConcept } from "@/lib/menus/defaultMenus"
import {
  cloneMenuContent,
  sanitiseMenuContent,
  type MenuContent,
} from "@/lib/menus/types"

const dataDirectory = path.join(process.cwd(), "data")
const databasePath = path.join(dataDirectory, "tablepilot.sqlite")

function ensureDatabase() {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true })
  }

  const db = new Database(databasePath)

  db.exec(`
    CREATE TABLE IF NOT EXISTS dashboard_menu_content (
      concept_slug TEXT PRIMARY KEY,
      payload_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  return db
}

export function getStoredMenuOverride(concept: string): MenuContent | null {
  const db = ensureDatabase()

  try {
    const row = db
      .prepare(
        `
          SELECT payload_json
          FROM dashboard_menu_content
          WHERE concept_slug = ?
        `,
      )
      .get(concept) as { payload_json: string } | undefined

    if (!row) {
      return null
    }

    const parsed = sanitiseMenuContent(JSON.parse(row.payload_json))

    if (!parsed) {
      return null
    }

    return cloneMenuContent(parsed)
  } finally {
    db.close()
  }
}

export function getEffectiveMenuForConcept(concept: string): MenuContent | null {
  const override = getStoredMenuOverride(concept)

  if (override) {
    return override
  }

  return getDefaultMenuForConcept(concept)
}

export function saveMenuOverride(
  concept: string,
  menu: MenuContent,
): MenuContent {
  const db = ensureDatabase()

  try {
    const safeMenu = sanitiseMenuContent(menu)

    if (!safeMenu) {
      throw new Error("Invalid menu payload")
    }

    db.prepare(
      `
        INSERT INTO dashboard_menu_content (
          concept_slug,
          payload_json,
          updated_at
        )
        VALUES (?, ?, ?)
        ON CONFLICT(concept_slug) DO UPDATE SET
          payload_json = excluded.payload_json,
          updated_at = excluded.updated_at
      `,
    ).run(concept, JSON.stringify(safeMenu), new Date().toISOString())

    return cloneMenuContent(safeMenu)
  } finally {
    db.close()
  }
}

export function deleteMenuOverride(concept: string): void {
  const db = ensureDatabase()

  try {
    db.prepare(
      `
        DELETE FROM dashboard_menu_content
        WHERE concept_slug = ?
      `,
    ).run(concept)
  } finally {
    db.close()
  }
}
import fs from "node:fs"
import path from "node:path"

import Database from "better-sqlite3"

import { getDefaultSettingsForConcept } from "@/lib/settings/defaultSettings"
import {
  cloneSettingsContent,
  sanitiseSettingsContent,
  type SettingsContent,
} from "@/lib/settings/types"

const dataDirectory = path.join(process.cwd(), "data")
const databasePath = path.join(dataDirectory, "tablepilot.sqlite")

function ensureDatabase() {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true })
  }

  const db = new Database(databasePath)

  db.exec(`
    CREATE TABLE IF NOT EXISTS dashboard_settings_content (
      concept_slug TEXT PRIMARY KEY,
      payload_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  return db
}

export function getStoredSettingsOverride(
  concept: string,
): SettingsContent | null {
  const db = ensureDatabase()

  try {
    const row = db
      .prepare(
        `
          SELECT payload_json
          FROM dashboard_settings_content
          WHERE concept_slug = ?
        `,
      )
      .get(concept) as { payload_json: string } | undefined

    if (!row) {
      return null
    }

    const parsed = sanitiseSettingsContent(
      JSON.parse(row.payload_json) as Partial<SettingsContent>,
    )

    if (!parsed) {
      return null
    }

    return cloneSettingsContent(parsed)
  } finally {
    db.close()
  }
}

export function getEffectiveSettingsForConcept(
  concept: string,
): SettingsContent | null {
  const override = getStoredSettingsOverride(concept)

  if (override) {
    return override
  }

  return getDefaultSettingsForConcept(concept)
}

export function saveSettingsOverride(
  concept: string,
  settings: SettingsContent,
): SettingsContent {
  const db = ensureDatabase()

  try {
    const safeSettings = sanitiseSettingsContent(settings)

    if (!safeSettings) {
      throw new Error("Invalid settings payload")
    }

    db.prepare(
      `
        INSERT INTO dashboard_settings_content (
          concept_slug,
          payload_json,
          updated_at
        )
        VALUES (?, ?, ?)
        ON CONFLICT(concept_slug) DO UPDATE SET
          payload_json = excluded.payload_json,
          updated_at = excluded.updated_at
      `,
    ).run(concept, JSON.stringify(safeSettings), new Date().toISOString())

    return cloneSettingsContent(safeSettings)
  } finally {
    db.close()
  }
}

export function deleteSettingsOverride(concept: string): void {
  const db = ensureDatabase()

  try {
    db.prepare(
      `
        DELETE FROM dashboard_settings_content
        WHERE concept_slug = ?
      `,
    ).run(concept)
  } finally {
    db.close()
  }
}
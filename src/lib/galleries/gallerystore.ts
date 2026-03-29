import db from "@/lib/db/sqlite"

import { getDefaultGalleryForConcept } from "@/lib/galleries/defaultGalleries"
import {
  cloneGalleryContent,
  sanitiseGalleryContent,
  type GalleryContent,
} from "@/lib/galleries/types"

type GalleryOverrideRow = {
  data: string
}

export function getGalleryOverride(concept: string): GalleryContent | null {
  const row = db
    .prepare("SELECT data FROM gallery_overrides WHERE concept = ?")
    .get(concept) as GalleryOverrideRow | undefined

  if (!row) {
    return null
  }

  try {
    const parsed = JSON.parse(row.data) as GalleryContent
    const safeGallery = sanitiseGalleryContent(parsed)

    if (!safeGallery) {
      return null
    }

    return cloneGalleryContent(safeGallery)
  } catch {
    return null
  }
}

export function getEffectiveGalleryForConcept(
  concept: string,
): GalleryContent | null {
  const override = getGalleryOverride(concept)

  if (override) {
    return override
  }

  return getDefaultGalleryForConcept(concept)
}

export function saveGalleryOverride(
  concept: string,
  gallery: GalleryContent,
): GalleryContent {
  const safeGallery = sanitiseGalleryContent(gallery)

  if (!safeGallery) {
    throw new Error("Invalid gallery payload")
  }

  db.prepare(
    `
      INSERT INTO gallery_overrides (
        concept,
        data
      )
      VALUES (?, ?)
      ON CONFLICT(concept) DO UPDATE SET
        data = excluded.data
    `,
  ).run(concept, JSON.stringify(safeGallery))

  return cloneGalleryContent(safeGallery)
}

export function deleteGalleryOverride(concept: string): void {
  db.prepare(
    `
      DELETE FROM gallery_overrides
      WHERE concept = ?
    `,
  ).run(concept)
}
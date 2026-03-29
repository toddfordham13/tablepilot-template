import { NextResponse } from "next/server"

import {
  getAvailableGalleryConcepts,
  getDefaultGalleryForConcept,
} from "@/lib/galleries/defaultGalleries"
import {
  deleteGalleryOverride,
  getEffectiveGalleryForConcept,
  saveGalleryOverride,
} from "@/lib/galleries/gallerystore"
import {
  sanitiseGalleryContent,
  type GalleryContent,
} from "@/lib/galleries/types"

export const runtime = "nodejs"

function isValidConcept(concept: string | null): concept is string {
  return !!concept && getAvailableGalleryConcepts().includes(concept)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const concept = searchParams.get("concept")
  const source = searchParams.get("source")

  if (!isValidConcept(concept)) {
    return NextResponse.json(
      { error: "Invalid or missing concept" },
      { status: 400 },
    )
  }

  const gallery =
    source === "default"
      ? getDefaultGalleryForConcept(concept)
      : getEffectiveGalleryForConcept(concept)

  if (!gallery) {
    return NextResponse.json({ error: "Gallery not found" }, { status: 404 })
  }

  return NextResponse.json({ gallery })
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    concept?: string
    gallery?: unknown
  }

  const concept = body.concept ?? null

  if (!isValidConcept(concept)) {
    return NextResponse.json(
      { error: "Invalid or missing concept" },
      { status: 400 },
    )
  }

  const safeGallery = sanitiseGalleryContent(
    (body.gallery ?? null) as GalleryContent | null,
  )

  if (!safeGallery) {
    return NextResponse.json(
      { error: "Invalid gallery payload" },
      { status: 400 },
    )
  }

  const savedGallery = saveGalleryOverride(concept, safeGallery)

  return NextResponse.json({ gallery: savedGallery })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const concept = searchParams.get("concept")

  if (!isValidConcept(concept)) {
    return NextResponse.json(
      { error: "Invalid or missing concept" },
      { status: 400 },
    )
  }

  deleteGalleryOverride(concept)

  const defaultGallery = getDefaultGalleryForConcept(concept)

  if (!defaultGallery) {
    return NextResponse.json({ error: "Gallery not found" }, { status: 404 })
  }

  return NextResponse.json({ gallery: defaultGallery })
}
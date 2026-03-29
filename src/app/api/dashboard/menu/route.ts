import { NextResponse } from "next/server"

import {
  getAvailableMenuConcepts,
  getDefaultMenuForConcept,
} from "@/lib/menus/defaultMenus"
import {
  deleteMenuOverride,
  getEffectiveMenuForConcept,
  saveMenuOverride,
} from "@/lib/menus/menuStore"
import { sanitiseMenuContent } from "@/lib/menus/types"

export const runtime = "nodejs"

function isValidConcept(concept: string | null): concept is string {
  return !!concept && getAvailableMenuConcepts().includes(concept)
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

  const menu =
    source === "default"
      ? getDefaultMenuForConcept(concept)
      : getEffectiveMenuForConcept(concept)

  if (!menu) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 })
  }

  return NextResponse.json({ menu })
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    concept?: string
    menu?: unknown
  }

  const concept = body.concept ?? null

  if (!isValidConcept(concept)) {
    return NextResponse.json(
      { error: "Invalid or missing concept" },
      { status: 400 },
    )
  }

  const safeMenu = sanitiseMenuContent((body.menu ?? {}) as object)

  if (!safeMenu) {
    return NextResponse.json({ error: "Invalid menu payload" }, { status: 400 })
  }

  const savedMenu = saveMenuOverride(concept, safeMenu)

  return NextResponse.json({ menu: savedMenu })
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

  deleteMenuOverride(concept)

  const defaultMenu = getDefaultMenuForConcept(concept)

  if (!defaultMenu) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 })
  }

  return NextResponse.json({ menu: defaultMenu })
}
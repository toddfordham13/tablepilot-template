import { NextResponse } from "next/server"

import {
  getAvailableSettingsConcepts,
  getDefaultSettingsForConcept,
} from "@/lib/settings/defaultSettings"
import {
  deleteSettingsOverride,
  getEffectiveSettingsForConcept,
  saveSettingsOverride,
} from "@/lib/settings/settingsStore"
import {
  sanitiseSettingsContent,
  type SettingsContent,
} from "@/lib/settings/types"

export const runtime = "nodejs"

function isValidConcept(concept: string | null): concept is string {
  return !!concept && getAvailableSettingsConcepts().includes(concept)
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

  const settings =
    source === "default"
      ? getDefaultSettingsForConcept(concept)
      : getEffectiveSettingsForConcept(concept)

  if (!settings) {
    return NextResponse.json(
      { error: "Settings not found" },
      { status: 404 },
    )
  }

  return NextResponse.json({ settings })
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    concept?: string
    settings?: unknown
  }

  const concept = body.concept ?? null

  if (!isValidConcept(concept)) {
    return NextResponse.json(
      { error: "Invalid or missing concept" },
      { status: 400 },
    )
  }

  const safeSettings = sanitiseSettingsContent(
    (body.settings ?? null) as SettingsContent | null,
  )

  if (!safeSettings) {
    return NextResponse.json(
      { error: "Invalid settings payload" },
      { status: 400 },
    )
  }

  const savedSettings = saveSettingsOverride(concept, safeSettings)

  return NextResponse.json({ settings: savedSettings })
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

  deleteSettingsOverride(concept)

  const defaultSettings = getDefaultSettingsForConcept(concept)

  if (!defaultSettings) {
    return NextResponse.json(
      { error: "Settings not found" },
      { status: 404 },
    )
  }

  return NextResponse.json({ settings: defaultSettings })
}
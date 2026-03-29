import { NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import {
  getOpeningHoursByRestaurantSlug,
  replaceOpeningHoursForRestaurant,
  type OpeningHourInput,
} from "@/lib/db/hours"

type HoursRequestBody = {
  hours?: Array<{
    dayKey?: string
    label?: string
    isClosed?: boolean
    openTime?: string
    closeTime?: string
    sortOrder?: number
  }>
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
}

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const hours = getOpeningHoursByRestaurantSlug(user.restaurantSlug)

  return NextResponse.json({ hours })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = (await request.json()) as HoursRequestBody
    const incomingHours = body.hours

    if (!Array.isArray(incomingHours) || incomingHours.length === 0) {
      return NextResponse.json(
        { error: "Hours payload is required." },
        { status: 400 }
      )
    }

    const parsedHours: OpeningHourInput[] = incomingHours.map((hour, index) => {
      const dayKey = hour.dayKey?.trim() ?? ""
      const label = hour.label?.trim() ?? ""
      const isClosed = Boolean(hour.isClosed)
      const openTime = hour.openTime?.trim() ?? ""
      const closeTime = hour.closeTime?.trim() ?? ""
      const sortOrder =
        typeof hour.sortOrder === "number" ? hour.sortOrder : index

      if (!dayKey || !label) {
        throw new Error("Each day must include a dayKey and label.")
      }

      if (!isClosed) {
        if (!isValidTime(openTime) || !isValidTime(closeTime)) {
          throw new Error("Open and close times must use HH:MM format.")
        }
      }

      return {
        dayKey,
        label,
        isClosed,
        openTime,
        closeTime,
        sortOrder,
      }
    })

    replaceOpeningHoursForRestaurant(user.restaurantSlug, parsedHours)

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save hours."

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
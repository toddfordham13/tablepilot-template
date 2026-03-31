import { NextResponse } from "next/server"

import { initBookingsDb } from "@/lib/bookings/db"
import {
  getAllServiceConfigsForRestaurant,
  saveServicesForRestaurant,
} from "@/lib/bookings/servicesRepo"
import {
  getBookingSettingsConfig,
  saveBookingSettings,
} from "@/lib/bookings/settingsRepo"
import type {
  BookingServiceConfig,
  BookingSettingsConfig,
  DayKey,
} from "@/lib/bookings/types"

export const runtime = "nodejs"

initBookingsDb()

const VALID_DAYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

function isValidTime(value: unknown): value is string {
  return typeof value === "string" && /^\d{2}:\d{2}$/.test(value)
}

function toNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return null
  }

  return parsed
}

function sanitiseSettings(
  restaurantSlug: string,
  value: unknown
): BookingSettingsConfig | null {
  if (!value || typeof value !== "object") {
    return null
  }

  const input = value as Record<string, unknown>

  const maxAdvanceDays = Number(input.maxAdvanceDays)
  const defaultSlotInterval = Number(input.defaultSlotInterval)
  const defaultMaxPartySize = Number(input.defaultMaxPartySize)
  const defaultCutoffHours = Number(input.defaultCutoffHours)

  if (
    !Number.isFinite(maxAdvanceDays) ||
    !Number.isFinite(defaultSlotInterval) ||
    !Number.isFinite(defaultMaxPartySize) ||
    !Number.isFinite(defaultCutoffHours)
  ) {
    return null
  }

  return {
    restaurantSlug,
    bookingEmail:
      typeof input.bookingEmail === "string" ? input.bookingEmail.trim() : "",
    timezone:
      typeof input.timezone === "string" && input.timezone.trim()
        ? input.timezone.trim()
        : "Europe/London",
    maxAdvanceDays: Math.max(1, Math.floor(maxAdvanceDays)),
    defaultSlotInterval: Math.max(5, Math.floor(defaultSlotInterval)),
    defaultMaxPartySize: Math.max(1, Math.floor(defaultMaxPartySize)),
    defaultCutoffHours: Math.max(0, Math.floor(defaultCutoffHours)),
  }
}

function sanitiseService(
  restaurantSlug: string,
  value: unknown,
  index: number
): BookingServiceConfig | null {
  if (!value || typeof value !== "object") {
    return null
  }

  const input = value as Record<string, unknown>

  const key =
    typeof input.key === "string" ? input.key.trim().toLowerCase() : ""
  const label = typeof input.label === "string" ? input.label.trim() : ""
  const startTime = typeof input.startTime === "string" ? input.startTime : ""
  const endTime = typeof input.endTime === "string" ? input.endTime : ""
  const slotInterval = Number(input.slotInterval)
  const sortOrder = Number(input.sortOrder ?? index + 1)

  const rawDays = Array.isArray(input.days) ? input.days : []
  const days = VALID_DAYS.filter((day: DayKey) => rawDays.includes(day))

  if (!key || !label) {
    return null
  }

  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    return null
  }

  if (startTime >= endTime) {
    return null
  }

  if (!Number.isFinite(slotInterval) || slotInterval < 5) {
    return null
  }

  if (!Number.isFinite(sortOrder) || sortOrder < 1) {
    return null
  }

  if (days.length === 0) {
    return null
  }

  return {
    id:
      typeof input.id === "string" && input.id.trim()
        ? input.id.trim()
        : `${restaurantSlug}-${key}`,
    restaurantSlug,
    key,
    label,
    days,
    startTime,
    endTime,
    slotInterval: Math.max(5, Math.floor(slotInterval)),
    maxCovers: toNullableNumber(input.maxCovers),
    maxPartySize: toNullableNumber(input.maxPartySize),
    cutoffHours: toNullableNumber(input.cutoffHours),
    active: Boolean(input.active),
    sortOrder: Math.max(1, Math.floor(sortOrder)),
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const restaurantSlug = searchParams.get("restaurantSlug")?.trim()

  if (!restaurantSlug) {
    return NextResponse.json(
      { error: "restaurantSlug required" },
      { status: 400 }
    )
  }

  const settings = getBookingSettingsConfig(restaurantSlug)
  const services = getAllServiceConfigsForRestaurant(restaurantSlug)

  return NextResponse.json({
    restaurantSlug,
    settings,
    services,
  })
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const restaurantSlug =
      typeof body?.restaurantSlug === "string"
        ? body.restaurantSlug.trim()
        : ""

    if (!restaurantSlug) {
      return NextResponse.json(
        { error: "restaurantSlug required" },
        { status: 400 }
      )
    }

    const settings = sanitiseSettings(restaurantSlug, body?.settings)
    const rawServices: unknown[] = Array.isArray(body?.services) ? body.services : []

    if (!settings) {
      return NextResponse.json(
        { error: "Invalid booking settings payload" },
        { status: 400 }
      )
    }

    const services = rawServices
      .map((service: unknown, index: number) =>
        sanitiseService(restaurantSlug, service, index)
      )
      .filter(
        (service: BookingServiceConfig | null): service is BookingServiceConfig =>
          Boolean(service)
      )
      .sort(
        (a: BookingServiceConfig, b: BookingServiceConfig) =>
          a.sortOrder - b.sortOrder || a.label.localeCompare(b.label)
      )

    if (services.length === 0) {
      return NextResponse.json(
        { error: "At least one service is required" },
        { status: 400 }
      )
    }

    const seenKeys = new Set<string>()

    for (const service of services) {
      if (seenKeys.has(service.key)) {
        return NextResponse.json(
          { error: `Duplicate service key "${service.key}"` },
          { status: 400 }
        )
      }

      seenKeys.add(service.key)
    }

    saveBookingSettings(restaurantSlug, settings)
    saveServicesForRestaurant(restaurantSlug, services)

    return NextResponse.json({
      restaurantSlug,
      settings: getBookingSettingsConfig(restaurantSlug),
      services: getAllServiceConfigsForRestaurant(restaurantSlug),
    })
  } catch (error) {
    console.error("Booking configuration save failed:", error)

    return NextResponse.json(
      { error: "Booking configuration save failed" },
      { status: 500 }
    )
  }
}
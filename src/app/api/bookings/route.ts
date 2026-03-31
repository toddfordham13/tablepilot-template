import { NextResponse } from "next/server"

import { createBooking, getBookingsForRestaurant } from "@/lib/bookings/bookingsRepo"
import { initBookingsDb } from "@/lib/bookings/db"
import { sendNewBookingEmails } from "@/lib/bookings/emails"
import { validateBookingRequest } from "@/lib/bookings/availability"
import type { BookingSource } from "@/lib/bookings/types"

export const runtime = "nodejs"

initBookingsDb()

const VALID_SOURCES: BookingSource[] = ["web", "phone", "walk_in", "manual"]

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isValidDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isValidTime(value: unknown): value is string {
  return typeof value === "string" && /^\d{2}:\d{2}$/.test(value)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const restaurantSlug = searchParams.get("restaurantSlug")

  if (!restaurantSlug) {
    return NextResponse.json(
      { error: "restaurantSlug required" },
      { status: 400 }
    )
  }

  const bookings = getBookingsForRestaurant(restaurantSlug)

  return NextResponse.json({ bookings })
}

export async function POST(request: Request) {
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

    if (!isNonEmptyString(body?.guestName)) {
      return NextResponse.json(
        { error: "Guest name is required" },
        { status: 400 }
      )
    }

    if (!isNonEmptyString(body?.guestEmail)) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    if (!isNonEmptyString(body?.guestPhone)) {
      return NextResponse.json(
        { error: "Phone is required" },
        { status: 400 }
      )
    }

    if (!isValidDate(body?.bookingDate)) {
      return NextResponse.json(
        { error: "Valid booking date is required" },
        { status: 400 }
      )
    }

    if (!isValidTime(body?.bookingTime)) {
      return NextResponse.json(
        { error: "Valid booking time is required" },
        { status: 400 }
      )
    }

    if (!isNonEmptyString(body?.serviceKey)) {
      return NextResponse.json(
        { error: "Service is required" },
        { status: 400 }
      )
    }

    const guests = Number(body?.guests)

    if (!Number.isInteger(guests) || guests < 1) {
      return NextResponse.json(
        { error: "Guests must be at least 1" },
        { status: 400 }
      )
    }

    const source: BookingSource =
      typeof body?.source === "string" &&
        VALID_SOURCES.includes(body.source as BookingSource)
        ? (body.source as BookingSource)
        : "web"

    const validation = validateBookingRequest({
      restaurantSlug,
      bookingDate: body.bookingDate,
      bookingTime: body.bookingTime,
      serviceKey: body.serviceKey.trim(),
      guests,
    })

    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const booking = createBooking({
      restaurantSlug,
      status: "pending",
      source,

      guestName: body.guestName.trim(),
      guestEmail: body.guestEmail.trim(),
      guestPhone: body.guestPhone.trim(),

      guests,

      bookingDate: body.bookingDate,
      bookingTime: body.bookingTime,

      serviceKey: body.serviceKey.trim(),

      allergies:
        typeof body?.allergies === "string"
          ? body.allergies.trim() || null
          : null,
      celebration:
        typeof body?.celebration === "string"
          ? body.celebration.trim() || null
          : null,
      seatingPreference:
        typeof body?.seatingPreference === "string"
          ? body.seatingPreference.trim() || null
          : null,
      accessibilityNotes:
        typeof body?.accessibilityNotes === "string"
          ? body.accessibilityNotes.trim() || null
          : null,
      highchair: Boolean(body?.highchair),

      guestNotes:
        typeof body?.guestNotes === "string"
          ? body.guestNotes.trim() || null
          : null,
      internalNotes: null,
    })

    if (booking) {
      try {
        await sendNewBookingEmails(booking)
      } catch (emailError) {
        console.error("Booking emails failed:", emailError)
      }
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Booking creation failed:", error)

    return NextResponse.json(
      { error: "Booking creation failed" },
      { status: 500 }
    )
  }
}
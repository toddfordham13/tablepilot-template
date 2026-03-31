import { NextResponse } from "next/server"

import { getAvailabilityForDate } from "@/lib/bookings/availability"
import { initBookingsDb } from "@/lib/bookings/db"

export const runtime = "nodejs"

initBookingsDb()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const restaurantSlug = searchParams.get("restaurantSlug")?.trim()
  const bookingDate = searchParams.get("bookingDate")?.trim()
  const guestsValue = searchParams.get("guests")?.trim()

  if (!restaurantSlug) {
    return NextResponse.json(
      { error: "restaurantSlug required" },
      { status: 400 }
    )
  }

  if (!bookingDate || !/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
    return NextResponse.json(
      { error: "Valid bookingDate required" },
      { status: 400 }
    )
  }

  const guests = Number(guestsValue ?? "2")

  if (!Number.isInteger(guests) || guests < 1) {
    return NextResponse.json(
      { error: "Guests must be at least 1" },
      { status: 400 }
    )
  }

  const availability = getAvailabilityForDate(
    restaurantSlug,
    bookingDate,
    guests
  )

  return NextResponse.json(availability)
}
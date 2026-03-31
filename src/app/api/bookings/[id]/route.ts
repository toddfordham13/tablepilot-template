import { NextResponse } from "next/server"
import { getBookingById, updateBookingStatus } from "@/lib/bookings/bookingsRepo"
import { initBookingsDb } from "@/lib/bookings/db"
import { sendBookingStatusEmail } from "@/lib/bookings/emails"
import type { BookingStatus } from "@/lib/bookings/types"

export const runtime = "nodejs"

initBookingsDb()

const VALID_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "declined",
  "cancelled",
  "arrived",
  "seated",
  "completed",
  "no_show",
]

function isValidBookingStatus(value: unknown): value is BookingStatus {
  return (
    typeof value === "string" &&
    VALID_STATUSES.includes(value as BookingStatus)
  )
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const booking = getBookingById(id)

  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ booking })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const status = body?.status

    if (!isValidBookingStatus(status)) {
      return NextResponse.json(
        { error: "Invalid booking status" },
        { status: 400 }
      )
    }

    const existingBooking = getBookingById(id)

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    const booking = updateBookingStatus(id, status)

    if (
      booking &&
      (status === "confirmed" ||
        status === "declined" ||
        status === "cancelled")
    ) {
      try {
        await sendBookingStatusEmail(booking, status)
      } catch (emailError) {
        console.error("Booking status email failed:", emailError)
      }
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Booking update failed:", error)

    return NextResponse.json(
      { error: "Booking update failed" },
      { status: 500 }
    )
  }
}
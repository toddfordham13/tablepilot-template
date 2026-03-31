import { randomUUID } from "crypto"
import { db } from "./db"
import type { BookingRecord, BookingStatus } from "./types"

export const CAPACITY_BLOCKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "arrived",
  "seated",
  "completed",
]

export function createBooking(input: {
  restaurantSlug: string
  status: BookingStatus
  source: string

  guestName: string
  guestEmail: string
  guestPhone: string

  guests: number

  bookingDate: string
  bookingTime: string

  serviceKey: string

  allergies?: string | null
  celebration?: string | null
  seatingPreference?: string | null
  accessibilityNotes?: string | null
  highchair?: boolean

  guestNotes?: string | null
  internalNotes?: string | null
}) {
  const id = randomUUID()
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO bookings (
      id,
      restaurant_slug,
      status,
      source,
      guest_name,
      guest_email,
      guest_phone,
      guests,
      booking_date,
      booking_time,
      service_key,
      allergies,
      celebration,
      seating_preference,
      accessibility_notes,
      highchair,
      guest_notes,
      internal_notes,
      created_at,
      updated_at
    )
    VALUES (
      ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
    )
  `).run(
    id,
    input.restaurantSlug,
    input.status,
    input.source,
    input.guestName,
    input.guestEmail,
    input.guestPhone,
    input.guests,
    input.bookingDate,
    input.bookingTime,
    input.serviceKey,
    input.allergies || null,
    input.celebration || null,
    input.seatingPreference || null,
    input.accessibilityNotes || null,
    input.highchair ? 1 : 0,
    input.guestNotes || null,
    input.internalNotes || null,
    now,
    now
  )

  return getBookingById(id)
}

export function getBookingById(id: string) {
  return db.prepare(`SELECT * FROM bookings WHERE id = ?`).get(id)
}

export function getBookingsForRestaurant(restaurantSlug: string) {
  return db
    .prepare(`
      SELECT *
      FROM bookings
      WHERE restaurant_slug = ?
      ORDER BY booking_date ASC, booking_time ASC
    `)
    .all(restaurantSlug)
}

export function getBookingsForRestaurantOnDate(
  restaurantSlug: string,
  bookingDate: string
): BookingRecord[] {
  return db
    .prepare(
      `
      SELECT *
      FROM bookings
      WHERE restaurant_slug = ?
        AND booking_date = ?
      ORDER BY booking_time ASC, created_at ASC
    `
    )
    .all(restaurantSlug, bookingDate) as BookingRecord[]
}

export function getBookingsForServiceOnDate(
  restaurantSlug: string,
  bookingDate: string,
  serviceKey: string
): BookingRecord[] {
  return db
    .prepare(
      `
      SELECT *
      FROM bookings
      WHERE restaurant_slug = ?
        AND booking_date = ?
        AND service_key = ?
      ORDER BY booking_time ASC, created_at ASC
    `
    )
    .all(restaurantSlug, bookingDate, serviceKey) as BookingRecord[]
}

export function isCapacityBlockingStatus(status: string): status is BookingStatus {
  return CAPACITY_BLOCKING_STATUSES.includes(status as BookingStatus)
}

export function getCapacityBookingsForServiceSlot(
  restaurantSlug: string,
  bookingDate: string,
  serviceKey: string,
  bookingTime: string
): BookingRecord[] {
  const rows = db
    .prepare(
      `
      SELECT *
      FROM bookings
      WHERE restaurant_slug = ?
        AND booking_date = ?
        AND service_key = ?
        AND booking_time = ?
      ORDER BY created_at ASC
    `
    )
    .all(
      restaurantSlug,
      bookingDate,
      serviceKey,
      bookingTime
    ) as BookingRecord[]

  return rows.filter((booking) =>
    isCapacityBlockingStatus(String(booking.status))
  )
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  const now = new Date().toISOString()

  db.prepare(`
    UPDATE bookings
    SET status = ?, updated_at = ?
    WHERE id = ?
  `).run(status, now, id)

  db.prepare(`
    INSERT INTO booking_status_history (
      id,
      booking_id,
      status,
      created_at
    )
    VALUES (?, ?, ?, ?)
  `).run(
    randomUUID(),
    id,
    status,
    now
  )

  return getBookingById(id)
}
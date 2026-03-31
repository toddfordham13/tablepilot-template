// src/lib/bookings/settingsRepo.ts
import { db } from "./db"
import type {
  BookingSettingsConfig,
  BookingSettingsRecord,
} from "./types"

export const DEFAULT_BOOKING_SETTINGS: BookingSettingsConfig = {
  restaurantSlug: "",
  bookingEmail: "",
  timezone: "Europe/London",
  maxAdvanceDays: 90,
  defaultSlotInterval: 15,
  defaultMaxPartySize: 8,
  defaultCutoffHours: 2,
}

function mapRowToConfig(
  restaurantSlug: string,
  row?: BookingSettingsRecord
): BookingSettingsConfig {
  return {
    restaurantSlug,
    bookingEmail: row?.booking_email ?? DEFAULT_BOOKING_SETTINGS.bookingEmail,
    timezone: row?.timezone ?? DEFAULT_BOOKING_SETTINGS.timezone,
    maxAdvanceDays:
      row?.max_advance_days ?? DEFAULT_BOOKING_SETTINGS.maxAdvanceDays,
    defaultSlotInterval:
      row?.default_slot_interval ??
      DEFAULT_BOOKING_SETTINGS.defaultSlotInterval,
    defaultMaxPartySize:
      row?.default_max_party_size ??
      DEFAULT_BOOKING_SETTINGS.defaultMaxPartySize,
    defaultCutoffHours:
      row?.default_cutoff_hours ??
      DEFAULT_BOOKING_SETTINGS.defaultCutoffHours,
  }
}

export function getBookingSettings(restaurantSlug: string) {
  return db
    .prepare(
      `
      SELECT *
      FROM booking_settings
      WHERE restaurant_slug = ?
    `
    )
    .get(restaurantSlug) as BookingSettingsRecord | undefined
}

export function getBookingSettingsConfig(
  restaurantSlug: string
): BookingSettingsConfig {
  const row = getBookingSettings(restaurantSlug)
  return mapRowToConfig(restaurantSlug, row)
}

export function saveBookingSettings(
  restaurantSlug: string,
  settings: BookingSettingsConfig
) {
  db.prepare(`
    INSERT INTO booking_settings (
      restaurant_slug,
      booking_email,
      timezone,
      max_advance_days,
      default_slot_interval,
      default_max_party_size,
      default_cutoff_hours
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(restaurant_slug) DO UPDATE SET
      booking_email = excluded.booking_email,
      timezone = excluded.timezone,
      max_advance_days = excluded.max_advance_days,
      default_slot_interval = excluded.default_slot_interval,
      default_max_party_size = excluded.default_max_party_size,
      default_cutoff_hours = excluded.default_cutoff_hours
  `).run(
    restaurantSlug,
    settings.bookingEmail.trim(),
    settings.timezone.trim() || DEFAULT_BOOKING_SETTINGS.timezone,
    Math.max(1, Math.floor(settings.maxAdvanceDays)),
    Math.max(5, Math.floor(settings.defaultSlotInterval)),
    Math.max(1, Math.floor(settings.defaultMaxPartySize)),
    Math.max(0, Math.floor(settings.defaultCutoffHours))
  )

  return getBookingSettingsConfig(restaurantSlug)
}
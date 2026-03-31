export type BookingStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "cancelled"
  | "arrived"
  | "seated"
  | "completed"
  | "no_show"

export type BookingSource =
  | "web"
  | "phone"
  | "walk_in"
  | "manual"

export type DayKey =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun"

export type Booking = {
  id: string
  restaurantSlug: string

  status: BookingStatus
  source: BookingSource

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

  createdAt: string
  updatedAt: string
}

export type BookingRecord = {
  id: string
  restaurant_slug: string

  status: BookingStatus
  source: BookingSource | string

  guest_name: string
  guest_email: string
  guest_phone: string

  guests: number

  booking_date: string
  booking_time: string

  service_key: string

  allergies: string | null
  celebration: string | null
  seating_preference: string | null
  accessibility_notes: string | null
  highchair: number | null

  guest_notes: string | null
  internal_notes: string | null

  created_at: string
  updated_at: string
}

export type BookingService = {
  id: string
  restaurantSlug: string

  key: string
  label: string

  days: string

  startTime: string
  endTime: string

  slotInterval: number

  maxCovers: number | null
  maxPartySize: number | null

  cutoffHours: number | null

  active: boolean

  sortOrder: number
}

export type BookingServiceRecord = {
  id: string
  restaurant_slug: string

  service_key: string
  label: string

  days: string

  start_time: string
  end_time: string

  slot_interval: number

  max_covers: number | null
  max_party_size: number | null

  cutoff_hours: number | null

  active: number

  sort_order: number
}

export type BookingServiceConfig = {
  id: string
  restaurantSlug: string
  key: string
  label: string
  days: DayKey[]
  startTime: string
  endTime: string
  slotInterval: number
  maxCovers: number | null
  maxPartySize: number | null
  cutoffHours: number | null
  active: boolean
  sortOrder: number
}

export type BookingSettings = {
  restaurantSlug: string
  bookingEmail: string
  timezone: string
  maxAdvanceDays: number
  defaultSlotInterval: number
  defaultMaxPartySize: number
  defaultCutoffHours: number
}

export type BookingSettingsRecord = {
  restaurant_slug: string
  booking_email: string
  timezone: string
  max_advance_days: number
  default_slot_interval: number
  default_max_party_size: number
  default_cutoff_hours: number
}

export type BookingSettingsConfig = {
  restaurantSlug: string
  bookingEmail: string
  timezone: string
  maxAdvanceDays: number
  defaultSlotInterval: number
  defaultMaxPartySize: number
  defaultCutoffHours: number
}

export type BookingAvailabilitySlot = {
  time: string
  available: boolean
  reason: string | null
  currentCovers: number
  remainingCovers: number | null
  maxCovers: number | null
}

export type BookingAvailabilityService = {
  key: string
  label: string
  startTime: string
  endTime: string
  slotInterval: number
  maxCovers: number | null
  maxPartySize: number | null
  cutoffHours: number | null
  available: boolean
  reason: string | null
  slots: BookingAvailabilitySlot[]
}

export type BookingAvailabilityResponse = {
  restaurantSlug: string
  bookingDate: string
  guests: number
  services: BookingAvailabilityService[]
}
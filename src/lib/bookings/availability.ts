import { getCapacityBookingsForServiceSlot } from "./bookingsRepo"
import { getActiveServiceConfigsForRestaurant } from "./servicesRepo"
import { getBookingSettingsConfig } from "./settingsRepo"
import type {
  BookingAvailabilityResponse,
  BookingAvailabilityService,
  BookingAvailabilitySlot,
  BookingServiceConfig,
  BookingSettingsConfig,
  DayKey,
} from "./types"

const DAY_MAP: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

function getStartOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function diffInCalendarDays(bookingDate: string) {
  const target = new Date(`${bookingDate}T00:00:00`)
  const today = getStartOfToday()

  return Math.floor(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )
}

export function getDayKey(date: string): DayKey {
  const day = new Date(`${date}T12:00:00`).getDay()
  return DAY_MAP[day]
}

function buildDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`)
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  return hours * 60 + minutes
}

function minutesToTime(value: number) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

function isValidTimeWithinService(service: BookingServiceConfig, bookingTime: string) {
  return bookingTime >= service.startTime && bookingTime <= service.endTime
}

function getServiceCutoffHours(
  service: BookingServiceConfig,
  settings: BookingSettingsConfig
) {
  return service.cutoffHours ?? settings.defaultCutoffHours
}

function getServiceMaxPartySize(
  service: BookingServiceConfig,
  settings: BookingSettingsConfig
) {
  return service.maxPartySize ?? settings.defaultMaxPartySize
}

function getServiceSlotInterval(
  service: BookingServiceConfig,
  settings: BookingSettingsConfig
) {
  return Math.max(5, service.slotInterval || settings.defaultSlotInterval || 15)
}

function getCurrentCoversForSlot(
  restaurantSlug: string,
  bookingDate: string,
  serviceKey: string,
  bookingTime: string
) {
  const bookings = getCapacityBookingsForServiceSlot(
    restaurantSlug,
    bookingDate,
    serviceKey,
    bookingTime
  )

  return bookings.reduce((total, booking) => total + Number(booking.guests || 0), 0)
}

function buildSlotReason(params: {
  bookingDate: string
  slotTime: string
  cutoffHours: number
  maxCovers: number | null
  currentCovers: number
  requestedGuests: number
}) {
  const { bookingDate, slotTime, cutoffHours, maxCovers, currentCovers, requestedGuests } =
    params

  const requestedDateTime = buildDateTime(bookingDate, slotTime)
  const nowPlusCutoff = new Date(Date.now() + cutoffHours * 60 * 60 * 1000)

  if (requestedDateTime.getTime() < nowPlusCutoff.getTime()) {
    return `Bookings for this time must be made at least ${cutoffHours} hour${cutoffHours === 1 ? "" : "s"} in advance`
  }

  if (maxCovers !== null && currentCovers + requestedGuests > maxCovers) {
    return "This time slot is fully booked"
  }

  return null
}

function buildServiceSlots(params: {
  restaurantSlug: string
  bookingDate: string
  requestedGuests: number
  service: BookingServiceConfig
  settings: BookingSettingsConfig
}): BookingAvailabilitySlot[] {
  const { restaurantSlug, bookingDate, requestedGuests, service, settings } = params

  const slotInterval = getServiceSlotInterval(service, settings)
  const startMinutes = timeToMinutes(service.startTime)
  const endMinutes = timeToMinutes(service.endTime)
  const cutoffHours = getServiceCutoffHours(service, settings)
  const maxCovers = service.maxCovers

  const slots: BookingAvailabilitySlot[] = []

  for (let current = startMinutes; current <= endMinutes; current += slotInterval) {
    const slotTime = minutesToTime(current)
    const currentCovers = getCurrentCoversForSlot(
      restaurantSlug,
      bookingDate,
      service.key,
      slotTime
    )

    const reason = buildSlotReason({
      bookingDate,
      slotTime,
      cutoffHours,
      maxCovers,
      currentCovers,
      requestedGuests,
    })

    const remainingCovers =
      maxCovers === null ? null : Math.max(0, maxCovers - currentCovers)

    slots.push({
      time: slotTime,
      available: reason === null,
      reason,
      currentCovers,
      remainingCovers,
      maxCovers,
    })
  }

  return slots
}

function buildServiceAvailability(params: {
  restaurantSlug: string
  bookingDate: string
  requestedGuests: number
  service: BookingServiceConfig
  settings: BookingSettingsConfig
}): BookingAvailabilityService {
  const { restaurantSlug, bookingDate, requestedGuests, service, settings } = params

  const maxPartySize = getServiceMaxPartySize(service, settings)
  const cutoffHours = getServiceCutoffHours(service, settings)
  const slotInterval = getServiceSlotInterval(service, settings)

  if (requestedGuests > maxPartySize) {
    return {
      key: service.key,
      label: service.label,
      startTime: service.startTime,
      endTime: service.endTime,
      slotInterval,
      maxCovers: service.maxCovers,
      maxPartySize,
      cutoffHours,
      available: false,
      reason: `Maximum party size for this service is ${maxPartySize}`,
      slots: [],
    }
  }

  const slots = buildServiceSlots({
    restaurantSlug,
    bookingDate,
    requestedGuests,
    service,
    settings,
  })

  const available = slots.some((slot) => slot.available)

  return {
    key: service.key,
    label: service.label,
    startTime: service.startTime,
    endTime: service.endTime,
    slotInterval,
    maxCovers: service.maxCovers,
    maxPartySize,
    cutoffHours,
    available,
    reason: available ? null : "No available times for this service",
    slots,
  }
}

export function getAvailabilityForDate(
  restaurantSlug: string,
  bookingDate: string,
  guests: number
): BookingAvailabilityResponse {
  const settings = getBookingSettingsConfig(restaurantSlug)
  const services = getActiveServiceConfigsForRestaurant(restaurantSlug)
  const bookingDay = getDayKey(bookingDate)

  const advanceDays = diffInCalendarDays(bookingDate)

  if (advanceDays < 0) {
    return {
      restaurantSlug,
      bookingDate,
      guests,
      services: [],
    }
  }

  if (advanceDays > settings.maxAdvanceDays) {
    return {
      restaurantSlug,
      bookingDate,
      guests,
      services: [],
    }
  }

  const availableServices = services
    .filter((service) => service.days.includes(bookingDay))
    .map((service) =>
      buildServiceAvailability({
        restaurantSlug,
        bookingDate,
        requestedGuests: guests,
        service,
        settings,
      })
    )

  return {
    restaurantSlug,
    bookingDate,
    guests,
    services: availableServices,
  }
}

export function validateBookingRequest(input: {
  restaurantSlug: string
  bookingDate: string
  bookingTime: string
  serviceKey: string
  guests: number
}) {
  const { restaurantSlug, bookingDate, bookingTime, serviceKey, guests } = input

  const settings = getBookingSettingsConfig(restaurantSlug)
  const services = getActiveServiceConfigsForRestaurant(restaurantSlug)
  const service = services.find((item) => item.key === serviceKey) ?? null

  if (!service || !service.active) {
    return {
      ok: false as const,
      error: "Selected service is not available",
    }
  }

  const bookingDay = getDayKey(bookingDate)

  if (!service.days.includes(bookingDay)) {
    return {
      ok: false as const,
      error: "Selected service is not available on that date",
    }
  }

  if (!isValidTimeWithinService(service, bookingTime)) {
    return {
      ok: false as const,
      error: "Selected booking time is outside service hours",
    }
  }

  const advanceDays = diffInCalendarDays(bookingDate)

  if (advanceDays < 0) {
    return {
      ok: false as const,
      error: "Booking date cannot be in the past",
    }
  }

  if (advanceDays > settings.maxAdvanceDays) {
    return {
      ok: false as const,
      error: `Bookings can only be made up to ${settings.maxAdvanceDays} days in advance`,
    }
  }

  const availability = getAvailabilityForDate(restaurantSlug, bookingDate, guests)
  const serviceAvailability =
    availability.services.find((item) => item.key === serviceKey) ?? null

  if (!serviceAvailability) {
    return {
      ok: false as const,
      error: "Selected service is not available",
    }
  }

  if (!serviceAvailability.available && serviceAvailability.reason) {
    return {
      ok: false as const,
      error: serviceAvailability.reason,
    }
  }

  const slot = serviceAvailability.slots.find((item) => item.time === bookingTime) ?? null

  if (!slot) {
    return {
      ok: false as const,
      error: "Selected booking time is not available",
    }
  }

  if (!slot.available) {
    return {
      ok: false as const,
      error: slot.reason || "Selected booking time is not available",
    }
  }

  return {
    ok: true as const,
    settings,
    service,
    serviceAvailability,
    slot,
  }
}
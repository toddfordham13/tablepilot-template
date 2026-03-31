// src/lib/bookings/servicesRepo.ts
import { randomUUID } from "crypto"
import { db } from "./db"
import type {
  BookingServiceConfig,
  BookingServiceRecord,
  DayKey,
} from "./types"

const DAY_ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
const EVERY_DAY: DayKey[] = [...DAY_ORDER]

export const DEFAULT_BOOKING_SERVICES: BookingServiceConfig[] = [
  {
    id: "default-breakfast",
    restaurantSlug: "",
    key: "breakfast",
    label: "Breakfast",
    days: EVERY_DAY,
    startTime: "08:00",
    endTime: "11:00",
    slotInterval: 15,
    maxCovers: null,
    maxPartySize: 8,
    cutoffHours: 2,
    active: false,
    sortOrder: 1,
  },
  {
    id: "default-brunch",
    restaurantSlug: "",
    key: "brunch",
    label: "Brunch",
    days: ["sat", "sun"],
    startTime: "10:00",
    endTime: "14:00",
    slotInterval: 15,
    maxCovers: null,
    maxPartySize: 8,
    cutoffHours: 2,
    active: false,
    sortOrder: 2,
  },
  {
    id: "default-lunch",
    restaurantSlug: "",
    key: "lunch",
    label: "Lunch",
    days: EVERY_DAY,
    startTime: "12:00",
    endTime: "15:00",
    slotInterval: 15,
    maxCovers: null,
    maxPartySize: 8,
    cutoffHours: 2,
    active: true,
    sortOrder: 3,
  },
  {
    id: "default-afternoon-tea",
    restaurantSlug: "",
    key: "afternoon_tea",
    label: "Afternoon Tea",
    days: ["fri", "sat", "sun"],
    startTime: "14:00",
    endTime: "17:00",
    slotInterval: 15,
    maxCovers: null,
    maxPartySize: 6,
    cutoffHours: 4,
    active: false,
    sortOrder: 4,
  },
  {
    id: "default-pre-theatre",
    restaurantSlug: "",
    key: "pre_theatre",
    label: "Pre-Theatre",
    days: ["thu", "fri", "sat"],
    startTime: "17:00",
    endTime: "18:30",
    slotInterval: 15,
    maxCovers: null,
    maxPartySize: 6,
    cutoffHours: 3,
    active: false,
    sortOrder: 5,
  },
  {
    id: "default-dinner",
    restaurantSlug: "",
    key: "dinner",
    label: "Dinner",
    days: EVERY_DAY,
    startTime: "18:00",
    endTime: "21:30",
    slotInterval: 15,
    maxCovers: null,
    maxPartySize: 8,
    cutoffHours: 2,
    active: true,
    sortOrder: 6,
  },
]

function normaliseDay(value: string): DayKey | null {
  const normalised = value.trim().toLowerCase() as DayKey
  return DAY_ORDER.includes(normalised) ? normalised : null
}

export function parseDays(days: string): DayKey[] {
  const unique = new Set<DayKey>()

  for (const part of days.split(",")) {
    const day = normaliseDay(part)
    if (day) unique.add(day)
  }

  return DAY_ORDER.filter((day) => unique.has(day))
}

export function serialiseDays(days: DayKey[]) {
  const unique = new Set<DayKey>()

  for (const day of days) {
    if (DAY_ORDER.includes(day)) unique.add(day)
  }

  return DAY_ORDER.filter((day) => unique.has(day)).join(",")
}

function mapRecordToConfig(row: BookingServiceRecord): BookingServiceConfig {
  return {
    id: row.id,
    restaurantSlug: row.restaurant_slug,
    key: row.service_key,
    label: row.label,
    days: parseDays(row.days),
    startTime: row.start_time,
    endTime: row.end_time,
    slotInterval: Number(row.slot_interval),
    maxCovers:
      row.max_covers === null || row.max_covers === undefined
        ? null
        : Number(row.max_covers),
    maxPartySize:
      row.max_party_size === null || row.max_party_size === undefined
        ? null
        : Number(row.max_party_size),
    cutoffHours:
      row.cutoff_hours === null || row.cutoff_hours === undefined
        ? null
        : Number(row.cutoff_hours),
    active: Number(row.active) === 1,
    sortOrder: Number(row.sort_order),
  }
}

function mapConfigToRecord(
  restaurantSlug: string,
  service: BookingServiceConfig
): BookingServiceRecord {
  return {
    id: service.id,
    restaurant_slug: restaurantSlug,
    service_key: service.key,
    label: service.label,
    days: serialiseDays(service.days),
    start_time: service.startTime,
    end_time: service.endTime,
    slot_interval: service.slotInterval,
    max_covers: service.maxCovers,
    max_party_size: service.maxPartySize,
    cutoff_hours: service.cutoffHours,
    active: service.active ? 1 : 0,
    sort_order: service.sortOrder,
  }
}

function buildDefaultServicesForRestaurant(
  restaurantSlug: string
): BookingServiceConfig[] {
  return DEFAULT_BOOKING_SERVICES.map((service) => ({
    ...service,
    id: `${restaurantSlug}-${service.key}`,
    restaurantSlug,
  }))
}

function getStoredServiceRows(restaurantSlug: string): BookingServiceRecord[] {
  return db
    .prepare(
      `
      SELECT *
      FROM booking_services
      WHERE restaurant_slug = ?
      ORDER BY sort_order ASC, label ASC
    `
    )
    .all(restaurantSlug) as BookingServiceRecord[]
}

export function getServicesForRestaurant(restaurantSlug: string) {
  const configs = getActiveServiceConfigsForRestaurant(restaurantSlug)

  return configs.map((service) =>
    mapConfigToRecord(restaurantSlug, service)
  )
}

export function getService(restaurantSlug: string, key: string) {
  const service = getServiceConfig(restaurantSlug, key)

  if (!service) {
    return undefined
  }

  return mapConfigToRecord(restaurantSlug, service)
}

export function getAllServiceConfigsForRestaurant(
  restaurantSlug: string
): BookingServiceConfig[] {
  const rows = getStoredServiceRows(restaurantSlug)

  if (rows.length === 0) {
    return buildDefaultServicesForRestaurant(restaurantSlug)
  }

  return rows.map(mapRecordToConfig)
}

export function getActiveServiceConfigsForRestaurant(
  restaurantSlug: string
): BookingServiceConfig[] {
  return getAllServiceConfigsForRestaurant(restaurantSlug)
    .filter((service) => service.active)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label))
}

export function getServiceConfig(restaurantSlug: string, key: string) {
  return (
    getAllServiceConfigsForRestaurant(restaurantSlug).find(
      (service) => service.key === key
    ) ?? null
  )
}

export function saveServicesForRestaurant(
  restaurantSlug: string,
  services: BookingServiceConfig[]
) {
  const insert = db.prepare(`
    INSERT INTO booking_services (
      id,
      restaurant_slug,
      service_key,
      label,
      days,
      start_time,
      end_time,
      slot_interval,
      max_covers,
      max_party_size,
      cutoff_hours,
      active,
      sort_order
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const removeExisting = db.prepare(`
    DELETE FROM booking_services
    WHERE restaurant_slug = ?
  `)

  const transaction = db.transaction(() => {
    removeExisting.run(restaurantSlug)

    for (const [index, service] of services.entries()) {
      const normalised: BookingServiceConfig = {
        ...service,
        id: service.id?.trim() || randomUUID(),
        restaurantSlug,
        key: service.key.trim(),
        label: service.label.trim(),
        days: DAY_ORDER.filter((day) => service.days.includes(day)),
        slotInterval: Math.max(5, Math.floor(service.slotInterval)),
        maxCovers:
          service.maxCovers === null ? null : Math.max(1, Math.floor(service.maxCovers)),
        maxPartySize:
          service.maxPartySize === null
            ? null
            : Math.max(1, Math.floor(service.maxPartySize)),
        cutoffHours:
          service.cutoffHours === null
            ? null
            : Math.max(0, Math.floor(service.cutoffHours)),
        sortOrder: Math.max(1, Math.floor(service.sortOrder || index + 1)),
      }

      const row = mapConfigToRecord(restaurantSlug, normalised)

      insert.run(
        row.id,
        row.restaurant_slug,
        row.service_key,
        row.label,
        row.days,
        row.start_time,
        row.end_time,
        row.slot_interval,
        row.max_covers,
        row.max_party_size,
        row.cutoff_hours,
        row.active,
        row.sort_order
      )
    }
  })

  transaction()

  return getAllServiceConfigsForRestaurant(restaurantSlug)
}
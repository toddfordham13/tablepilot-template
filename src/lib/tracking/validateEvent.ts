import {
  ANALYTICS_EVENT_NAMES,
  type AnalyticsDeviceType,
  type AnalyticsEventPayload,
  type AnalyticsSection,
} from "./types"

const VALID_SECTIONS: AnalyticsSection[] = [
  "hero",
  "menu",
  "gallery",
  "contact",
  "booking",
  "footer",
  "kpi",
  "unknown",
]

const VALID_DEVICE_TYPES: AnalyticsDeviceType[] = [
  "mobile",
  "tablet",
  "desktop",
  "unknown",
]

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function validateAnalyticsEvent(input: unknown): AnalyticsEventPayload | null {
  if (!isPlainObject(input)) return null

  const event = input.event
  const concept = input.concept
  const path = input.path
  const timestamp = input.timestamp
  const section = input.section
  const deviceType = input.deviceType
  const referrer = input.referrer
  const metadata = input.metadata

  if (
    typeof event !== "string" ||
    !ANALYTICS_EVENT_NAMES.includes(event as (typeof ANALYTICS_EVENT_NAMES)[number])
  ) {
    return null
  }

  if (typeof concept !== "string" || concept.trim().length === 0) {
    return null
  }

  if (typeof path !== "string" || path.trim().length === 0) {
    return null
  }

  if (typeof timestamp !== "string" || Number.isNaN(Date.parse(timestamp))) {
    return null
  }

  if (
    section !== undefined &&
    (typeof section !== "string" ||
      !VALID_SECTIONS.includes(section as AnalyticsSection))
  ) {
    return null
  }

  if (
    deviceType !== undefined &&
    (typeof deviceType !== "string" ||
      !VALID_DEVICE_TYPES.includes(deviceType as AnalyticsDeviceType))
  ) {
    return null
  }

  if (referrer !== undefined && typeof referrer !== "string") {
    return null
  }

  if (metadata !== undefined && !isPlainObject(metadata)) {
    return null
  }

  return {
    event: event as AnalyticsEventPayload["event"],
    concept: concept.trim(),
    path: path.trim(),
    timestamp,
    section: section as AnalyticsSection | undefined,
    deviceType: deviceType as AnalyticsDeviceType | undefined,
    referrer: referrer as string | undefined,
    metadata: metadata as Record<string, string | number | boolean | null> | undefined,
  }
}
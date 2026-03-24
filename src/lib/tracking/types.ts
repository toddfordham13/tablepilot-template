export const ANALYTICS_EVENT_NAMES = [
  "page_view",
  "menu_view",
  "booking_click",
  "directions_click",
  "phone_click",
  "gallery_view",
  "menu_category_click",
  "cta_view",
  "contact_section_view",
  "scroll_depth",
  "private_hire_submit",
] as const

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number]

export type AnalyticsDeviceType = "mobile" | "tablet" | "desktop" | "unknown"

export type AnalyticsSection =
  | "hero"
  | "menu"
  | "gallery"
  | "contact"
  | "booking"
  | "footer"
  | "kpi"
  | "unknown"

export type AnalyticsEventPayload = {
  event: AnalyticsEventName
  concept: string
  path: string
  timestamp: string
  section?: AnalyticsSection
  deviceType?: AnalyticsDeviceType
  referrer?: string
  metadata?: Record<string, string | number | boolean | null>
}
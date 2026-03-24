"use client"

import type {
  AnalyticsDeviceType,
  AnalyticsEventName,
  AnalyticsEventPayload,
  AnalyticsSection,
} from "./types"

type TrackEventInput = {
  event: AnalyticsEventName
  concept: string
  path?: string
  section?: AnalyticsSection
  metadata?: Record<string, string | number | boolean | null>
}

function getDeviceType(): AnalyticsDeviceType {
  if (typeof window === "undefined") return "unknown"

  const width = window.innerWidth

  if (width < 768) return "mobile"
  if (width < 1024) return "tablet"
  return "desktop"
}

function getPath(inputPath?: string) {
  if (inputPath) return inputPath
  if (typeof window === "undefined") return "/"
  return window.location.pathname
}

function getReferrer() {
  if (typeof document === "undefined") return ""
  return document.referrer || ""
}

export async function trackEvent({
  event,
  concept,
  path,
  section,
  metadata,
}: TrackEventInput) {
  const payload: AnalyticsEventPayload = {
    event,
    concept,
    path: getPath(path),
    timestamp: new Date().toISOString(),
    section,
    deviceType: getDeviceType(),
    referrer: getReferrer(),
    metadata,
  }

  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch (error) {
    console.error("Analytics tracking failed:", error)
  }
}
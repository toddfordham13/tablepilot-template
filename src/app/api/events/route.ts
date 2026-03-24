import { NextResponse } from "next/server"

import { getEventsByConcept } from "@/lib/analytics/eventStore"

type AnalyticsEventPayload = {
  event?: string
  timestamp?: string
  concept?: string
  path?: string
  section?: string
  deviceType?: string
  referrer?: string
  metadata?: Record<string, string | number | boolean | null>
}

function isWithinRange(
  timestamp: string,
  start?: string | null,
  end?: string | null
) {
  const value = new Date(timestamp).getTime()

  if (Number.isNaN(value)) return false

  if (start) {
    const startValue = new Date(start).getTime()
    if (!Number.isNaN(startValue) && value < startValue) return false
  }

  if (end) {
    const endValue = new Date(end).getTime()
    if (!Number.isNaN(endValue) && value > endValue) return false
  }

  return true
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const concept = searchParams.get("concept")
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    console.log("[events] query concept:", concept, "start:", start, "end:", end)

    if (!concept) {
      return NextResponse.json(
        { ok: false, error: "Concept is required" },
        { status: 400 }
      )
    }

    const storedEvents = getEventsByConcept(concept)
    console.log("[events] storedEvents:", storedEvents)

    const filteredEvents = storedEvents
      .map((event) => event.payload as AnalyticsEventPayload | null)
      .filter((event): event is AnalyticsEventPayload => Boolean(event))
      .filter((event) => {
        if (!event.timestamp) return false
        if (!isWithinRange(event.timestamp, start, end)) return false
        return true
      })

    console.log("[events] filteredEvents:", filteredEvents)

    const summary = {
      totalEvents: filteredEvents.length,
      visits: filteredEvents.filter((event) => event.event === "page_view").length,
      menuViews: filteredEvents.filter((event) => event.event === "menu_view").length,
      bookingClicks: filteredEvents.filter((event) => event.event === "booking_click").length,
      phoneClicks: filteredEvents.filter((event) => event.event === "phone_click").length,
      directionsClicks: filteredEvents.filter((event) => event.event === "directions_click").length,
      galleryViews: filteredEvents.filter((event) => event.event === "gallery_view").length,
      scrollDepthEvents: filteredEvents.filter((event) => event.event === "scroll_depth").length,
    }

    return NextResponse.json({
      concept,
      events: filteredEvents,
      summary,
    })
  } catch (error) {
    console.error("Events API error:", error)

    return NextResponse.json(
      { ok: false, error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}
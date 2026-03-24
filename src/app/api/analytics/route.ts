import { NextResponse } from "next/server"

import { insertAnalyticsEvent } from "@/lib/analytics/eventStore"
import { validateAnalyticsEvent } from "@/lib/tracking/validateEvent"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[analytics] raw body:", body)

    const event = validateAnalyticsEvent(body)
    console.log("[analytics] validated event:", event)

    if (!event) {
      console.log("[analytics] validation failed")
      return NextResponse.json(
        { ok: false, error: "Invalid analytics event payload" },
        { status: 400 }
      )
    }

    const saved = insertAnalyticsEvent({
      concept: event.concept,
      eventType: event.event,
      sessionId: null,
      path: event.path ?? null,
      payload: event,
    })

    console.log("[analytics] saved event:", saved)

    return NextResponse.json({ ok: true, saved })
  } catch (error) {
    console.error("Analytics API error:", error)

    return NextResponse.json(
      { ok: false, error: "Failed to store analytics event" },
      { status: 500 }
    )
  }
}
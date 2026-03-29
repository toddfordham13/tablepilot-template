import { redirect } from "next/navigation"

import KpiDashboard from "@/components/kpi/KpiDashboard"
import { getConceptAnalytics } from "@/lib/analytics/getConceptAnalytics"
import { getConceptKpis } from "@/lib/analytics/getConceptKpis"
import { getRestaurantHealthScore } from "@/lib/analytics/getRestaurantHealthScore"
import { getRestaurantInsights } from "@/lib/analytics/getRestaurantInsights"
import { getTrendComparison } from "@/lib/analytics/getTrendComparison"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import type { AnalyticsEventPayload } from "@/lib/tracking/types"

type EventsApiResponse = {
  events: AnalyticsEventPayload[]
}

type RangeKey = "today" | "7d" | "30d"

function getDateRange(range: RangeKey) {
  const now = new Date()
  const end = now.toISOString()
  const startDate = new Date(now)

  if (range === "today") {
    startDate.setHours(0, 0, 0, 0)
  } else if (range === "7d") {
    startDate.setDate(startDate.getDate() - 7)
  } else {
    startDate.setDate(startDate.getDate() - 30)
  }

  return {
    start: startDate.toISOString(),
    end,
  }
}

function getPreviousDateRange(range: RangeKey) {
  const currentRange = getDateRange(range)
  const currentStart = new Date(currentRange.start)
  const currentEnd = new Date(currentRange.end)

  const durationMs = currentEnd.getTime() - currentStart.getTime()

  const previousEnd = new Date(currentStart.getTime())
  const previousStart = new Date(currentStart.getTime() - durationMs)

  return {
    start: previousStart.toISOString(),
    end: previousEnd.toISOString(),
  }
}

async function getEventsForWindow(
  concept: string,
  start: string,
  end: string
): Promise<AnalyticsEventPayload[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  const res = await fetch(
    `${baseUrl}/api/events?concept=${encodeURIComponent(
      concept
    )}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    return []
  }

  const data: EventsApiResponse = await res.json()
  return data.events
}

async function getEvents(
  concept: string,
  range: RangeKey
): Promise<AnalyticsEventPayload[]> {
  const { start, end } = getDateRange(range)
  return getEventsForWindow(concept, start, end)
}

async function getPreviousEvents(
  concept: string,
  range: RangeKey
): Promise<AnalyticsEventPayload[]> {
  const { start, end } = getPreviousDateRange(range)
  return getEventsForWindow(concept, start, end)
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/dashboard/login")
  }

  const resolvedSearchParams = await searchParams
  const concept = user.restaurantSlug
  const requestedRange = resolvedSearchParams?.range

  const range: RangeKey =
    requestedRange === "today" ||
      requestedRange === "7d" ||
      requestedRange === "30d"
      ? requestedRange
      : "30d"

  const [events, previousEvents] = await Promise.all([
    getEvents(concept, range),
    getPreviousEvents(concept, range),
  ])

  const summary = getConceptAnalytics(events)
  const kpis = getConceptKpis(summary)

  const previousSummary = getConceptAnalytics(previousEvents)
  const previousKpis = getConceptKpis(previousSummary)

  const health = getRestaurantHealthScore({
    bookingIntentRate: kpis.bookingIntentRate,
    contactActionRate: kpis.contactActionRate,
    menuInterestRate: kpis.menuInterestRate,
    menuToBookingRate: kpis.menuToBookingRate,
  })

  const { insights, actions } = getRestaurantInsights({
    visits: summary.visits,
    menuViews: summary.menuViews,
    bookingClicks: summary.bookingClicks,
    phoneClicks: summary.phoneClicks,
    directionsClicks: summary.directionsClicks,
    contactActions: summary.contactActions,
    bookingIntentRate: kpis.bookingIntentRate,
    menuInterestRate: kpis.menuInterestRate,
    menuToBookingRate: kpis.menuToBookingRate,
    contactActionRate: kpis.contactActionRate,
    healthScore: health.score,
    galleryViews: summary.galleryViews,
    contactSectionViews: summary.contactSectionViews,
    galleryEngagementRate: kpis.galleryEngagementRate,
    contactSectionReachRate: kpis.contactSectionReachRate,
    avgScrollDepth: kpis.avgScrollDepth,
    maxScrollDepth: kpis.maxScrollDepth,
    menuCategoryClicks: summary.menuCategoryClicks,
  })

  const trends = getTrendComparison({
    current: {
      visits: summary.visits,
      menuInterestRate: kpis.menuInterestRate,
      menuToBookingRate: kpis.menuToBookingRate,
      bookingIntentRate: kpis.bookingIntentRate,
      contactActionRate: kpis.contactActionRate,
    },
    previous: {
      visits: previousSummary.visits,
      menuInterestRate: previousKpis.menuInterestRate,
      menuToBookingRate: previousKpis.menuToBookingRate,
      bookingIntentRate: previousKpis.bookingIntentRate,
      contactActionRate: previousKpis.contactActionRate,
    },
  })

  return (
    <KpiDashboard
      concept={concept}
      range={range}
      health={health}
      summary={summary}
      kpis={kpis}
      insights={insights}
      actions={actions}
      trends={trends}
    />
  )
}
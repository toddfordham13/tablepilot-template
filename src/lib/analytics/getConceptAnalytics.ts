import type { AnalyticsEventPayload } from "@/lib/tracking/types"

export type AnalyticsSummary = {
  totalEvents: number

  visits: number
  menuViews: number
  bookingClicks: number
  phoneClicks: number
  directionsClicks: number
  galleryViews: number
  contactSectionViews: number
  scrollDepthEvents: number
  menuCategoryClicks: number
  ctaViews: number

  contactActions: number

  avgScrollDepth: number
  maxScrollDepth: number

  guestJourney: {
    visits: number
    menuViews: number
    bookingClicks: number
  }
}

function getScrollPercent(event: AnalyticsEventPayload): number {
  const percent = event.metadata?.percent

  if (typeof percent === "number" && Number.isFinite(percent)) {
    return Math.max(0, Math.min(100, percent))
  }

  if (typeof percent === "string") {
    const parsed = Number(percent)
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.min(100, parsed))
    }
  }

  return 0
}

export function getConceptAnalytics(
  events: AnalyticsEventPayload[]
): AnalyticsSummary {
  let visits = 0
  let menuViews = 0
  let bookingClicks = 0
  let phoneClicks = 0
  let directionsClicks = 0
  let galleryViews = 0
  let contactSectionViews = 0
  let scrollDepthEvents = 0
  let menuCategoryClicks = 0
  let ctaViews = 0

  let scrollDepthTotal = 0
  let maxScrollDepth = 0

  for (const event of events) {
    switch (event.event) {
      case "page_view":
        visits++
        break
      case "menu_view":
        menuViews++
        break
      case "booking_click":
        bookingClicks++
        break
      case "phone_click":
        phoneClicks++
        break
      case "directions_click":
        directionsClicks++
        break
      case "gallery_view":
        galleryViews++
        break
      case "contact_section_view":
        contactSectionViews++
        break
      case "scroll_depth": {
        scrollDepthEvents++
        const percent = getScrollPercent(event)
        scrollDepthTotal += percent
        if (percent > maxScrollDepth) maxScrollDepth = percent
        break
      }
      case "menu_category_click":
        menuCategoryClicks++
        break
      case "cta_view":
        ctaViews++
        break
      default:
        break
    }
  }

  const contactActions = bookingClicks + phoneClicks + directionsClicks
  const avgScrollDepth =
    scrollDepthEvents > 0 ? scrollDepthTotal / scrollDepthEvents : 0

  return {
    totalEvents: events.length,

    visits,
    menuViews,
    bookingClicks,
    phoneClicks,
    directionsClicks,
    galleryViews,
    contactSectionViews,
    scrollDepthEvents,
    menuCategoryClicks,
    ctaViews,

    contactActions,

    avgScrollDepth,
    maxScrollDepth,

    guestJourney: {
      visits,
      menuViews,
      bookingClicks,
    },
  }
}
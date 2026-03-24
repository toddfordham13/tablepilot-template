type KpiInput = {
  visits: number
  menuViews: number
  bookingClicks: number
  phoneClicks: number
  directionsClicks: number
  galleryViews?: number
  contactSectionViews?: number
  avgScrollDepth?: number
  maxScrollDepth?: number
  menuCategoryClicks?: number
  ctaViews?: number
}

export type ConceptKpis = {
  visits: number
  menuViews: number
  bookingClicks: number
  phoneClicks: number
  directionsClicks: number
  galleryViews: number
  contactSectionViews: number
  menuCategoryClicks: number
  ctaViews: number

  contactActions: number

  menuInterestRate: number
  menuToBookingRate: number
  bookingIntentRate: number
  contactActionRate: number
  galleryEngagementRate: number
  contactSectionReachRate: number

  avgScrollDepth: number
  maxScrollDepth: number
}

function toPercentage(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0
  return (numerator / denominator) * 100
}

export function getConceptKpis(data: KpiInput): ConceptKpis {
  const galleryViews = data.galleryViews ?? 0
  const contactSectionViews = data.contactSectionViews ?? 0
  const avgScrollDepth = data.avgScrollDepth ?? 0
  const maxScrollDepth = data.maxScrollDepth ?? 0
  const menuCategoryClicks = data.menuCategoryClicks ?? 0
  const ctaViews = data.ctaViews ?? 0

  const contactActions =
    data.phoneClicks + data.directionsClicks + data.bookingClicks

  const menuInterestRate = toPercentage(data.menuViews, data.visits)
  const menuToBookingRate = toPercentage(data.bookingClicks, data.menuViews)
  const bookingIntentRate = toPercentage(data.bookingClicks, data.visits)
  const contactActionRate = toPercentage(contactActions, data.visits)
  const galleryEngagementRate = toPercentage(galleryViews, data.visits)
  const contactSectionReachRate = toPercentage(contactSectionViews, data.visits)

  return {
    visits: data.visits,
    menuViews: data.menuViews,
    bookingClicks: data.bookingClicks,
    phoneClicks: data.phoneClicks,
    directionsClicks: data.directionsClicks,
    galleryViews,
    contactSectionViews,
    menuCategoryClicks,
    ctaViews,

    contactActions,

    menuInterestRate,
    menuToBookingRate,
    bookingIntentRate,
    contactActionRate,
    galleryEngagementRate,
    contactSectionReachRate,

    avgScrollDepth,
    maxScrollDepth,
  }
}
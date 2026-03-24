type TrendMetric = {
  current: number
  previous: number
  delta: number
  deltaPercent: number
  direction: "up" | "down" | "flat"
}

export type TrendComparison = {
  visits: TrendMetric
  menuInterestRate: TrendMetric
  menuToBookingRate: TrendMetric
  bookingIntentRate: TrendMetric
  contactActionRate: TrendMetric
}

function getDirection(delta: number): "up" | "down" | "flat" {
  if (delta > 0) return "up"
  if (delta < 0) return "down"
  return "flat"
}

function compareMetric(current: number, previous: number): TrendMetric {
  const delta = current - previous
  const deltaPercent =
    previous === 0 ? (current === 0 ? 0 : 100) : (delta / previous) * 100

  return {
    current,
    previous,
    delta,
    deltaPercent,
    direction: getDirection(delta),
  }
}

export function getTrendComparison(input: {
  current: {
    visits: number
    menuInterestRate: number
    menuToBookingRate: number
    bookingIntentRate: number
    contactActionRate: number
  }
  previous: {
    visits: number
    menuInterestRate: number
    menuToBookingRate: number
    bookingIntentRate: number
    contactActionRate: number
  }
}): TrendComparison {
  return {
    visits: compareMetric(input.current.visits, input.previous.visits),
    menuInterestRate: compareMetric(
      input.current.menuInterestRate,
      input.previous.menuInterestRate
    ),
    menuToBookingRate: compareMetric(
      input.current.menuToBookingRate,
      input.previous.menuToBookingRate
    ),
    bookingIntentRate: compareMetric(
      input.current.bookingIntentRate,
      input.previous.bookingIntentRate
    ),
    contactActionRate: compareMetric(
      input.current.contactActionRate,
      input.previous.contactActionRate
    ),
  }
}
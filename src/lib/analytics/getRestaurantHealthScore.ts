type HealthScoreInput = {
  bookingIntentRate: number
  contactActionRate: number
  menuInterestRate: number
  menuToBookingRate: number
}

type HealthStatus = "Excellent" | "Strong" | "Fair" | "Weak"

type RestaurantHealthScore = {
  score: number
  status: HealthStatus
  summary: string
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function getRestaurantHealthScore({
  bookingIntentRate,
  contactActionRate,
  menuInterestRate,
  menuToBookingRate,
}: HealthScoreInput): RestaurantHealthScore {

  const bookingScore = clamp((bookingIntentRate / 12) * 40, 0, 40)

  const contactScore = clamp((contactActionRate / 18) * 30, 0, 30)

  const menuScore = clamp((menuInterestRate / 40) * 20, 0, 20)

  const menuConversionScore = clamp((menuToBookingRate / 25) * 10, 0, 10)

  const score = Math.round(
    bookingScore +
    contactScore +
    menuScore +
    menuConversionScore
  )

  let status: HealthStatus = "Weak"

  if (score >= 85) {
    status = "Excellent"
  } else if (score >= 70) {
    status = "Strong"
  } else if (score >= 50) {
    status = "Fair"
  }

  let summary =
    "Guest action is currently low and the site may need clearer conversion paths."

  if (status === "Excellent") {
    summary =
      "The site is converting strongly, with healthy guest intent across menu, contact and booking actions."
  } else if (status === "Strong") {
    summary =
      "The site is performing well, with clear guest interest and solid action-taking behaviour."
  } else if (status === "Fair") {
    summary =
      "The site is generating interest, but there is room to improve how effectively it turns visits into action."
  }

  return {
    score,
    status,
    summary,
  }
}
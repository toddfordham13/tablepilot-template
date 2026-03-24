type InsightInput = {
  visits: number
  menuViews: number
  bookingClicks: number
  phoneClicks: number
  directionsClicks: number

  bookingIntentRate: number
  menuInterestRate: number
  menuToBookingRate: number
  contactActionRate: number
  healthScore: number

  galleryViews?: number
  contactSectionViews?: number
  galleryEngagementRate?: number
  contactSectionReachRate?: number
  avgScrollDepth?: number
  maxScrollDepth?: number
  menuCategoryClicks?: number
}

export type RestaurantInsight = {
  title: string
  body: string
  tone: "good" | "neutral" | "warning"
}

export type RestaurantAction = {
  title: string
  body: string
}

export type RestaurantInsightsResult = {
  insights: RestaurantInsight[]
  actions: RestaurantAction[]
}

export function getRestaurantInsights(
  input: InsightInput
): RestaurantInsightsResult {
  const insights: RestaurantInsight[] = []
  const actions: RestaurantAction[] = []

  const indirectActions = input.phoneClicks + input.directionsClicks
  const hasLowData = input.visits < 25

  const galleryViews = input.galleryViews ?? 0
  const contactSectionViews = input.contactSectionViews ?? 0
  const galleryEngagementRate = input.galleryEngagementRate ?? 0
  const contactSectionReachRate = input.contactSectionReachRate ?? 0
  const avgScrollDepth = input.avgScrollDepth ?? 0
  const maxScrollDepth = input.maxScrollDepth ?? 0
  const menuCategoryClicks = input.menuCategoryClicks ?? 0

  if (hasLowData) {
    insights.push({
      title: "Low data volume",
      body: "Traffic is still low, so current trends are directional rather than fully reliable.",
      tone: "neutral",
    })

    actions.push({
      title: "Increase traffic volume",
      body: "Drive more visits before making major conversion decisions so the KPI picture becomes more reliable.",
    })
  }

  if (input.menuViews === 0 && input.visits > 0) {
    insights.push({
      title: "Menu discovery is weak",
      body: "Visitors are landing on the site, but menu engagement is not showing up. The menu CTA may need stronger placement.",
      tone: "warning",
    })

    actions.push({
      title: "Strengthen menu CTA visibility",
      body: "Move the menu call-to-action higher on the page and make it more visually prominent.",
    })
  }

  if (input.menuInterestRate > 0 && input.menuInterestRate < 15) {
    insights.push({
      title: "Menu reach is low",
      body: "A small share of visitors are reaching the menu. Guests may not be discovering food content quickly enough.",
      tone: "warning",
    })

    actions.push({
      title: "Pull menu content higher",
      body: "Move menu previews or menu calls-to-action closer to the hero so more visitors enter the menu journey.",
    })
  }

  if (input.menuInterestRate >= 30 && input.bookingIntentRate < 5) {
    insights.push({
      title: "Interest is not converting strongly",
      body: "Guests are engaging with the menu, but booking intent is relatively low. The booking path or CTA may need to be clearer.",
      tone: "warning",
    })

    actions.push({
      title: "Improve booking path from menu",
      body: "Place stronger booking prompts near menu content and reduce friction between menu browsing and booking.",
    })
  }

  if (input.menuInterestRate >= 30 && input.menuToBookingRate < 10) {
    insights.push({
      title: "Menu engagement is strong but booking follow-through is weak",
      body: "Guests are clearly exploring the menu, but relatively few are progressing from menu interest into booking action.",
      tone: "warning",
    })

    actions.push({
      title: "Add booking prompts inside menu journey",
      body: "Introduce clearer booking prompts around high-interest menu sections to capture intent earlier.",
    })
  }

  if (
    input.contactActionRate >= 10 &&
    input.bookingIntentRate < 4 &&
    indirectActions > input.bookingClicks
  ) {
    insights.push({
      title: "Contact is outperforming bookings",
      body: "Guests are calling or checking directions more often than booking directly. This can indicate booking friction or a preference for offline conversion.",
      tone: "neutral",
    })

    actions.push({
      title: "Review direct booking visibility",
      body: "Test stronger direct-booking placement so guests do not default to phone or directions before booking.",
    })
  }

  if (contactSectionViews > 0 && contactSectionReachRate < 20 && input.visits >= 10) {
    insights.push({
      title: "Too few guests reach the contact section",
      body: "The lower page journey may not be getting enough visibility. Contact information could be too far down the page for many visitors.",
      tone: "warning",
    })

    actions.push({
      title: "Expose contact actions earlier",
      body: "Repeat booking, phone or directions CTAs higher up the page so guests can act earlier.",
    })
  }

  if (avgScrollDepth > 0 && avgScrollDepth < 40 && input.visits >= 10) {
    insights.push({
      title: "Scroll depth is shallow",
      body: "Guests are not progressing far down the page on average, which can suppress menu and contact discovery.",
      tone: "warning",
    })

    actions.push({
      title: "Improve above-the-fold clarity",
      body: "Tighten hero messaging and bring the strongest CTA and proof points higher so users continue deeper.",
    })
  }

  if (galleryViews > 0 && galleryEngagementRate >= 20) {
    insights.push({
      title: "Visual engagement is strong",
      body: "Guests are engaging with gallery content at a healthy rate, which suggests the visual presentation is supporting interest.",
      tone: "good",
    })
  }

  if (galleryViews === 0 && input.visits >= 10) {
    insights.push({
      title: "Gallery engagement is missing",
      body: "Visitors are not reaching or engaging with visual content, which may reduce trust and atmosphere-building.",
      tone: "neutral",
    })

    actions.push({
      title: "Improve visual discovery",
      body: "Pull photography closer to the top of the page or cross-link visual content from stronger sections.",
    })
  }

  if (menuCategoryClicks >= 3) {
    insights.push({
      title: "Guests are interacting with menu items",
      body: "Preview menu cards are attracting direct interaction, which is a good signal of active food interest.",
      tone: "good",
    })
  }

  if (input.bookingIntentRate >= 8) {
    insights.push({
      title: "Booking intent is healthy",
      body: "The site is doing a solid job of turning visits into booking actions.",
      tone: "good",
    })
  }

  if (input.contactActionRate >= 12) {
    insights.push({
      title: "Guests are taking action",
      body: "Phone, directions and booking interactions show strong practical guest intent.",
      tone: "good",
    })
  }

  if (maxScrollDepth >= 75) {
    insights.push({
      title: "Some guests are reaching deep page content",
      body: "A meaningful share of users are exploring further down the journey, which is a positive sign for long-form conversion pages.",
      tone: "good",
    })
  }

  if (input.healthScore >= 85) {
    insights.push({
      title: "Overall performance is excellent",
      body: "The site is showing strong guest engagement and high-value action signals across the funnel.",
      tone: "good",
    })
  } else if (input.healthScore < 50) {
    insights.push({
      title: "Performance needs attention",
      body: "The current mix of interest and action signals suggests the site is not yet converting strongly enough.",
      tone: "warning",
    })

    actions.push({
      title: "Focus on conversion basics first",
      body: "Prioritise stronger booking CTAs, clearer menu access and more visible trust signals before adding complexity.",
    })
  }

  const uniqueInsights = insights.filter(
    (insight, index, self) =>
      index === self.findIndex((item) => item.title === insight.title)
  )

  const uniqueActions = actions.filter(
    (action, index, self) =>
      index === self.findIndex((item) => item.title === action.title)
  )

  return {
    insights: uniqueInsights.slice(0, 6),
    actions: uniqueActions.slice(0, 4),
  }
}
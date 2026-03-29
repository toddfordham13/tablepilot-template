export type RestaurantInsight = {
  title: string
  body: string
  tone?: "good" | "warning" | "neutral"
}

export type RestaurantAction = {
  title: string
  body: string
  priority?: "high" | "medium" | "low"
}

type GetRestaurantInsightsInput = {
  visits: number
  menuViews: number
  bookingClicks: number
  phoneClicks: number
  directionsClicks: number
  contactActions: number

  bookingIntentRate: number
  menuInterestRate: number
  menuToBookingRate: number
  contactActionRate: number

  galleryViews: number
  contactSectionViews: number
  galleryEngagementRate: number
  contactSectionReachRate: number

  avgScrollDepth: number
  maxScrollDepth: number
  menuCategoryClicks: number

  healthScore?: number
}

export function getRestaurantInsights(
  input: GetRestaurantInsightsInput
): {
  insights: RestaurantInsight[]
  actions: RestaurantAction[]
} {
  const insights: RestaurantInsight[] = []
  const actions: RestaurantAction[] = []

  const {
    visits,
    menuViews,
    bookingClicks,
    phoneClicks,
    directionsClicks,
    contactActions,
    menuInterestRate,
    bookingIntentRate,
    menuToBookingRate,
    contactActionRate,
    galleryViews,
    galleryEngagementRate,
    contactSectionReachRate,
    avgScrollDepth,
    menuCategoryClicks,
  } = input

  if (visits < 25) {
    insights.push({
      title: "Early traffic signals are building",
      body: "The site is starting to attract visitors. As more guests land on the site, TablePilot will build a clearer picture of what drives menu views and bookings.",
      tone: "neutral",
    })

    actions.push({
      title: "Drive more traffic",
      body: "Share the website link on Instagram or Google so more guests begin discovering the menu and booking pages.",
      priority: "high",
    })
  }

  if (menuInterestRate < 20) {
    insights.push({
      title: "Menu discovery could increase",
      body: "Some visitors are discovering the menu, with room to guide more guests there earlier in the journey.",
      tone: "warning",
    })

    actions.push({
      title: "Highlight the menu on social",
      body: "Post a signature dish or best-seller and link directly to the menu page.",
      priority: "high",
    })
  } else if (menuInterestRate >= 40) {
    insights.push({
      title: "Guests are exploring the menu well",
      body: "A strong portion of visitors are reaching the menu, which is a positive signal of food interest.",
      tone: "good",
    })
  }

  if (bookingIntentRate < 2) {
    insights.push({
      title: "Bookings could be encouraged more",
      body: "Visitors are exploring the site but only a small portion are moving toward reservations.",
      tone: "warning",
    })

    actions.push({
      title: "Promote reservations",
      body: "Run a post or story encouraging guests to book tables for upcoming evenings or weekends.",
      priority: "high",
    })
  } else if (bookingIntentRate >= 5) {
    insights.push({
      title: "Booking intent is strong",
      body: "Visitors are progressing from browsing into booking at a healthy rate.",
      tone: "good",
    })
  }

  if (menuViews > 0 && menuToBookingRate >= 12) {
    insights.push({
      title: "Menu views are converting well",
      body: "Guests who reach the menu are progressing into bookings at a strong rate.",
      tone: "good",
    })
  }

  if (contactActionRate >= 3) {
    insights.push({
      title: "Guests are taking direct action",
      body: "Visitors are calling, booking or requesting directions, showing strong real-world engagement.",
      tone: "good",
    })
  }

  if (galleryViews > 0 && galleryEngagementRate >= 15) {
    insights.push({
      title: "Visual content is working",
      body: "Guests are engaging with imagery across the site, helping build interest in the food and venue.",
      tone: "good",
    })
  }

  if (contactSectionReachRate < 15 && visits > 20) {
    insights.push({
      title: "Contact sections could be reached earlier",
      body: "Moving booking prompts slightly higher could help more guests reach them.",
      tone: "neutral",
    })
  }

  if (avgScrollDepth >= 55) {
    insights.push({
      title: "Guests are exploring deeper",
      body: "Visitors are scrolling well through the page, which means they are actively browsing content.",
      tone: "good",
    })
  }

  if (menuCategoryClicks >= 8) {
    insights.push({
      title: "Menu interaction is strong",
      body: "Guests are actively exploring menu categories, which indicates strong food interest.",
      tone: "good",
    })
  }

  if (insights.length === 0) {
    insights.push({
      title: "Guest activity is building",
      body: "The site is collecting useful visitor signals. Continued promotion will strengthen insights.",
      tone: "neutral",
    })
  }

  if (actions.length === 0) {
    actions.push({
      title: "Maintain visibility",
      body: "Continue sharing food photos, menu items, and booking links on social channels.",
      priority: "medium",
    })
  }

  return {
    insights: dedupeInsights(insights).slice(0, 6),
    actions: dedupeActions(actions).slice(0, 3),
  }
}

function dedupeInsights(items: RestaurantInsight[]) {
  const seen = new Set<string>()

  return items.filter((item) => {
    const key = `${item.title}::${item.body}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function dedupeActions(items: RestaurantAction[]) {
  const seen = new Set<string>()

  return items.filter((item) => {
    const key = `${item.title}::${item.body}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
export type KpiStats = {
  visits: number
  menuViews: number
  bookingClicks: number
  phoneClicks: number
  directionsClicks: number
  contactActions: number
}

type GetKpiStatsOptions = {
  start?: string
  end?: string
}

export async function getKpiStats(
  concept: string,
  options?: GetKpiStatsOptions
): Promise<KpiStats> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

    const params = new URLSearchParams({
      concept,
    })

    if (options?.start) {
      params.set("start", options.start)
    }

    if (options?.end) {
      params.set("end", options.end)
    }

    const response = await fetch(`${baseUrl}/api/events?${params.toString()}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        visits: 0,
        menuViews: 0,
        bookingClicks: 0,
        phoneClicks: 0,
        directionsClicks: 0,
        contactActions: 0,
      }
    }

    return response.json()
  } catch {
    return {
      visits: 0,
      menuViews: 0,
      bookingClicks: 0,
      phoneClicks: 0,
      directionsClicks: 0,
      contactActions: 0,
    }
  }
}
"use client"

import { useEffect, useMemo, useState } from "react"

type HourRow = {
  dayKey: string
  label: string
  isClosed: boolean
  openTime: string
  closeTime: string
  sortOrder: number
}

type ApiHourRow = {
  day_key: string
  label: string
  is_closed: number
  open_time: string | null
  close_time: string | null
  sort_order: number
}

const DEFAULT_HOURS_BY_CONCEPT: Record<string, HourRow[]> = {
  bodega: [
    {
      dayKey: "monday",
      label: "Monday",
      isClosed: false,
      openTime: "11:00",
      closeTime: "20:00",
      sortOrder: 0,
    },
    {
      dayKey: "tuesday",
      label: "Tuesday",
      isClosed: false,
      openTime: "11:00",
      closeTime: "20:00",
      sortOrder: 1,
    },
    {
      dayKey: "wednesday",
      label: "Wednesday",
      isClosed: false,
      openTime: "11:00",
      closeTime: "20:00",
      sortOrder: 2,
    },
    {
      dayKey: "thursday",
      label: "Thursday",
      isClosed: false,
      openTime: "11:00",
      closeTime: "20:00",
      sortOrder: 3,
    },
    {
      dayKey: "friday",
      label: "Friday",
      isClosed: false,
      openTime: "11:00",
      closeTime: "20:00",
      sortOrder: 4,
    },
    {
      dayKey: "saturday",
      label: "Saturday",
      isClosed: false,
      openTime: "11:00",
      closeTime: "20:00",
      sortOrder: 5,
    },
    {
      dayKey: "sunday",
      label: "Sunday",
      isClosed: false,
      openTime: "11:00",
      closeTime: "17:00",
      sortOrder: 6,
    },
  ],
  fuego: [
    {
      dayKey: "monday",
      label: "Monday",
      isClosed: false,
      openTime: "17:00",
      closeTime: "21:00",
      sortOrder: 0,
    },
    {
      dayKey: "tuesday",
      label: "Tuesday",
      isClosed: true,
      openTime: "17:00",
      closeTime: "21:00",
      sortOrder: 1,
    },
    {
      dayKey: "wednesday",
      label: "Wednesday",
      isClosed: true,
      openTime: "17:00",
      closeTime: "21:00",
      sortOrder: 2,
    },
    {
      dayKey: "thursday",
      label: "Thursday",
      isClosed: false,
      openTime: "17:00",
      closeTime: "21:00",
      sortOrder: 3,
    },
    {
      dayKey: "friday",
      label: "Friday",
      isClosed: false,
      openTime: "17:00",
      closeTime: "21:00",
      sortOrder: 4,
    },
    {
      dayKey: "saturday",
      label: "Saturday",
      isClosed: false,
      openTime: "12:00",
      closeTime: "21:00",
      sortOrder: 5,
    },
    {
      dayKey: "sunday",
      label: "Sunday",
      isClosed: false,
      openTime: "12:00",
      closeTime: "18:00",
      sortOrder: 6,
    },
  ],
}

const FALLBACK_HOURS: HourRow[] = [
  {
    dayKey: "monday",
    label: "Monday",
    isClosed: false,
    openTime: "12:00",
    closeTime: "21:00",
    sortOrder: 0,
  },
  {
    dayKey: "tuesday",
    label: "Tuesday",
    isClosed: false,
    openTime: "12:00",
    closeTime: "21:00",
    sortOrder: 1,
  },
  {
    dayKey: "wednesday",
    label: "Wednesday",
    isClosed: false,
    openTime: "12:00",
    closeTime: "21:00",
    sortOrder: 2,
  },
  {
    dayKey: "thursday",
    label: "Thursday",
    isClosed: false,
    openTime: "12:00",
    closeTime: "21:00",
    sortOrder: 3,
  },
  {
    dayKey: "friday",
    label: "Friday",
    isClosed: false,
    openTime: "12:00",
    closeTime: "21:00",
    sortOrder: 4,
  },
  {
    dayKey: "saturday",
    label: "Saturday",
    isClosed: false,
    openTime: "12:00",
    closeTime: "21:00",
    sortOrder: 5,
  },
  {
    dayKey: "sunday",
    label: "Sunday",
    isClosed: false,
    openTime: "12:00",
    closeTime: "18:00",
    sortOrder: 6,
  },
]

function cloneHours(hours: HourRow[]) {
  return hours.map((hour) => ({ ...hour }))
}

export default function DashboardHoursPage() {
  const [hours, setHours] = useState<HourRow[]>([])
  const [restaurantSlug, setRestaurantSlug] = useState("restaurant")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const initialHours = useMemo(() => {
    return cloneHours(FALLBACK_HOURS)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadHours() {
      try {
        setLoading(true)
        setError("")

        const dashboardResponse = await fetch("/dashboard", {
          cache: "no-store",
        })

        const dashboardHtml = await dashboardResponse.text()
        const slugMatch = dashboardHtml.match(/TablePilot dashboard/i)

        let inferredSlug = "restaurant"

        if (dashboardHtml.toLowerCase().includes("bodega")) {
          inferredSlug = "bodega"
        } else if (dashboardHtml.toLowerCase().includes("fuego")) {
          inferredSlug = "fuego"
        }

        const fallback =
          DEFAULT_HOURS_BY_CONCEPT[inferredSlug] ?? cloneHours(initialHours)

        const response = await fetch("/api/dashboard/hours", {
          cache: "no-store",
        })

        const data = (await response.json()) as {
          hours?: ApiHourRow[]
          error?: string
        }

        if (!response.ok) {
          throw new Error(data.error || "Unable to load hours.")
        }

        if (cancelled) {
          return
        }

        setRestaurantSlug(inferredSlug)

        if (Array.isArray(data.hours) && data.hours.length > 0) {
          setHours(
            data.hours.map((hour) => ({
              dayKey: hour.day_key,
              label: hour.label,
              isClosed: hour.is_closed === 1,
              openTime: hour.open_time ?? "12:00",
              closeTime: hour.close_time ?? "21:00",
              sortOrder: hour.sort_order,
            }))
          )
        } else {
          setHours(cloneHours(fallback))
        }
      } catch (loadError) {
        if (cancelled) {
          return
        }

        const message =
          loadError instanceof Error ? loadError.message : "Unable to load hours."

        setHours(cloneHours(initialHours))
        setError(message)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadHours()

    return () => {
      cancelled = true
    }
  }, [initialHours])

  function updateHour(
    dayKey: string,
    field: keyof Pick<HourRow, "isClosed" | "openTime" | "closeTime">,
    value: boolean | string
  ) {
    setSuccess("")
    setHours((current) =>
      current.map((hour) =>
        hour.dayKey === dayKey
          ? {
            ...hour,
            [field]: value,
          }
          : hour
      )
    )
  }

  async function handleSave() {
    try {
      setSaving(true)
      setError("")
      setSuccess("")

      const response = await fetch("/api/dashboard/hours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hours }),
      })

      const data = (await response.json()) as {
        ok?: boolean
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to save hours.")
      }

      setSuccess("Opening hours saved.")
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to save hours."

      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Opening Hours</h1>
        <p className="mt-2 text-sm text-white/70">
          Update the live opening hours for {restaurantSlug}.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          Loading opening hours...
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-4">
            {hours.map((hour) => (
              <div
                key={hour.dayKey}
                className="grid gap-3 rounded-2xl border border-white/10 bg-black/10 p-4 md:grid-cols-[160px,120px,1fr,1fr]"
              >
                <div className="flex items-center text-sm font-medium text-white">
                  {hour.label}
                </div>

                <label className="flex items-center gap-2 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={hour.isClosed}
                    onChange={(event) =>
                      updateHour(hour.dayKey, "isClosed", event.target.checked)
                    }
                  />
                  Closed
                </label>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">
                    Open
                  </label>
                  <input
                    type="time"
                    value={hour.openTime}
                    disabled={hour.isClosed}
                    onChange={(event) =>
                      updateHour(hour.dayKey, "openTime", event.target.value)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">
                    Close
                  </label>
                  <input
                    type="time"
                    value={hour.closeTime}
                    disabled={hour.isClosed}
                    onChange={(event) =>
                      updateHour(hour.dayKey, "closeTime", event.target.value)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </div>
              </div>
            ))}
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {success}
            </div>
          ) : null}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-[#C9A24A] px-5 py-3 text-sm font-semibold text-[#0F1F3D] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save opening hours"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
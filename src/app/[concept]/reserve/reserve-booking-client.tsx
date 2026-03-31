"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

import type {
  BookingAvailabilityResponse,
  BookingServiceConfig,
  BookingSettingsConfig,
  DayKey,
} from "@/lib/bookings/types"

type ReserveBookingClientProps = {
  concept: string
}

type ReserveFormState = {
  guestName: string
  guestEmail: string
  guestPhone: string
  guests: string
  bookingDate: string
  bookingTime: string
  serviceKey: string
  allergies: string
  celebration: string
  seatingPreference: string
  accessibilityNotes: string
  guestNotes: string
}

type CreateBookingResponse = {
  booking: {
    id: string
    booking_date: string
    booking_time: string
    service_key: string
    guest_name: string
    status: string
  }
}

type BookingConfigResponse = {
  restaurantSlug: string
  settings: BookingSettingsConfig
  services: BookingServiceConfig[]
}

type ApiErrorResponse = {
  error?: string
}

const DEFAULT_SEATING_OPTIONS = [
  { value: "", label: "No preference" },
  { value: "window", label: "Window" },
  { value: "booth", label: "Booth" },
  { value: "bar", label: "Bar" },
  { value: "quiet_area", label: "Quiet area" },
  { value: "outdoor", label: "Outdoor" },
]

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return typeof value === "object" && value !== null && "error" in value
}

function isBookingConfigResponse(value: unknown): value is BookingConfigResponse {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return (
    "restaurantSlug" in value &&
    "settings" in value &&
    "services" in value &&
    Array.isArray((value as BookingConfigResponse).services)
  )
}

function isCreateBookingResponse(value: unknown): value is CreateBookingResponse {
  if (typeof value !== "object" || value === null || !("booking" in value)) {
    return false
  }

  const booking = (value as CreateBookingResponse).booking

  return typeof booking === "object" && booking !== null && "id" in booking
}

function isAvailabilityResponse(value: unknown): value is BookingAvailabilityResponse {
  if (typeof value !== "object" || value === null) return false
  return (
    "restaurantSlug" in value &&
    "bookingDate" in value &&
    "guests" in value &&
    "services" in value &&
    Array.isArray((value as BookingAvailabilityResponse).services)
  )
}

function getTodayKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, "0")
  const day = `${now.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function addDays(date: string, days: number) {
  const next = new Date(`${date}T12:00:00`)
  next.setDate(next.getDate() + days)

  const year = next.getFullYear()
  const month = `${next.getMonth() + 1}`.padStart(2, "0")
  const day = `${next.getDate()}`.padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getDayKey(date: string): DayKey {
  const day = new Date(`${date}T12:00:00`).getDay()
  const map: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
  return map[day]
}

function getServicesForDate(
  services: BookingServiceConfig[],
  bookingDate: string
) {
  const dayKey = getDayKey(bookingDate)

  return services
    .filter((service) => service.active && service.days.includes(dayKey))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label))
}

function getDefaultForm(): ReserveFormState {
  return {
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guests: "2",
    bookingDate: getTodayKey(),
    bookingTime: "",
    serviceKey: "",
    allergies: "",
    celebration: "",
    seatingPreference: "",
    accessibilityNotes: "",
    guestNotes: "",
  }
}

function titleFromConcept(concept: string) {
  return concept
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function titleFromServiceKey(serviceKey: string) {
  return serviceKey
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function formatDateLabel(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${value}T12:00:00`))
  } catch {
    return value
  }
}

export default function ReserveBookingClient({
  concept,
}: ReserveBookingClientProps) {
  const [form, setForm] = useState<ReserveFormState>(getDefaultForm())
  const [config, setConfig] = useState<BookingConfigResponse | null>(null)
  const [isConfigLoading, setIsConfigLoading] = useState(true)

  const [availability, setAvailability] = useState<BookingAvailabilityResponse | null>(null)
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<CreateBookingResponse["booking"] | null>(null)

  const conceptLabel = useMemo(() => titleFromConcept(concept), [concept])

  useEffect(() => {
    let cancelled = false

    async function loadConfig() {
      try {
        setIsConfigLoading(true)
        setError(null)

        const response = await fetch(
          `/api/bookings/config?restaurantSlug=${encodeURIComponent(concept)}`
        )

        const data: unknown = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            isApiErrorResponse(data) && data.error
              ? data.error
              : "Failed to load booking configuration"
          )
        }

        if (!isBookingConfigResponse(data)) {
          throw new Error("Invalid booking configuration response")
        }

        if (cancelled) return

        setConfig(data)
        setForm((current) => ({
          ...current,
          bookingDate: getTodayKey(),
        }))
      } catch (loadError) {
        console.error(loadError)

        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load booking settings."
          )
        }
      } finally {
        if (!cancelled) {
          setIsConfigLoading(false)
        }
      }
    }

    loadConfig()

    return () => {
      cancelled = true
    }
  }, [concept])

  useEffect(() => {
    let cancelled = false

    async function loadAvailability() {
      if (!config) return

      const guests = Math.max(1, Number(form.guests) || 1)

      try {
        setIsAvailabilityLoading(true)

        const response = await fetch(
          `/api/bookings/availability?restaurantSlug=${encodeURIComponent(
            concept
          )}&bookingDate=${encodeURIComponent(form.bookingDate)}&guests=${guests}`
        )

        const data: unknown = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            isApiErrorResponse(data) && data.error
              ? data.error
              : "Failed to load availability"
          )
        }

        if (!isAvailabilityResponse(data)) {
          throw new Error("Invalid availability response")
        }

        if (cancelled) return

        setAvailability(data)
      } catch (availabilityError) {
        console.error(availabilityError)

        if (!cancelled) {
          setAvailability(null)
        }
      } finally {
        if (!cancelled) {
          setIsAvailabilityLoading(false)
        }
      }
    }

    loadAvailability()

    return () => {
      cancelled = true
    }
  }, [concept, config, form.bookingDate, form.guests])

  const activeServices = useMemo(
    () => config?.services.filter((service) => service.active) ?? [],
    [config]
  )

  const allServicesForDate = useMemo(
    () => getServicesForDate(activeServices, form.bookingDate),
    [activeServices, form.bookingDate]
  )

  const availableServicesForDate = useMemo(
    () =>
      (availability?.services ?? [])
        .filter((service) => service.available || service.slots.length > 0)
        .sort((a, b) => a.label.localeCompare(b.label)),
    [availability]
  )

  const selectedServiceAvailability = useMemo(
    () =>
      availableServicesForDate.find((service) => service.key === form.serviceKey) ?? null,
    [availableServicesForDate, form.serviceKey]
  )

  const availableTimeOptions = useMemo(
    () =>
      (selectedServiceAvailability?.slots ?? [])
        .filter((slot) => slot.available)
        .map((slot) => slot.time),
    [selectedServiceAvailability]
  )

  const serviceAvailabilityMessage = useMemo(() => {
    if (isAvailabilityLoading) {
      return "Checking available booking times..."
    }

    if (!availability) {
      return "No booking times are currently available for the selected date."
    }

    if (availability.services.length === 0) {
      return "No booking times are currently available for the selected date."
    }

    const hasAvailableSlots = availability.services.some((service) =>
      service.slots.some((slot) => slot.available)
    )

    if (!hasAvailableSlots) {
      return "No booking times are currently available for the selected date."
    }

    return null
  }, [availability, isAvailabilityLoading])

  useEffect(() => {
    if (availableServicesForDate.length === 0) {
      setForm((current) => ({
        ...current,
        serviceKey: "",
        bookingTime: "",
      }))
      return
    }

    const stillValid = availableServicesForDate.some(
      (service) => service.key === form.serviceKey
    )

    if (!stillValid) {
      const nextService = availableServicesForDate[0]

      setForm((current) => ({
        ...current,
        serviceKey: nextService.key,
        bookingTime:
          nextService.slots.find((slot) => slot.available)?.time ?? "",
      }))
    }
  }, [availableServicesForDate, form.serviceKey])

  useEffect(() => {
    if (availableTimeOptions.length === 0) {
      setForm((current) => ({
        ...current,
        bookingTime: "",
      }))
      return
    }

    const isCurrentTimeValid = availableTimeOptions.includes(form.bookingTime)

    if (!isCurrentTimeValid) {
      setForm((current) => ({
        ...current,
        bookingTime: availableTimeOptions[0],
      }))
    }
  }, [availableTimeOptions, form.bookingTime])

  function updateForm<K extends keyof ReserveFormState>(
    key: K,
    value: ReserveFormState[K]
  ) {
    setForm((current) => {
      const next = {
        ...current,
        [key]: value,
      }

      if (key === "serviceKey") {
        const matched = availableServicesForDate.find(
          (service) => service.key === value
        )

        if (matched) {
          next.bookingTime = matched.slots.find((slot) => slot.available)?.time ?? ""
        }
      }

      if (key === "bookingDate") {
        next.serviceKey = ""
        next.bookingTime = ""
      }

      if (key === "guests") {
        next.serviceKey = ""
        next.bookingTime = ""
      }

      return next
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!config) {
      setError("Booking settings are not ready yet.")
      return
    }

    if (!form.guestName.trim()) {
      setError("Guest name is required.")
      return
    }

    if (!form.guestEmail.trim()) {
      setError("Email is required.")
      return
    }

    if (!form.guestPhone.trim()) {
      setError("Phone is required.")
      return
    }

    if (!form.bookingDate.trim()) {
      setError("Booking date is required.")
      return
    }

    if (!form.bookingTime.trim()) {
      setError("Booking time is required.")
      return
    }

    if (!form.serviceKey.trim()) {
      setError("Service is required.")
      return
    }

    if (!form.guests.trim() || Number(form.guests) < 1) {
      setError("Guests must be at least 1.")
      return
    }

    try {
      setError(null)
      setIsSubmitting(true)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantSlug: concept,
          source: "web",
          guestName: form.guestName,
          guestEmail: form.guestEmail,
          guestPhone: form.guestPhone,
          guests: Number(form.guests),
          bookingDate: form.bookingDate,
          bookingTime: form.bookingTime,
          serviceKey: form.serviceKey,
          allergies: form.allergies || null,
          celebration: form.celebration || null,
          seatingPreference: form.seatingPreference || null,
          accessibilityNotes: form.accessibilityNotes || null,
          guestNotes: form.guestNotes || null,
        }),
      })

      const data: unknown = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          isApiErrorResponse(data) && data.error
            ? data.error
            : "Failed to submit booking"
        )
      }

      if (!isCreateBookingResponse(data)) {
        throw new Error("Invalid booking creation response")
      }

      setSuccess(data.booking)
    } catch (submissionError) {
      console.error(submissionError)
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not send your booking request. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="booking-shell min-h-screen text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="booking-panel booking-fade-in w-full overflow-hidden rounded-[32px]">
            <div className="border-b border-white/10 px-8 py-8">
              <p className="booking-kicker mb-3">Booking Request Received</p>

              <h1 className="font-['Playfair_Display'] text-4xl text-white sm:text-5xl">
                Thanks, {success.guest_name}
              </h1>

              <p className="booking-muted mt-4 max-w-2xl text-base leading-7">
                Your booking request has been sent to {conceptLabel}. The team
                will review it and confirm your table as soon as possible.
              </p>
            </div>

            <div className="grid gap-4 px-8 py-8 sm:grid-cols-3">
              <div className="booking-card rounded-[24px] p-5">
                <p className="booking-label">Date</p>
                <p className="mt-2 text-sm text-white">{success.booking_date}</p>
              </div>

              <div className="booking-card rounded-[24px] p-5">
                <p className="booking-label">Time</p>
                <p className="mt-2 text-sm text-white">{success.booking_time}</p>
              </div>

              <div className="booking-card rounded-[24px] p-5">
                <p className="booking-label">Service</p>
                <p className="mt-2 text-sm text-white">
                  {titleFromServiceKey(success.service_key)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-white/10 px-8 py-6">
              <Link
                href={`/${concept}`}
                className="booking-button-secondary px-5 py-3 text-sm"
              >
                Back to site
              </Link>

              <button
                type="button"
                onClick={() => {
                  const freshForm = getDefaultForm()
                  setForm(freshForm)
                  setSuccess(null)
                }}
                className="booking-button-primary px-5 py-3 text-sm"
              >
                Make another booking request
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const todayKey = getTodayKey()
  const maxDate = addDays(todayKey, config?.settings.maxAdvanceDays ?? 90)

  const selectedMaxPartySize =
    selectedServiceAvailability?.maxPartySize ??
    config?.settings.defaultMaxPartySize ??
    8

  return (
    <div className="booking-shell min-h-screen text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[0.92fr,1.08fr]">
          <div className="booking-panel booking-fade-in overflow-hidden rounded-[32px]">
            <div className="border-b border-white/10 px-8 py-8">
              <p className="booking-kicker mb-3">{conceptLabel} Reservations</p>

              <h1 className="font-['Playfair_Display'] text-5xl leading-none text-white">
                Reserve your table
              </h1>

              <p className="booking-muted mt-5 max-w-xl text-base leading-7">
                Choose your preferred date, time and party size, then add any
                notes the team should know before your visit.
              </p>
            </div>

            <div className="space-y-4 px-8 py-8">
              <div className="booking-card rounded-[24px] p-5">
                <p className="booking-label">Before you book</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Let us know about allergies, celebrations, seating preferences
                  or accessibility needs when you send your request.
                </p>
              </div>

              <div className="booking-card rounded-[24px] p-5">
                <p className="booking-label">Booking process</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Send your request online and the restaurant team will review it
                  and confirm availability.
                </p>
              </div>

              <div className="booking-card rounded-[24px] p-5">
                <p className="booking-label">Availability</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  {serviceAvailabilityMessage
                    ? serviceAvailabilityMessage
                    : `${availableServicesForDate.length} service option(s) available for the selected date.`}
                </p>
              </div>

              <div className="rounded-[24px] border border-[#C9A24A]/20 bg-[#C9A24A]/8 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F3D78A]">
                  Selected visit
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="booking-soft text-[11px] font-semibold uppercase tracking-[0.14em]">
                      Date
                    </p>
                    <p className="mt-1 text-sm text-white">
                      {formatDateLabel(form.bookingDate)}
                    </p>
                  </div>

                  <div>
                    <p className="booking-soft text-[11px] font-semibold uppercase tracking-[0.14em]">
                      Service
                    </p>
                    <p className="mt-1 text-sm text-white">
                      {selectedServiceAvailability?.label ?? "Select a service"}
                    </p>
                  </div>

                  <div>
                    <p className="booking-soft text-[11px] font-semibold uppercase tracking-[0.14em]">
                      Time
                    </p>
                    <p className="mt-1 text-sm text-white">
                      {form.bookingTime || "Select a time"}
                    </p>
                  </div>

                  <div>
                    <p className="booking-soft text-[11px] font-semibold uppercase tracking-[0.14em]">
                      Party size
                    </p>
                    <p className="mt-1 text-sm text-white">
                      {form.guests || "2"} guest{form.guests === "1" ? "" : "s"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-panel booking-fade-in overflow-hidden rounded-[32px]">
            <div className="border-b border-white/10 px-8 py-8">
              <p className="booking-kicker mb-3">Booking Form</p>
              <h2 className="font-['Playfair_Display'] text-4xl text-white">
                Your details
              </h2>
              <p className="booking-muted mt-3 text-sm leading-6">
                Complete the form below and send your booking request directly to
                the restaurant team.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6 px-8 py-8">
                <section className="booking-section rounded-[24px] p-6">
                  <div className="mb-5">
                    <p className="booking-section-number">01</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      Guest details
                    </h3>
                    <p className="booking-muted mt-2 text-sm leading-6">
                      Tell us who the booking is for and how we can contact you.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="booking-label">Guest name</label>
                      <input
                        value={form.guestName}
                        onChange={(event) =>
                          updateForm("guestName", event.target.value)
                        }
                        className="booking-input"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label className="booking-label">Email</label>
                      <input
                        type="email"
                        value={form.guestEmail}
                        onChange={(event) =>
                          updateForm("guestEmail", event.target.value)
                        }
                        className="booking-input"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="booking-label">Phone</label>
                      <input
                        value={form.guestPhone}
                        onChange={(event) =>
                          updateForm("guestPhone", event.target.value)
                        }
                        className="booking-input"
                        placeholder="07123 456789"
                      />
                    </div>
                  </div>
                </section>

                <section className="booking-section rounded-[24px] p-6">
                  <div className="mb-5">
                    <p className="booking-section-number">02</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      Booking details
                    </h3>
                    <p className="booking-muted mt-2 text-sm leading-6">
                      Choose when you would like to visit and the service you want
                      to book.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="booking-label">Date</label>
                      <input
                        type="date"
                        min={todayKey}
                        max={maxDate}
                        value={form.bookingDate}
                        onChange={(event) =>
                          updateForm("bookingDate", event.target.value)
                        }
                        className="booking-input"
                      />
                    </div>

                    <div>
                      <label className="booking-label">Time</label>
                      <select
                        value={form.bookingTime}
                        onChange={(event) =>
                          updateForm("bookingTime", event.target.value)
                        }
                        disabled={
                          availableServicesForDate.length === 0 ||
                          availableTimeOptions.length === 0
                        }
                        className="booking-input disabled:opacity-60"
                      >
                        {availableTimeOptions.length === 0 ? (
                          <option value="">No times available</option>
                        ) : (
                          availableTimeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="booking-label">Service</label>
                      <select
                        value={form.serviceKey}
                        onChange={(event) =>
                          updateForm("serviceKey", event.target.value)
                        }
                        disabled={
                          isConfigLoading ||
                          isAvailabilityLoading ||
                          availableServicesForDate.length === 0
                        }
                        className="booking-input disabled:opacity-60"
                      >
                        {availableServicesForDate.length === 0 ? (
                          <option value="">No services available</option>
                        ) : (
                          availableServicesForDate.map((option) => (
                            <option key={option.key} value={option.key}>
                              {option.label}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="booking-label">Guests</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedMaxPartySize}
                        value={form.guests}
                        onChange={(event) => updateForm("guests", event.target.value)}
                        className="booking-input"
                      />
                    </div>
                  </div>
                </section>

                <section className="booking-section rounded-[24px] p-6">
                  <div className="mb-5">
                    <p className="booking-section-number">03</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      Visit notes
                    </h3>
                    <p className="booking-muted mt-2 text-sm leading-6">
                      Add any details that will help the team look after your
                      booking properly.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="booking-label">Allergies</label>
                      <input
                        value={form.allergies}
                        onChange={(event) =>
                          updateForm("allergies", event.target.value)
                        }
                        className="booking-input"
                        placeholder="Nuts, shellfish, gluten..."
                      />
                    </div>

                    <div>
                      <label className="booking-label">Celebration</label>
                      <input
                        value={form.celebration}
                        onChange={(event) =>
                          updateForm("celebration", event.target.value)
                        }
                        className="booking-input"
                        placeholder="Birthday, anniversary..."
                      />
                    </div>

                    <div>
                      <label className="booking-label">Seating preference</label>
                      <select
                        value={form.seatingPreference}
                        onChange={(event) =>
                          updateForm("seatingPreference", event.target.value)
                        }
                        className="booking-input"
                      >
                        {DEFAULT_SEATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="booking-label">Accessibility notes</label>
                      <textarea
                        rows={3}
                        value={form.accessibilityNotes}
                        onChange={(event) =>
                          updateForm("accessibilityNotes", event.target.value)
                        }
                        className="booking-input"
                        placeholder="Wheelchair access, pram space..."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="booking-label">Additional notes</label>
                      <textarea
                        rows={4}
                        value={form.guestNotes}
                        onChange={(event) =>
                          updateForm("guestNotes", event.target.value)
                        }
                        className="booking-input"
                        placeholder="Anything else the venue should know?"
                      />
                    </div>
                  </div>
                </section>

                {serviceAvailabilityMessage ? (
                  <div className="rounded-[20px] border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                    {serviceAvailabilityMessage}
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-[20px] border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                  </div>
                ) : null}
              </div>

              <div className="border-t border-white/10 bg-[#081427]/35 px-8 py-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-xl">
                    <p className="booking-label mb-0">Final step</p>
                    <p className="booking-muted mt-2 text-sm leading-6">
                      Your request will be sent to the restaurant team for review
                      and confirmation.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      isConfigLoading ||
                      isAvailabilityLoading ||
                      availableServicesForDate.length === 0 ||
                      availableTimeOptions.length === 0
                    }
                    className="booking-button-primary w-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto lg:min-w-[220px]"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : isConfigLoading || isAvailabilityLoading
                        ? "Loading..."
                        : "Request booking"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
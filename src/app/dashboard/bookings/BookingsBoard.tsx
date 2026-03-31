"use client"

import { useMemo, useState } from "react"

import BookingStatusBadge from "./BookingStatusBadge"
import type {
  BookingRecord,
  BookingServiceConfig,
  BookingSettingsConfig,
  BookingStatus,
  DayKey,
} from "@/lib/bookings/types"

export type BookingRow = BookingRecord

type BookingsBoardProps = {
  restaurantSlug: string
  initialBookings: BookingRecord[]
  initialServices?: BookingServiceConfig[]
  initialSettings?: BookingSettingsConfig
}

type BookingFormState = {
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

type EditableSettingsState = {
  bookingEmail: string
  timezone: string
  maxAdvanceDays: string
  defaultSlotInterval: string
  defaultMaxPartySize: string
  defaultCutoffHours: string
}

type EditableServiceState = {
  id: string
  key: string
  label: string
  days: DayKey[]
  startTime: string
  endTime: string
  slotInterval: string
  maxCovers: string
  maxPartySize: string
  cutoffHours: string
  active: boolean
  sortOrder: string
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const DAY_OPTIONS: Array<{ value: DayKey; label: string }> = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
]

const STATUS_ACTIONS: Array<{
  status: BookingStatus
  label: string
}> = [
    { status: "confirmed", label: "Confirm" },
    { status: "arrived", label: "Arrived" },
    { status: "seated", label: "Seat" },
    { status: "completed", label: "Complete" },
    { status: "declined", label: "Decline" },
    { status: "cancelled", label: "Cancel" },
    { status: "no_show", label: "No Show" },
  ]

const DEFAULT_SEATING_OPTIONS = [
  { value: "", label: "No preference" },
  { value: "window", label: "Window" },
  { value: "booth", label: "Booth" },
  { value: "bar", label: "Bar" },
  { value: "quiet_area", label: "Quiet area" },
  { value: "outdoor", label: "Outdoor" },
]

function getTodayKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, "0")
  const day = `${now.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getDayKey(date: string): DayKey {
  const day = new Date(`${date}T12:00:00`).getDay()
  const map: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
  return map[day]
}

function buildCalendarDays(viewDate: Date) {
  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
  const startDay = (firstOfMonth.getDay() + 6) % 7
  const gridStart = new Date(firstOfMonth)
  gridStart.setDate(firstOfMonth.getDate() - startDay)

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart)
    day.setDate(gridStart.getDate() + index)
    return day
  })
}

function formatSelectedDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`))
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(date)
}

function titleFromServiceKey(serviceKey: string) {
  return serviceKey
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function titleFromSource(source: string) {
  switch (source) {
    case "web":
      return "Website"
    case "phone":
      return "Phone"
    case "walk_in":
      return "Walk-in"
    case "manual":
      return "Manual"
    default:
      return source
  }
}

function sortBookingsByTime(bookings: BookingRecord[]) {
  return [...bookings].sort((a, b) => a.booking_time.localeCompare(b.booking_time))
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

function buildServiceGroups(
  bookings: BookingRecord[],
  services: BookingServiceConfig[]
) {
  const map = new Map<string, BookingRecord[]>()

  for (const booking of bookings) {
    const current = map.get(booking.service_key) ?? []
    current.push(booking)
    map.set(booking.service_key, current)
  }

  const labelMap = new Map<string, string>(
    services.map((service) => [service.key, service.label])
  )
  const orderMap = new Map<string, number>(
    services.map((service) => [service.key, service.sortOrder])
  )

  return Array.from(map.entries())
    .map(([serviceKey, serviceBookings]) => ({
      serviceKey,
      label: labelMap.get(serviceKey) ?? titleFromServiceKey(serviceKey),
      sortOrder: orderMap.get(serviceKey) ?? 999,
      bookings: sortBookingsByTime(serviceBookings),
      covers: serviceBookings.reduce(
        (total, booking) => total + Number(booking.guests || 0),
        0
      ),
    }))
    .sort(
      (a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label)
    )
}

function createEditableSettings(
  settings: BookingSettingsConfig
): EditableSettingsState {
  return {
    bookingEmail: settings.bookingEmail,
    timezone: settings.timezone,
    maxAdvanceDays: String(settings.maxAdvanceDays),
    defaultSlotInterval: String(settings.defaultSlotInterval),
    defaultMaxPartySize: String(settings.defaultMaxPartySize),
    defaultCutoffHours: String(settings.defaultCutoffHours),
  }
}

function createEditableService(
  service: BookingServiceConfig
): EditableServiceState {
  return {
    id: service.id,
    key: service.key,
    label: service.label,
    days: [...service.days],
    startTime: service.startTime,
    endTime: service.endTime,
    slotInterval: String(service.slotInterval),
    maxCovers: service.maxCovers === null ? "" : String(service.maxCovers),
    maxPartySize:
      service.maxPartySize === null ? "" : String(service.maxPartySize),
    cutoffHours:
      service.cutoffHours === null ? "" : String(service.cutoffHours),
    active: service.active,
    sortOrder: String(service.sortOrder),
  }
}

function toNullableNumber(value: string) {
  if (!value.trim()) return null

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return null
  }

  return parsed
}

function createDefaultSettings(
  restaurantSlug: string
): BookingSettingsConfig {
  return {
    restaurantSlug,
    bookingEmail: "",
    timezone: "Europe/London",
    maxAdvanceDays: 90,
    defaultSlotInterval: 15,
    defaultMaxPartySize: 8,
    defaultCutoffHours: 0,
  }
}

function toSettingsPayload(
  restaurantSlug: string,
  settings: EditableSettingsState
): BookingSettingsConfig {
  return {
    restaurantSlug,
    bookingEmail: settings.bookingEmail.trim(),
    timezone: settings.timezone.trim() || "Europe/London",
    maxAdvanceDays: Math.max(1, Number(settings.maxAdvanceDays) || 1),
    defaultSlotInterval: Math.max(5, Number(settings.defaultSlotInterval) || 5),
    defaultMaxPartySize: Math.max(1, Number(settings.defaultMaxPartySize) || 1),
    defaultCutoffHours: Math.max(0, Number(settings.defaultCutoffHours) || 0),
  }
}

function toServicesPayload(
  restaurantSlug: string,
  services: EditableServiceState[]
): BookingServiceConfig[] {
  return services.map((service, index) => ({
    id: service.id.trim() || `${restaurantSlug}-${service.key.trim()}`,
    restaurantSlug,
    key: service.key.trim().toLowerCase(),
    label: service.label.trim(),
    days: DAY_OPTIONS.filter((day) => service.days.includes(day.value)).map(
      (day) => day.value
    ),
    startTime: service.startTime,
    endTime: service.endTime,
    slotInterval: Math.max(5, Number(service.slotInterval) || 5),
    maxCovers: toNullableNumber(service.maxCovers),
    maxPartySize: toNullableNumber(service.maxPartySize),
    cutoffHours: toNullableNumber(service.cutoffHours),
    active: service.active,
    sortOrder: Math.max(1, Number(service.sortOrder) || index + 1),
  }))
}

function getDefaultFormState(
  selectedDate: string,
  services: BookingServiceConfig[]
): BookingFormState {
  const availableServices = getServicesForDate(services, selectedDate)
  const firstService =
    availableServices[0] ?? services.find((service) => service.active)

  return {
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guests: "2",
    bookingDate: selectedDate,
    bookingTime: firstService?.startTime ?? "19:00",
    serviceKey: firstService?.key ?? "",
    allergies: "",
    celebration: "",
    seatingPreference: "",
    accessibilityNotes: "",
    guestNotes: "",
  }
}

function getInitialExpandedServices(
  services: EditableServiceState[]
): Record<string, boolean> {
  if (services.length === 0) {
    return {}
  }

  return services.reduce<Record<string, boolean>>((accumulator, service, index) => {
    accumulator[service.id] = index === 0
    return accumulator
  }, {})
}

function getServiceSummary(service: EditableServiceState) {
  const label = service.label.trim() || "Untitled service"
  const days =
    service.days.length > 0
      ? DAY_OPTIONS.filter((day) => service.days.includes(day.value))
        .map((day) => day.label)
        .join(", ")
      : "No days selected"

  return `${label} • ${service.startTime}–${service.endTime} • ${days}`
}

function getServiceOperatingLabel(
  serviceKey: string,
  services: BookingServiceConfig[]
) {
  const matchingService = services.find((service) => service.key === serviceKey)

  if (!matchingService) {
    return null
  }

  return `${matchingService.startTime}–${matchingService.endTime}`
}

async function patchBookingStatus(id: string, status: BookingStatus) {
  const response = await fetch(`/api/bookings/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | { error?: string }
      | null

    throw new Error(data?.error || "Failed to update booking status")
  }

  const data = (await response.json()) as { booking: BookingRecord }
  return data.booking
}

async function createBooking(
  restaurantSlug: string,
  form: BookingFormState
) {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      restaurantSlug,
      source: "manual",
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

  const data = (await response.json().catch(() => null)) as
    | { booking?: BookingRecord; error?: string }
    | null

  if (!response.ok || !data?.booking) {
    throw new Error(data?.error || "Failed to create booking")
  }

  return data.booking
}

async function saveBookingConfiguration(
  restaurantSlug: string,
  settings: EditableSettingsState,
  services: EditableServiceState[]
) {
  const response = await fetch("/api/bookings/config", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      restaurantSlug,
      settings: toSettingsPayload(restaurantSlug, settings),
      services: toServicesPayload(restaurantSlug, services),
    }),
  })

  const data = (await response.json().catch(() => null)) as
    | {
      settings?: BookingSettingsConfig
      services?: BookingServiceConfig[]
      error?: string
    }
    | null

  if (!response.ok || !data?.settings || !data?.services) {
    throw new Error(data?.error || "Failed to save booking configuration")
  }

  return {
    settings: data.settings,
    services: data.services,
  }
}

export default function BookingsBoard({
  restaurantSlug,
  initialBookings,
  initialServices = [],
  initialSettings,
}: BookingsBoardProps) {
  const resolvedInitialSettings =
    initialSettings ?? createDefaultSettings(restaurantSlug)

  const initialServiceDrafts = initialServices.map(createEditableService)

  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings)
  const [services, setServices] = useState<BookingServiceConfig[]>(initialServices)
  const [settings, setSettings] = useState<BookingSettingsConfig>(
    resolvedInitialSettings
  )

  const [settingsDraft, setSettingsDraft] = useState<EditableSettingsState>(
    createEditableSettings(resolvedInitialSettings)
  )
  const [servicesDraft, setServicesDraft] =
    useState<EditableServiceState[]>(initialServiceDrafts)
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>(
    getInitialExpandedServices(initialServiceDrafts)
  )
  const [isSavingConfig, setIsSavingConfig] = useState(false)
  const [configError, setConfigError] = useState<string | null>(null)
  const [configSuccess, setConfigSuccess] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState<string>(getTodayKey())
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [statusUpdating, setStatusUpdating] = useState<BookingStatus | null>(null)
  const [panelError, setPanelError] = useState<string | null>(null)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<BookingFormState>(
    getDefaultFormState(getTodayKey(), initialServices)
  )

  const initialDate = selectedDate
    ? new Date(`${selectedDate}T12:00:00`)
    : new Date()

  const [viewDate, setViewDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  )

  const bookingDates = useMemo(() => {
    return new Set(bookings.map((booking) => booking.booking_date))
  }, [bookings])

  const calendarDays = useMemo(() => buildCalendarDays(viewDate), [viewDate])

  const selectedDayBookings = useMemo(() => {
    return bookings.filter((booking) => booking.booking_date === selectedDate)
  }, [bookings, selectedDate])

  const selectedBooking = useMemo(() => {
    return bookings.find((booking) => booking.id === selectedBookingId) ?? null
  }, [bookings, selectedBookingId])

  const selectedDateServiceOptions = useMemo(() => {
    return getServicesForDate(services, selectedDate)
  }, [services, selectedDate])

  const serviceGroups = useMemo(() => {
    return buildServiceGroups(selectedDayBookings, services)
  }, [selectedDayBookings, services])

  const totalCovers = selectedDayBookings.reduce(
    (total, booking) => total + Number(booking.guests || 0),
    0
  )

  const todayKey = toDateKey(new Date())

  function toggleServiceSection(id: string) {
    setExpandedServices((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  function openCreateModal() {
    setCreateError(null)
    setForm(getDefaultFormState(selectedDate, services))
    setIsCreateModalOpen(true)
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false)
    setCreateError(null)
  }

  function updateForm<K extends keyof BookingFormState>(
    key: K,
    value: BookingFormState[K]
  ) {
    setForm((current) => {
      const next = {
        ...current,
        [key]: value,
      }

      if (key === "bookingDate") {
        const available = getServicesForDate(services, String(value))
        const currentService = available.find(
          (service) => service.key === next.serviceKey
        )

        if (!currentService && available[0]) {
          next.serviceKey = available[0].key
          next.bookingTime = available[0].startTime
        }

        if (available.length === 0) {
          next.serviceKey = ""
          next.bookingTime = ""
        }
      }

      if (key === "serviceKey") {
        const selectedService = services.find(
          (service) => service.key === value
        )

        if (selectedService) {
          next.bookingTime = selectedService.startTime
        }
      }

      return next
    })
  }

  function updateSettingsDraft<K extends keyof EditableSettingsState>(
    key: K,
    value: EditableSettingsState[K]
  ) {
    setSettingsDraft((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function updateServiceDraft(
    id: string,
    updater: (service: EditableServiceState) => EditableServiceState
  ) {
    setServicesDraft((current) =>
      current.map((service) => (service.id === id ? updater(service) : service))
    )
  }

  function toggleServiceDay(id: string, day: DayKey) {
    updateServiceDraft(id, (service) => ({
      ...service,
      days: service.days.includes(day)
        ? service.days.filter((value) => value !== day)
        : [...service.days, day],
    }))
  }

  function addServiceDraft() {
    const nextIndex = servicesDraft.length + 1
    const newServiceId = `new-service-${Date.now()}-${nextIndex}`

    setServicesDraft((current) => [
      ...current,
      {
        id: newServiceId,
        key: `service_${nextIndex}`,
        label: `Service ${nextIndex}`,
        days: ["fri", "sat"],
        startTime: "18:00",
        endTime: "21:00",
        slotInterval: settingsDraft.defaultSlotInterval,
        maxCovers: "",
        maxPartySize: settingsDraft.defaultMaxPartySize,
        cutoffHours: settingsDraft.defaultCutoffHours,
        active: true,
        sortOrder: String(nextIndex),
      },
    ])

    setExpandedServices((current) => ({
      ...current,
      [newServiceId]: true,
    }))
  }

  function removeServiceDraft(id: string) {
    setServicesDraft((current) => current.filter((service) => service.id !== id))
    setExpandedServices((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  async function handleSaveConfiguration() {
    try {
      setConfigError(null)
      setConfigSuccess(null)
      setIsSavingConfig(true)

      const data = await saveBookingConfiguration(
        restaurantSlug,
        settingsDraft,
        servicesDraft
      )

      const nextDrafts = data.services.map(createEditableService)

      setSettings(data.settings)
      setServices(data.services)
      setSettingsDraft(createEditableSettings(data.settings))
      setServicesDraft(nextDrafts)
      setExpandedServices((current) =>
        nextDrafts.reduce<Record<string, boolean>>((accumulator, service, index) => {
          accumulator[service.id] = current[service.id] ?? index === 0
          return accumulator
        }, {})
      )
      setConfigSuccess("Booking settings saved.")
    } catch (error) {
      console.error(error)
      setConfigError(
        error instanceof Error
          ? error.message
          : "Booking settings could not be saved."
      )
    } finally {
      setIsSavingConfig(false)
    }
  }

  async function handleStatusUpdate(nextStatus: BookingStatus) {
    if (!selectedBooking) return

    try {
      setPanelError(null)
      setStatusUpdating(nextStatus)

      const updatedBooking = await patchBookingStatus(selectedBooking.id, nextStatus)

      setBookings((current) =>
        current.map((booking) =>
          booking.id === updatedBooking.id ? updatedBooking : booking
        )
      )
    } catch (error) {
      console.error(error)
      setPanelError(
        error instanceof Error
          ? error.message
          : "Status update failed. Please try again."
      )
    } finally {
      setStatusUpdating(null)
    }
  }

  async function handleCreateBooking() {
    if (!form.guestName.trim()) {
      setCreateError("Guest name is required.")
      return
    }

    if (!form.guestEmail.trim()) {
      setCreateError("Email is required.")
      return
    }

    if (!form.guestPhone.trim()) {
      setCreateError("Phone is required.")
      return
    }

    if (!form.bookingDate.trim()) {
      setCreateError("Booking date is required.")
      return
    }

    if (!form.bookingTime.trim()) {
      setCreateError("Booking time is required.")
      return
    }

    if (!form.serviceKey.trim()) {
      setCreateError("Service is required.")
      return
    }

    if (!form.guests.trim() || Number(form.guests) < 1) {
      setCreateError("Guests must be at least 1.")
      return
    }

    try {
      setCreateError(null)
      setIsCreating(true)

      const newBooking = await createBooking(restaurantSlug, form)

      setBookings((current) => sortBookingsByTime([...current, newBooking]))
      setSelectedDate(newBooking.booking_date)
      setSelectedBookingId(newBooking.id)
      setViewDate(new Date(`${newBooking.booking_date}T12:00:00`))
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error(error)
      setCreateError(
        error instanceof Error
          ? error.message
          : "Booking could not be created. Please try again."
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <section className="booking-panel booking-fade-in overflow-hidden rounded-[30px]">
          <div className="border-b border-white/10 px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="booking-kicker mb-3">Booking Settings</p>
                <h2 className="font-['Playfair_Display'] text-3xl text-white sm:text-4xl">
                  Reservation rules
                </h2>
                <p className="booking-muted mt-3 max-w-3xl text-sm leading-6">
                  Set venue-wide defaults, manage service windows, and control
                  party size, lead time, and availability without touching the
                  public site.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={addServiceDraft}
                  className="booking-button-secondary px-4 py-2.5 text-sm"
                >
                  + Add service
                </button>

                <button
                  type="button"
                  onClick={handleSaveConfiguration}
                  disabled={isSavingConfig}
                  className="booking-button-primary px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingConfig ? "Saving..." : "Save settings"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 xl:grid-cols-[360px,minmax(0,1fr)] sm:px-8 sm:py-8">
            <div className="booking-section rounded-[26px] p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/55">
                Venue defaults
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="booking-label">Booking notification email</label>
                  <input
                    value={settingsDraft.bookingEmail}
                    onChange={(event) =>
                      updateSettingsDraft("bookingEmail", event.target.value)
                    }
                    className="booking-input"
                    placeholder="reservations@restaurant.com"
                  />
                </div>

                <div>
                  <label className="booking-label">Timezone</label>
                  <input
                    value={settingsDraft.timezone}
                    onChange={(event) =>
                      updateSettingsDraft("timezone", event.target.value)
                    }
                    className="booking-input"
                    placeholder="Europe/London"
                  />
                </div>

                <div>
                  <label className="booking-label">Max advance days</label>
                  <input
                    type="number"
                    min="1"
                    value={settingsDraft.maxAdvanceDays}
                    onChange={(event) =>
                      updateSettingsDraft("maxAdvanceDays", event.target.value)
                    }
                    className="booking-input"
                  />
                </div>

                <div>
                  <label className="booking-label">Default time interval</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={settingsDraft.defaultSlotInterval}
                    onChange={(event) =>
                      updateSettingsDraft("defaultSlotInterval", event.target.value)
                    }
                    className="booking-input"
                  />
                </div>

                <div>
                  <label className="booking-label">Default max party size</label>
                  <input
                    type="number"
                    min="1"
                    value={settingsDraft.defaultMaxPartySize}
                    onChange={(event) =>
                      updateSettingsDraft("defaultMaxPartySize", event.target.value)
                    }
                    className="booking-input"
                  />
                </div>

                <div>
                  <label className="booking-label">
                    Default booking cutoff (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settingsDraft.defaultCutoffHours}
                    onChange={(event) =>
                      updateSettingsDraft("defaultCutoffHours", event.target.value)
                    }
                    className="booking-input"
                  />
                </div>

                {configError ? (
                  <div className="rounded-[18px] border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
                    {configError}
                  </div>
                ) : null}

                {configSuccess ? (
                  <div className="rounded-[18px] border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-200">
                    {configSuccess}
                  </div>
                ) : (
                  <p className="text-sm text-white/50">
                    Individual services can override these venue defaults.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {servicesDraft.map((service, index) => {
                const isExpanded = expandedServices[service.id] ?? false

                return (
                  <div
                    key={service.id}
                    className="booking-section rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5 shadow-[0_14px_40px_rgba(1,6,20,0.22)]"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <button
                        type="button"
                        onClick={() => toggleServiceSection(service.id)}
                        className="flex flex-1 items-start justify-between gap-4 text-left"
                      >
                        <div className="min-w-0">
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9A24A]">
                            Service {index + 1}
                          </p>

                          <h3 className="font-['Playfair_Display'] text-[30px] leading-none text-white">
                            {service.label.trim() || `Service ${index + 1}`}
                          </h3>

                          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">
                            {getServiceSummary(service)}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span
                              className={[
                                "rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]",
                                service.active
                                  ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                                  : "border-white/10 bg-white/[0.04] text-white/60",
                              ].join(" ")}
                            >
                              {service.active ? "Active" : "Inactive"}
                            </span>

                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
                              Sort {service.sortOrder}
                            </span>
                          </div>
                        </div>

                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white/70 transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.08] hover:text-white">
                          {isExpanded ? "−" : "+"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeServiceDraft(service.id)}
                        className="rounded-full border border-rose-300/20 bg-rose-300/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/14"
                      >
                        Remove
                      </button>
                    </div>

                    {isExpanded ? (
                      <>
                        <div className="mt-6 grid gap-4 border-t border-white/8 pt-5 lg:grid-cols-2">
                          <div>
                            <label className="booking-label">Service key</label>
                            <input
                              value={service.key}
                              onChange={(event) =>
                                updateServiceDraft(service.id, (current) => ({
                                  ...current,
                                  key: event.target.value,
                                }))
                              }
                              className="booking-input"
                              placeholder="dinner"
                            />
                          </div>

                          <div>
                            <label className="booking-label">Service name</label>
                            <input
                              value={service.label}
                              onChange={(event) =>
                                updateServiceDraft(service.id, (current) => ({
                                  ...current,
                                  label: event.target.value,
                                }))
                              }
                              className="booking-input"
                              placeholder="Dinner"
                            />
                          </div>

                          <div>
                            <label className="booking-label">Start time</label>
                            <input
                              type="time"
                              value={service.startTime}
                              onChange={(event) =>
                                updateServiceDraft(service.id, (current) => ({
                                  ...current,
                                  startTime: event.target.value,
                                }))
                              }
                              className="booking-input"
                            />
                          </div>

                          <div>
                            <label className="booking-label">End time</label>
                            <input
                              type="time"
                              value={service.endTime}
                              onChange={(event) =>
                                updateServiceDraft(service.id, (current) => ({
                                  ...current,
                                  endTime: event.target.value,
                                }))
                              }
                              className="booking-input"
                            />
                          </div>

                          <div>
                            <label className="booking-label">Time interval</label>
                            <input
                              type="number"
                              min="5"
                              step="5"
                              value={service.slotInterval}
                              onChange={(event) =>
                                updateServiceDraft(service.id, (current) => ({
                                  ...current,
                                  slotInterval: event.target.value,
                                }))
                              }
                              className="booking-input"
                            />
                          </div>

                          <div>
                            <label className="booking-label">Sort order</label>
                            <input
                              type="number"
                              min="1"
                              value={service.sortOrder}
                              onChange={(event) =>
                                updateServiceDraft(service.id, (current) => ({
                                  ...current,
                                  sortOrder: event.target.value,
                                }))
                              }
                              className="booking-input"
                            />
                          </div>

                          <div>
                            <label className="booking-label">Max covers per slot</label>
                            <input
                              type="number"
                              min="1"
                              value={service.maxCovers}
                              onChange={(event) =>
                                updateServiceDraft(service.id, (current) => ({
                                  ...current,
                                  maxCovers: event.target.value,
                                }))
                              }
                              className="booking-input"
                              placeholder="Optional"
                            />
                          </div>

                          <div>
                            <label className="booking-label">Max party size</label>
                            <input
                              type="number"
                              min="1"
                              value={service.maxPartySize}
                              onChange={(event) =>
                                updateServiceDraft(service.id, (current) => ({
                                  ...current,
                                  maxPartySize: event.target.value,
                                }))
                              }
                              className="booking-input"
                              placeholder="Optional"
                            />
                          </div>

                          <div>
                            <label className="booking-label">
                              Booking cutoff (hours)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={service.cutoffHours}
                              onChange={(event) =>
                                updateServiceDraft(service.id, (current) => ({
                                  ...current,
                                  cutoffHours: event.target.value,
                                }))
                              }
                              className="booking-input"
                              placeholder="Optional"
                            />
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="mb-3 flex flex-wrap items-center gap-3">
                            <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
                              <input
                                type="checkbox"
                                checked={service.active}
                                onChange={(event) =>
                                  updateServiceDraft(service.id, (current) => ({
                                    ...current,
                                    active: event.target.checked,
                                  }))
                                }
                              />
                              Accept bookings for this service
                            </label>
                          </div>

                          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                            Trading days
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {DAY_OPTIONS.map((day) => {
                              const selected = service.days.includes(day.value)

                              return (
                                <button
                                  key={day.value}
                                  type="button"
                                  onClick={() =>
                                    toggleServiceDay(service.id, day.value)
                                  }
                                  className={[
                                    "rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition",
                                    selected
                                      ? "border-[#C9A24A]/40 bg-[#C9A24A]/12 text-[#F3D78A]"
                                      : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]",
                                  ].join(" ")}
                                >
                                  {day.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                )
              })}

              {servicesDraft.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-white/10 bg-[#0B1830] p-6 text-sm text-white/60">
                  No services added yet. Create your first service to open up
                  availability on the booking page.
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[320px,minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="booking-panel booking-fade-in rounded-[28px] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    Calendar
                  </p>
                  <h2 className="text-lg font-semibold text-white">
                    {formatMonthLabel(viewDate)}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setViewDate(
                        new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
                      )
                    }
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white/75 shadow-[0_8px_20px_rgba(1,6,20,0.15)] transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setViewDate(
                        new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
                      )
                    }
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white/75 shadow-[0_8px_20px_rgba(1,6,20,0.15)] transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-7 gap-2">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const dateKey = toDateKey(day)
                  const isCurrentMonth = day.getMonth() === viewDate.getMonth()
                  const isSelected = dateKey === selectedDate
                  const isToday = dateKey === todayKey
                  const hasBookings = bookingDates.has(dateKey)

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      onClick={() => setSelectedDate(dateKey)}
                      className={[
                        "group relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border text-sm font-medium transition duration-200",
                        isSelected
                          ? "border-[#C9A24A] bg-[radial-gradient(circle_at_top,rgba(201,162,74,0.18),rgba(201,162,74,0.08))] text-white shadow-[0_0_0_1px_rgba(201,162,74,0.35),0_18px_30px_rgba(1,6,20,0.20)]"
                          : "border-white/8 bg-white/[0.03] text-white/80 shadow-[0_10px_24px_rgba(1,6,20,0.10)] hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.06] hover:shadow-[0_18px_30px_rgba(1,6,20,0.16)]",
                        !isCurrentMonth ? "text-white/28" : "",
                      ].join(" ")}
                    >
                      <span>{day.getDate()}</span>

                      {!isSelected ? (
                        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_65%)] opacity-0 transition duration-200 group-hover:opacity-100" />
                      ) : null}

                      {hasBookings ? (
                        <span className="absolute bottom-2 h-1.5 w-1.5 rounded-full bg-[#C9A24A] shadow-[0_0_10px_rgba(201,162,74,0.65)]" />
                      ) : null}

                      {isToday && !isSelected ? (
                        <span className="absolute inset-1 rounded-[14px] border border-dashed border-white/20" />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="booking-panel booking-fade-in rounded-[28px] p-5">
              <div className="mb-5">
                <p className="booking-kicker mb-2">Venue Snapshot</p>

                <div>
                  <h3 className="text-lg font-semibold capitalize text-white">
                    {restaurantSlug}
                  </h3>
                  <p className="mt-1 text-sm text-white/65">
                    A quick view of the day’s bookings, covers, and service setup.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4 shadow-[0_16px_30px_rgba(1,6,20,0.18)] sm:col-span-2 xl:col-span-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Selected date
                  </p>
                  <p className="mt-3 font-['Playfair_Display'] text-[26px] leading-tight text-white">
                    {formatSelectedDate(selectedDate)}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4 shadow-[0_16px_30px_rgba(1,6,20,0.18)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Bookings
                  </p>
                  <p className="mt-3 text-4xl font-semibold leading-none text-white">
                    {selectedDayBookings.length}
                  </p>
                  <p className="mt-2 text-sm text-white/55">Covers the full diary count</p>
                </div>

                <div className="rounded-[22px] border border-[#C9A24A]/20 bg-[linear-gradient(180deg,rgba(201,162,74,0.12),rgba(201,162,74,0.04))] p-4 shadow-[0_16px_30px_rgba(1,6,20,0.18)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7CA7B]">
                    Covers
                  </p>
                  <p className="mt-3 text-4xl font-semibold leading-none text-white">
                    {totalCovers}
                  </p>
                  <p className="mt-2 text-sm text-white/55">Total guests expected</p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4 shadow-[0_16px_30px_rgba(1,6,20,0.18)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Active services
                  </p>
                  <p className="mt-3 text-4xl font-semibold leading-none text-white">
                    {services.filter((service) => service.active).length}
                  </p>
                  <p className="mt-2 text-sm text-white/55">Currently bookable services</p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4 shadow-[0_16px_30px_rgba(1,6,20,0.18)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Max advance days
                  </p>
                  <p className="mt-3 text-4xl font-semibold leading-none text-white">
                    {settings.maxAdvanceDays}
                  </p>
                  <p className="mt-2 text-sm text-white/55">Forward booking window</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="booking-panel booking-fade-in rounded-[28px] p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    Day view
                  </p>
                  <h2 className="font-['Playfair_Display'] text-3xl text-white">
                    {formatSelectedDate(selectedDate)}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="booking-button-primary px-4 py-2 text-sm"
                  >
                    + New booking
                  </button>

                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
                    {selectedDayBookings.length} bookings
                  </div>
                  <div className="rounded-full border border-[#C9A24A]/25 bg-[#C9A24A]/10 px-4 py-2 text-sm text-[#F3D78A]">
                    {totalCovers} covers
                  </div>
                </div>
              </div>
            </div>

            {serviceGroups.length === 0 ? (
              <div className="booking-panel booking-fade-in rounded-[28px] p-10 text-center">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  No bookings
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  Nothing booked for this date yet
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/65">
                  Once bookings are added, they will appear here grouped by
                  service with guest details, covers, and status.
                </p>
              </div>
            ) : (
              serviceGroups.map((group) => (
                <section
                  key={group.serviceKey}
                  className="booking-panel booking-fade-in overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-0 shadow-[0_18px_40px_rgba(1,6,20,0.22)]"
                >
                  <div className="border-b border-white/8 px-5 py-5 sm:px-6 sm:py-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div className="min-w-0">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A24A]">
                          Service
                        </p>
                        <h3 className="font-['Playfair_Display'] text-[30px] leading-none text-white">
                          {group.label}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-white/60">
                          {getServiceOperatingLabel(group.serviceKey, services)
                            ? `${getServiceOperatingLabel(group.serviceKey, services)} service window`
                            : "Bookings grouped by service"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
                          {group.bookings.length} bookings
                        </div>
                        <div className="rounded-full border border-[#C9A24A]/25 bg-[#C9A24A]/10 px-4 py-2 text-sm text-[#F3D78A]">
                          {group.covers} covers
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <div className="hidden grid-cols-[132px,minmax(0,1.5fr),150px,160px] bg-white/[0.03] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45 md:grid">
                      <div>Time</div>
                      <div>Guest</div>
                      <div>Party size</div>
                      <div>Status</div>
                    </div>

                    <div className="divide-y divide-white/8">
                      {group.bookings.map((booking) => {
                        const isSelected = selectedBookingId === booking.id

                        return (
                          <button
                            key={booking.id}
                            type="button"
                            onClick={() => {
                              setSelectedBookingId(booking.id)
                              setPanelError(null)
                            }}
                            className={[
                              "group grid w-full gap-4 px-6 py-6 text-left transition duration-200 md:grid-cols-[132px,minmax(0,1.5fr),150px,160px] md:items-center",
                              isSelected
                                ? "bg-[linear-gradient(90deg,rgba(201,162,74,0.10),rgba(255,255,255,0.04))]"
                                : "bg-[#0B1830]/72 hover:bg-white/[0.04]",
                            ].join(" ")}
                          >
                            <div className="flex items-center gap-3">
                              <div className="inline-flex min-w-[72px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-base font-semibold text-white shadow-[0_10px_20px_rgba(1,6,20,0.16)]">
                                {booking.booking_time}
                              </div>
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-col gap-2">
                                <div className="truncate text-lg font-semibold text-white">
                                  {booking.guest_name}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {booking.celebration ? (
                                    <span className="rounded-full border border-rose-300/25 bg-rose-300/12 px-2.5 py-1 text-[11px] font-medium text-rose-100">
                                      {booking.celebration}
                                    </span>
                                  ) : null}

                                  {booking.allergies ? (
                                    <span className="rounded-full border border-amber-300/25 bg-amber-300/12 px-2.5 py-1 text-[11px] font-medium text-amber-100">
                                      Allergy note
                                    </span>
                                  ) : null}

                                  {booking.highchair ? (
                                    <span className="rounded-full border border-sky-300/25 bg-sky-300/12 px-2.5 py-1 text-[11px] font-medium text-sky-100">
                                      Highchair
                                    </span>
                                  ) : null}

                                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/70">
                                    {titleFromSource(booking.source)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/42 md:hidden">
                                Party size
                              </p>
                              <div className="mt-1 md:mt-0">
                                <p className="text-sm uppercase tracking-[0.14em] text-white/42">
                                  Party
                                </p>
                                <p className="mt-1 text-lg font-semibold text-white">
                                  {booking.guests} guest{booking.guests === 1 ? "" : "s"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start md:justify-start">
                              <div className="flex flex-col gap-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/42 md:hidden">
                                  Status
                                </p>
                                <BookingStatusBadge status={booking.status} />
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </section>
              ))
            )}
          </div>
        </div>

        {selectedBooking ? (
          <div className="fixed inset-0 z-50 flex justify-end bg-[#020817]/70 backdrop-blur-sm">
            <button
              type="button"
              aria-label="Close booking panel"
              className="absolute inset-0"
              onClick={() => {
                setSelectedBookingId(null)
                setPanelError(null)
              }}
            />

            <div className="booking-panel booking-fade-in relative flex h-full w-full max-w-xl flex-col border-l border-white/10">
              <div className="flex items-start justify-between border-b border-white/10 px-6 py-6">
                <div>
                  <p className="booking-kicker mb-2">Booking Detail</p>
                  <h3 className="text-3xl font-semibold text-white">
                    {selectedBooking.guest_name}
                  </h3>
                  <p className="mt-2 text-sm text-white/65">
                    {selectedBooking.booking_date} at {selectedBooking.booking_time}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedBookingId(null)
                    setPanelError(null)
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                <div className="booking-section rounded-[24px] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/55">
                      Booking summary
                    </h4>
                    <BookingStatusBadge status={selectedBooking.status} />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="booking-card rounded-2xl p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        Service
                      </p>
                      <p className="mt-2 text-sm text-white">
                        {titleFromServiceKey(selectedBooking.service_key)}
                      </p>
                    </div>

                    <div className="booking-card rounded-2xl p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        Party size
                      </p>
                      <p className="mt-2 text-sm text-white">
                        {selectedBooking.guests} guests
                      </p>
                    </div>
                  </div>
                </div>

                <div className="booking-section rounded-[24px] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/55">
                      Status actions
                    </h4>
                    <span className="text-xs uppercase tracking-[0.16em] text-white/45">
                      Live update
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {STATUS_ACTIONS.map((action) => {
                      const isCurrent = selectedBooking.status === action.status
                      const isLoading = statusUpdating === action.status

                      return (
                        <button
                          key={action.status}
                          type="button"
                          disabled={Boolean(statusUpdating) || isCurrent}
                          onClick={() => handleStatusUpdate(action.status)}
                          className={[
                            "rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                            isCurrent
                              ? "border-[#C9A24A]/35 bg-[#C9A24A]/14 text-[#F3D78A]"
                              : "border-white/10 bg-[#0B1830] text-white/85 hover:border-white/20 hover:bg-white/[0.06]",
                            Boolean(statusUpdating) && "cursor-not-allowed opacity-60",
                          ].join(" ")}
                        >
                          {isLoading ? "Updating..." : action.label}
                        </button>
                      )
                    })}
                  </div>

                  {panelError ? (
                    <p className="mt-4 text-sm text-rose-200">{panelError}</p>
                  ) : (
                    <p className="mt-4 text-sm text-white/55">
                      Update this booking directly from the side panel.
                    </p>
                  )}
                </div>

                <div className="booking-section rounded-[24px] p-5">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/55">
                    Guest details
                  </h4>

                  <div className="space-y-3">
                    <div className="booking-card rounded-2xl p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        Email
                      </p>
                      <p className="mt-2 text-sm text-white">
                        {selectedBooking.guest_email}
                      </p>
                    </div>

                    <div className="booking-card rounded-2xl p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        Phone
                      </p>
                      <p className="mt-2 text-sm text-white">
                        {selectedBooking.guest_phone}
                      </p>
                    </div>

                    <div className="booking-card rounded-2xl p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        Booking source
                      </p>
                      <p className="mt-2 text-sm text-white">
                        {titleFromSource(selectedBooking.source)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="booking-section rounded-[24px] p-5">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/55">
                    Guest notes
                  </h4>

                  <div className="space-y-3">
                    <div className="booking-card rounded-2xl p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        Allergies
                      </p>
                      <p className="mt-2 text-sm text-white">
                        {selectedBooking.allergies || "None supplied"}
                      </p>
                    </div>

                    <div className="booking-card rounded-2xl p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        Celebration
                      </p>
                      <p className="mt-2 text-sm text-white">
                        {selectedBooking.celebration || "None supplied"}
                      </p>
                    </div>

                    <div className="booking-card rounded-2xl p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        Seating preference
                      </p>
                      <p className="mt-2 text-sm text-white">
                        {selectedBooking.seating_preference || "None supplied"}
                      </p>
                    </div>

                    <div className="booking-card rounded-2xl p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        Accessibility
                      </p>
                      <p className="mt-2 text-sm text-white">
                        {selectedBooking.accessibility_notes || "None supplied"}
                      </p>
                    </div>

                    <div className="booking-card rounded-2xl p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        Additional notes
                      </p>
                      <p className="mt-2 text-sm text-white">
                        {selectedBooking.guest_notes || "None supplied"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {isCreateModalOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#020817]/75 p-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close booking creation"
            className="absolute inset-0"
            onClick={closeCreateModal}
          />

          <div className="booking-panel booking-fade-in relative z-10 w-full max-w-4xl overflow-hidden rounded-[32px]">
            <div className="flex items-start justify-between border-b border-white/10 px-6 py-6">
              <div>
                <p className="booking-kicker mb-2">TablePilot Reservations</p>
                <h3 className="text-3xl font-semibold text-white">
                  New booking
                </h3>
                <p className="mt-2 text-sm text-white/65">
                  Add a booking directly into the diary.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 px-6 py-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <section className="booking-section rounded-[24px] p-5">
                  <div className="mb-5">
                    <p className="booking-section-number">01</p>
                    <h4 className="mt-2 text-xl font-semibold text-white">
                      Guest details
                    </h4>
                    <p className="booking-muted mt-2 text-sm leading-6">
                      Add the guest and contact information for this booking.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="booking-label">Guest name</label>
                      <input
                        value={form.guestName}
                        onChange={(event) => updateForm("guestName", event.target.value)}
                        className="booking-input"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label className="booking-label">Email</label>
                      <input
                        type="email"
                        value={form.guestEmail}
                        onChange={(event) => updateForm("guestEmail", event.target.value)}
                        className="booking-input"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="booking-label">Phone</label>
                      <input
                        value={form.guestPhone}
                        onChange={(event) => updateForm("guestPhone", event.target.value)}
                        className="booking-input"
                        placeholder="07123 456789"
                      />
                    </div>
                  </div>
                </section>

                <section className="booking-section rounded-[24px] p-5">
                  <div className="mb-5">
                    <p className="booking-section-number">02</p>
                    <h4 className="mt-2 text-xl font-semibold text-white">
                      Booking details
                    </h4>
                    <p className="booking-muted mt-2 text-sm leading-6">
                      Choose the date, time, service and party size.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="booking-label">Date</label>
                      <input
                        type="date"
                        value={form.bookingDate}
                        onChange={(event) => updateForm("bookingDate", event.target.value)}
                        className="booking-input"
                      />
                    </div>

                    <div>
                      <label className="booking-label">Time</label>
                      <input
                        type="time"
                        value={form.bookingTime}
                        onChange={(event) => updateForm("bookingTime", event.target.value)}
                        className="booking-input"
                      />
                    </div>

                    <div>
                      <label className="booking-label">Service</label>
                      <select
                        value={form.serviceKey}
                        onChange={(event) => updateForm("serviceKey", event.target.value)}
                        className="booking-input"
                      >
                        {selectedDateServiceOptions.length === 0 ? (
                          <option value="">No services configured</option>
                        ) : (
                          selectedDateServiceOptions.map((option) => (
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
                        value={form.guests}
                        onChange={(event) => updateForm("guests", event.target.value)}
                        className="booking-input"
                      />
                    </div>
                  </div>

                  {selectedDateServiceOptions.length === 0 ? (
                    <div className="mt-4 rounded-[18px] border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                      No active services are set up for this date.
                    </div>
                  ) : null}
                </section>
              </div>

              <section className="booking-section rounded-[24px] p-5">
                <div className="mb-5">
                  <p className="booking-section-number">03</p>
                  <h4 className="mt-2 text-xl font-semibold text-white">
                    Guest notes
                  </h4>
                  <p className="booking-muted mt-2 text-sm leading-6">
                    Add anything the team should know before the booking arrives.
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="booking-label">Allergies</label>
                    <input
                      value={form.allergies}
                      onChange={(event) => updateForm("allergies", event.target.value)}
                      className="booking-input"
                      placeholder="Nuts, shellfish, gluten..."
                    />
                  </div>

                  <div>
                    <label className="booking-label">Celebration</label>
                    <input
                      value={form.celebration}
                      onChange={(event) => updateForm("celebration", event.target.value)}
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

                  <div>
                    <label className="booking-label">Accessibility notes</label>
                    <textarea
                      value={form.accessibilityNotes}
                      onChange={(event) =>
                        updateForm("accessibilityNotes", event.target.value)
                      }
                      rows={3}
                      className="booking-input"
                      placeholder="Wheelchair access, pram space..."
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="booking-label">Additional notes</label>
                    <textarea
                      value={form.guestNotes}
                      onChange={(event) => updateForm("guestNotes", event.target.value)}
                      rows={4}
                      className="booking-input"
                      placeholder="Any extra notes for the team..."
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-white/60">
                This booking will be saved as{" "}
                <span className="font-semibold text-white">Manual</span>.
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {createError ? (
                  <p className="text-sm text-rose-200">{createError}</p>
                ) : null}

                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="booking-button-secondary px-5 py-3 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCreateBooking}
                  disabled={isCreating}
                  className="booking-button-primary px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? "Creating..." : "Create booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
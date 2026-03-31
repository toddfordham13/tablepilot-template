import nodemailer from "nodemailer"

type BookingEmailRecord = {
  id: string
  restaurant_slug: string
  status: string
  source: string
  guest_name: string
  guest_email: string
  guest_phone: string
  guests: number
  booking_date: string
  booking_time: string
  service_key: string
  allergies: string | null
  celebration: string | null
  seating_preference: string | null
  accessibility_notes: string | null
  highchair: number | null
  guest_notes: string | null
  internal_notes: string | null
  created_at: string
  updated_at: string
}

type BookingSettingsRow = {
  restaurant_slug: string
  booking_email: string
  timezone: string
  max_advance_days: number
  default_slot_interval: number
  default_max_party_size: number
  default_cutoff_hours: number
} | undefined

function titleFromServiceKey(serviceKey: string) {
  return serviceKey
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function titleFromRestaurantSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function getMailerConfig() {
  const host = process.env.BOOKING_SMTP_HOST
  const port = Number(process.env.BOOKING_SMTP_PORT || 587)
  const user = process.env.BOOKING_SMTP_USER
  const pass = process.env.BOOKING_SMTP_PASS
  const from = process.env.BOOKING_SMTP_FROM

  if (!host || !user || !pass || !from) {
    return null
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    from,
  }
}

function getTransporter() {
  const config = getMailerConfig()

  if (!config) {
    return null
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  })
}

async function getRestaurantNotificationEmail(
  restaurantSlug: string
): Promise<string | null> {
  try {
    const { getBookingSettings } = await import("./settingsRepo")
    const settings = getBookingSettings(restaurantSlug) as BookingSettingsRow

    if (settings?.booking_email?.trim()) {
      return settings.booking_email.trim()
    }

    return null
  } catch {
    return null
  }
}

function isBookingEmailRecord(value: unknown): value is BookingEmailRecord {
  if (!value || typeof value !== "object") return false

  const booking = value as Record<string, unknown>

  return (
    typeof booking.id === "string" &&
    typeof booking.restaurant_slug === "string" &&
    typeof booking.status === "string" &&
    typeof booking.source === "string" &&
    typeof booking.guest_name === "string" &&
    typeof booking.guest_email === "string" &&
    typeof booking.guest_phone === "string" &&
    typeof booking.guests === "number" &&
    typeof booking.booking_date === "string" &&
    typeof booking.booking_time === "string" &&
    typeof booking.service_key === "string"
  )
}

function buildBookingSummaryText(booking: BookingEmailRecord) {
  return [
    `Guest: ${booking.guest_name}`,
    `Email: ${booking.guest_email}`,
    `Phone: ${booking.guest_phone}`,
    `Guests: ${booking.guests}`,
    `Date: ${booking.booking_date}`,
    `Time: ${booking.booking_time}`,
    `Service: ${titleFromServiceKey(booking.service_key)}`,
    `Source: ${booking.source}`,
    `Allergies: ${booking.allergies || "None supplied"}`,
    `Celebration: ${booking.celebration || "None supplied"}`,
    `Seating preference: ${booking.seating_preference || "None supplied"}`,
    `Accessibility notes: ${booking.accessibility_notes || "None supplied"}`,
    `Guest notes: ${booking.guest_notes || "None supplied"}`,
  ].join("\n")
}

export async function sendNewBookingEmails(booking: unknown) {
  if (!isBookingEmailRecord(booking)) {
    console.warn("Booking emails skipped: invalid booking payload.")
    return
  }

  const transporter = getTransporter()
  const config = getMailerConfig()

  if (!transporter || !config) {
    console.warn(
      "Booking emails skipped: BOOKING_SMTP_* env vars are not configured."
    )
    return
  }

  const restaurantName = titleFromRestaurantSlug(booking.restaurant_slug)
  const serviceLabel = titleFromServiceKey(booking.service_key)
  const restaurantEmail = await getRestaurantNotificationEmail(
    booking.restaurant_slug
  )

  const tasks: Array<Promise<unknown>> = []

  if (restaurantEmail) {
    tasks.push(
      transporter.sendMail({
        from: config.from,
        to: restaurantEmail,
        subject: `New booking request — ${restaurantName}`,
        text: [
          `A new booking request has been submitted for ${restaurantName}.`,
          "",
          buildBookingSummaryText(booking),
        ].join("\n"),
      })
    )
  } else {
    console.warn(
      `Booking notification skipped: no booking_email configured for "${booking.restaurant_slug}".`
    )
  }

  if (booking.guest_email?.trim()) {
    tasks.push(
      transporter.sendMail({
        from: config.from,
        to: booking.guest_email.trim(),
        subject: `We’ve received your booking request — ${restaurantName}`,
        text: [
          `Hi ${booking.guest_name},`,
          "",
          `We’ve received your booking request for ${restaurantName}.`,
          `Date: ${booking.booking_date}`,
          `Time: ${booking.booking_time}`,
          `Service: ${serviceLabel}`,
          `Guests: ${booking.guests}`,
          "",
          "Your request is currently pending confirmation from the restaurant.",
          "",
          "Thank you.",
        ].join("\n"),
      })
    )
  }

  await Promise.all(tasks)
}

export async function sendBookingStatusEmail(
  booking: unknown,
  status: "confirmed" | "declined" | "cancelled"
) {
  if (!isBookingEmailRecord(booking)) {
    console.warn("Booking status email skipped: invalid booking payload.")
    return
  }

  const transporter = getTransporter()
  const config = getMailerConfig()

  if (!transporter || !config) {
    console.warn(
      "Booking status email skipped: BOOKING_SMTP_* env vars are not configured."
    )
    return
  }

  if (!booking.guest_email?.trim()) {
    return
  }

  const restaurantName = titleFromRestaurantSlug(booking.restaurant_slug)
  const serviceLabel = titleFromServiceKey(booking.service_key)

  const statusCopy = {
    confirmed: {
      subject: `Booking confirmed — ${restaurantName}`,
      message: `Your booking at ${restaurantName} has been confirmed.`,
    },
    declined: {
      subject: `Booking update — ${restaurantName}`,
      message: `Unfortunately, the restaurant was unable to confirm your booking request at ${restaurantName}.`,
    },
    cancelled: {
      subject: `Booking cancelled — ${restaurantName}`,
      message: `Your booking at ${restaurantName} has been cancelled.`,
    },
  }[status]

  await transporter.sendMail({
    from: config.from,
    to: booking.guest_email.trim(),
    subject: statusCopy.subject,
    text: [
      `Hi ${booking.guest_name},`,
      "",
      statusCopy.message,
      `Date: ${booking.booking_date}`,
      `Time: ${booking.booking_time}`,
      `Service: ${serviceLabel}`,
      `Guests: ${booking.guests}`,
      "",
      "Thank you.",
    ].join("\n"),
  })
}
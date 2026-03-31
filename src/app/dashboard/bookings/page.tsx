import BookingsBoard from "./BookingsBoard"

import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { getBookingsForRestaurant } from "@/lib/bookings/bookingsRepo"
import { initBookingsDb } from "@/lib/bookings/db"
import { getAllServiceConfigsForRestaurant } from "@/lib/bookings/servicesRepo"
import { getBookingSettingsConfig } from "@/lib/bookings/settingsRepo"
import type {
  BookingRecord,
  BookingServiceConfig,
  BookingSettingsConfig,
} from "@/lib/bookings/types"

export const dynamic = "force-dynamic"

export default async function DashboardBookingsPage() {
  initBookingsDb()

  const user = await getCurrentUser()
  const restaurantSlug = user?.restaurantSlug ?? "restaurant"

  const bookings = getBookingsForRestaurant(restaurantSlug) as BookingRecord[]
  const services = getAllServiceConfigsForRestaurant(
    restaurantSlug
  ) as BookingServiceConfig[]
  const settings = getBookingSettingsConfig(
    restaurantSlug
  ) as BookingSettingsConfig

  return (
    <div className="min-h-screen bg-[#0F1F3D] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C9A24A]">
                TablePilot Reservations
              </p>
              <h1 className="font-['Playfair_Display'] text-3xl leading-none text-white sm:text-4xl">
                Bookings Back Office
              </h1>
            </div>

            <div className="max-w-xl text-sm leading-6 text-white/70">
              View bookings by date and service, update statuses quickly, and
              manage reservation settings for your venue in one place.
            </div>
          </div>
        </div>

        <BookingsBoard
          restaurantSlug={restaurantSlug}
          initialBookings={bookings}
          initialServices={services}
          initialSettings={settings}
        />
      </div>
    </div>
  )
}
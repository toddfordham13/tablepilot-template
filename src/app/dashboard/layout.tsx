import Link from "next/link"
import type { ReactNode } from "react"

import LogoutButton from "@/components/dashboard/LogoutButton"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    return <>{children}</>
  }

  const restaurantSlug = user.restaurantSlug

  return (
    <div
      className="flex min-h-screen bg-[#0F1F3D] text-white"
      data-restaurant-slug={restaurantSlug}
    >
      <aside className="flex w-64 flex-col border-r border-white/10 p-6">
        <div>
          <h2 className="mb-2 text-xl font-semibold">TablePilot</h2>
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            {restaurantSlug}
          </p>

          <nav className="space-y-3 text-sm">
            <Link href="/dashboard" className="block hover:text-[#C9A24A]">
              Overview
            </Link>
            <Link href="/dashboard/menu" className="block hover:text-[#C9A24A]">
              Menu
            </Link>
            <Link href="/dashboard/hours" className="block hover:text-[#C9A24A]">
              Opening Hours
            </Link>
            <Link href="/dashboard/gallery" className="block hover:text-[#C9A24A]">
              Gallery
            </Link>
            <Link href="/dashboard/settings" className="block hover:text-[#C9A24A]">
              Settings
            </Link>
          </nav>
        </div>

        <div className="mt-auto pt-10">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  )
}
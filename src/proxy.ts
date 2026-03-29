import { NextRequest, NextResponse } from "next/server"

const SESSION_COOKIE_NAME = "tablepilot_session"
const PUBLIC_PATHS = ["/dashboard/login"]

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/")

  if (!isDashboardRoute) {
    return NextResponse.next()
  }

  const isPublicDashboardPath = PUBLIC_PATHS.some(
    (path) => pathname === path
  )

  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!session && !isPublicDashboardPath) {
    const loginUrl = new URL("/dashboard/login", request.url)
    loginUrl.searchParams.set("next", `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (session && isPublicDashboardPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
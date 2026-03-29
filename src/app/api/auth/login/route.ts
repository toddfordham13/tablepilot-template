import { NextResponse } from "next/server"

import { verifyPassword } from "@/lib/auth/password"
import {
  createSessionToken,
  getSessionCookieName,
  getSessionMaxAge,
} from "@/lib/auth/session"
import { getUserByEmail } from "@/lib/db/users"

type LoginBody = {
  email?: string
  password?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody
    const email = body.email?.trim().toLowerCase()
    const password = body.password?.trim()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      )
    }

    const user = getUserByEmail(email)

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      )
    }

    const validPassword = await verifyPassword(password, user.password_hash)

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      )
    }

    const token = await createSessionToken({
      userId: user.id,
      restaurantSlug: user.restaurant_slug,
      email: user.email,
    })

    const response = NextResponse.json({ ok: true }, { status: 200 })

    response.cookies.set({
      name: getSessionCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getSessionMaxAge(),
    })

    return response
  } catch {
    return NextResponse.json(
      { error: "Unable to log in." },
      { status: 500 }
    )
  }
}
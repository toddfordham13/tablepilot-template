import { cookies } from "next/headers"

import {
  getSessionCookieName,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/auth/session"

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(getSessionCookieName())?.value

  if (!token) {
    return null
  }

  try {
    return await verifySessionToken(token)
  } catch {
    return null
  }
}
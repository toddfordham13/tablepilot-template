import { SignJWT, jwtVerify } from "jose"

const SESSION_COOKIE_NAME = "tablepilot_session"
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET

  if (!secret) {
    throw new Error("AUTH_SECRET is not set")
  }

  return new TextEncoder().encode(secret)
}

export type SessionPayload = {
  userId: number
  restaurantSlug: string
  email: string
}

export async function createSessionToken(payload: SessionPayload) {
  const secret = getSessionSecret()

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret)
}

export async function verifySessionToken(token: string) {
  const secret = getSessionSecret()

  const { payload } = await jwtVerify(token, secret)
  return payload as unknown as SessionPayload
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME
}

export function getSessionMaxAge() {
  return SESSION_DURATION_SECONDS
}
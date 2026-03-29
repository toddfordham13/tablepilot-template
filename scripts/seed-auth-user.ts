import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

import { hashPassword } from "@/lib/auth/password"
import { createUser, getUserByEmail } from "@/lib/db/users"

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD?.trim()
  const restaurantSlug = process.env.SEED_ADMIN_RESTAURANT_SLUG?.trim()

  if (!email || !password || !restaurantSlug) {
    throw new Error(
      "Missing SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD or SEED_ADMIN_RESTAURANT_SLUG"
    )
  }

  const existing = getUserByEmail(email)

  if (existing) {
    console.log(`User already exists for ${email}`)
    return
  }

  const passwordHash = await hashPassword(password)

  const user = createUser({
    restaurantSlug,
    email,
    passwordHash,
  })

  console.log("Created user:", user)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
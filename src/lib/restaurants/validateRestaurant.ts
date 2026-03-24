import type { Restaurant } from "./types"

export function validateRestaurant(restaurant: Restaurant) {
  const issues: string[] = []

  const { config, hero } = restaurant

  if (!config.slug) {
    issues.push("Missing slug")
  }

  if (!config.name) {
    issues.push("Missing restaurant name")
  }

  if (!config.phone) {
    issues.push("Missing phone number")
  }

  if (!config.addressLine) {
    issues.push("Missing address")
  }

  if (!config.landingImage) {
    issues.push("Missing landing image")
  }

  if (!hero?.image?.src) {
    issues.push("Missing hero image")
  }

  if (!config.seo?.title) {
    issues.push("Missing SEO title")
  }

  if (!config.seo?.description) {
    issues.push("Missing SEO description")
  }

  if (!config.theme?.primary) {
    issues.push("Missing theme primary colour")
  }

  if (!config.theme?.accent) {
    issues.push("Missing theme accent colour")
  }

  const isStrict =
    config.status === "live" || config.readiness === "launch-ready"

  if (issues.length > 0) {
    const header = isStrict
      ? `🚨 Restaurant "${config.slug}" FAILED launch validation`
      : `⚠️ Restaurant "${config.slug}" has configuration issues`

    console.warn(header)

    issues.forEach((issue) => {
      console.warn(` - ${issue}`)
    })
  }
}
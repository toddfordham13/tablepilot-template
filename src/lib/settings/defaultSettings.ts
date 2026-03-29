import { config as bodegaConfig } from "@/content/restaurants/bodega/config"
import { config as fuegoConfig } from "@/content/restaurants/fuego/config"

import {
  cloneSettingsContent,
  sanitiseSettingsContent,
  type SettingsContent,
} from "@/lib/settings/types"

function mapConfigToSettings(config: {
  slug: string
  name: string
  tagline: string
  addressLine: string
  phone: string
  email: string
  bookingUrl: string
  instagramUrl: string
  facebookUrl: string
  mapUrl: string
  openingHours: string
  seo: {
    title: string
    description: string
  }
}): SettingsContent {
  const safe = sanitiseSettingsContent({
    slug: config.slug,
    name: config.name,
    tagline: config.tagline,
    addressLine: config.addressLine,
    phone: config.phone,
    email: config.email,
    bookingUrl: config.bookingUrl,
    instagramUrl: config.instagramUrl,
    facebookUrl: config.facebookUrl,
    mapUrl: config.mapUrl,
    openingHours: config.openingHours,
    seoTitle: config.seo.title,
    seoDescription: config.seo.description,
  })

  if (!safe) {
    throw new Error(`Invalid default settings for concept: ${config.slug}`)
  }

  return safe
}

const defaultSettings: Record<string, SettingsContent> = {
  bodega: mapConfigToSettings(bodegaConfig),
  fuego: mapConfigToSettings(fuegoConfig),
}

export function getAvailableSettingsConcepts(): string[] {
  return Object.keys(defaultSettings)
}

export function getDefaultSettingsForConcept(
  concept: string,
): SettingsContent | null {
  const match = defaultSettings[concept]

  if (!match) {
    return null
  }

  return cloneSettingsContent(match)
}
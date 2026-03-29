export type SettingsContent = {
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
  seoTitle: string
  seoDescription: string
}

export function sanitiseSettingsContent(
  input: Partial<SettingsContent> | null | undefined,
): SettingsContent | null {
  if (!input || typeof input !== "object") {
    return null
  }

  if (typeof input.slug !== "string" || input.slug.trim().length === 0) {
    return null
  }

  return {
    slug: input.slug,
    name: typeof input.name === "string" ? input.name : "",
    tagline: typeof input.tagline === "string" ? input.tagline : "",
    addressLine: typeof input.addressLine === "string" ? input.addressLine : "",
    phone: typeof input.phone === "string" ? input.phone : "",
    email: typeof input.email === "string" ? input.email : "",
    bookingUrl: typeof input.bookingUrl === "string" ? input.bookingUrl : "",
    instagramUrl:
      typeof input.instagramUrl === "string" ? input.instagramUrl : "",
    facebookUrl: typeof input.facebookUrl === "string" ? input.facebookUrl : "",
    mapUrl: typeof input.mapUrl === "string" ? input.mapUrl : "",
    openingHours:
      typeof input.openingHours === "string" ? input.openingHours : "",
    seoTitle: typeof input.seoTitle === "string" ? input.seoTitle : "",
    seoDescription:
      typeof input.seoDescription === "string" ? input.seoDescription : "",
  }
}

export function cloneSettingsContent(
  content: SettingsContent,
): SettingsContent {
  return JSON.parse(JSON.stringify(content)) as SettingsContent
}
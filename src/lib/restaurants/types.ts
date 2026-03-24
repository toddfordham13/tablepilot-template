export type RestaurantTheme = {
  primary: string
  accent: string
  background: string
  surface: string
  text: string
}

export type RestaurantSeo = {
  title: string
  description: string
}

export type RestaurantSchema = {
  businessType: string
  cuisine: string
  priceRange: string
}

export type RestaurantStatus = "starter" | "demo" | "live"
export type RestaurantReadiness = "building" | "review" | "launch-ready"

export type RestaurantConfig = {
  slug: string
  name: string
  status: RestaurantStatus
  readiness: RestaurantReadiness
  addressLine: string
  phone: string
  email: string
  openingHours: string
  tagline: string
  bookingUrl: string
  instagramUrl: string
  facebookUrl: string
  mapUrl: string
  landingImage: string
  theme: RestaurantTheme
  seo: RestaurantSeo
  schema: RestaurantSchema
}

export type HeroImage = {
  src: string
  alt: string
}

export type GalleryImage = {
  src: string
  alt: string
}

export type MenuItem = {
  name: string
  description: string
  price?: string
  category: string
  featured?: boolean
}

export type RestaurantHero = {
  tagline: string
  description: string
  image: HeroImage
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

export type RestaurantMenu = {
  title: string
  description: string
  items: MenuItem[]
}

export type RestaurantGallery = {
  title: string
  description: string
  images: GalleryImage[]
}

export type Restaurant = {
  config: RestaurantConfig
  hero: RestaurantHero
  menu: RestaurantMenu
  gallery: RestaurantGallery
}
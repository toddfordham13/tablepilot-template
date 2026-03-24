import type { RestaurantConfig } from "../../../lib/restaurants/types"

export const config: RestaurantConfig = {
  slug: "bodega",

  name: "The Bodega",

  status: "demo",
  readiness: "review",

  tagline: "NYC style sandwiches. Stacked high. Loud flavour.",

  addressLine: "Stall 175, Row H, Norwich Market",

  phone: "+44 0000 000001",

  email: "hello@thebodega.co.uk",

  openingHours: "Mon–Sat | 11:00 – 20:00 | Sun | 11:00 – 17:00",

  bookingUrl: "",

  instagramUrl: "https://instagram.com/bodega175_norwich",

  facebookUrl: "",

  mapUrl: "https://maps.google.com/?q=Norwich+Market+Stall+175+Row+H",

  landingImage: "/images/bodega/landing.jpg",

  theme: {
    primary: "#8B1E1E",
    accent: "#C9A24A",
    background: "#F3E9D2",
    surface: "#FFF8EC",
    text: "#1F1714",
  },

  seo: {
    title: "The Bodega | NYC Style Sandwiches in Norwich",
    description:
      "Discover The Bodega in Norwich Market for stacked NYC style sandwiches, bold flavour, signature specials, and loud street-food energy.",
  },

  schema: {
    businessType: "Restaurant",
    cuisine: "Sandwiches",
    priceRange: "££",
  },
}
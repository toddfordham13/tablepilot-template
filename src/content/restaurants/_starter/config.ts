import type { RestaurantConfig } from "../../../lib/restaurants/types"

export const config: RestaurantConfig = {
  slug: "restaurant-slug",

  name: "Restaurant Name",

  status: "starter",
  readiness: "building",

  tagline: "Short tagline describing the venue",

  addressLine: "Restaurant address here",

  phone: "+44 0000 000000",

  email: "hello@restaurant.com",

  openingHours: "Mon–Sun | 12:00 – Late",

  bookingUrl: "",

  instagramUrl: "",

  facebookUrl: "",

  mapUrl: "",

  landingImage: "/images/restaurants/restaurant-slug/landing.jpg",

  theme: {
    primary: "#111111",
    accent: "#c9a24a",
    background: "#f8f5ef",
    surface: "#ffffff",
    text: "#111111",
  },

  seo: {
    title: "Restaurant Name | Restaurant website",
    description:
      "Short SEO description for the restaurant, highlighting cuisine, atmosphere, and bookings.",
  },

  schema: {
    businessType: "Restaurant",
    cuisine: "Restaurant",
    priceRange: "££",
  },
}
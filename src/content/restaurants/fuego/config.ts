import type { RestaurantConfig } from "../../../lib/restaurants/types"

export const config: RestaurantConfig = {
  slug: "fuego",

  name: "Fuego Tacos",

  status: "demo",
  readiness: "review",

  tagline: "Bold tacos, big flavour, and Norwich nights done right",

  addressLine: "The Stanley, 33 Magdalen Road, Norwich, Norfolk, NR3 4LG",

  phone: "",

  email: "",

  openingHours:
    "Mon 17:00–21:00 · Tue Closed · Wed Closed · Thu 17:00–21:00 · Fri 17:00–21:00 · Sat 12:00–21:00 · Sun 12:00–18:00",

  bookingUrl: "",

  instagramUrl: "https://www.instagram.com/fuegonorwich/",

  facebookUrl: "",

  mapUrl:
    "https://www.google.com/maps?q=The+Stanley,+33+Magdalen+Road,+Norwich,+Norfolk,+NR3+4LG",

  landingImage: "/images/fuego/landing.jpg",

  theme: {
    primary: "#9f1d16",
    accent: "#f0c24b",
    background: "#120706",
    surface: "#1a0d0b",
    text: "#f5ead7",
  },

  seo: {
    title:
      "Fuego Tacos Norwich | Bold tacos, big flavour, and Norwich nights done right",
    description:
      "Fuego Tacos brings bold Mexican-inspired flavour, stacked plates, cocktails, and proper Norwich taco bar energy from The Stanley.",
  },

  schema: {
    businessType: "Restaurant",
    cuisine: "Mexican",
    priceRange: "££",
  },
}
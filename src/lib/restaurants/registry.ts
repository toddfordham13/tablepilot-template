import type { Restaurant } from "./types"
import { validateRestaurant } from "./validateRestaurant"

import { bodegaRestaurant } from "../../content/restaurants/bodega"
import { fuegoRestaurant } from "../../content/restaurants/fuego"

export const restaurantRegistry: Record<string, Restaurant> = {
  bodega: bodegaRestaurant,
  fuego: fuegoRestaurant,
}

Object.values(restaurantRegistry).forEach(validateRestaurant)

export function getRestaurant(slug: string): Restaurant | null {
  return restaurantRegistry[slug] ?? null
}

export function getAllRestaurants(): Restaurant[] {
  return Object.values(restaurantRegistry)
}

export function getAllRestaurantSlugs(): string[] {
  return Object.keys(restaurantRegistry)
}
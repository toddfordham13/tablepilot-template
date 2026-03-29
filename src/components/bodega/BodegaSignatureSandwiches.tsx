import { unstable_noStore as noStore } from "next/cache"

import { menu as fallbackMenu } from "@/content/restaurants/bodega/menu"
import BodegaSignatureSandwichesClient from "@/components/bodega/BodegaSignatureSandwichesClient"
import { getEffectiveMenuForConcept } from "@/lib/menus/menuStore"
import type { MenuContent } from "@/lib/menus/types"

export default function BodegaSignatureSandwiches() {
  noStore()

  const effectiveMenu =
    (getEffectiveMenuForConcept("bodega") as MenuContent | null) ?? fallbackMenu

  return <BodegaSignatureSandwichesClient menuContent={effectiveMenu} />
}
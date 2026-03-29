import { menu as bodegaMenu } from "@/content/restaurants/bodega/menu"
import { menu as fuegoMenu } from "@/content/restaurants/fuego/menu"
import {
  cloneMenuContent,
  createMenuContent,
  sanitiseMenuItem,
  type MenuContent,
  type MenuItem,
} from "@/lib/menus/types"

type LegacyMenuContent = {
  title: string
  description: string
  items: Array<Partial<MenuItem>>
}

function isMenuContent(value: unknown): value is MenuContent {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Partial<MenuContent>

  return (
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    (candidate.displayMode === "featured-grid" ||
      candidate.displayMode === "sectioned-menu") &&
    Array.isArray(candidate.sections)
  )
}

function isLegacyMenuContent(value: unknown): value is LegacyMenuContent {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Partial<LegacyMenuContent>

  return (
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    Array.isArray(candidate.items)
  )
}

function normaliseLegacyMenu(menu: LegacyMenuContent): MenuContent {
  const grouped = new Map<string, MenuItem[]>()

  menu.items.forEach((item, index) => {
    const safeItem = sanitiseMenuItem(item, index)
    const category =
      typeof safeItem.category === "string" && safeItem.category.trim().length > 0
        ? safeItem.category
        : "Menu"

    const existing = grouped.get(category) ?? []
    existing.push(safeItem)
    grouped.set(category, existing)
  })

  const sections = Array.from(grouped.entries()).map(
    ([category, items], index) => ({
      id: `section-${index + 1}`,
      title: category,
      description: "",
      items: items.map((item, itemIndex) => ({
        ...item,
        sortOrder: itemIndex + 1,
      })),
    }),
  )

  return createMenuContent({
    title: menu.title,
    description: menu.description,
    displayMode: "sectioned-menu",
    sections,
  })
}

function normaliseMenu(input: unknown): MenuContent {
  if (isMenuContent(input)) {
    return cloneMenuContent(input)
  }

  if (isLegacyMenuContent(input)) {
    return normaliseLegacyMenu(input)
  }

  throw new Error("Invalid default menu content")
}

const defaultMenus: Record<string, MenuContent> = {
  bodega: normaliseMenu(bodegaMenu),
  fuego: normaliseMenu(fuegoMenu),
}

export function getDefaultMenuForConcept(concept: string): MenuContent | null {
  const match = defaultMenus[concept]

  if (!match) {
    return null
  }

  return cloneMenuContent(match)
}

export function getAvailableMenuConcepts(): string[] {
  return Object.keys(defaultMenus)
}
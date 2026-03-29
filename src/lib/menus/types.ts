export type MenuDisplayMode = "featured-grid" | "sectioned-menu"

export type MenuItem = {
  id: string
  name: string
  description: string
  price?: string
  category: string
  featured?: boolean
  image?: string
  tag?: string
  meta?: string
  accent?: string
  visible: boolean
  sortOrder: number
}

export type MenuSection = {
  id: string
  title: string
  description?: string
  items: MenuItem[]
}

export type MenuContent = {
  title: string
  description: string
  displayMode: MenuDisplayMode
  sections: MenuSection[]
  items: MenuItem[]
}

export function createMenuContent(input: {
  title: string
  description: string
  displayMode: MenuDisplayMode
  sections: MenuSection[]
}): MenuContent {
  return {
    title: input.title,
    description: input.description,
    displayMode: input.displayMode,
    sections: input.sections,
    items: input.sections.flatMap((section) => section.items),
  }
}

export function cloneMenuSections(sections: MenuSection[]): MenuSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item })),
  }))
}

export function normaliseMenuItems(items: MenuItem[]): MenuItem[] {
  return items.map((item, index) => ({
    ...item,
    sortOrder: index + 1,
  }))
}

export function cloneMenuContent(menu: MenuContent): MenuContent {
  return createMenuContent({
    title: menu.title,
    description: menu.description,
    displayMode: menu.displayMode,
    sections: cloneMenuSections(menu.sections).map((section) => ({
      ...section,
      items: normaliseMenuItems(
        section.items
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder),
      ),
    })),
  })
}

export function isMenuDisplayMode(value: unknown): value is MenuDisplayMode {
  return value === "featured-grid" || value === "sectioned-menu"
}

export function sanitiseMenuItem(
  item: Partial<MenuItem>,
  index: number,
): MenuItem {
  return {
    id:
      typeof item.id === "string" && item.id.trim().length > 0
        ? item.id
        : `item-${index + 1}`,
    name: typeof item.name === "string" ? item.name : "",
    description: typeof item.description === "string" ? item.description : "",
    price: typeof item.price === "string" ? item.price : "",
    category: typeof item.category === "string" ? item.category : "",
    featured: typeof item.featured === "boolean" ? item.featured : false,
    image: typeof item.image === "string" ? item.image : "",
    tag: typeof item.tag === "string" ? item.tag : "",
    meta: typeof item.meta === "string" ? item.meta : "",
    accent: typeof item.accent === "string" ? item.accent : "#f0b323",
    visible: typeof item.visible === "boolean" ? item.visible : true,
    sortOrder:
      typeof item.sortOrder === "number" && Number.isFinite(item.sortOrder)
        ? item.sortOrder
        : index + 1,
  }
}

export function sanitiseMenuSection(
  section: Partial<MenuSection>,
  index: number,
): MenuSection {
  const rawItems = Array.isArray(section.items) ? section.items : []

  return {
    id:
      typeof section.id === "string" && section.id.trim().length > 0
        ? section.id
        : `section-${index + 1}`,
    title: typeof section.title === "string" ? section.title : "",
    description:
      typeof section.description === "string" ? section.description : "",
    items: normaliseMenuItems(
      rawItems.map((item, itemIndex) => sanitiseMenuItem(item, itemIndex)),
    ),
  }
}

export function sanitiseMenuContent(
  input: Partial<MenuContent>,
): MenuContent | null {
  if (
    typeof input.title !== "string" ||
    typeof input.description !== "string" ||
    !isMenuDisplayMode(input.displayMode) ||
    !Array.isArray(input.sections)
  ) {
    return null
  }

  return createMenuContent({
    title: input.title,
    description: input.description,
    displayMode: input.displayMode,
    sections: input.sections.map((section, index) =>
      sanitiseMenuSection(section, index),
    ),
  })
}
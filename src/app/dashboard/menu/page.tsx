"use client"

import { useEffect, useMemo, useState } from "react"

import { getDefaultMenuForConcept } from "@/lib/menus/defaultMenus"
import {
  cloneMenuContent,
  cloneMenuSections,
  normaliseMenuItems,
  type MenuContent,
  type MenuDisplayMode,
  type MenuItem,
  type MenuSection,
} from "@/lib/menus/types"

function getDisplayModeLabel(displayMode: MenuDisplayMode) {
  switch (displayMode) {
    case "featured-grid":
      return "Featured grid"
    case "sectioned-menu":
      return "Sectioned menu"
    default:
      return displayMode
  }
}

type EditableMenuState = {
  title: string
  description: string
  displayMode: MenuDisplayMode
  sections: MenuSection[]
}

function createEditorStateFromMenu(menu: MenuContent): EditableMenuState {
  const cloned = cloneMenuContent(menu)

  return {
    title: cloned.title,
    description: cloned.description,
    displayMode: cloned.displayMode,
    sections: cloned.sections,
  }
}

function createMenuFromEditorState(editorState: EditableMenuState): MenuContent {
  return {
    title: editorState.title,
    description: editorState.description,
    displayMode: editorState.displayMode,
    sections: cloneMenuSections(editorState.sections).map((section) => ({
      ...section,
      items: normaliseMenuItems(
        section.items.slice().sort((a, b) => a.sortOrder - b.sortOrder)
      ),
    })),
    items: cloneMenuSections(editorState.sections).flatMap((section) =>
      normaliseMenuItems(
        section.items.slice().sort((a, b) => a.sortOrder - b.sortOrder)
      )
    ),
  }
}

function createEmptyMenuItem(category: string, sortOrder: number): MenuItem {
  const timestamp = Date.now().toString()

  return {
    id: `new-item-${timestamp}`,
    name: "New item",
    description: "",
    price: "",
    category,
    featured: false,
    image: "",
    tag: "",
    meta: "",
    accent: "#f0b323",
    visible: true,
    sortOrder,
  }
}

function getRestaurantSlugFromDashboardShell() {
  if (typeof document === "undefined") {
    return "bodega"
  }

  const slug =
    document
      .querySelector("[data-restaurant-slug]")
      ?.getAttribute("data-restaurant-slug")
      ?.trim()
      .toLowerCase() ?? "bodega"

  return slug
}

export default function DashboardMenuPage() {
  const [activeConcept, setActiveConcept] = useState("bodega")
  const [editorState, setEditorState] = useState<EditableMenuState>(() => {
    const fallback = getDefaultMenuForConcept("bodega")

    return createEditorStateFromMenu(
      fallback ?? {
        title: "Menu",
        description: "",
        displayMode: "featured-grid",
        sections: [],
        items: [],
      }
    )
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    const slug = getRestaurantSlugFromDashboardShell()
    setActiveConcept(slug)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadMenu() {
      setIsLoading(true)
      setSaveMessage(null)

      const fallbackMenu = getDefaultMenuForConcept(activeConcept)

      try {
        const response = await fetch(
          `/api/dashboard/menu?concept=${encodeURIComponent(activeConcept)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        )

        if (!response.ok) {
          throw new Error("Failed to load menu")
        }

        const data = (await response.json()) as { menu: MenuContent }

        if (!isMounted) {
          return
        }

        setEditorState(createEditorStateFromMenu(data.menu))
        setHasUnsavedChanges(false)
      } catch {
        if (!isMounted) {
          return
        }

        if (fallbackMenu) {
          setEditorState(createEditorStateFromMenu(fallbackMenu))
        }

        setSaveMessage("Using fallback menu content")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadMenu()

    return () => {
      isMounted = false
    }
  }, [activeConcept])

  useEffect(() => {
    if (!saveMessage) {
      return
    }

    const timeout = window.setTimeout(() => {
      setSaveMessage(null)
    }, 3000)

    return () => window.clearTimeout(timeout)
  }, [saveMessage])

  const allItems = useMemo(
    () => editorState.sections.flatMap((section) => section.items),
    [editorState.sections]
  )

  const totalSections = editorState.sections.length
  const totalItems = allItems.length
  const visibleItems = allItems.filter((item) => item.visible).length
  const hiddenItems = totalItems - visibleItems

  function markDirty() {
    setHasUnsavedChanges(true)
    setSaveMessage(null)
  }

  function updateTopLevelField(field: "title" | "description", value: string) {
    setEditorState((current) => ({
      ...current,
      [field]: value,
    }))
    markDirty()
  }

  function updateSectionField(
    sectionId: string,
    field: "title" | "description",
    value: string
  ) {
    setEditorState((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            [field]: value,
          }
          : section
      ),
    }))
    markDirty()
  }

  function updateItemField<K extends keyof MenuItem>(
    sectionId: string,
    itemId: string,
    field: K,
    value: MenuItem[K]
  ) {
    setEditorState((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id !== sectionId
          ? section
          : {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId
                ? {
                  ...item,
                  [field]: value,
                }
                : item
            ),
          }
      ),
    }))
    markDirty()
  }

  function addItem(sectionId: string) {
    setEditorState((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) {
          return section
        }

        const nextSortOrder = section.items.length + 1

        return {
          ...section,
          items: [
            ...section.items,
            createEmptyMenuItem(section.title, nextSortOrder),
          ],
        }
      }),
    }))
    markDirty()
  }

  function deleteItem(sectionId: string, itemId: string) {
    setEditorState((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) {
          return section
        }

        return {
          ...section,
          items: normaliseMenuItems(
            section.items.filter((item) => item.id !== itemId)
          ),
        }
      }),
    }))
    markDirty()
  }

  function moveItem(
    sectionId: string,
    itemId: string,
    direction: "up" | "down"
  ) {
    setEditorState((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) {
          return section
        }

        const sortedItems = section.items
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)

        const currentIndex = sortedItems.findIndex((item) => item.id === itemId)

        if (currentIndex === -1) {
          return section
        }

        const targetIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1

        if (targetIndex < 0 || targetIndex >= sortedItems.length) {
          return section
        }

        const reorderedItems = sortedItems.slice()
        const [movedItem] = reorderedItems.splice(currentIndex, 1)
        reorderedItems.splice(targetIndex, 0, movedItem)

        return {
          ...section,
          items: normaliseMenuItems(reorderedItems),
        }
      }),
    }))
    markDirty()
  }

  async function handleSave() {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const response = await fetch("/api/dashboard/menu", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concept: activeConcept,
          menu: createMenuFromEditorState(editorState),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save menu")
      }

      const data = (await response.json()) as { menu: MenuContent }

      setEditorState(createEditorStateFromMenu(data.menu))
      setHasUnsavedChanges(false)
      setSaveMessage("Saved to backend")
    } catch {
      setSaveMessage("Save failed")
    } finally {
      setIsSaving(false)
    }
  }

  async function resetChanges() {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const response = await fetch(
        `/api/dashboard/menu?concept=${encodeURIComponent(activeConcept)}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to reset menu")
      }

      const data = (await response.json()) as { menu: MenuContent }

      setEditorState(createEditorStateFromMenu(data.menu))
      setHasUnsavedChanges(false)
      setSaveMessage("Reset to default menu")
    } catch {
      setSaveMessage("Reset failed")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className="inline-flex w-fit items-center rounded-full border border-[#C9A24A]/30 bg-[#C9A24A]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#C9A24A]">
            Dashboard / Menu editor
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Menu editor
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
              Edit safe structured content only. Public website layouts remain
              locked, while the dashboard controls item names, descriptions,
              visibility, supporting text, and ordering data.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${isLoading || isSaving
                ? "border border-sky-400/30 bg-sky-400/10 text-sky-300"
                : hasUnsavedChanges
                  ? "border border-amber-400/30 bg-amber-400/10 text-amber-300"
                  : "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              }`}
          >
            {isLoading
              ? "Loading..."
              : isSaving
                ? "Saving..."
                : hasUnsavedChanges
                  ? "Unsaved changes"
                  : "In sync"}
          </div>

          {saveMessage ? (
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              {saveMessage}
            </div>
          ) : null}

          <button
            type="button"
            onClick={resetChanges}
            disabled={isLoading || isSaving}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset to default
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || isSaving || !hasUnsavedChanges}
            className="rounded-full border border-[#C9A24A]/30 bg-[#C9A24A]/10 px-4 py-2 text-sm font-semibold text-[#C9A24A] transition hover:bg-[#C9A24A]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
            Active concept
          </p>
          <p className="mt-3 text-lg font-semibold capitalize text-white">
            {activeConcept}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
            Display mode
          </p>
          <p className="mt-3 text-lg font-semibold text-white">
            {getDisplayModeLabel(editorState.displayMode)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
            Sections
          </p>
          <p className="mt-3 text-lg font-semibold text-white">
            {totalSections}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
            Visible items
          </p>
          <p className="mt-3 text-lg font-semibold text-white">
            {visibleItems}
            <span className="ml-2 text-sm font-medium text-white/45">
              / {totalItems}
            </span>
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0F1F3D]/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="grid gap-6 border-b border-white/10 pb-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C9A24A]">
                Menu settings
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Top-level content
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                These fields shape the controlled content layer behind the public
                presentation. They do not expose styling or layout controls to
                clients.
              </p>
            </div>

            <div className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                  Title
                </span>
                <input
                  value={editorState.title}
                  onChange={(event) =>
                    updateTopLevelField("title", event.target.value)
                  }
                  disabled={isLoading}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C9A24A]/40 focus:bg-white/10 disabled:opacity-60"
                  placeholder="Menu title"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                  Description
                </span>
                <textarea
                  value={editorState.description}
                  onChange={(event) =>
                    updateTopLevelField("description", event.target.value)
                  }
                  disabled={isLoading}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C9A24A]/40 focus:bg-white/10 disabled:opacity-60"
                  placeholder="Menu description"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                Active mode
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {getDisplayModeLabel(editorState.displayMode)}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                {activeConcept} is currently using a{" "}
                {getDisplayModeLabel(editorState.displayMode).toLowerCase()}{" "}
                presentation. The editor model still supports broader hospitality
                menu structures.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                Hidden items
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {hiddenItems}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Visibility is safe to expose because it only affects whether an
                approved card appears, not how the public site is designed.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {editorState.sections.map((section) => {
            const sortedItems = section.items
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)

            return (
              <div
                key={section.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="grid gap-6 border-b border-white/10 pb-5 lg:grid-cols-[1fr_auto]">
                  <div className="grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                        Section title
                      </span>
                      <input
                        value={section.title}
                        onChange={(event) =>
                          updateSectionField(section.id, "title", event.target.value)
                        }
                        disabled={isLoading}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C9A24A]/40 focus:bg-white/10 disabled:opacity-60"
                        placeholder="Section title"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                        Section description
                      </span>
                      <textarea
                        value={section.description ?? ""}
                        onChange={(event) =>
                          updateSectionField(
                            section.id,
                            "description",
                            event.target.value
                          )
                        }
                        disabled={isLoading}
                        rows={3}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C9A24A]/40 focus:bg-white/10 disabled:opacity-60"
                        placeholder="Section description"
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap items-start gap-3 lg:flex-col lg:items-end">
                    <span className="rounded-full border border-[#C9A24A]/30 bg-[#C9A24A]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C9A24A]">
                      {section.items.length} items
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                      Section ID: {section.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => addItem(section.id)}
                      disabled={isLoading}
                      className="rounded-full border border-[#C9A24A]/30 bg-[#C9A24A]/10 px-4 py-2 text-sm font-semibold text-[#C9A24A] transition hover:bg-[#C9A24A]/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      + Add item
                    </button>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {sortedItems.map((item, index) => {
                    const isFirst = index === 0
                    const isLast = index === sortedItems.length - 1

                    return (
                      <article
                        key={item.id}
                        className="rounded-2xl border border-white/10 bg-[#0B162C]/70 p-5"
                      >
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/40">
                              {item.category} · Sort order {item.sortOrder}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => moveItem(section.id, item.id, "up")}
                              disabled={isLoading || isFirst}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Up
                            </button>

                            <button
                              type="button"
                              onClick={() => moveItem(section.id, item.id, "down")}
                              disabled={isLoading || isLast}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Down
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteItem(section.id, item.id)}
                              disabled={isLoading}
                              className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-300 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Delete
                            </button>

                            <label className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                                Visible
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateItemField(
                                    section.id,
                                    item.id,
                                    "visible",
                                    !item.visible
                                  )
                                }
                                disabled={isLoading}
                                className={`relative h-6 w-11 rounded-full transition ${item.visible ? "bg-emerald-500/70" : "bg-white/15"
                                  } disabled:cursor-not-allowed disabled:opacity-50`}
                                aria-pressed={item.visible}
                                aria-label={`Toggle visibility for ${item.name}`}
                              >
                                <span
                                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${item.visible ? "left-6" : "left-1"
                                    }`}
                                />
                              </button>
                            </label>
                          </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                          <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                              Name
                            </span>
                            <input
                              value={item.name}
                              onChange={(event) =>
                                updateItemField(
                                  section.id,
                                  item.id,
                                  "name",
                                  event.target.value
                                )
                              }
                              disabled={isLoading}
                              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C9A24A]/40 focus:bg-white/10 disabled:opacity-60"
                              placeholder="Item name"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                              Tag
                            </span>
                            <input
                              value={item.tag ?? ""}
                              onChange={(event) =>
                                updateItemField(
                                  section.id,
                                  item.id,
                                  "tag",
                                  event.target.value
                                )
                              }
                              disabled={isLoading}
                              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C9A24A]/40 focus:bg-white/10 disabled:opacity-60"
                              placeholder="Featured label"
                            />
                          </label>

                          <label className="block lg:col-span-2">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                              Description
                            </span>
                            <textarea
                              value={item.description}
                              onChange={(event) =>
                                updateItemField(
                                  section.id,
                                  item.id,
                                  "description",
                                  event.target.value
                                )
                              }
                              disabled={isLoading}
                              rows={4}
                              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C9A24A]/40 focus:bg-white/10 disabled:opacity-60"
                              placeholder="Item description"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                              Meta text
                            </span>
                            <input
                              value={item.meta ?? ""}
                              onChange={(event) =>
                                updateItemField(
                                  section.id,
                                  item.id,
                                  "meta",
                                  event.target.value
                                )
                              }
                              disabled={isLoading}
                              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C9A24A]/40 focus:bg-white/10 disabled:opacity-60"
                              placeholder="Served in..."
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                              Accent colour
                            </span>
                            <input
                              value={item.accent ?? ""}
                              onChange={(event) =>
                                updateItemField(
                                  section.id,
                                  item.id,
                                  "accent",
                                  event.target.value
                                )
                              }
                              disabled={isLoading}
                              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C9A24A]/40 focus:bg-white/10 disabled:opacity-60"
                              placeholder="#f0b323"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                              Price
                            </span>
                            <input
                              value={item.price ?? ""}
                              onChange={(event) =>
                                updateItemField(
                                  section.id,
                                  item.id,
                                  "price",
                                  event.target.value
                                )
                              }
                              disabled={isLoading}
                              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C9A24A]/40 focus:bg-white/10 disabled:opacity-60"
                              placeholder="£9.50"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                              Image path
                            </span>
                            <input
                              value={item.image ?? ""}
                              onChange={(event) =>
                                updateItemField(
                                  section.id,
                                  item.id,
                                  "image",
                                  event.target.value
                                )
                              }
                              disabled={isLoading}
                              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C9A24A]/40 focus:bg-white/10 disabled:opacity-60"
                              placeholder="/images/bodega/menu/item.jpg"
                            />
                          </label>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
"use client"

import { useMemo, useState } from "react"

import type { GalleryContent } from "@/lib/galleries/types"

type GalleryEditorClientProps = {
  concept: string
  initialGallery: GalleryContent
}

type SaveState = "idle" | "saving" | "saved" | "error"

export default function GalleryEditorClient({
  concept,
  initialGallery,
}: GalleryEditorClientProps) {
  const [gallery, setGallery] = useState<GalleryContent>(initialGallery)
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [isResetting, setIsResetting] = useState(false)

  const visibleImages = useMemo(
    () =>
      gallery.images
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .filter((image) => image.visible),
    [gallery.images],
  )

  function updateImage(
    id: string,
    key: "src" | "alt" | "visible",
    value: string | boolean,
  ) {
    setGallery((current) => ({
      ...current,
      images: current.images.map((image) =>
        image.id === id ? { ...image, [key]: value } : image,
      ),
    }))
    setSaveState("idle")
  }

  function moveImage(id: string, direction: "up" | "down") {
    setGallery((current) => {
      const ordered = current.images
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)

      const index = ordered.findIndex((image) => image.id === id)

      if (index === -1) {
        return current
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1

      if (targetIndex < 0 || targetIndex >= ordered.length) {
        return current
      }

      const next = ordered.slice()
      const [moved] = next.splice(index, 1)
      next.splice(targetIndex, 0, moved)

      return {
        ...current,
        images: next.map((image, imageIndex) => ({
          ...image,
          sortOrder: imageIndex + 1,
        })),
      }
    })

    setSaveState("idle")
  }

  function addImage() {
    setGallery((current) => ({
      ...current,
      images: [
        ...current.images,
        {
          id: `image-${Date.now()}`,
          src: "",
          alt: "",
          visible: true,
          sortOrder: current.images.length + 1,
        },
      ],
    }))
    setSaveState("idle")
  }

  function removeImage(id: string) {
    setGallery((current) => ({
      ...current,
      images: current.images
        .filter((image) => image.id !== id)
        .map((image, index) => ({
          ...image,
          sortOrder: index + 1,
        })),
    }))
    setSaveState("idle")
  }

  async function handleSave() {
    setSaveState("saving")
    setErrorMessage("")

    try {
      const response = await fetch("/api/dashboard/gallery", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concept,
          gallery,
        }),
      })

      const data = (await response.json()) as {
        gallery?: GalleryContent
        error?: string
      }

      if (!response.ok || !data.gallery) {
        throw new Error(data.error || "Failed to save gallery")
      }

      setGallery(data.gallery)
      setSaveState("saved")
    } catch (error) {
      setSaveState("error")
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save gallery",
      )
    }
  }

  async function handleReset() {
    setIsResetting(true)
    setErrorMessage("")

    try {
      const response = await fetch(
        `/api/dashboard/gallery?concept=${encodeURIComponent(concept)}`,
        {
          method: "DELETE",
        },
      )

      const data = (await response.json()) as {
        gallery?: GalleryContent
        error?: string
      }

      if (!response.ok || !data.gallery) {
        throw new Error(data.error || "Failed to reset gallery")
      }

      setGallery(data.gallery)
      setSaveState("idle")
    } catch (error) {
      setSaveState("error")
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to reset gallery",
      )
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a24a]">
              Gallery editor
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Gallery</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Edit gallery content for <span className="font-semibold text-white">{concept}</span>.
              This follows the same override system as the menu editor.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-white/15 px-4 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResetting ? "Resetting..." : "Reset to default"}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === "saving"}
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#c9a24a] px-5 text-sm font-semibold text-[#0f1f3d] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveState === "saving" ? "Saving..." : "Save gallery"}
            </button>
          </div>
        </div>

        {saveState === "saved" ? (
          <p className="mt-4 text-sm text-emerald-300">
            Gallery saved successfully.
          </p>
        ) : null}

        {saveState === "error" ? (
          <p className="mt-4 text-sm text-red-300">{errorMessage}</p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">
              Title
            </span>
            <input
              value={gallery.title}
              onChange={(event) => {
                setGallery((current) => ({
                  ...current,
                  title: event.target.value,
                }))
                setSaveState("idle")
              }}
              className="w-full rounded-xl border border-white/15 bg-[#08152b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#c9a24a]"
              placeholder="Gallery title"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">
              Description
            </span>
            <textarea
              value={gallery.description}
              onChange={(event) => {
                setGallery((current) => ({
                  ...current,
                  description: event.target.value,
                }))
                setSaveState("idle")
              }}
              rows={4}
              className="w-full rounded-xl border border-white/15 bg-[#08152b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#c9a24a]"
              placeholder="Gallery description"
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Images</h2>
            <p className="mt-1 text-sm text-white/60">
              Reorder, hide, add, or remove gallery images.
            </p>
          </div>

          <button
            type="button"
            onClick={addImage}
            className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-white/15 px-4 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Add image
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {gallery.images
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((image, index, ordered) => (
              <div
                key={image.id}
                className="rounded-2xl border border-white/10 bg-[#08152b] p-4"
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-white">
                        Image path
                      </span>
                      <input
                        value={image.src}
                        onChange={(event) =>
                          updateImage(image.id, "src", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/15 bg-[#0d1b36] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#c9a24a]"
                        placeholder="/images/fuego/gallery-1.jpg"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-white">
                        Alt text
                      </span>
                      <input
                        value={image.alt}
                        onChange={(event) =>
                          updateImage(image.id, "alt", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/15 bg-[#0d1b36] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#c9a24a]"
                        placeholder="Describe the image"
                      />
                    </label>

                    <label className="inline-flex items-center gap-3 text-sm text-white/80">
                      <input
                        type="checkbox"
                        checked={image.visible}
                        onChange={(event) =>
                          updateImage(image.id, "visible", event.target.checked)
                        }
                        className="h-4 w-4 rounded border-white/20 bg-[#0d1b36] text-[#c9a24a]"
                      />
                      Visible on site
                    </label>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0d1b36] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                      Preview
                    </p>
                    <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#06101f] p-3">
                      <div className="aspect-[4/3] rounded-lg border border-dashed border-white/10 bg-[#0a162b] p-3 text-xs text-white/45">
                        <div className="flex h-full items-center justify-center text-center">
                          {image.src.trim().length > 0 ? image.src : "Image path preview"}
                        </div>
                      </div>
                      <p className="mt-3 line-clamp-2 text-xs text-white/55">
                        {image.alt || "No alt text set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 lg:flex-col">
                    <button
                      type="button"
                      onClick={() => moveImage(image.id, "up")}
                      disabled={index === 0}
                      className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-white/15 px-3 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Up
                    </button>

                    <button
                      type="button"
                      onClick={() => moveImage(image.id, "down")}
                      disabled={index === ordered.length - 1}
                      className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-white/15 px-3 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Down
                    </button>

                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-red-400/25 px-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/10"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Visible image order</h2>
        <p className="mt-1 text-sm text-white/60">
          This is the order currently used by the public site.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleImages.map((image) => (
            <div
              key={image.id}
              className="rounded-2xl border border-white/10 bg-[#08152b] p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a24a]">
                #{image.sortOrder}
              </p>
              <p className="mt-2 truncate text-sm font-medium text-white">
                {image.src}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-white/55">
                {image.alt}
              </p>
            </div>
          ))}

          {!visibleImages.length ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#08152b] p-4 text-sm text-white/55">
              No visible images in this gallery yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
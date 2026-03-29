"use client"

import { useEffect, useMemo, useState } from "react"

type GalleryImage = {
  id: string
  src: string
  alt: string
  visible: boolean
  sortOrder: number
}

type GalleryContent = {
  title: string
  description: string
  images: GalleryImage[]
}

export default function GalleryEditorPage() {
  const [concept, setConcept] = useState("bodega")
  const [gallery, setGallery] = useState<GalleryContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string>("")

  async function loadGallery(selectedConcept: string) {
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(`/api/dashboard/gallery?concept=${selectedConcept}`, {
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error("Failed to load gallery")
      }

      const data = (await res.json()) as { gallery?: GalleryContent }
      setGallery(data.gallery ?? null)
    } catch {
      setGallery(null)
      setMessage("Failed to load gallery.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadGallery(concept)
  }, [concept])

  async function saveGallery() {
    if (!gallery) return

    setSaving(true)
    setMessage("")

    try {
      const res = await fetch("/api/dashboard/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept,
          gallery: {
            ...gallery,
            images: gallery.images.map((image, index) => ({
              ...image,
              sortOrder: index + 1,
            })),
          },
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to save gallery")
      }

      const data = (await res.json()) as { gallery?: GalleryContent }
      setGallery(data.gallery ?? gallery)
      setMessage("Gallery saved.")
    } catch {
      setMessage("Failed to save gallery.")
    } finally {
      setSaving(false)
    }
  }

  async function resetGallery() {
    setMessage("")

    try {
      const res = await fetch(`/api/dashboard/gallery?concept=${concept}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to reset gallery")
      }

      const data = (await res.json()) as { gallery?: GalleryContent }
      setGallery(data.gallery ?? null)
      setMessage("Gallery reset to default.")
    } catch {
      setMessage("Failed to reset gallery.")
    }
  }

  function updateGalleryField(
    field: keyof Pick<GalleryContent, "title" | "description">,
    value: string,
  ) {
    if (!gallery) return

    setGallery({
      ...gallery,
      [field]: value,
    })
  }

  function updateImage(
    index: number,
    field: keyof GalleryImage,
    value: string | boolean | number,
  ) {
    if (!gallery) return

    const nextImages = gallery.images.map((image, imageIndex) =>
      imageIndex === index
        ? {
          ...image,
          [field]: value,
        }
        : image,
    )

    setGallery({
      ...gallery,
      images: nextImages,
    })
  }

  function moveImage(index: number, direction: "up" | "down") {
    if (!gallery) return

    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= gallery.images.length) {
      return
    }

    const nextImages = [...gallery.images]
    const current = nextImages[index]
    nextImages[index] = nextImages[targetIndex]
    nextImages[targetIndex] = current

    setGallery({
      ...gallery,
      images: nextImages.map((image, imageIndex) => ({
        ...image,
        sortOrder: imageIndex + 1,
      })),
    })
  }

  const visibleCount = useMemo(() => {
    if (!gallery) return 0
    return gallery.images.filter((image) => image.visible).length
  }, [gallery])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          Loading gallery…
        </div>
      </div>
    )
  }

  if (!gallery) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-100">
          {message || "Gallery could not be loaded."}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-white">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C9A24A]">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Gallery Editor
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/65">
            Update gallery content safely without changing public site layout or
            design.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#111827] px-4 py-2.5 text-sm text-white outline-none"
          >
            <option value="bodega" className="bg-[#111827] text-white">
              Bodega
            </option>
            <option value="fuego" className="bg-[#111827] text-white">
              Fuego
            </option>
          </select>

          <button
            type="button"
            onClick={saveGallery}
            disabled={saving}
            className="rounded-xl bg-[#C9A24A] px-4 py-2.5 text-sm font-medium text-[#0F1F3D] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save gallery"}
          </button>

          <button
            type="button"
            onClick={resetGallery}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Reset to default
          </button>
        </div>
      </div>

      {message ? (
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
          {message}
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
            Concept
          </p>
          <p className="mt-2 text-lg font-medium capitalize">{concept}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
            Total images
          </p>
          <p className="mt-2 text-lg font-medium">{gallery.images.length}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
            Visible images
          </p>
          <p className="mt-2 text-lg font-medium">{visibleCount}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <h2 className="text-lg font-medium">Gallery copy</h2>

          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/75">
                Title
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                value={gallery.title}
                onChange={(e) => updateGalleryField("title", e.target.value)}
                placeholder="Gallery title"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/75">
                Description
              </label>
              <textarea
                className="min-h-[120px] w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                value={gallery.description}
                onChange={(e) =>
                  updateGalleryField("description", e.target.value)
                }
                placeholder="Gallery description"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-medium">Images</h2>
            <p className="text-sm text-white/50">
              Reorder, edit alt text, and control visibility.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {gallery.images.map((image, index) => (
              <div
                key={image.id}
                className="rounded-2xl border border-white/10 bg-[#0F172A] p-5"
              >
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Image {index + 1}
                    </p>
                    <p className="text-xs text-white/45">ID: {image.id}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => moveImage(index, "up")}
                      disabled={index === 0}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Move up
                    </button>

                    <button
                      type="button"
                      onClick={() => moveImage(index, "down")}
                      disabled={index === gallery.images.length - 1}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Move down
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Image source
                    </label>
                    <input
                      className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                      value={image.src}
                      placeholder="/images/example.jpg"
                      onChange={(e) => updateImage(index, "src", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Alt text
                    </label>
                    <input
                      className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                      value={image.alt}
                      placeholder="Describe the image"
                      onChange={(e) => updateImage(index, "alt", e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-sm text-white/80">
                      <input
                        type="checkbox"
                        checked={image.visible}
                        onChange={(e) =>
                          updateImage(index, "visible", e.target.checked)
                        }
                      />
                      Visible on site
                    </label>

                    <span className="text-xs text-white/45">
                      Sort order: {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
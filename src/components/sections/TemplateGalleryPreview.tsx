"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

import { trackEvent } from "@/lib/tracking/trackEvent"

type GalleryImage = {
  src: string
  alt: string
}

type Theme = {
  primary: string
  accent: string
  background: string
  surface: string
  text: string
}

type TemplateGalleryPreviewProps = {
  concept: string
  title: string
  description: string
  images: GalleryImage[]
  theme: Theme
}

export default function TemplateGalleryPreview({
  concept,
  title,
  description,
  images,
  theme,
}: TemplateGalleryPreviewProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const hasTrackedGalleryView = useRef(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node || hasTrackedGalleryView.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || hasTrackedGalleryView.current) return

        hasTrackedGalleryView.current = true

        trackEvent({
          event: "gallery_view",
          concept,
          path: "/gallery",
          section: "gallery",
          metadata: {
            imageCount: images.length,
            source: "gallery_preview_section",
          },
        })

        observer.disconnect()
      },
      {
        threshold: 0.2,
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [concept, images.length])

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="border-t"
      style={{
        backgroundColor: theme.surface,
        borderColor: "rgba(0,0,0,0.08)",
        color: theme.text,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] opacity-55">
              Gallery
            </p>

            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em] md:text-6xl">
              {title}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 opacity-75 md:text-lg md:leading-8">
              {description}
            </p>
          </div>

          <div className="lg:flex lg:justify-end">
            <div
              className="max-w-lg border px-6 py-5"
              style={{
                backgroundColor: theme.background,
                borderColor: "rgba(0,0,0,0.10)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
              }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-45">
                Visual Atmosphere
              </p>
              <p className="mt-3 text-sm leading-6 opacity-72 md:text-[15px]">
                Food, mood, texture, and energy — a sharper visual read of the
                brand that makes the concept feel alive without cluttering the
                page.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-12">
          {images[0] ? (
            <div className="group relative overflow-hidden border md:col-span-7">
              <div className="relative aspect-[4/4.25]">
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            </div>
          ) : null}

          <div className="grid gap-5 md:col-span-5">
            {images.slice(1, 3).map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="group relative overflow-hidden border"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
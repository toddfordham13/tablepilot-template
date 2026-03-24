"use client"

import { useEffect, useRef } from "react"

import { trackEvent } from "@/lib/tracking/trackEvent"

type MenuItem = {
  name: string
  description: string
  price?: string
  category: string
  featured?: boolean
}

type Theme = {
  primary: string
  accent: string
  background: string
  surface: string
  text: string
}

type TemplateMenuPreviewProps = {
  concept: string
  title: string
  description: string
  items: MenuItem[]
  theme: Theme
}

export default function TemplateMenuPreview({
  concept,
  title,
  description,
  items,
  theme,
}: TemplateMenuPreviewProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const hasTrackedSectionView = useRef(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node || hasTrackedSectionView.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || hasTrackedSectionView.current) return

        hasTrackedSectionView.current = true

        trackEvent({
          event: "menu_view",
          concept,
          path: "/menu",
          section: "menu",
          metadata: {
            source: "menu_preview_section",
            itemCount: items.length,
          },
        })

        observer.disconnect()
      },
      {
        threshold: 0.35,
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [concept, items.length])

  return (
    <section
      ref={sectionRef}
      id="menu"
      className="border-t"
      style={{
        backgroundColor: theme.background,
        borderColor: "rgba(0,0,0,0.08)",
        color: theme.text,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] opacity-55">
              Menu Preview
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
                backgroundColor: theme.surface,
                borderColor: "rgba(0,0,0,0.10)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
              }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-45">
                Signature Selection
              </p>
              <p className="mt-3 text-sm leading-6 opacity-72 md:text-[15px]">
                A strong first read of the concept through hero dishes, clear
                pricing, and a sharper food-led presentation that still works
                across both restaurant brands.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          {items.map((item, index) => (
            <article
              key={`${item.category}-${item.name}`}
              onClick={() =>
                trackEvent({
                  event: "menu_category_click",
                  concept,
                  path: "/menu",
                  section: "menu",
                  metadata: {
                    itemName: item.name,
                    category: item.category,
                    featured: item.featured ? "true" : "false",
                    source: "menu_preview_card",
                    index: index + 1,
                  },
                })
              }
              className={`group cursor-pointer border p-6 transition duration-300 hover:-translate-y-1 md:p-7 ${index === 0 ? "lg:col-span-6" : "lg:col-span-3"
                }`}
              style={{
                backgroundColor: theme.surface,
                borderColor: "rgba(0,0,0,0.10)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-[80%]">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] opacity-45">
                    {item.category}
                  </p>

                  <h3 className="text-2xl font-black uppercase leading-tight tracking-[-0.02em] md:text-[2rem]">
                    {item.name}
                  </h3>
                </div>

                {item.price ? (
                  <span
                    className="shrink-0 border px-3 py-1 text-sm font-semibold"
                    style={{
                      backgroundColor: `${theme.accent}20`,
                      borderColor: `${theme.primary}22`,
                      color: theme.text,
                    }}
                  >
                    {item.price}
                  </span>
                ) : null}
              </div>

              <p className="mt-5 max-w-xl text-sm leading-7 opacity-75 md:text-base">
                {item.description}
              </p>

              <div className="mt-8 flex items-center justify-between gap-4 border-t pt-5">
                <div className="flex items-center gap-3">
                  {item.featured ? (
                    <span
                      className="inline-flex border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
                      style={{
                        backgroundColor: theme.primary,
                        borderColor: theme.primary,
                      }}
                    >
                      Featured
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-45">
                      Signature Item
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-35 transition-opacity duration-300 group-hover:opacity-60">
                  Preview
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
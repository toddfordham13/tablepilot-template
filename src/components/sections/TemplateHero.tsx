"use client"

import Image from "next/image"

import { trackEvent } from "@/lib/tracking/trackEvent"

type HeroImage = {
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

type TemplateHeroProps = {
  concept: string
  name: string
  tagline: string
  description: string
  image: HeroImage
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  openingHours: string
  address: string
  cuisine: string
  priceRange: string
  theme: Theme
}

function normalise(value: string) {
  return value.trim().toLowerCase()
}

function handleTrackedClick(concept: string, href: string, label: string) {
  const normalisedHref = normalise(href)
  const normalisedLabel = normalise(label)

  if (
    normalisedHref === "#menu" ||
    normalisedHref.includes("/menu") ||
    normalisedLabel.includes("menu")
  ) {
    trackEvent({
      event: "menu_view",
      concept,
      path: "/menu",
      section: "menu",
      metadata: {
        href,
        label,
        source: "hero_cta",
      },
    })
    return
  }

  if (
    normalisedHref === "#contact" ||
    normalisedHref.includes("book") ||
    normalisedHref.includes("reserve") ||
    normalisedHref.includes("reservation") ||
    normalisedLabel.includes("book") ||
    normalisedLabel.includes("reserve") ||
    normalisedLabel.includes("find")
  ) {
    trackEvent({
      event: "booking_click",
      concept,
      path: href,
      section: "booking",
      metadata: {
        href,
        label,
        source: "hero_cta",
      },
    })
  }
}

export default function TemplateHero({
  concept,
  name,
  tagline,
  description,
  image,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  openingHours,
  address,
  cuisine,
  priceRange,
  theme,
}: TemplateHeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden"
      style={{ backgroundColor: theme.primary, color: "#ffffff" }}
    >
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,7,6,0.88) 0%, rgba(10,7,6,0.76) 34%, rgba(10,7,6,0.42) 58%, rgba(10,7,6,0.30) 100%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.22) 38%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, rgba(139,30,30,0.45) 0%, rgba(139,30,30,0) 100%)",
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,7,6,0) 0%, rgba(10,7,6,0.72) 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-end px-6 pb-10 pt-28 md:min-h-[92vh] md:px-8 md:pb-12 md:pt-32">
        <div className="w-full">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-black shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                style={{
                  backgroundColor: theme.accent,
                  borderColor: "rgba(0,0,0,0.18)",
                }}
              >
                {name}
              </span>

              <span className="inline-flex items-center border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/88 backdrop-blur-sm">
                {cuisine}
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] text-white md:text-7xl lg:text-[6rem]">
              {tagline}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/82 md:text-lg md:leading-8">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={primaryCtaHref}
                onClick={() =>
                  handleTrackedClick(concept, primaryCtaHref, primaryCtaLabel)
                }
                className="inline-flex min-h-[56px] items-center justify-center border px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black shadow-[0_14px_34px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-0.5 hover:opacity-95"
                style={{
                  backgroundColor: theme.accent,
                  borderColor: "rgba(0,0,0,0.16)",
                }}
              >
                {primaryCtaLabel}
              </a>

              <a
                href={secondaryCtaHref}
                onClick={() =>
                  handleTrackedClick(
                    concept,
                    secondaryCtaHref,
                    secondaryCtaLabel
                  )
                }
                className="inline-flex min-h-[56px] items-center justify-center border border-white/18 bg-black/28 px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-black"
              >
                {secondaryCtaLabel}
              </a>
            </div>
          </div>

          <div className="mt-12 grid gap-3 md:mt-16 md:grid-cols-4">
            <div className="border border-white/12 bg-black/34 p-5 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                Cuisine
              </p>
              <p className="mt-3 text-base font-semibold uppercase text-white">
                {cuisine}
              </p>
            </div>

            <div className="border border-white/12 bg-black/34 p-5 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                Price Range
              </p>
              <p className="mt-3 text-base font-semibold uppercase text-white">
                {priceRange}
              </p>
            </div>

            <div className="border border-white/12 bg-black/34 p-5 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                Opening Hours
              </p>
              <p className="mt-3 text-base font-semibold text-white">
                {openingHours}
              </p>
            </div>

            <div className="border border-white/12 bg-black/34 p-5 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                Location
              </p>
              <p className="mt-3 text-base font-semibold text-white">
                {address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
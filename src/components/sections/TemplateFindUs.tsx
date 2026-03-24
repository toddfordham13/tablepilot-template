"use client"

import { trackEvent } from "@/lib/tracking/trackEvent"

type Theme = {
  primary: string
  accent: string
  background: string
  surface: string
  text: string
}

type TemplateFindUsProps = {
  concept: string
  address: string
  mapUrl: string
  theme: Theme
}

export default function TemplateFindUs({
  concept,
  address,
  mapUrl,
  theme,
}: TemplateFindUsProps) {
  return (
    <section
      id="find"
      className="border-t"
      style={{
        backgroundColor: theme.background,
        borderColor: "rgba(0,0,0,0.08)",
        color: theme.text,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-24">
        <div
          className="overflow-hidden border"
          style={{
            backgroundColor: theme.surface,
            borderColor: "rgba(0,0,0,0.10)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
          }}
        >
          <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
            <div className="p-8 md:p-10 lg:p-12">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] opacity-55">
                Location
              </p>

              <h2 className="text-4xl font-black uppercase tracking-tight md:text-6xl">
                Find the venue
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 opacity-75 md:text-lg md:leading-8">
                Everything you need to get here quickly — whether you're
                planning ahead or walking in for food and drinks.
              </p>

              <div
                className="mt-10 border p-6"
                style={{
                  backgroundColor: `${theme.primary}08`,
                  borderColor: "rgba(0,0,0,0.10)",
                }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-45">
                  Address
                </p>

                <p className="mt-3 text-lg font-semibold tracking-tight">
                  {address}
                </p>
              </div>

              <div className="mt-8">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent({
                      event: "directions_click",
                      concept,
                      path: "/find",
                      section: "contact",
                      metadata: {
                        target: mapUrl,
                        source: "find_us_cta",
                      },
                    })
                  }
                  className="inline-flex min-h-[56px] items-center justify-center border px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-95"
                  style={{
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                  }}
                >
                  Get Directions
                </a>
              </div>
            </div>

            <div
              className="flex items-end border-t p-8 md:p-10 lg:border-l lg:border-t-0 lg:p-12"
              style={{ borderColor: "rgba(0,0,0,0.10)" }}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-45">
                  Visit us
                </p>

                <h3 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-4xl">
                  Great food.
                  <br />
                  Easy to find.
                </h3>

                <p className="mt-5 max-w-md text-sm leading-7 opacity-75 md:text-base">
                  Drop in, bring friends, grab a table, or pick up something
                  great to eat — the door’s open.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
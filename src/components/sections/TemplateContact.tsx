"use client"

import { useEffect, useRef } from "react"

import { trackEvent } from "@/lib/tracking/trackEvent"

type Theme = {
  primary: string
  accent: string
  background: string
  surface: string
  text: string
}

type TemplateContactProps = {
  concept: string
  address: string
  phone: string
  email: string
  openingHours: string
  bookingUrl?: string
  instagramUrl?: string
  facebookUrl?: string
  theme: Theme
}

export default function TemplateContact({
  concept,
  address,
  phone,
  email,
  openingHours,
  bookingUrl,
  instagramUrl,
  facebookUrl,
  theme,
}: TemplateContactProps) {
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
          event: "contact_section_view",
          concept,
          path: "/contact",
          section: "contact",
          metadata: {
            source: "contact_section",
            hasBookingUrl: bookingUrl ? "true" : "false",
            hasInstagramUrl: instagramUrl ? "true" : "false",
            hasFacebookUrl: facebookUrl ? "true" : "false",
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
  }, [bookingUrl, concept, facebookUrl, instagramUrl])

  return (
    <section
      ref={sectionRef}
      id="contact"
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
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-8 md:p-10 lg:p-12">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] opacity-55">
                Contact
              </p>

              <h2 className="text-4xl font-black uppercase tracking-tight md:text-6xl">
                Get in touch
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 opacity-75 md:text-lg md:leading-8">
                Everything you need in one place — phone, email, opening hours,
                address, and direct links to book or follow along online.
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                <div
                  className="border p-6"
                  style={{
                    backgroundColor: `${theme.primary}08`,
                    borderColor: "rgba(0,0,0,0.10)",
                  }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-45">
                    Phone
                  </p>
                  <a
                    href={`tel:${phone}`}
                    onClick={() =>
                      trackEvent({
                        event: "phone_click",
                        concept,
                        path: "/contact",
                        section: "contact",
                        metadata: {
                          target: phone,
                          source: "contact_phone",
                          type: "phone",
                        },
                      })
                    }
                    className="mt-3 block text-lg font-semibold tracking-tight transition hover:opacity-70"
                  >
                    {phone}
                  </a>
                </div>

                <div
                  className="border p-6"
                  style={{
                    backgroundColor: `${theme.primary}08`,
                    borderColor: "rgba(0,0,0,0.10)",
                  }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-45">
                    Email
                  </p>
                  <a
                    href={`mailto:${email}`}
                    onClick={() =>
                      trackEvent({
                        event: "cta_view",
                        concept,
                        path: "/contact",
                        section: "contact",
                        metadata: {
                          target: email,
                          source: "contact_email",
                          type: "email",
                        },
                      })
                    }
                    className="mt-3 block text-lg font-semibold tracking-tight transition hover:opacity-70"
                  >
                    {email}
                  </a>
                </div>

                <div
                  className="border p-6 md:col-span-2"
                  style={{
                    backgroundColor: `${theme.primary}08`,
                    borderColor: "rgba(0,0,0,0.10)",
                  }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-45">
                    Opening Hours
                  </p>
                  <p className="mt-3 text-lg font-semibold tracking-tight">
                    {openingHours}
                  </p>
                </div>

                <div
                  className="border p-6 md:col-span-2"
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
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {bookingUrl ? (
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent({
                        event: "booking_click",
                        concept,
                        path: bookingUrl,
                        section: "booking",
                        metadata: {
                          target: bookingUrl,
                          source: "contact_booking",
                        },
                      })
                    }
                    className="inline-flex min-h-[56px] items-center justify-center border px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-95"
                    style={{
                      backgroundColor: theme.primary,
                      borderColor: theme.primary,
                    }}
                  >
                    Book a Table
                  </a>
                ) : null}

                {instagramUrl ? (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent({
                        event: "cta_view",
                        concept,
                        path: instagramUrl,
                        section: "contact",
                        metadata: {
                          target: instagramUrl,
                          source: "contact_instagram",
                          platform: "instagram",
                        },
                      })
                    }
                    className="inline-flex min-h-[56px] items-center justify-center border px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition duration-200 hover:-translate-y-0.5"
                    style={{
                      borderColor: "rgba(0,0,0,0.10)",
                    }}
                  >
                    Instagram
                  </a>
                ) : null}

                {facebookUrl ? (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent({
                        event: "cta_view",
                        concept,
                        path: facebookUrl,
                        section: "contact",
                        metadata: {
                          target: facebookUrl,
                          source: "contact_facebook",
                          platform: "facebook",
                        },
                      })
                    }
                    className="inline-flex min-h-[56px] items-center justify-center border px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition duration-200 hover:-translate-y-0.5"
                    style={{
                      borderColor: "rgba(0,0,0,0.10)",
                    }}
                  >
                    Facebook
                  </a>
                ) : null}
              </div>
            </div>

            <div
              className="flex items-end border-t p-8 md:p-10 lg:border-l lg:border-t-0 lg:p-12"
              style={{ borderColor: "rgba(0,0,0,0.10)" }}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-45">
                  Reach us
                </p>

                <h3 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-4xl">
                  Book it.
                  <br />
                  Find it.
                  <br />
                  Follow it.
                </h3>

                <p className="mt-5 max-w-md text-sm leading-7 opacity-75 md:text-base">
                  Whether guests want to reserve, call ahead, message, or check
                  the vibe on social, the key details are all right here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import ConceptAnalyticsTracker from "@/components/sections/ConceptAnalyticsTracker"

import TemplateHero from "@/components/sections/TemplateHero"
import TemplateMenuPreview from "@/components/sections/TemplateMenuPreview"
import TemplateGalleryPreview from "@/components/sections/TemplateGalleryPreview"
import TemplateFindUs from "@/components/sections/TemplateFindUs"
import TemplateContact from "@/components/sections/TemplateContact"
import TemplateFooter from "@/components/sections/TemplateFooter"
import BodegaHeader from "@/components/bodega/BodegaHeader"
import BodegaHero from "@/components/bodega/BodegaHero"
import BodegaSignatureSandwiches from "@/components/bodega/BodegaSignatureSandwiches"
import BodegaFooter from "@/components/bodega/BodegaFooter"
import FuegoHeader from "@/components/fuego/FuegoHeader"
import FuegoHero from "@/components/fuego/FuegoHero"
import FuegoSignatureTacos from "@/components/fuego/FuegoSignatureTacos"
import FuegoLocation from "@/components/fuego/FuegoLocation"
import FuegoFooter from "@/components/fuego/FuegoFooter"

import {
  getAllRestaurantSlugs,
  getRestaurant,
} from "@/lib/restaurants/registry"

type ConceptPageProps = {
  params: Promise<{
    concept: string
  }>
}

export function generateStaticParams() {
  return getAllRestaurantSlugs().map((concept) => ({
    concept,
  }))
}

export async function generateMetadata({
  params,
}: ConceptPageProps): Promise<Metadata> {
  const { concept } = await params
  const restaurant = getRestaurant(concept)

  if (!restaurant) {
    return {
      title: "Restaurant not found",
      description: "The requested restaurant page could not be found.",
    }
  }

  return {
    title: restaurant.config.seo.title,
    description: restaurant.config.seo.description,
    openGraph: {
      title: restaurant.config.seo.title,
      description: restaurant.config.seo.description,
      images: [
        {
          url: restaurant.config.landingImage,
          alt: `${restaurant.config.name} landing image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: restaurant.config.seo.title,
      description: restaurant.config.seo.description,
      images: [restaurant.config.landingImage],
    },
  }
}

function BodegaPage({
  restaurant,
}: {
  restaurant: NonNullable<ReturnType<typeof getRestaurant>>
}) {
  return (
    <main
      style={{
        backgroundColor: "#120706",
        color: "#f3e9d2",
      }}
    >
      <BodegaHeader />
      <BodegaHero />
      <BodegaSignatureSandwiches />

      <section
        id="find"
        style={{
          backgroundColor: "#180907",
          borderTop: "3px solid #000",
          borderBottom: "3px solid #000",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-12">
          <div className="grid gap-6">
            <div
              className="overflow-hidden border-[3px] shadow-[0_18px_40px_rgba(0,0,0,0.32)] lg:grid lg:grid-cols-2"
              style={{
                borderColor: "#000000",
                backgroundColor: "#eadcc7",
              }}
            >
              <div
                className="border-b-[3px] p-6 md:p-7 lg:border-b-0 lg:border-r-[3px]"
                style={{
                  borderColor: "#000000",
                  backgroundColor: "#eadcc7",
                  color: "#1f1714",
                }}
              >
                <div className="text-center lg:text-left">
                  <div
                    className="inline-block border-[3px] px-4 py-2"
                    style={{
                      backgroundColor: "#b31217",
                      borderColor: "#000000",
                      color: "#ffffff",
                    }}
                  >
                    <p className="text-sm font-black uppercase tracking-[0.16em]">
                      Opening Hours
                    </p>
                  </div>

                  <h3 className="mt-5 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-black md:text-6xl">
                    Find The
                    <br />
                    Bodega
                  </h3>

                  <p
                    className="mt-4 text-sm font-black uppercase tracking-[0.14em] md:text-base"
                    style={{ color: "#b31217" }}
                  >
                    Stall 175 · Row H
                  </p>
                </div>

                <div
                  className="mt-6 overflow-hidden border-[3px]"
                  style={{ borderColor: "#000000" }}
                >
                  <div
                    className="px-5 py-3"
                    style={{
                      backgroundColor: "#b31217",
                      color: "#ffffff",
                      borderBottom: "3px solid #000000",
                    }}
                  >
                    <p className="text-sm font-black uppercase tracking-[0.16em]">
                      This Week
                    </p>
                  </div>

                  <div
                    className="p-5"
                    style={{
                      backgroundColor: "#eadcc7",
                    }}
                  >
                    <div className="space-y-0">
                      {[
                        { day: "Monday", hours: "11:00 – 15:30" },
                        { day: "Tuesday", hours: "11:00 – 15:30" },
                        { day: "Wednesday", hours: "11:00 – 15:30" },
                        { day: "Thursday", hours: "11:00 – 15:30" },
                        { day: "Friday", hours: "11:00 – 15:30" },
                        { day: "Saturday", hours: "10:30 – 16:00" },
                        { day: "Sunday", hours: "12:00 – 16:00" },
                      ].map((item) => (
                        <div
                          key={item.day}
                          className="flex items-center justify-between gap-4 border-b-[2px] py-3 last:border-b-0"
                          style={{ borderColor: "rgba(0,0,0,0.14)" }}
                        >
                          <span className="text-base font-black uppercase tracking-[0.08em] text-black md:text-lg">
                            {item.day}
                          </span>
                          <span className="text-base font-black text-black md:text-lg">
                            {item.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-6 md:p-7"
                style={{
                  backgroundColor: "#eadcc7",
                  color: "#1f1714",
                }}
              >
                <div className="text-center lg:text-left">
                  <div
                    className="inline-block border-[3px] px-4 py-2"
                    style={{
                      backgroundColor: "#2f6d3d",
                      borderColor: "#000000",
                      color: "#ffffff",
                    }}
                  >
                    <p className="text-sm font-black uppercase tracking-[0.16em]">
                      Directions
                    </p>
                  </div>

                  <h3 className="mt-5 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-black md:text-6xl">
                    Norwich
                    <br />
                    Market
                  </h3>
                </div>

                <div className="mt-6 overflow-hidden border-[3px] border-black bg-[#ddd1be]">
                  <iframe
                    src="https://www.google.com/maps?q=Norwich%20Market&z=16&output=embed"
                    className="h-[320px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="The Bodega map"
                  />
                </div>

                <div className="mt-5">
                  <a
                    href={restaurant.config.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[56px] items-center justify-center px-7 py-3 text-sm font-black uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-1"
                    style={{
                      backgroundColor: "#c9a24a",
                      color: "#000000",
                      border: "3px solid #000000",
                      boxShadow: "0 6px 0 #000000",
                    }}
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            <div
              className="relative overflow-hidden border-[3px] shadow-[0_18px_40px_rgba(0,0,0,0.32)]"
              style={{
                borderColor: "#000000",
                backgroundColor: "#241613",
                minHeight: "420px",
              }}
            >
              <Image
                src="/images/fuego/landing.jpg"
                alt="Fuego restaurant interior"
                fill
                className="object-cover"
                sizes="100vw"
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 44%, rgba(8,5,4,0.92) 100%)",
                }}
              />

              <div
                className="absolute left-0 top-0 h-4 w-full"
                style={{ backgroundColor: "#b31217" }}
              />

              <div className="relative z-10 flex min-h-[420px] items-end p-6 md:p-8">
                <div className="max-w-2xl">
                  <div
                    className="inline-block border-[3px] px-4 py-2"
                    style={{
                      backgroundColor: "#0f0f0f",
                      borderColor: "#000000",
                      color: "#f0d9a7",
                    }}
                  >
                    <p className="text-sm font-black uppercase tracking-[0.18em]">
                      Also From The Team
                    </p>
                  </div>

                  <h3 className="mt-5 text-5xl font-black uppercase leading-[0.88] tracking-[-0.05em] text-white md:text-7xl">
                    Discover
                    <br />
                    Fuego
                  </h3>

                  <p
                    className="mt-4 max-w-xl text-base font-semibold leading-7 md:text-xl"
                    style={{ color: "rgba(255,255,255,0.95)" }}
                  >
                    Relaxed Mexican dining, bold flavour, cocktails and a more
                    sit-down restaurant experience from the Bodega team.
                  </p>

                  <div className="mt-6">
                    <a
                      href="/fuego"
                      className="inline-flex min-h-[56px] items-center justify-center px-7 py-3 text-sm font-black uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-1"
                      style={{
                        backgroundColor: "#c9a24a",
                        color: "#000000",
                        border: "3px solid #000000",
                        boxShadow: "0 6px 0 #000000",
                      }}
                    >
                      Visit Fuego
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          backgroundColor: "#b31217",
          borderTop: "3px solid #000000",
          borderBottom: "3px solid #000000",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.18))",
          }}
        />

        <div className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-16">
          <div
            className="relative z-10 border-[3px] px-6 py-10 text-center md:px-10 md:py-12"
            style={{
              borderColor: "#000000",
              backgroundColor: "rgba(0,0,0,0.12)",
            }}
          >
            <div
              className="relative mx-auto mb-5 h-16 w-16 overflow-hidden rounded-full border-[3px]"
              style={{
                borderColor: "#f3e9d2",
                backgroundColor: "#b31217",
              }}
            >
              <Image
                src="/images/bodega/logo.png"
                alt="The Bodega logo"
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <p
              className="text-sm font-black uppercase tracking-[0.2em]"
              style={{ color: "#f0d9a7" }}
            >
              The Bodega
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.86] tracking-[-0.05em] text-white md:text-7xl">
              STACKED HIGH.
              <br />
              LOUD FLAVOUR.
            </h2>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#signature-sandwiches"
                className="inline-flex min-h-[56px] items-center justify-center px-7 py-3 text-sm font-black uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-1"
                style={{
                  backgroundColor: "#c9a24a",
                  color: "#000000",
                  border: "3px solid #000000",
                  boxShadow: "0 6px 0 #000000",
                }}
              >
                View Sandwiches
              </a>

              <a
                href="/fuego"
                className="inline-flex min-h-[56px] items-center justify-center px-7 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition duration-200 hover:-translate-y-1"
                style={{
                  backgroundColor: "#1c100d",
                  border: "3px solid #000000",
                  boxShadow: "0 6px 0 #000000",
                }}
              >
                Visit Fuego
              </a>
            </div>
          </div>
        </div>
      </section>

      <BodegaFooter />
    </main>
  )
}

function FuegoPage() {
  return (
    <main
      style={{
        backgroundColor: "#120706",
        color: "#f5ead7",
      }}
    >
      <FuegoHeader />
      <FuegoHero />
      <FuegoSignatureTacos />
      <FuegoLocation />
      <FuegoFooter />
    </main>
  )
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { concept } = await params
  const restaurant = getRestaurant(concept)

  if (!restaurant) {
    notFound()
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": restaurant.config.schema.businessType,
    name: restaurant.config.name,
    description: restaurant.config.seo.description,
    servesCuisine: restaurant.config.schema.cuisine,
    priceRange: restaurant.config.schema.priceRange,
    telephone: restaurant.config.phone,
    email: restaurant.config.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.config.addressLine,
    },
    image: restaurant.config.landingImage,
    url: `/${restaurant.config.slug}`,
    sameAs: [
      restaurant.config.instagramUrl,
      restaurant.config.facebookUrl,
    ].filter(Boolean),
    hasMap: restaurant.config.mapUrl || undefined,
    acceptsReservations: restaurant.config.bookingUrl ? "True" : "False",
  }

  if (concept === "bodega") {
    return (
      <>
        <ConceptAnalyticsTracker concept={concept} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        <BodegaPage restaurant={restaurant} />
      </>
    )
  }

  if (concept === "fuego") {
    return (
      <>
        <ConceptAnalyticsTracker concept={concept} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        <FuegoPage />
      </>
    )
  }

  return (
    <main>
      <ConceptAnalyticsTracker concept={concept} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <TemplateHero
        concept={concept}
        name={restaurant.config.name}
        tagline={restaurant.hero.tagline}
        description={restaurant.hero.description}
        image={restaurant.hero.image}
        primaryCtaLabel={restaurant.hero.primaryCtaLabel}
        primaryCtaHref={restaurant.hero.primaryCtaHref}
        secondaryCtaLabel={restaurant.hero.secondaryCtaLabel}
        secondaryCtaHref={restaurant.hero.secondaryCtaHref}
        openingHours={restaurant.config.openingHours}
        address={restaurant.config.addressLine}
        cuisine={restaurant.config.schema.cuisine}
        priceRange={restaurant.config.schema.priceRange}
        theme={restaurant.config.theme}
      />

      <TemplateMenuPreview
        concept={concept}
        title={restaurant.menu.title}
        description={restaurant.menu.description}
        items={restaurant.menu.items}
        theme={restaurant.config.theme}
      />

      <TemplateGalleryPreview
        concept={concept}
        title={restaurant.gallery.title}
        description={restaurant.gallery.description}
        images={restaurant.gallery.images}
        theme={restaurant.config.theme}
      />

      <TemplateFindUs
        concept={concept}
        address={restaurant.config.addressLine}
        mapUrl={restaurant.config.mapUrl}
        theme={restaurant.config.theme}
      />

      <TemplateContact
        concept={concept}
        address={restaurant.config.addressLine}
        phone={restaurant.config.phone}
        email={restaurant.config.email}
        openingHours={restaurant.config.openingHours}
        bookingUrl={restaurant.config.bookingUrl}
        instagramUrl={restaurant.config.instagramUrl}
        facebookUrl={restaurant.config.facebookUrl}
        theme={restaurant.config.theme}
      />

      <TemplateFooter
        name={restaurant.config.name}
        address={restaurant.config.addressLine}
        phone={restaurant.config.phone}
        email={restaurant.config.email}
        instagramUrl={restaurant.config.instagramUrl}
        facebookUrl={restaurant.config.facebookUrl}
        theme={restaurant.config.theme}
      />
    </main>
  )
}
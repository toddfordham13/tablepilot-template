import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { getEffectiveMenuForConcept } from "@/lib/menus/menuStore"

export const metadata: Metadata = {
  title: "Fuego Tacos Menu | Norwich",
  description:
    "View the Fuego Tacos menu with snacks, tacos, tostadas, sides, dips and desserts at The Stanley in Norwich.",
}

const galleryImages = [
  {
    src: "/images/fuego/gallery-1.jpg",
    alt: "Fuego tacos and plates",
  },
  {
    src: "/images/fuego/gallery-2.jpg",
    alt: "Fuego signature taco plate",
  },
  {
    src: "/images/fuego/gallery-3.jpg",
    alt: "Fuego food spread",
  },
]

const toId = (value: string) => value.toLowerCase().replace(/\s+/g, "-")

export default async function MenuPage() {
  const menu = await getEffectiveMenuForConcept("fuego")

  if (!menu) {
    return (
      <main className="p-10">
        <h1>No menu available</h1>
      </main>
    )
  }

  const menuSections = menu.sections ?? []

  return (
    <main
      style={{
        backgroundColor: "#F4EEE4",
        color: "#1B1311",
      }}
    >
      <section
        style={{
          backgroundColor: "#7A1E1E",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-7 md:px-8 md:py-8">
          <div>
            <p
              className="text-[0.72rem] font-bold uppercase tracking-[0.24em]"
              style={{ color: "rgba(243,231,215,0.82)" }}
            >
              Fuego Tacos
            </p>

            <h1
              className="mt-1 text-4xl font-black uppercase leading-none md:text-6xl"
              style={{
                color: "#F8F1E7",
                letterSpacing: "-0.05em",
              }}
            >
              Menu
            </h1>
          </div>

          <Link
            href="/fuego"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full px-5 text-sm font-bold uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: "#F3E7D7",
              color: "#1B1311",
            }}
          >
            Back to Site
          </Link>
        </div>
      </section>

      <section
        style={{
          backgroundColor: "#C7A564",
          borderBottom: "1px solid rgba(27,19,17,0.12)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-3 md:px-8">
          <p
            className="text-[0.72rem] font-bold uppercase tracking-[0.24em] md:text-xs"
            style={{ color: "#1B1311" }}
          >
            Mexican Plates · Norwich · At The Stanley
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-16">
        <div className="max-w-3xl">
          <p
            className="text-xs font-bold uppercase tracking-[0.22em]"
            style={{ color: "#7A1E1E" }}
          >
            Fuego Tacos Menu
          </p>

          <h2
            className="mt-4 text-4xl font-black leading-[0.95] md:text-6xl"
            style={{
              color: "#1B1311",
              letterSpacing: "-0.05em",
            }}
          >
            Tacos, tostadas, sides and everything around them.
          </h2>

          <p
            className="mt-5 max-w-2xl text-base leading-8 md:text-lg"
            style={{ color: "rgba(27,19,17,0.74)" }}
          >
            A full look at the current Fuego menu at The Stanley. Please inform
            your server of any allergies before ordering.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {galleryImages.map((image, index) => (
            <div
              key={image.src}
              className={[
                "group relative overflow-hidden rounded-[24px]",
                "shadow-[0_16px_40px_rgba(27,19,17,0.08)]",
                "transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(27,19,17,0.14)]",
                index === 1 ? "md:-translate-y-3" : "",
              ].join(" ")}
              style={{
                minHeight: "220px",
                backgroundColor: "#1B1311",
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-8">
          {menuSections.map((section: any) => (
            <section
              key={section.id ?? section.title}
              id={toId(section.title)}
              className="overflow-hidden rounded-[28px] border bg-white shadow-[0_18px_44px_rgba(27,19,17,0.06)]"
              style={{
                borderColor: "rgba(27,19,17,0.08)",
              }}
            >
              <div
                className="border-b px-6 py-5 md:px-8"
                style={{
                  borderColor: "rgba(27,19,17,0.08)",
                  backgroundColor: "#FBF8F2",
                }}
              >
                <h3
                  className="text-3xl font-black uppercase md:text-4xl"
                  style={{
                    color: "#1B1311",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {section.title}
                </h3>
              </div>

              <div className="px-6 py-3 md:px-8 md:py-4">
                {(section.items ?? [])
                  .filter((item: any) => item.visible !== false)
                  .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                  .map((item: any) => (
                    <div
                      key={item.id ?? item.name}
                      className="grid gap-2 border-b py-4 md:grid-cols-[1fr_auto]"
                      style={{
                        borderColor: "rgba(27,19,17,0.08)",
                      }}
                    >
                      <div>
                        <h4
                          className="text-lg font-black md:text-xl"
                          style={{
                            color: "#1B1311",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {item.name}
                        </h4>

                        {item.description && (
                          <p
                            className="mt-1 text-sm leading-7 md:text-base"
                            style={{ color: "rgba(27,19,17,0.72)" }}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div>
                        <p
                          className="text-base font-black md:text-[1.15rem]"
                          style={{ color: "#1B1311" }}
                        >
                          {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  )
}
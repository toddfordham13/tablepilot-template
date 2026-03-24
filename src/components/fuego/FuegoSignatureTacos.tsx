import Image from "next/image"
import Link from "next/link"

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

const menuSections = [
  {
    title: "Snacks",
    description:
      "Crispy fried jalapeños, fresh fried nachos, Cajun chicken tenders and quick starters built to open the table properly.",
  },
  {
    title: "Tacos",
    description:
      "Beef birria, garlic chicken, pork carnitas, carne asada, fish goujon and more, priced clearly for x2 or x3.",
  },
  {
    title: "Tostadas",
    description:
      "Sharp, fresh, crunchy plates with bold toppings including habanero beef carpaccio and elote sweetcorn.",
  },
  {
    title: "Sides, Dips & Dessert",
    description:
      "Fries, loaded nachos, corn ribs, crema, queso, salsa de arbol and a clean finish with ice cream or margarita sorbet.",
  },
]

export default function FuegoSignatureTacos() {
  return (
    <section
      id="signature-tacos"
      style={{
        backgroundColor: "#F3E7D7",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 md:px-8 md:py-16">
        <div className="grid gap-4 md:grid-cols-3 md:items-end">
          {galleryImages.map((image, index) => (
            <div
              key={image.src}
              className={[
                "group relative overflow-hidden rounded-[20px] sm:rounded-[24px]",
                "shadow-[0_16px_40px_rgba(27,19,17,0.10)]",
                "transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(27,19,17,0.16)]",
                index === 1 ? "md:-translate-y-4" : "",
              ].join(" ")}
              style={{
                minHeight: index === 1 ? "300px" : "260px",
                backgroundColor: "#1B1311",
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(27,19,17,0.04) 0%, rgba(27,19,17,0.10) 52%, rgba(27,19,17,0.34) 100%)",
                }}
              />

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 opacity-70"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(27,19,17,0.22) 100%)",
                }}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className="text-[0.68rem] font-bold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.22em]"
                style={{ color: "#7A1E1E" }}
              >
                On The Menu
              </p>

              <h3
                className="mt-3 text-[2.1rem] font-black leading-[0.95] sm:text-4xl md:text-5xl"
                style={{
                  color: "#1B1311",
                  letterSpacing: "-0.05em",
                }}
              >
                Fuego menu highlights.
              </h3>
            </div>

            <div className="hidden sm:block">
              <Link
                href="/fuego/menu"
                className="inline-flex min-h-[50px] items-center justify-center rounded-full px-6 text-sm font-bold uppercase tracking-[0.14em] transition duration-200 hover:-translate-y-0.5 sm:min-h-[52px] sm:px-7"
                style={{
                  backgroundColor: "#7A1E1E",
                  color: "#F3E7D7",
                }}
              >
                View Full Menu
              </Link>
            </div>
          </div>

          <div className="mt-5 sm:hidden">
            <Link
              href="/fuego/menu"
              className="inline-flex min-h-[50px] items-center justify-center rounded-full px-6 text-sm font-bold uppercase tracking-[0.14em] transition duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: "#7A1E1E",
                color: "#F3E7D7",
              }}
            >
              View Full Menu
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2">
          {menuSections.map((section) => (
            <div
              key={section.title}
              className="group relative rounded-[20px] border bg-white p-5 sm:rounded-[24px] sm:p-7 md:p-8 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(27,19,17,0.10)]"
              style={{
                borderColor: "rgba(27,19,17,0.08)",
              }}
            >
              <div
                className="absolute left-0 top-0 h-full w-[4px] rounded-l-[24px] opacity-80"
                style={{ backgroundColor: "#C7A564" }}
              />

              <h4
                className="text-[2rem] font-black sm:text-3xl md:text-[34px]"
                style={{
                  color: "#1B1311",
                  letterSpacing: "-0.04em",
                }}
              >
                {section.title}
              </h4>

              <p
                className="mt-3 text-[0.98rem] leading-7 sm:mt-4 sm:text-base sm:leading-8"
                style={{ color: "rgba(27,19,17,0.74)" }}
              >
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
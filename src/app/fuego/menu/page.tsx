import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

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

const menuSections = [
  {
    title: "Snacks",
    items: [
      {
        name: "Crispy fried jalapeños with sour cream",
        description: "VG",
        price: "£5",
      },
      {
        name: "Fresh fried nachos with salsa",
        description: "VG",
        price: "£5",
      },
      {
        name: "Cajun chicken tenders, hot sauce",
        description: "Spicy",
        price: "£7.50",
      },
    ],
  },
  {
    title: "Tacos",
    subtitle: "x2 / x3",
    items: [
      {
        name: "Beef Birria",
        description: "Cheese, pickles, cilantro, consommé",
        price: "£11 / £16",
      },
      {
        name: "Garlic chicken",
        description: "Jalapeño salsa, truffle crema",
        price: "£9.50 / £14",
      },
      {
        name: "Pork Carnitas",
        description: "Guac, grilled pineapple",
        price: "£10 / £14.50",
      },
      {
        name: "Carne Asada Steak",
        description: "Elote corn, chimichurri",
        price: "£11 / £16",
      },
      {
        name: "Cajun fish goujon",
        description: "Slaw, coconut & chipotle crema",
        price: "£11 / £16",
      },
      {
        name: "Cheeseburger tacos",
        description: "Pickles, lettuce",
        price: "£10 / £14.50",
      },
      {
        name: "Roasted cauliflower",
        description: "Pasilla BBQ sauce, avocado, pickles",
        price: "£9.50 / £14",
      },
    ],
  },
  {
    title: "Tostadas",
    items: [
      {
        name: "Habanero beef carpaccio tostada",
        description: "Pepper pippian, jalapeño aioli",
        price: "£11.50",
      },
      {
        name: "Elote sweetcorn tostada",
        description: "Jalapeño, Grana Padano, coconut",
        price: "£8",
      },
    ],
  },
  {
    title: "Sides",
    items: [
      {
        name: "Chilli salt or plain fries",
        description: "VG",
        price: "£4.50",
      },
      {
        name: "Crispy fried potatoes with jalapeño aioli",
        description: "VG",
        price: "£6",
      },
      {
        name: "Fries or nachos with queso",
        description: "Pickled chillies, crispy onion, coriander",
        price: "£9",
      },
      {
        name: "Fries or nachos loaded with any taco filling",
        description: "",
        price: "£12",
      },
      {
        name: "Chilli salt corn ribs with sriracha crema",
        description: "VG",
        price: "£8",
      },
      {
        name: "Hispi cabbage slaw, garlic crumb",
        description: "VG",
        price: "£5",
      },
      {
        name: "Caesar salad",
        description: "Anchovies, jalapeño, Grana Padano",
        price: "£6.50",
      },
    ],
  },
  {
    title: "Dips",
    items: [
      {
        name: "Truffle crema",
        description: "",
        price: "£2 each",
      },
      {
        name: "Queso",
        description: "",
        price: "£2 each",
      },
      {
        name: "Sour cream",
        description: "",
        price: "£2 each",
      },
      {
        name: "Sriracha crema",
        description: "",
        price: "£2 each",
      },
      {
        name: "Salsa de Arbol",
        description: "",
        price: "£2 each",
      },
    ],
  },
  {
    title: "Dessert",
    items: [
      {
        name: "Vanilla ice cream",
        description: "",
        price: "£2 per scoop",
      },
      {
        name: "Margarita sorbet, Tajin",
        description: "",
        price: "£2.50 per scoop",
      },
    ],
  },
]

const toId = (value: string) => value.toLowerCase().replace(/\s+/g, "-")

export default function MenuPage() {
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
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(27,19,17,0.04) 0%, rgba(27,19,17,0.10) 52%, rgba(27,19,17,0.30) 100%)",
                }}
              />
            </div>
          ))}
        </div>

        <div className="sticky top-0 z-20 mt-10 border-y bg-[#F4EEE4]/90 py-4 backdrop-blur">
          <div className="flex gap-3 overflow-x-auto">
            {menuSections.map((section) => (
              <a
                key={section.title}
                href={`#${toId(section.title)}`}
                className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full border px-4 text-xs font-bold uppercase tracking-[0.14em] transition duration-200 hover:-translate-y-0.5"
                style={{
                  borderColor: "rgba(27,19,17,0.10)",
                  backgroundColor: "#FBF8F2",
                  color: "#1B1311",
                }}
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-8">
          {menuSections.map((section) => (
            <section
              id={toId(section.title)}
              key={section.title}
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
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h3
                    className="text-3xl font-black uppercase md:text-4xl"
                    style={{
                      color: "#1B1311",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {section.title}
                  </h3>

                  {section.subtitle ? (
                    <p
                      className="text-sm font-bold uppercase tracking-[0.18em]"
                      style={{ color: "rgba(27,19,17,0.56)" }}
                    >
                      {section.subtitle}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="px-6 py-3 md:px-8 md:py-4">
                {section.items.map((item, index) => (
                  <div
                    key={`${section.title}-${item.name}`}
                    className="grid gap-2 border-b py-4 transition-colors duration-200 hover:bg-[#f7f3ec] md:grid-cols-[1fr_auto] md:gap-6"
                    style={{
                      borderColor:
                        index === section.items.length - 1
                          ? "transparent"
                          : "rgba(27,19,17,0.08)",
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

                      {item.description ? (
                        <p
                          className="mt-1 text-sm leading-7 md:text-base"
                          style={{ color: "rgba(27,19,17,0.72)" }}
                        >
                          {item.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="md:pl-6">
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

        <div
          className="mt-12 border-t pt-6"
          style={{ borderColor: "rgba(27,19,17,0.10)" }}
        >
          <div
            className="rounded-[24px] border px-6 py-6 md:px-8"
            style={{
              borderColor: "rgba(27,19,17,0.08)",
              backgroundColor: "#FBF8F2",
            }}
          >
            <p
              className="text-sm leading-7 md:text-base"
              style={{ color: "rgba(27,19,17,0.76)" }}
            >
              Our entire menu is gluten free unless labelled otherwise. V =
              Veggie, VG = Vegan, VGO = Vegan Option Available.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
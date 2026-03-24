import Image from "next/image"
import Link from "next/link"

export default function FuegoHero() {
  return (
    <section
      style={{
        backgroundColor: "#1B1311",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 md:px-8 md:py-12">
        <div
          className="overflow-hidden rounded-[24px] border shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
          style={{
            borderColor: "rgba(255,255,255,0.10)",
            backgroundColor: "#201715",
          }}
        >
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex items-center px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-14 lg:px-12">
              <div className="max-w-2xl">
                <p
                  className="text-[0.68rem] font-bold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.22em]"
                  style={{ color: "#C7A564" }}
                >
                  Mexican plates, bold flavour, Norwich
                </p>

                <h2
                  className="mt-3 text-[3rem] font-black leading-[0.92] sm:mt-4 sm:text-5xl md:text-7xl"
                  style={{
                    color: "#F8F1E7",
                    letterSpacing: "-0.06em",
                  }}
                >
                  Fuego
                  <br />
                  Tacos
                </h2>

                <p
                  className="mt-5 max-w-xl text-[1rem] leading-7 sm:mt-6 sm:text-base sm:leading-8 md:text-lg"
                  style={{ color: "rgba(248,241,231,0.84)" }}
                >
                  Tacos, quesadillas, tostadas and crisp totopos built around bold
                  Mexican flavours and plates designed for proper evenings out.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/fuego/menu"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-full px-6 text-sm font-bold uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-0.5 sm:min-h-[54px]"
                    style={{
                      backgroundColor: "#C7A564",
                      color: "#1B1311",
                    }}
                  >
                    View Menu
                  </Link>

                  <a
                    href="#find"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-full border px-6 text-sm font-bold uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-0.5 sm:min-h-[54px]"
                    style={{
                      borderColor: "rgba(248,241,231,0.22)",
                      color: "#F8F1E7",
                      backgroundColor: "transparent",
                    }}
                  >
                    Find Us
                  </a>
                </div>
              </div>
            </div>

            <div className="relative h-[300px] sm:h-[380px] lg:h-auto lg:min-h-[640px]">
              <Image
                src="/images/fuego/hero.jpg"
                alt="Fuego tacos dish"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(27,19,17,0.08) 0%, rgba(27,19,17,0.14) 48%, rgba(27,19,17,0.36) 100%)",
                }}
              />

              <div
                className="absolute inset-y-0 left-0 hidden w-40 lg:block"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(27,19,17,0.50) 0%, rgba(27,19,17,0.0) 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
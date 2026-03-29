import Link from "next/link"
import { unstable_noStore as noStore } from "next/cache"

import { getOpeningHoursByRestaurantSlug } from "@/lib/db/hours"

type OpeningTimeRow = {
  day: string
  hours: string
}

function getFuegoOpeningTimes(): OpeningTimeRow[] {
  noStore()

  const overrides = getOpeningHoursByRestaurantSlug("fuego")

  if (!overrides.length) {
    return [
      { day: "Monday", hours: "17:00–21:00" },
      { day: "Tuesday", hours: "Closed" },
      { day: "Wednesday", hours: "Closed" },
      { day: "Thursday", hours: "17:00–21:00" },
      { day: "Friday", hours: "17:00–21:00" },
      { day: "Saturday", hours: "12:00–21:00" },
      { day: "Sunday", hours: "12:00–18:00" },
    ]
  }

  return overrides.map((item) => ({
    day: item.label,
    hours:
      item.is_closed === 1
        ? "Closed"
        : `${item.open_time ?? ""}–${item.close_time ?? ""}`,
  }))
}

export default function FuegoLocation() {
  const openingTimes = getFuegoOpeningTimes()

  return (
    <section
      id="find"
      style={{
        backgroundColor: "#1B1311",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 md:px-8 md:py-18">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div
            className="rounded-[24px] border p-5 sm:rounded-[28px] sm:p-7 md:p-8"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              backgroundColor: "#201715",
            }}
          >
            <p
              className="text-[0.68rem] font-bold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.22em]"
              style={{ color: "#C7A564" }}
            >
              Find Us
            </p>

            <h3
              className="mt-3 text-[2.4rem] font-black leading-[0.95] sm:mt-4 sm:text-4xl md:text-5xl"
              style={{
                color: "#F8F1E7",
                letterSpacing: "-0.05em",
              }}
            >
              Fuego Tacos
              <br />
              at The Stanley
            </h3>

            <div className="mt-5 sm:mt-6">
              <p
                className="text-[1rem] leading-7 sm:text-base sm:leading-8 md:text-lg"
                style={{ color: "rgba(248,241,231,0.82)" }}
              >
                33 Magdalen Road
                <br />
                Norwich
                <br />
                Norfolk
                <br />
                NR3 4LG
              </p>
            </div>

            <div
              className="mt-6 overflow-hidden rounded-[20px] border sm:mt-8 sm:rounded-[22px]"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              <div
                className="border-b px-4 py-3.5 sm:px-5 sm:py-4"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <p
                  className="text-[0.68rem] font-bold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.22em]"
                  style={{ color: "#C7A564" }}
                >
                  Opening Hours
                </p>
              </div>

              <div className="px-4 py-2.5 sm:px-5 sm:py-3">
                {openingTimes.map((item) => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between gap-4 border-b py-3 last:border-b-0"
                    style={{ borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    <span
                      className="text-[0.8rem] font-bold uppercase tracking-[0.08em] sm:text-sm md:text-base"
                      style={{ color: "#F8F1E7" }}
                    >
                      {item.day}
                    </span>

                    <span
                      className="text-[0.8rem] font-semibold sm:text-sm md:text-base"
                      style={{
                        color:
                          item.hours === "Closed"
                            ? "rgba(248,241,231,0.54)"
                            : "rgba(248,241,231,0.82)",
                      }}
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              <a
                href="https://www.google.com/maps?q=The+Stanley,+33+Magdalen+Road,+Norwich,+Norfolk,+NR3+4LG"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full px-6 text-sm font-bold uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-0.5 sm:min-h-[54px]"
                style={{
                  backgroundColor: "#C7A564",
                  color: "#1B1311",
                }}
              >
                Get Directions
              </a>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-rows-[1fr_auto]">
            <div
              className="overflow-hidden rounded-[24px] border sm:rounded-[28px]"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                backgroundColor: "#201715",
              }}
            >
              <iframe
                src="https://www.google.com/maps?q=The%20Stanley%2C%2033%20Magdalen%20Road%2C%20Norwich%2C%20Norfolk%2C%20NR3%204LG&z=16&output=embed"
                className="h-[300px] w-full sm:h-[380px] md:h-[100%] md:min-h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Fuego map"
              />
            </div>

            <div
              className="rounded-[24px] border p-6 sm:rounded-[28px] sm:p-8 md:p-10"
              style={{
                borderColor: "rgba(0,0,0,0.35)",
                backgroundColor: "#b31217",
              }}
            >
              <p
                className="text-[0.68rem] font-black uppercase tracking-[0.2em] sm:text-xs sm:tracking-[0.24em]"
                style={{ color: "#f4c542" }}
              >
                Also From The Team
              </p>

              <h3
                className="mt-3 text-[2.5rem] font-black uppercase leading-[0.9] sm:mt-4 sm:text-4xl md:text-5xl"
                style={{
                  color: "#ffffff",
                  letterSpacing: "-0.05em",
                }}
              >
                THE
                <br />
                BODEGA
              </h3>

              <p
                className="mt-3 max-w-md text-[1rem] leading-7 sm:mt-4 sm:text-base sm:leading-7 md:text-lg"
                style={{ color: "rgba(255,255,255,0.88)" }}
              >
                NYC-style stacked sandwiches. Loud flavours.
                <br />
                Built fresh every day from Norwich Market.
              </p>

              <div className="mt-5 sm:mt-6">
                <Link
                  href="/bodega"
                  className="inline-flex min-h-[50px] items-center justify-center rounded-full px-6 text-sm font-black uppercase tracking-[0.14em] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.03] sm:min-h-[52px] sm:px-7"
                  style={{
                    backgroundColor: "#f4c542",
                    color: "#000",
                  }}
                >
                  Visit The Bodega
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
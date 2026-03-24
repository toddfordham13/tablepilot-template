import Image from "next/image"

type BodegaLocationProps = {
  mapUrl?: string
}

const openingHours = [
  { day: "Monday", hours: "11:00 – 15:30" },
  { day: "Tuesday", hours: "11:00 – 15:30" },
  { day: "Wednesday", hours: "11:00 – 15:30" },
  { day: "Thursday", hours: "11:00 – 15:30" },
  { day: "Friday", hours: "11:00 – 15:30" },
  { day: "Saturday", hours: "10:30 – 16:00" },
  { day: "Sunday", hours: "12:00 – 16:00" },
]

export default function BodegaLocation({
  mapUrl = "https://maps.google.com/?q=Norwich%20Market",
}: BodegaLocationProps) {
  return (
    <section
      id="find"
      style={{
        backgroundColor: "#1c100d",
        borderTop: "1px solid #5b3327",
        borderBottom: "1px solid #5b3327",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-0 border shadow-[0_18px_40px_rgba(0,0,0,0.22)] lg:grid-cols-2">
          {/* OPENING HOURS */}
          <div
            className="border-b p-6 md:p-7 lg:border-b-0 lg:border-r"
            style={{
              borderColor: "#6b4636",
              backgroundColor: "#eadcc7",
              color: "#1f1714",
            }}
          >
            <p
              className="text-sm font-black uppercase tracking-[0.16em]"
              style={{ color: "#8b1e1e" }}
            >
              Find The Bodega
            </p>

            <h3 className="mt-3 text-4xl font-black uppercase leading-[0.92] tracking-[-0.03em] md:text-5xl">
              Stall 175
              <br />
              Row H
            </h3>

            <div
              className="mt-6 overflow-hidden border"
              style={{ borderColor: "rgba(0,0,0,0.12)" }}
            >
              <div
                className="px-5 py-3"
                style={{
                  backgroundColor: "#b01f1f",
                  color: "#ffffff",
                  borderBottom: "1px solid rgba(0,0,0,0.15)",
                }}
              >
                <p className="text-sm font-black uppercase tracking-[0.16em]">
                  Opening Hours
                </p>
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  {openingHours.map((item) => (
                    <div
                      key={item.day}
                      className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
                      style={{ borderColor: "rgba(0,0,0,0.08)" }}
                    >
                      <span className="text-base font-black uppercase tracking-[0.08em] md:text-lg">
                        {item.day}
                      </span>
                      <span className="text-base font-semibold md:text-lg">
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MAP */}
          <div
            className="p-6 md:p-7"
            style={{
              backgroundColor: "#eadcc7",
              color: "#1f1714",
            }}
          >
            <p
              className="text-sm font-black uppercase tracking-[0.16em]"
              style={{ color: "#8b1e1e" }}
            >
              Directions
            </p>

            <h3 className="mt-3 text-4xl font-black uppercase leading-[0.92] tracking-[-0.03em] md:text-5xl">
              Norwich
              <br />
              Market
            </h3>

            <div className="mt-6 overflow-hidden border border-black/10 bg-[#ddd1be]">
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
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center px-6 py-3 text-sm font-black uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-1"
                style={{
                  backgroundColor: "#c9a24a",
                  color: "#000000",
                  border: "1px solid rgba(0,0,0,0.2)",
                }}
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* FUEGO PANEL */}
        <div
          className="relative mt-6 overflow-hidden border shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
          style={{
            borderColor: "#6b4636",
            backgroundColor: "#241613",
            minHeight: "420px",
          }}
        >
          <Image
            src="/images/fuego/landing.jpg"
            alt="Fuego restaurant food"
            fill
            className="object-cover"
            sizes="100vw"
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.58) 45%, rgba(8,5,4,0.88) 100%)",
            }}
          />

          <div className="relative z-10 flex min-h-[420px] items-end p-6 md:p-8">
            <div className="max-w-2xl">
              <p
                className="text-sm font-black uppercase tracking-[0.18em]"
                style={{ color: "#f0d9a7" }}
              >
                Also From The Team
              </p>

              <h3 className="mt-3 text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-white md:text-7xl">
                Discover
                <br />
                Fuego
              </h3>

              <p
                className="mt-4 max-w-xl text-base font-semibold leading-7 md:text-xl"
                style={{ color: "rgba(255,255,255,0.92)" }}
              >
                Relaxed Mexican dining, bold flavour, cocktails and a more
                sit-down restaurant experience from the Bodega team.
              </p>

              <div className="mt-6">
                <a
                  href="/fuego"
                  className="inline-flex min-h-[54px] items-center justify-center px-6 py-3 text-sm font-black uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-1"
                  style={{
                    backgroundColor: "#c9a24a",
                    color: "#000000",
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  Visit Fuego
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
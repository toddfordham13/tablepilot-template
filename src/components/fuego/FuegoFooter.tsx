import Link from "next/link"

export default function FuegoFooter() {
  return (
    <footer
      style={{
        backgroundColor: "#7A1E1E",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-12">
        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.22em]"
              style={{ color: "rgba(243,231,215,0.78)" }}
            >
              By The Bodega
            </p>

            <h3
              className="mt-3 text-3xl font-black md:text-4xl"
              style={{
                color: "#F8F1E7",
                letterSpacing: "-0.05em",
              }}
            >
              Fuego Tacos
            </h3>

            <p
              className="mt-3 max-w-xl text-sm md:text-base"
              style={{ color: "rgba(248,241,231,0.78)" }}
            >
              Bold Mexican plates, tacos, tostadas and sides served at The
              Stanley in Norwich.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/fuego/menu"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border px-5 text-sm font-bold uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-0.5"
              style={{
                borderColor: "rgba(248,241,231,0.18)",
                color: "#F8F1E7",
              }}
            >
              Menu
            </Link>

            <a
              href="#find"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border px-5 text-sm font-bold uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-0.5"
              style={{
                borderColor: "rgba(248,241,231,0.18)",
                color: "#F8F1E7",
              }}
            >
              Find Us
            </a>

            <a
              href="#find"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full px-5 text-sm font-bold uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: "#C7A564",
                color: "#1B1311",
              }}
            >
              Book Table
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
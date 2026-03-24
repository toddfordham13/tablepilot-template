import Image from "next/image"
import Link from "next/link"

export default function FuegoHeader() {
  return (
    <>
      <header
        style={{
          backgroundColor: "#7A1E1E",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-7 md:gap-6 md:px-8 md:py-8">
          <Link href="/fuego" className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Image
              src="/images/fuego/logo-v2.png"
              alt="Fuego Tacos"
              width={84}
              height={84}
              unoptimized
              className="h-[58px] w-[58px] object-contain sm:h-[84px] sm:w-[84px]"
            />

            <div className="min-w-0 pt-0.5 sm:pt-1">
              <p
                className="text-[0.58rem] font-bold uppercase tracking-[0.2em] sm:text-[0.72rem] sm:tracking-[0.24em]"
                style={{ color: "rgba(243,231,215,0.82)" }}
              >
                By The Bodega
              </p>

              <h1
                className="mt-1 text-[1.8rem] font-black uppercase leading-none sm:text-3xl md:text-4xl"
                style={{
                  color: "#F8F1E7",
                  letterSpacing: "-0.04em",
                }}
              >
                Fuego Tacos
              </h1>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/fuego/menu"
              className="text-sm font-bold uppercase tracking-[0.12em] transition-opacity duration-200 hover:opacity-70"
              style={{ color: "#F8F1E7" }}
            >
              Menu
            </Link>

            <a
              href="#find"
              className="text-sm font-bold uppercase tracking-[0.12em] transition-opacity duration-200 hover:opacity-70"
              style={{ color: "#F8F1E7" }}
            >
              Find Us
            </a>

            <a
              href="https://www.instagram.com/fuegonorwich/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold uppercase tracking-[0.12em] transition-opacity duration-200 hover:opacity-70"
              style={{ color: "#F8F1E7" }}
            >
              Instagram
            </a>

            <a
              href="#find"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full px-5 text-sm font-bold uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: "#F3E7D7",
                color: "#1B1311",
              }}
            >
              Book Table
            </a>
          </nav>
        </div>
      </header>

      <div
        style={{
          backgroundColor: "#C7A564",
          borderBottom: "1px solid rgba(27,19,17,0.12)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 md:px-8 md:py-3">
          <p
            className="text-[0.58rem] font-bold uppercase tracking-[0.16em] sm:text-[0.72rem] sm:tracking-[0.24em] md:text-xs"
            style={{ color: "#1B1311" }}
          >
            Mexican Plates · Norwich · By The Bodega Team
          </p>
        </div>
      </div>
    </>
  )
}
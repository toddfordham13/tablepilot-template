import Link from "next/link";

const leftLinks = [
  { label: "MENU", href: "/menu" },
  { label: "GALLERY", href: "/gallery" },
  { label: "ORDER", href: "/#order" }, // keep as anchor for now
];

const rightLinks = [
  { label: "FIND US", href: "/#find" },
  { label: "CONTACT", href: "/#contact" },
];

export default function SiteHeader() {
  return (
    <header className="w-full">
      <div className="container-shell pt-6">
        <nav className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/60 px-6 py-4 backdrop-blur">
          {/* LEFT NAV */}
          <div className="hidden gap-6 md:flex">
            {leftLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative text-xs tracking-[0.22em] text-charcoal/70 hover:text-charcoal transition"
              >
                {item.label}
                {/* underline only on hover */}
                <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 rounded bg-[var(--gold)] transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          {/* LOGO */}
          <Link href="/" className="text-center">
            <div className="h-font text-3xl tracking-[0.18em] text-[var(--gold)]">
              GRAZE
            </div>
            <div className="b-font -mt-1 text-[10px] tracking-[0.45em] text-[var(--gold)]/85">
              LOUNGE
            </div>
          </Link>

          {/* RIGHT NAV */}
          <div className="flex items-center gap-4">
            <div className="hidden gap-6 md:flex">
              {rightLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative text-xs tracking-[0.22em] text-charcoal/70 hover:text-charcoal transition"
                >
                  {item.label}
                  {/* underline only on hover */}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 rounded bg-[var(--gold)] transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              ))}
            </div>

            {/* PRIMARY CTA */}
            <Link href="/#order" className="pill pill-primary">
              ORDER ONLINE
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
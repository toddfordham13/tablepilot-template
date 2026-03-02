"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  const findHref = pathname === "/" ? "#find" : "/#find";
  const contactHref = pathname === "/" ? "#contact" : "/#contact";

  const leftLinks = [
    { label: "MENU", href: "/menu" },
    { label: "GALLERY", href: "/gallery" },
  ];

  const rightLinks = [
    { label: "FIND US", href: findHref },
    { label: "CONTACT", href: contactHref },
  ];

  return (
    <header>
      <nav className="flex items-center justify-between rounded-3xl border border-black/10 bg-white/70 px-8 py-5 shadow-[0_15px_45px_rgba(0,0,0,0.08)] backdrop-blur">
        {/* LEFT */}
        <div className="hidden md:flex gap-6">
          {leftLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative text-xs tracking-[0.22em] text-charcoal/70 hover:text-charcoal transition"
            >
              {item.label}
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

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-6">
          {rightLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative text-xs tracking-[0.22em] text-charcoal/70 hover:text-charcoal transition"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 rounded bg-[var(--gold)] transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}

          <Link href={findHref} className="pill pill-primary">
            GET DIRECTIONS
          </Link>
        </div>
      </nav>
    </header>
  );
}
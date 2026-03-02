"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADDRESS_LINE = "5 Ippokratous St, 5330 Ayia Napa, Cyprus";
const OPENING_HOURS = "Mon–Sun  |  4:00 PM — Late";
const PHONE = "+357 943 24677";

const INSTAGRAM_URL = "https://www.instagram.com/graze_lounge/";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61588374581854";

function telLink(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const pathname = usePathname();

  const findHref = pathname === "/" ? "#find" : "/#find";
  const contactHref = pathname === "/" ? "#contact" : "/#contact";
  const privateHireHref = pathname === "/" ? "#private-hire" : "/#private-hire";

  return (
    <footer className="w-full">
      <div className="container-shell py-14">
        <div className="text-center">
          <div className="h-font text-[30px] tracking-[0.18em] text-[var(--gold)]">
            GRAZE
          </div>
          <div className="b-font -mt-1 text-[10px] tracking-[0.45em] text-[var(--gold)]">
            LOUNGE
          </div>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12">
          {/* Info */}
          <div className="text-center md:text-left">
            <div className="b-font text-[11px] tracking-[0.26em] text-charcoal/55">
              VISIT
            </div>
            <p className="b-font mt-3 text-sm text-charcoal/70 leading-relaxed">
              {ADDRESS_LINE}
            </p>

            <div className="mt-6">
              <div className="b-font text-[11px] tracking-[0.26em] text-charcoal/55">
                HOURS
              </div>
              <p className="b-font mt-2 text-sm text-charcoal/70">
                {OPENING_HOURS}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="text-center">
            <div className="b-font text-[11px] tracking-[0.26em] text-charcoal/55">
              QUICK LINKS
            </div>

            <div className="mt-4 flex flex-col items-center gap-3">
              <Link
                href="/menu"
                className="text-sm text-charcoal/70 hover:text-charcoal transition"
              >
                Menu
              </Link>
              <Link
                href="/gallery"
                className="text-sm text-charcoal/70 hover:text-charcoal transition"
              >
                Gallery
              </Link>
              <Link
                href={findHref}
                className="text-sm text-charcoal/70 hover:text-charcoal transition"
              >
                Find Us
              </Link>
              <Link
                href={contactHref}
                className="text-sm text-charcoal/70 hover:text-charcoal transition"
              >
                Contact
              </Link>
              <Link
                href={privateHireHref}
                className="text-sm text-charcoal/70 hover:text-charcoal transition"
              >
                Private Hire
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <div className="b-font text-[11px] tracking-[0.26em] text-charcoal/55">
              CONTACT
            </div>

            <a
              href={telLink(PHONE)}
              className="b-font mt-3 inline-block text-sm text-charcoal/70 hover:text-[var(--gold)] transition"
              aria-label={`Call Graze Lounge on ${PHONE}`}
            >
              {PHONE}
            </a>

            <div className="mt-6 flex justify-center md:justify-end gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="pill flex items-center gap-2 hover:text-[var(--gold)] transition"
                aria-label="Open Graze Lounge Instagram"
              >
                Instagram
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="pill flex items-center gap-2 hover:text-[var(--gold)] transition"
                aria-label="Open Graze Lounge Facebook"
              >
                Facebook
              </a>
            </div>

            <div className="mt-6">
              <div className="b-font text-xs text-[var(--botanical)]">
                ✓ Walk-ins welcome
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        <p className="b-font mt-8 text-center text-xs text-charcoal/60">
          © {year} Graze Lounge, Cyprus
        </p>
      </div>

      <div className="h-10 bg-[color-mix(in_srgb,var(--gold)_35%,white)]" />
    </footer>
  );
}
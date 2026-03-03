// src/components/sections/FindContact.tsx

"use client";

const ADDRESS_LINE = "5 Ippokratous St, 5330 Ayia Napa, Cyprus";
const OPENING_HOURS = "Mon–Sun  |  4:00 PM — Late";
const PHONE = "+357 943 24677";

const INSTAGRAM_URL = "https://www.instagram.com/graze_lounge/";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61588374581854";

/**
 * To stop maps pointing to a random house, prefer ONE of:
 * 1) GOOGLE_MAPS_PLACE_ID (best)
 * 2) MAPS_COORDS (e.g. "34.989123,33.999456")
 *
 * If neither is set, we fall back to ADDRESS_LINE.
 *
 * Set these in .env.local / Vercel:
 * - NEXT_PUBLIC_GOOGLE_MAPS_PLACE_ID=
 * - NEXT_PUBLIC_MAPS_COORDS=
 */
const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLACE_ID || "";
const COORDS = process.env.NEXT_PUBLIC_MAPS_COORDS || "";

function mapQuery() {
  if (PLACE_ID) return `place_id:${PLACE_ID}`;
  if (COORDS) return COORDS;
  return ADDRESS_LINE;
}

function mapEmbedUrl() {
  // Using q works for place_id:... and for lat,lng and for normal addresses
  const q = encodeURIComponent(mapQuery());
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

function mapsDirectionsUrl() {
  // Google Directions supports destination=lat,lng OR destination=address OR destination_place_id=
  if (PLACE_ID) {
    return `https://www.google.com/maps/dir/?api=1&destination_place_id=${encodeURIComponent(
      PLACE_ID
    )}`;
  }
  const q = encodeURIComponent(mapQuery());
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

function appleMapsDirectionsUrl() {
  // Apple Maps: daddr can be address or lat,lng
  const daddr = encodeURIComponent(mapQuery());
  return `https://maps.apple.com/?daddr=${daddr}`;
}

function telLink(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  const gtag = (window as any).gtag as undefined | ((...args: any[]) => void);
  if (!gtag) return;

  gtag("event", name, {
    event_category: "engagement",
    ...params,
  });
}

export default function FindContact() {
  const googleHref = mapsDirectionsUrl();
  const appleHref = appleMapsDirectionsUrl();

  return (
    <section id="find" className="marble-soft">
      <div className="container-shell py-14">
        <div className="grid gap-14 md:grid-cols-[1fr_auto_1fr] md:gap-16">
          {/* FIND US */}
          <div>
            <div className="section-title text-center md:text-left">FIND US</div>

            <div className="mt-3 h-px w-full bg-black/10" />

            <div className="mt-6 overflow-hidden rounded-[14px] bg-white/30 ring-1 ring-black/10">
              <iframe
                title="Graze Lounge map"
                src={mapEmbedUrl()}
                className="h-[220px] w-full sm:h-[260px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="b-font mt-5 text-[15px] text-charcoal/70">
              {ADDRESS_LINE}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={googleHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("directions_click", {
                    event_label: "Google Maps",
                    link_url: googleHref,
                  })
                }
                className="pill inline-flex items-center gap-2 transition hover:text-[var(--gold)]"
                aria-label="Open directions to Graze Lounge in Google Maps"
              >
                <span>Google Maps</span>
                <span aria-hidden="true">→</span>
              </a>

              <a
                href={appleHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("directions_click", {
                    event_label: "Apple Maps",
                    link_url: appleHref,
                  })
                }
                className="pill inline-flex items-center gap-2 transition hover:text-[var(--gold)]"
                aria-label="Open directions to Graze Lounge in Apple Maps"
              >
                <span>Apple Maps</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="mt-6">
              <div className="b-font text-[11px] tracking-[0.26em] text-charcoal/55">
                OPENING HOURS
              </div>
              <div className="b-font mt-2 text-[15px] text-charcoal/70">
                {OPENING_HOURS}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden w-px bg-black/10 md:block" />

          {/* CONTACT */}
          <div id="contact">
            <div className="section-title text-center md:text-left">CONTACT</div>

            <div className="mt-3 h-px w-full bg-black/10" />

            <div className="b-font mt-6 text-[15px] text-charcoal/70">
              <div className="text-[16px] font-medium text-charcoal/80">
                Graze Lounge
              </div>

              <a
                href={telLink(PHONE)}
                onClick={() =>
                  trackEvent("phone_click", {
                    event_label: PHONE,
                  })
                }
                className="mt-2 inline-block text-[15px] font-medium transition-colors hover:text-[var(--gold)]"
                aria-label={`Call Graze Lounge on ${PHONE}`}
              >
                {PHONE}
              </a>
            </div>

            {/* SOCIAL LINKS */}
            <div className="mt-6 flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("social_click", {
                    event_label: "Instagram",
                    link_url: INSTAGRAM_URL,
                  })
                }
                className="pill flex items-center gap-2 transition hover:text-[var(--gold)]"
                aria-label="Open Graze Lounge Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm4.25 5.25A4.75 4.75 0 1 0 16.75 12 4.76 4.76 0 0 0 12 7.25zm0 7.75A3 3 0 1 1 15 12a3 3 0 0 1-3 3zm5-8.75a1 1 0 1 1 1-1 1 1 0 0 1-1 1z" />
                </svg>
                Instagram
              </a>

              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("social_click", {
                    event_label: "Facebook",
                    link_url: FACEBOOK_URL,
                  })
                }
                className="pill flex items-center gap-2 transition hover:text-[var(--gold)]"
                aria-label="Open Graze Lounge Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M13 22v-9h3l1-4h-4V7a2 2 0 0 1 2-2h2V1h-3a5 5 0 0 0-5 5v3H6v4h3v9z" />
                </svg>
                Facebook
              </a>
            </div>

            <div className="mt-6 space-y-2">
              <div className="b-font text-xs text-[var(--botanical)]">
                ✓ Walk-ins welcome
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hairline" />
    </section>
  );
}
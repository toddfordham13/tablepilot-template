"use client";

const ADDRESS_LINE = "5 Ippokratous St, 5330 Ayia Napa, Cyprus";
const OPENING_HOURS = "Mon–Sun  |  4:00 PM — Late";
const PHONE = "+357 943 24677";

const INSTAGRAM_URL = "https://www.instagram.com/graze_lounge/";
const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61588374581854";

/**
 * To stop maps pointing to a random house, prefer ONE of:
 * 1) GOOGLE_MAPS_PLACE_ID (best)
 * 2) MAPS_COORDS (e.g. "34.989123,33.999456")
 *
 * Set in Vercel:
 * NEXT_PUBLIC_GOOGLE_MAPS_PLACE_ID=
 * NEXT_PUBLIC_MAPS_COORDS=
 */
const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLACE_ID || "";
const COORDS = process.env.NEXT_PUBLIC_MAPS_COORDS || "";

function mapQuery() {
  if (PLACE_ID) return `place_id:${PLACE_ID}`;
  if (COORDS) return COORDS;
  return ADDRESS_LINE;
}

function mapEmbedUrl() {
  const q = encodeURIComponent(mapQuery());
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

function mapsDirectionsUrl() {
  if (PLACE_ID) {
    return `https://www.google.com/maps/dir/?api=1&destination_place_id=${encodeURIComponent(
      PLACE_ID
    )}`;
  }
  const q = encodeURIComponent(mapQuery());
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

function appleMapsDirectionsUrl() {
  const daddr = encodeURIComponent(mapQuery());
  return `https://maps.apple.com/?daddr=${daddr}`;
}

function telLink(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

function fireEvent(name: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", name, params || {});
  }
}

export default function FindContact() {
  const googleUrl = mapsDirectionsUrl();
  const appleUrl = appleMapsDirectionsUrl();

  return (
    <section id="find" className="marble-soft">
      <div className="container-shell py-14">
        <div className="grid gap-14 md:grid-cols-[1fr_auto_1fr] md:gap-16">
          {/* FIND US */}
          <div>
            <div className="section-title text-center md:text-left">
              FIND US
            </div>

            <div className="mt-3 h-px w-full bg-black/10" />

            <div className="mt-6 overflow-hidden rounded-[14px] bg-white/30 ring-1 ring-black/10">
              <iframe
                title="Graze Lounge map"
                src={mapEmbedUrl()}
                className="h-[220px] sm:h-[260px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="b-font mt-5 text-[15px] text-charcoal/70">
              {ADDRESS_LINE}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {/* GOOGLE MAPS */}
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  fireEvent("directions_click", {
                    method: "google_maps",
                    destination: mapQuery(),
                  })
                }
                className="pill inline-flex items-center gap-2 hover:text-[var(--gold)] transition"
              >
                <span>Google Maps</span>
                <span aria-hidden="true">→</span>
              </a>

              {/* APPLE MAPS */}
              <a
                href={appleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  fireEvent("directions_click", {
                    method: "apple_maps",
                    destination: mapQuery(),
                  })
                }
                className="pill inline-flex items-center gap-2 hover:text-[var(--gold)] transition"
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
          <div className="hidden md:block w-px bg-black/10" />

          {/* CONTACT */}
          <div id="contact">
            <div className="section-title text-center md:text-left">
              CONTACT
            </div>

            <div className="mt-3 h-px w-full bg-black/10" />

            <div className="b-font mt-6 text-[15px] text-charcoal/70">
              <div className="text-[16px] text-charcoal/80 font-medium">
                Graze Lounge
              </div>

              <a
                href={telLink(PHONE)}
                onClick={() =>
                  fireEvent("phone_click", {
                    phone_number: PHONE,
                  })
                }
                className="mt-2 inline-block text-[15px] font-medium transition-colors hover:text-[var(--gold)]"
              >
                {PHONE}
              </a>
            </div>

            {/* SOCIAL */}
            <div className="mt-6 flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  fireEvent("social_click", { platform: "instagram" })
                }
                className="pill flex items-center gap-2 hover:text-[var(--gold)] transition"
              >
                Instagram
              </a>

              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  fireEvent("social_click", { platform: "facebook" })
                }
                className="pill flex items-center gap-2 hover:text-[var(--gold)] transition"
              >
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
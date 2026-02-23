const ADDRESS_LINE = "5 Ippokratous St, 5330 Ayia Napa, Cyprus";
const OPENING_HOURS = "Mon–Sun  |  4:00 PM — Late";
const PHONE = "+357 943 24677";

const INSTAGRAM_URL = "https://www.instagram.com/graze_lounge/";
const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61588374581854";

function mapEmbedUrl(address: string) {
  const q = encodeURIComponent(address);
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

function telLink(phone: string) {
  const cleaned = phone.replace(/\s+/g, "");
  return `tel:${cleaned}`;
}

export default function FindContact() {
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
                src={mapEmbedUrl(ADDRESS_LINE)}
                className="h-[170px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="b-font mt-5 text-[15px] text-charcoal/70">
              {ADDRESS_LINE}
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
                className="mt-2 inline-block text-[15px] font-medium transition-colors hover:text-[var(--gold)]"
              >
                {PHONE}
              </a>
            </div>

            {/* SOCIAL LINKS */}
            <div className="mt-6 flex gap-3">

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="pill flex items-center gap-2 hover:text-[var(--gold)] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm4.25 5.25A4.75 4.75 0 1 0 16.75 12 4.76 4.76 0 0 0 12 7.25zm0 7.75A3 3 0 1 1 15 12a3 3 0 0 1-3 3zm5-8.75a1 1 0 1 1 1-1 1 1 0 0 1-1 1z" />
                </svg>
                Instagram
              </a>

              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="pill flex items-center gap-2 hover:text-[var(--gold)] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
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
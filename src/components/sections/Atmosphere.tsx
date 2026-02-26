import Link from "next/link";

export default function Atmosphere() {
  const features = [
    { title: "Sunset Starts", desc: "Golden-hour drinks and easy conversation." },
    { title: "Late-Night Rhythm", desc: "Music-led atmosphere that builds." },
    { title: "Central Ayia Napa", desc: "Right in the heart of the action." },
  ] as const;

  return (
    <section className="px-4 sm:px-6 pb-12 sm:pb-14">
      <div className="rounded-3xl bg-white/60 px-5 sm:px-10 py-10 sm:py-14 ring-1 ring-[#d9d9d9] shadow-[0_18px_55px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
          {/* LEFT COPY */}
          <div>
            <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#1f1f1f]/60">
              Atmosphere
            </p>

            <h2 className="mt-3 text-2xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#1f1f1f]">
              Marble, gold and warm light — built for long nights.
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#1f1f1f]/70 leading-relaxed max-w-xl">
              Graze Lounge is designed for laid-back evenings that build into
              late-night energy — crafted cocktails, great music, and a space
              that feels effortless from the first drink to the last.
            </p>

            <div className="mt-7 sm:mt-8 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
              {features.map((f) => (
                <Feature key={f.title} title={f.title} desc={f.desc} />
              ))}
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/gallery"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-[#1f1f1f] ring-1 ring-[#d9d9d9] hover:bg-[#f5f4f1] transition"
                aria-label="View the Graze Lounge gallery"
              >
                View Gallery
              </Link>

              <Link
                href="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white bg-[#1f1f1f] hover:bg-[#2a2a2a] shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition"
                aria-label="View the Graze Lounge menu"
              >
                View Menu
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <Link
              href="/gallery"
              className="block relative overflow-hidden rounded-2xl ring-1 ring-[#d9d9d9]/70 shadow-[0_18px_55px_rgba(0,0,0,0.12)]"
              aria-label="Open gallery"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/images/hero/hero-2.jpg"
                  alt="Graze Lounge atmosphere"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

                {/* subtle hover affordance */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/5" />
              </div>
            </Link>

            <div className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-[#f5f4f1] blur-2xl opacity-70" />
          </div>
        </div>

        <div className="mt-10 sm:mt-12 h-px w-full bg-gradient-to-r from-transparent via-[#d9d9d9] to-transparent" />
      </div>
    </section>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-[#f5f4f1] px-4 py-4 ring-1 ring-[#d9d9d9]/60 shadow-[0_8px_25px_rgba(0,0,0,0.04)]">
      <p className="text-sm font-semibold text-[#1f1f1f]">{title}</p>
      <p className="mt-1 text-sm text-[#1f1f1f]/70 leading-relaxed">{desc}</p>
    </div>
  );
}
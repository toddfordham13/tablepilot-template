export default function Discover() {
  const items = [
    {
      title: "Gallery",
      desc: "A first look at the vibe — cocktails, warm light and late-night energy.",
      href: "/gallery",
      cta: "View Gallery",
      img: "/images/hero/hero-3.jpg",
      alt: "Graze Lounge gallery preview",
    },
    {
      title: "Menu",
      desc: "Crowd favourites, made properly — cocktails, spritz, classics and more.",
      href: "/menu",
      cta: "View Menu",
      img: "/images/cocktails/espresso-martini.jpg",
      alt: "Graze cocktail menu preview",
    },
    {
      title: "Find Us",
      desc: "Central Ayia Napa — easy to reach, hard to leave.",
      href: "/#find",
      cta: "Get Directions",
      img: "/images/hero/hero-2.jpg",
      alt: "Graze Lounge location preview",
    },
  ];

  return (
    <section className="px-6 pb-14">
      <div className="rounded-3xl bg-[#f5f4f1] px-6 py-12 sm:px-10 sm:py-14 ring-1 ring-[#d9d9d9] shadow-[0_18px_55px_rgba(0,0,0,0.08)]">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#1f1f1f]/60">
            Discover Graze
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#1f1f1f]">
            Everything you need — in one place.
          </h2>
          <p className="mt-3 mx-auto max-w-2xl text-[#1f1f1f]/70 leading-relaxed">
            Explore the vibe, browse the cocktails, and find us in the heart of Ayia Napa.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it) => (
            <a
              key={it.title}
              href={it.href}
              className="group overflow-hidden rounded-2xl bg-white/70 ring-1 ring-[#d9d9d9]/70 shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_55px_rgba(0,0,0,0.12)] transition"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={it.img}
                  alt={it.alt}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-lg font-semibold text-white">{it.title}</p>
                  <p className="mt-1 text-sm text-white/85 leading-relaxed">
                    {it.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm font-medium text-[#1f1f1f]">
                  {it.cta}
                </span>
                <span className="text-[#1f1f1f]/50 group-hover:text-[#1f1f1f] transition">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-[#d9d9d9] to-transparent" />
      </div>
    </section>
  );
}
// src/components/sections/SignatureCocktails.tsx

export default function SignatureCocktails() {
  const cocktails = [
    {
      name: "Pornstar Martini",
      img: "/images/cocktails/pornstar-martini.jpg",
      desc: "Vanilla vodka, passionfruit purée and vanilla syrup — served with a chilled champagne sidecar.",
      alt: "Pornstar Martini with champagne sidecar",
    },
    {
      name: "Espresso Martini",
      img: "/images/cocktails/espresso-martini.jpg",
      desc: "Vodka, Kahlua and fresh espresso — rich, smooth and built for long nights.",
      alt: "Espresso Martini",
    },
    {
      name: "Old Fashioned",
      img: "/images/cocktails/old-fashioned.jpg",
      desc: "Bourbon, sugar and angostura bitters — stirred down and finished with a subtle splash of soda.",
      alt: "Old Fashioned cocktail",
    },
    {
      name: "Amaretto Sour",
      img: "/images/cocktails/amaretto-sour.jpg",
      desc: "Amaretto, fresh lemon and sugar syrup — brightened with a touch of soda for a smooth citrus lift.",
      alt: "Amaretto Sour in rocks glass",
    },
  ];

  return (
    <section className="px-4 sm:px-6 pt-4 pb-12 sm:pb-14">
      <div className="rounded-3xl bg-[#f5f4f1] px-5 sm:px-10 py-10 sm:py-14 ring-1 ring-[#d9d9d9] shadow-[0_18px_55px_rgba(0,0,0,0.08)]">
        <div className="max-w-5xl">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#1f1f1f]/60">
            Signature Cocktails
          </p>

          <h2 className="mt-3 text-2xl sm:text-4xl font-semibold tracking-tight text-[#1f1f1f]">
            Crafted classics. Elevated presentation.
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#1f1f1f]/70 max-w-2xl leading-relaxed">
            Four crowd favourites, made properly — designed for sunset starts and late-night finishes.
          </p>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cocktails.map((c) => (
            <article
              key={c.name}
              className="group overflow-hidden rounded-2xl ring-1 ring-[#d9d9d9]/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_22px_65px_rgba(0,0,0,0.14)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.alt}
                  className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    {c.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-white/85 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 h-px w-full bg-gradient-to-r from-transparent via-[#d9d9d9] to-transparent" />
      </div>
    </section>
  );
}
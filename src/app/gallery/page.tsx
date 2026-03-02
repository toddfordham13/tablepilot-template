// src/app/gallery/page.tsx

type GalleryImage = { src: string; alt: string };

export default function GalleryPage() {
  const images: GalleryImage[] = [
    { src: "/images/gallery/pornstar-martini.jpg", alt: "Pornstar Martini" },
    { src: "/images/gallery/espresso-martini.jpg", alt: "Espresso Martini" },
    { src: "/images/gallery/amaretto-sour.jpg", alt: "Amaretto Sour" },
    { src: "/images/gallery/classic-mojito.jpg", alt: "Classic Mojito" },
    { src: "/images/gallery/strawberry-margarita.jpg", alt: "Strawberry Margarita" },
    { src: "/images/gallery/long-island.jpg", alt: "Long Island Iced Tea" },
    { src: "/images/gallery/mai-tai.jpg", alt: "Mai Tai" },
    { src: "/images/gallery/negroni.jpg", alt: "Negroni" },
    { src: "/images/gallery/marble-bar-wide.jpg", alt: "Marble bar wide shot" },
    { src: "/images/gallery/bartender-pour.jpg", alt: "Bartender pouring" },
    { src: "/images/gallery/candle-table-detail.jpg", alt: "Candle and marble detail" },
    { src: "/images/gallery/cheers-shot.jpg", alt: "Guests clinking glasses" },
  ];

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-[1120px]">
        <div className="rounded-3xl bg-white/60 px-6 py-14 sm:px-10 sm:py-16 ring-1 ring-[#d9d9d9] shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="mb-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1f1f1f]/70 hover:text-[#1f1f1f] transition"
            >
              ← Back to Home
            </a>
          </div>

          <div className="text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#1f1f1f]/60">
              Gallery
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.02em] text-[#1f1f1f]">
              A glimpse of the Graze vibe
            </h1>
            <p className="mt-3 mx-auto max-w-2xl text-[#1f1f1f]/70 leading-relaxed">
              Cocktails, atmosphere and the details that make the night.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, idx) => (
              <a
                key={`${img.src}-${idx}`}
                href={img.src}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl bg-[#f5f4f1] ring-1 ring-[#d9d9d9]/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_22px_65px_rgba(0,0,0,0.14)] hover:-translate-y-1 transition-all duration-300"
                title="Open image"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-[#d9d9d9] to-transparent" />

          <div className="mt-10 text-center">
            <a
              href="/menu"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white bg-[#1f1f1f] hover:bg-[#2a2a2a] shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition"
            >
              View Menu
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
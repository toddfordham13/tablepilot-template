"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const cocktails = [
  {
    name: "Espresso Martini",
    desc: "Vodka, coffee liqueur, fresh espresso — smooth, bold and late-night ready.",
    img: "/images/cocktails/espresso-martini.jpg",
  },
  {
    name: "Old Fashioned",
    desc: "Bourbon, sugar, bitters — simple, strong and timeless.",
    img: "/images/cocktails/old-fashioned.jpg",
  },
  {
    name: "Pornstar Martini",
    desc: "Vanilla vodka, passionfruit, prosecco on the side — a crowd favourite.",
    img: "/images/cocktails/pornstar-martini.jpg",
  },
  {
    name: "Amaretto Sour",
    desc: "Amaretto, citrus, silky foam — sweet with a sharp edge.",
    img: "/images/cocktails/amaretto-sour.jpg",
  },
];

export default function SignatureCocktails() {
  const cardsRef = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const els = cardsRef.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center">
          <p className="text-xs tracking-[0.35em] uppercase text-[#1f1f1f]/60">
            Signature Drinks
          </p>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-[#1f1f1f]">
            Crafted properly. Poured with intent.
          </h2>

          <p className="mt-3 mx-auto max-w-2xl text-[#1f1f1f]/70 leading-relaxed">
            From bold espresso martinis to timeless classics — our menu balances
            crowd favourites with cocktails done right.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cocktails.map((drink, i) => (
            <article
              key={drink.name}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_12px_40px_rgba(0,0,0,0.08)]
                         transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]
                         opacity-0 translate-y-8"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={drink.img}
                  alt={drink.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition duration-700 group-hover:scale-[1.05]"
                  priority={i === 0}
                />

                {/* Film grain overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"2\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')",
                  }}
                />
              </div>

              {/* Copy */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#1f1f1f]">
                  {drink.name}
                </h3>
                <p className="mt-2 text-sm text-[#1f1f1f]/70 leading-relaxed">
                  {drink.desc}
                </p>

                {/* subtle accent line */}
                <div className="mt-4 h-px w-10 bg-[#d8c08a]/60 transition-all duration-500 group-hover:w-16" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-xs sm:text-sm font-semibold tracking-[0.12em] uppercase
                       text-white bg-[#6d7f6c] hover:bg-[#5f705e]
                       shadow-[0_10px_35px_rgba(0,0,0,0.10)] transition"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
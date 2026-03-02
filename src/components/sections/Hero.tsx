"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Slide = { src: string };

export default function Hero() {
  const slides = useMemo<Slide[]>(
    () => [
      { src: "/images/hero/hero-1.jpg" },
      { src: "/images/hero/hero-2.jpg" },
      { src: "/images/hero/hero-3.jpg" },
    ],
    []
  );

  const [available, setAvailable] = useState<Slide[]>([]);
  const [frontIndex, setFrontIndex] = useState(0);
  const [backIndex, setBackIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);

  /* ------------------ Preload images ------------------ */
  useEffect(() => {
    let cancelled = false;

    Promise.all(
      slides.map(
        (s) =>
          new Promise<Slide | null>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(s);
            img.onerror = () => resolve(null);
            img.src = s.src;
          })
      )
    ).then((res) => {
      if (cancelled) return;

      const ok = res.filter(Boolean) as Slide[];
      const finalList = ok.length ? ok : [{ src: "/images/hero/hero-1.jpg" }];

      setAvailable(finalList);
      setFrontIndex(0);
      setBackIndex(finalList.length > 1 ? 1 : 0);
      setIsFading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [slides]);

  /* ------------------ Auto slide ------------------ */
  const goNext = () => {
    if (available.length <= 1) return;

    const next = (frontIndex + 1) % available.length;
    setBackIndex(next);
    setIsFading(true);

    if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = window.setTimeout(() => {
      setFrontIndex(next);
      setIsFading(false);
    }, 800);
  };

  useEffect(() => {
    if (available.length <= 1) return;

    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(goNext, 6000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [available.length, frontIndex]);

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    };
  }, []);

  const frontSrc = available[frontIndex]?.src ?? "/images/hero/hero-1.jpg";
  const backSrc = available[backIndex]?.src ?? frontSrc;

  return (
    <section className="container-shell">
      <div className="rounded-3xl border border-black/10 bg-white/40 p-4 shadow-[0_15px_45px_rgba(0,0,0,0.08)]">
        <div className="relative overflow-hidden rounded-[26px] border border-black/10">

          {/* Background layers */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${frontSrc})` }}
            />
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
              style={{
                backgroundImage: `url(${backSrc})`,
                opacity: isFading ? 1 : 0,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative flex items-center px-12 min-h-[520px]">
            <div className="max-w-[640px]">
              <h1 className="h-font text-[62px] leading-[1.05] text-white">
                Cocktails & music
                <br />
                in the heart of
                <br />
                Ayia Napa
              </h1>

              <p className="mt-6 text-sm tracking-[0.22em] text-white/85">
                Warm light · Great drinks · Good people
              </p>

              <div className="mt-8 flex gap-3">
                <Link
                  href="#find"
                  className="rounded-full border border-white/40 bg-white/25 px-6 py-2 text-xs tracking-[0.18em] text-white hover:bg-white/35 transition"
                >
                  GET DIRECTIONS
                </Link>

                <Link
                  href="/menu"
                  className="rounded-full bg-[var(--botanical)] px-6 py-2 text-xs tracking-[0.18em] text-white hover:opacity-95 transition"
                >
                  VIEW MENU
                </Link>
              </div>

              {/* Slide dots */}
              {available.length > 1 && (
                <div className="mt-10 flex gap-2">
                  {available.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setBackIndex(i);
                        setIsFading(true);
                        if (fadeTimeoutRef.current)
                          window.clearTimeout(fadeTimeoutRef.current);
                        fadeTimeoutRef.current = window.setTimeout(() => {
                          setFrontIndex(i);
                          setIsFading(false);
                        }, 800);
                      }}
                      className={`h-2 w-2 rounded-full transition ${i === frontIndex
                          ? "bg-white"
                          : "bg-white/40 hover:bg-white/70"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
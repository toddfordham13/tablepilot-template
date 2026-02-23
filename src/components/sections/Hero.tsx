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
      setBackIndex(0);
      setIsFading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [slides]);

  const goNext = () => {
    if (available.length <= 1) return;

    const next = (frontIndex + 1) % available.length;

    setBackIndex(next);
    setIsFading(true);

    if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = window.setTimeout(() => {
      setFrontIndex(next);
      setIsFading(false);
    }, 900);
  };

  useEffect(() => {
    if (available.length <= 1) return;

    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(goNext, 6000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <section className="container-shell pt-8 sm:pt-10">
      <div className="rounded-3xl border border-black/15 bg-white/25 p-3 sm:p-4">
        <div className="relative overflow-hidden rounded-[26px] border border-black/15">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${frontSrc})` }}
            />
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-900"
              style={{
                backgroundImage: `url(${backSrc})`,
                opacity: isFading ? 1 : 0,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
            <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.18)]" />
          </div>

          <div className="relative h-[440px] sm:h-[520px] px-6 sm:px-10 py-10 sm:py-12 md:px-14">
            <div className="max-w-[560px]">
              <h1 className="h-font text-[44px] sm:text-[58px] md:text-[62px] leading-[1.05] tracking-[0.01em] text-white">
                Cocktails
                <br />
                in the heart of
                <br />
                Ayia Napa
              </h1>

              <p className="mt-6 sm:mt-8 b-font text-xs sm:text-sm tracking-[0.22em] text-white/85">
                Relaxed evenings · Great music
                <br />
                Good company
              </p>

              <div className="mt-8 sm:mt-10 flex flex-wrap gap-3">
                <Link
                  href="/#find"
                  className="pill"
                  style={{
                    background: "rgba(255,255,255,0.38)",
                    borderColor: "rgba(255,255,255,0.35)",
                  }}
                >
                  FIND US
                </Link>

                <Link href="/#order" className="pill pill-primary">
                  ORDER ONLINE
                </Link>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const slides = [
  {
    src: "/images/bodega/bodega-hero.jpg",
    alt: "The Bodega sandwich close-up",
    label: "Coq Joke",
  },
  {
    src: "/images/bodega/bodega-sandwich-hero.jpg",
    alt: "The Bodega stacked sandwich",
    label: "The Laughing Cow",
  },
  {
    src: "/images/bodega/gallery-2.jpg",
    alt: "The Bodega stall",
    label: "Norwich Market stall",
  },
]

export default function BodegaHero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [paused])

  const next = () => setIndex((prev) => (prev + 1) % slides.length)
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section
      data-bodega-hero="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#e0b22e",
        borderBottom: "4px solid #111",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.1,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "4px 4px, 4px 4px",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 14% 28%, rgba(255,255,255,0.16), transparent 22%), radial-gradient(circle at 82% 24%, rgba(0,0,0,0.08), transparent 26%)",
        }}
      />

      <div className="bodega-bg-wordmark">
        STREET FOOD
        <br />
        STACKED HIGH
      </div>

      <div className="bodega-hero-shell">
        <div className="bodega-hero-copy">
          <div className="bodega-kicker">NYC deli energy. Norwich Market.</div>

          <h2 className="bodega-title">
            Stacked high.
            <br />
            Loud flavour.
          </h2>

          <p className="bodega-body">
            Big sandwiches. Proper fillings. No quiet flavours. The Bodega
            brings full deli attitude straight into Norwich Market.
          </p>

          <div className="bodega-actions">
            <a href="#menu" className="bodega-btn bodega-btn-dark">
              Menu
            </a>

            <a href="#find" className="bodega-btn bodega-btn-red">
              Find The Stall
            </a>
          </div>
        </div>

        <div className="bodega-carousel">
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              className={`bodega-slide ${i === index ? "is-active" : ""}`}
            >
              <div className="bodega-slide-shadow" />

              <div className="bodega-slide-card">
                <div className="bodega-slide-image-wrap">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    unoptimized
                    sizes="(max-width: 760px) 100vw, (max-width: 1180px) 460px, 540px"
                    style={{
                      objectFit: "cover",
                      objectPosition: i === 2 ? "center top" : "center",
                    }}
                  />
                </div>

                <div className="bodega-slide-footer">
                  <span>{slide.label}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={prev}
            aria-label="Previous slide"
            className="bodega-carousel-arrow bodega-carousel-arrow-left"
          >
            ‹
          </button>

          <button
            onClick={next}
            aria-label="Next slide"
            className="bodega-carousel-arrow bodega-carousel-arrow-right"
          >
            ›
          </button>

          <div className="bodega-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`bodega-dot ${i === index ? "is-active" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .bodega-bg-wordmark {
          position: absolute;
          top: 24px;
          left: 48px;
          right: 48px;
          pointer-events: none;
          font-family: Anton, "Bebas Neue", sans-serif;
          font-size: 210px;
          line-height: 0.82;
          letter-spacing: -0.05em;
          text-transform: uppercase;
          color: rgba(196, 22, 28, 0.2);
          user-select: none;
          white-space: pre-line;
        }

        .bodega-hero-shell {
          position: relative;
          z-index: 2;
          max-width: 1500px;
          margin: 0 auto;
          min-height: 700px;
          padding: 48px 36px 44px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 540px);
          gap: 34px;
          align-items: center;
        }

        .bodega-hero-copy {
          position: relative;
          z-index: 2;
          max-width: 720px;
        }

        .bodega-kicker {
          display: inline-block;
          margin-bottom: 22px;
          padding: 10px 16px;
          background: #111;
          color: #f7f3ee;
          border: 2px solid #111;
          font-family: Anton, "Bebas Neue", sans-serif;
          font-size: 18px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
        }

        .bodega-title {
          margin: 0;
          font-family: Anton, "Bebas Neue", sans-serif;
          font-size: 118px;
          line-height: 0.84;
          letter-spacing: -0.05em;
          text-transform: uppercase;
          color: #f7f3ee;
          text-shadow: 2px 2px 0 #111, 5px 5px 0 rgba(179, 18, 23, 0.7);
        }

        .bodega-body {
          margin: 22px 0 30px;
          max-width: 600px;
          color: #1a120f;
          font-size: 23px;
          line-height: 1.45;
          font-weight: 700;
        }

        .bodega-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .bodega-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 60px;
          padding: 0 26px;
          border: 2px solid #111;
          text-decoration: none;
          font-family: Anton, "Bebas Neue", sans-serif;
          font-size: 22px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.14);
        }

        .bodega-btn-dark {
          background: #111;
          color: #f7f3ee;
        }

        .bodega-btn-red {
          background: #c4161c;
          color: #fff;
        }

        .bodega-carousel {
          position: relative;
          z-index: 2;
          justify-self: end;
          width: 100%;
          max-width: 540px;
          min-height: 620px;
        }

        .bodega-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: translateY(14px) rotate(-1deg);
          transition: opacity 0.45s ease, transform 0.45s ease;
          pointer-events: none;
        }

        .bodega-slide.is-active {
          opacity: 1;
          transform: translateY(0) rotate(-3deg);
          pointer-events: auto;
        }

        .bodega-slide-shadow {
          position: absolute;
          inset: 30px 0 0 38px;
          background: rgba(0, 0, 0, 0.2);
          filter: blur(12px);
          transform: scale(0.96);
        }

        .bodega-slide-card {
          position: relative;
          width: 100%;
          height: 100%;
          background: #f7f3ee;
          border: 3px solid #111;
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.24);
          overflow: hidden;
        }

        .bodega-slide-image-wrap {
          position: absolute;
          inset: 0 0 64px 0;
        }

        .bodega-slide-footer {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 64px;
          background: #f7f3ee;
          border-top: 3px solid #111;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          font-family: Anton, "Bebas Neue", sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #111;
          font-size: 18px;
        }

        .bodega-carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 52px;
          height: 52px;
          border: 2px solid #111;
          color: #fff;
          cursor: pointer;
          font-size: 30px;
          line-height: 1;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .bodega-carousel-arrow-left {
          left: 14px;
          background: #111;
        }

        .bodega-carousel-arrow-right {
          right: 14px;
          background: #c4161c;
        }

        .bodega-dots {
          position: absolute;
          right: 12px;
          bottom: 12px;
          display: flex;
          gap: 8px;
          z-index: 3;
        }

        .bodega-dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          border: 2px solid #111;
          padding: 0;
          background: #f7f3ee;
          cursor: pointer;
        }

        .bodega-dot.is-active {
          background: #c4161c;
        }

        @media (max-width: 1180px) {
          .bodega-bg-wordmark {
            font-size: 150px;
            left: 28px;
            right: 28px;
          }

          .bodega-hero-shell {
            grid-template-columns: 1fr;
            min-height: 0;
            padding: 42px 28px 44px;
            gap: 30px;
          }

          .bodega-title {
            font-size: 86px;
          }

          .bodega-carousel {
            justify-self: start;
            max-width: 460px;
            min-height: 560px;
          }
        }

        @media (max-width: 760px) {
          .bodega-bg-wordmark {
            top: 18px;
            left: 18px;
            right: 18px;
            font-size: 88px;
          }

          .bodega-hero-shell {
            padding: 26px 16px 38px;
            gap: 24px;
          }

          .bodega-kicker {
            margin-bottom: 16px;
            padding: 9px 14px;
            font-size: 15px;
          }

          .bodega-title {
            font-size: 48px;
            line-height: 0.88;
            letter-spacing: -0.04em;
            text-shadow: 2px 2px 0 #111, 4px 4px 0 rgba(179, 18, 23, 0.65);
          }

          .bodega-body {
            margin: 18px 0 24px;
            max-width: 100%;
            font-size: 18px;
            line-height: 1.55;
          }

          .bodega-actions {
            gap: 12px;
          }

          .bodega-btn {
            min-height: 56px;
            padding: 0 20px;
            font-size: 19px;
            flex: 1 1 100%;
            width: 100%;
          }

          .bodega-carousel {
            justify-self: stretch;
            max-width: 100%;
            min-height: 420px;
          }

          .bodega-slide.is-active {
            transform: translateY(0) rotate(0deg);
          }

          .bodega-slide-shadow {
            inset: 18px 8px 0 8px;
          }

          .bodega-carousel-arrow {
            top: auto;
            bottom: 82px;
            transform: none;
            width: 44px;
            height: 44px;
            font-size: 24px;
          }

          .bodega-carousel-arrow-left {
            left: 10px;
          }

          .bodega-carousel-arrow-right {
            right: 10px;
          }

          .bodega-slide-footer {
            height: 58px;
            font-size: 15px;
            padding: 0 14px;
          }

          .bodega-dots {
            right: 12px;
            bottom: 10px;
          }
        }

        @media (max-width: 420px) {
          .bodega-title {
            font-size: 42px;
          }

          .bodega-bg-wordmark {
            font-size: 72px;
          }

          .bodega-carousel {
            min-height: 360px;
          }
        }
      `}</style>
    </section>
  )
}
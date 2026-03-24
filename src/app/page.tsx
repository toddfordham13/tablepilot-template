"use client"

import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <section className="relative min-h-screen">
        <div className="grid min-h-screen md:grid-cols-2">
          <Link
            href="/bodega"
            className="group relative isolate flex min-h-[50vh] overflow-hidden md:min-h-screen"
          >
            <Image
              src="/images/bodega/bodega-sandwich-hero.jpg"
              alt="The Bodega landing image"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover object-center transition duration-700 ease-out group-hover:scale-[1.04] group-hover:contrast-105"
            />

            <div className="absolute inset-0 bg-black/28" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/38 to-black/8" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(120,32,24,0.18),rgba(0,0,0,0.04)_42%,rgba(0,0,0,0.22))]" />
            <div className="absolute -right-[12%] top-1/2 h-[52vw] w-[52vw] -translate-y-1/2 rounded-full bg-[rgba(130,40,28,0.10)] blur-3xl transition duration-500 group-hover:bg-[rgba(130,40,28,0.16)]" />

            <div className="relative z-10 flex h-full w-full flex-col justify-between p-5 sm:p-8 md:p-10 lg:p-12">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/72 sm:text-sm">
                  Bodega
                </p>

                <div className="mt-3 sm:mt-4">
                  <Image
                    src="/images/bodega/logo.png"
                    alt="The Bodega logo"
                    width={220}
                    height={220}
                    className="h-auto w-[74px] drop-shadow-[0_18px_48px_rgba(0,0,0,0.46)] transition duration-500 group-hover:scale-[1.03] sm:w-[105px] md:w-[120px] lg:w-[135px]"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-x-0 bottom-0 h-[42vh] rounded-[26px] bg-gradient-to-t from-black/88 via-black/68 to-transparent sm:h-[44vh] sm:rounded-[32px]" />

                <div className="relative z-10 flex min-h-[34vh] flex-col justify-end rounded-[26px] p-5 sm:min-h-[38vh] sm:p-8 md:p-10">
                  <p
                    className="bodega-landing-title whitespace-nowrap uppercase text-[#f5f3ee]"
                    style={{
                      fontWeight: 900,
                      fontSize: "clamp(2.55rem, 10.5vw, 7rem)",
                      lineHeight: 0.9,
                      letterSpacing: "-0.04em",
                      textShadow: "0 10px 30px rgba(0,0,0,0.62)",
                    }}
                  >
                    BIG
                    <br />
                    SANDWICHES
                  </p>

                  <p
                    className="mt-3 uppercase text-white/92 sm:mt-4"
                    style={{
                      fontWeight: 800,
                      fontSize: "clamp(0.86rem, 3.25vw, 1.55rem)",
                      letterSpacing: "0.16em",
                    }}
                  >
                    Loud. Stacked. Unapologetic.
                  </p>

                  <div className="mt-5 sm:mt-8">
                    <div className="premium-cta-red relative overflow-hidden rounded-[22px] border border-white/15 sm:rounded-[26px]">
                      <div className="relative flex min-h-[90px] items-center justify-between gap-4 px-5 sm:min-h-[170px] sm:px-10 lg:min-h-[190px] lg:px-12">
                        <span
                          className="cta-label uppercase text-white"
                          style={{
                            fontWeight: 900,
                            fontSize: "clamp(1.1rem, 4.2vw, 3rem)",
                            letterSpacing: "0.12em",
                          }}
                        >
                          Enter Bodega
                        </span>

                        <span
                          className="cta-arrow text-white transition duration-300 group-hover:translate-x-2"
                          style={{
                            fontSize: "clamp(1.55rem, 5vw, 4rem)",
                            lineHeight: 1,
                          }}
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/fuego"
            className="group relative isolate flex min-h-[50vh] overflow-hidden md:min-h-screen"
          >
            <Image
              src="/images/fuego/landing.jpg"
              alt="Fuego landing image"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover object-center transition duration-700 ease-out group-hover:scale-[1.04] group-hover:contrast-105"
            />

            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/42 to-black/8" />
            <div className="absolute inset-0 bg-[linear-gradient(225deg,rgba(30,56,46,0.18),rgba(0,0,0,0.04)_42%,rgba(0,0,0,0.24))]" />
            <div className="absolute -left-[12%] top-1/2 h-[52vw] w-[52vw] -translate-y-1/2 rounded-full bg-[rgba(32,70,58,0.10)] blur-3xl transition duration-500 group-hover:bg-[rgba(32,70,58,0.16)]" />

            <div className="relative z-10 flex h-full w-full flex-col justify-between p-5 text-right sm:p-8 md:p-10 lg:p-12">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/72 sm:text-sm">
                  Fuego
                </p>

                <div className="mt-3 flex justify-end sm:mt-4">
                  <Image
                    src="/images/fuego/logo-v2.png"
                    alt="Fuego logo"
                    width={220}
                    height={220}
                    className="h-auto w-[74px] drop-shadow-[0_18px_48px_rgba(0,0,0,0.46)] transition duration-500 group-hover:scale-[1.03] sm:w-[105px] md:w-[120px] lg:w-[135px]"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-x-0 bottom-0 h-[42vh] rounded-[26px] bg-gradient-to-t from-black/90 via-black/70 to-transparent sm:h-[44vh] sm:rounded-[32px]" />

                <div className="relative z-10 flex min-h-[34vh] flex-col justify-end rounded-[26px] p-5 sm:min-h-[38vh] sm:p-8 md:p-10">
                  <p
                    className="fuego-landing-title font-serif uppercase text-[#f5f3ee]"
                    style={{
                      fontWeight: 900,
                      fontSize: "clamp(2.5rem, 10vw, 7.2rem)",
                      lineHeight: 0.9,
                      letterSpacing: "-0.04em",
                      textShadow: "0 10px 30px rgba(0,0,0,0.62)",
                    }}
                  >
                    PROPER
                    <br />
                    TACOS
                  </p>

                  <p
                    className="mt-3 ml-auto uppercase text-white/92 sm:mt-4"
                    style={{
                      fontWeight: 800,
                      fontSize: "clamp(0.84rem, 3.15vw, 1.55rem)",
                      letterSpacing: "0.16em",
                    }}
                  >
                    Smoke. Spice. Rule-breaking.
                  </p>

                  <div className="mt-5 sm:mt-8">
                    <div className="premium-cta-green relative overflow-hidden rounded-[22px] border border-white/15 sm:rounded-[26px]">
                      <div className="relative flex min-h-[90px] items-center justify-between gap-4 px-5 sm:min-h-[170px] sm:px-10 lg:min-h-[190px] lg:px-12">
                        <span
                          className="cta-arrow text-white transition duration-300 group-hover:-translate-x-2"
                          style={{
                            fontSize: "clamp(1.55rem, 5vw, 4rem)",
                            lineHeight: 1,
                          }}
                        >
                          ←
                        </span>

                        <span
                          className="cta-label uppercase text-white"
                          style={{
                            fontWeight: 900,
                            fontSize: "clamp(1.1rem, 4.2vw, 3rem)",
                            letterSpacing: "0.12em",
                          }}
                        >
                          Enter Fuego
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 hidden -translate-x-1/2 md:block">
          <div className="relative h-full w-[5px] bg-white/8">
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/40" />
          </div>
        </div>

        <style jsx>{`
          .premium-cta-red {
            background: linear-gradient(180deg, #c5151d, #8e0e14);
            box-shadow:
              0 30px 70px rgba(197, 21, 29, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
            transition: all 300ms ease;
          }

          .premium-cta-green {
            background: linear-gradient(180deg, #2f604c, #1e4336);
            box-shadow:
              0 30px 70px rgba(30, 67, 54, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.12);
            transition: all 300ms ease;
          }

          .group:hover .premium-cta-red {
            transform: translateY(-3px);
            box-shadow:
              0 40px 90px rgba(197, 21, 29, 0.45),
              inset 0 1px 0 rgba(255, 255, 255, 0.18);
          }

          .group:hover .premium-cta-green {
            transform: translateY(-3px);
            box-shadow:
              0 40px 90px rgba(30, 67, 54, 0.45),
              inset 0 1px 0 rgba(255, 255, 255, 0.16);
          }

          @media (min-width: 768px) and (max-width: 1024px) {
            .bodega-landing-title {
              font-size: clamp(2.15rem, 5.8vw, 4rem) !important;
              line-height: 0.92 !important;
            }

            .fuego-landing-title {
              font-size: clamp(2.3rem, 6vw, 4.2rem) !important;
              line-height: 0.92 !important;
            }

            .cta-label {
              font-size: clamp(1rem, 2.8vw, 1.55rem) !important;
              letter-spacing: 0.1em !important;
            }

            .cta-arrow {
              font-size: clamp(1.4rem, 3vw, 2rem) !important;
            }

            .premium-cta-red > div,
            .premium-cta-green > div {
              min-height: 100px !important;
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
          }
        `}</style>
      </section>
    </main>
  )
}
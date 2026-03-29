"use client"

import Image from "next/image"
import { useMemo, useState } from "react"

import type { MenuContent } from "@/lib/menus/types"

type BodegaSignatureSandwichesClientProps = {
  menuContent: MenuContent
}

export default function BodegaSignatureSandwichesClient({
  menuContent,
}: BodegaSignatureSandwichesClientProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const sandwiches = useMemo(() => {
    const signatureSection = menuContent.sections.find(
      (section) => section.id === "signature-sandwiches",
    )

    const sourceItems = signatureSection
      ? signatureSection.items
      : menuContent.items

    return sourceItems
      .filter((item) => item.visible)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }, [menuContent])

  if (sandwiches.length === 0) {
    return null
  }

  return (
    <section
      id="signature-sandwiches"
      style={{
        background: "linear-gradient(180deg, #1b0d0a 0%, #140907 100%)",
        borderTop: "4px solid #000",
        borderBottom: "4px solid #000",
        padding: "64px 20px 72px",
      }}
    >
      <div
        style={{
          maxWidth: "1560px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "36px",
          }}
        >
          <div
            className="bodega-signature-title"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "14px",
              backgroundColor: "#0f0f0f",
              padding: "16px 28px",
              border: "3px solid #000",
              boxShadow: "0 6px 0 #000",
              color: "#f7ead2",
              textTransform: "uppercase",
              fontWeight: 900,
              letterSpacing: "0.08em",
              fontSize: "clamp(1.4rem, 2.4vw, 2.2rem)",
            }}
          >
            <span style={{ color: "#f0b323", fontSize: "1.2em" }}>★</span>
            <span>{menuContent.title}</span>
            <span style={{ color: "#f0b323", fontSize: "1.2em" }}>★</span>
          </div>
        </div>

        <div
          className="bodega-signature-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "22px",
          }}
        >
          {sandwiches.map((item, index) => (
            <article
              key={item.id}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              style={{
                backgroundColor: "#111",
                border: "3px solid #000",
                boxShadow:
                  hovered === index
                    ? "0 24px 40px rgba(0,0,0,0.45)"
                    : "0 16px 32px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transform:
                  hovered === index
                    ? "translateY(-6px) scale(1.02)"
                    : "none",
                transition: "all 0.25s ease",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 5",
                  borderBottom: "3px solid #000",
                  backgroundColor: "#000",
                }}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                ) : null}
              </div>

              <div
                className="bodega-signature-card-copy"
                style={{
                  background: "linear-gradient(180deg,#1a1a1a 0%,#101010 100%)",
                  padding: "18px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "260px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-block",
                      marginBottom: "14px",
                      backgroundColor: item.accent ?? "#f0b323",
                      color: "#000",
                      padding: "7px 12px",
                      border: "2px solid #000",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontSize: "0.78rem",
                    }}
                  >
                    {item.tag ?? "Featured Stack"}
                  </div>

                  <h3
                    className="bodega-signature-card-title"
                    style={{
                      margin: "0 0 14px",
                      fontSize: "clamp(1.7rem,2vw,2.3rem)",
                      lineHeight: 0.95,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "-0.04em",
                      color: item.accent ?? "#f0b323",
                      textShadow: "3px 3px 0 #000",
                    }}
                  >
                    {item.name}
                  </h3>

                  <p
                    style={{
                      margin: "0 auto",
                      maxWidth: "300px",
                      color: "#f5ead6",
                      fontSize: "1rem",
                      lineHeight: 1.55,
                      fontWeight: 700,
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                {item.meta ? (
                  <p
                    style={{
                      margin: "14px 0 0",
                      color: "#f0b323",
                      fontSize: "0.92rem",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {item.meta}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 760px) {
          section#signature-sandwiches {
            padding: 44px 16px 52px !important;
          }

          .bodega-signature-title {
            padding: 12px 16px !important;
            gap: 10px !important;
            font-size: 1.05rem !important;
            letter-spacing: 0.05em !important;
            box-shadow: 0 4px 0 #000 !important;
          }

          .bodega-signature-grid {
            gap: 18px !important;
          }

          .bodega-signature-card-copy {
            min-height: 0 !important;
            padding: 16px 15px 18px !important;
          }

          .bodega-signature-card-title {
            font-size: 1.9rem !important;
          }
        }

        @media (max-width: 480px) {
          .bodega-signature-title {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  )
}
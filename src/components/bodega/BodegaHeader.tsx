"use client"

import Image from "next/image"

export default function BodegaHeader() {
  return (
    <section
      data-bodega-header="true"
      style={{
        backgroundColor: "#b31217",
        borderBottom: "4px solid #000",
        overflow: "hidden",
      }}
    >
      <div
        className="bodega-header-main"
        style={{
          maxWidth: "1800px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          padding: "20px 28px 14px",
          gap: "18px",
        }}
      >
        <div
          className="bodega-header-logo"
          style={{
            position: "relative",
            width: "96px",
            height: "96px",
            flexShrink: 0,
          }}
        >
          <Image
            src="/images/bodega/logo.png"
            alt="The Bodega logo"
            fill
            priority
            unoptimized
            style={{ objectFit: "contain" }}
          />
        </div>

        <div
          className="bodega-header-title"
          style={{
            fontFamily: "Anton, Bebas Neue, sans-serif",
            fontSize: "96px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: "#ffffff",
            lineHeight: 0.9,
            textShadow: `
              1px 1px 0 #7a0d10,
              2px 2px 0 #7a0d10,
              3px 3px 0 #7a0d10,
              4px 4px 0 #7a0d10,
              5px 5px 0 #7a0d10
            `,
          }}
        >
          THE BODEGA
        </div>
      </div>

      <div
        className="bodega-header-strip"
        style={{
          backgroundColor: "#2b6f3f",
          padding: "10px 28px",
          borderTop: "3px solid #000",
          borderBottom: "3px solid #000",
          fontFamily: "Anton, Bebas Neue, sans-serif",
          fontSize: "22px",
          fontWeight: 900,
          fontStyle: "italic",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#ffffff",
        }}
      >
        Sandwiches with attitude
      </div>

      <style jsx>{`
        @media (max-width: 760px) {
          .bodega-header-main {
            padding: 14px 16px 12px;
            gap: 12px;
          }

          .bodega-header-logo {
            width: 60px !important;
            height: 60px !important;
          }

          .bodega-header-title {
            font-size: 52px !important;
            line-height: 0.92 !important;
            text-shadow:
              1px 1px 0 #7a0d10,
              2px 2px 0 #7a0d10,
              3px 3px 0 #7a0d10 !important;
          }

          .bodega-header-strip {
            padding: 8px 16px !important;
            font-size: 15px !important;
            letter-spacing: 0.05em !important;
          }
        }

        @media (max-width: 420px) {
          .bodega-header-title {
            font-size: 44px !important;
          }

          .bodega-header-strip {
            font-size: 13px !important;
          }
        }
      `}</style>
    </section>
  )
}
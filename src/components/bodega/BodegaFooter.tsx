export default function BodegaFooter() {
  return (
    <footer
      style={{
        backgroundColor: "#120706",
        borderTop: "3px solid #000",
        color: "#f3e9d2",
      }}
    >
      <div
        className="mx-auto max-w-7xl px-6 py-10 md:px-8"
        style={{
          textAlign: "center",
        }}
      >
        <h3
          className="text-3xl font-black uppercase tracking-[0.08em]"
          style={{ marginBottom: "12px" }}
        >
          The Bodega
        </h3>

        <p
          className="text-sm font-semibold uppercase tracking-[0.12em]"
          style={{
            color: "#c9a24a",
            marginBottom: "20px",
          }}
        >
          Norwich Market · Stall 175 · Row H
        </p>

        <div
          className="flex justify-center gap-6"
          style={{ marginBottom: "24px" }}
        >
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-black uppercase tracking-[0.14em]"
            style={{
              color: "#f3e9d2",
            }}
          >
            Instagram
          </a>

          <a
            href="https://www.google.com/maps?q=Norwich%20Market"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-black uppercase tracking-[0.14em]"
            style={{
              color: "#f3e9d2",
            }}
          >
            Directions
          </a>
        </div>

        <p
          className="text-xs font-semibold uppercase tracking-[0.12em]"
          style={{
            color: "rgba(243,233,210,0.6)",
          }}
        >
          © {new Date().getFullYear()} The Bodega
        </p>
      </div>
    </footer>
  )
}
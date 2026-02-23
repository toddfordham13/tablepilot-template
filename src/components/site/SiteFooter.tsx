export default function SiteFooter() {
  return (
    <footer className="w-full">
      <div className="container-shell py-14 text-center">
        <div className="h-font text-[30px] tracking-[0.18em] text-[var(--gold)]">
          GRAZE
        </div>
        <div className="b-font -mt-1 text-[10px] tracking-[0.45em] text-[var(--gold)]">
          LOUNGE
        </div>

        <p className="b-font mt-8 text-xs text-charcoal/60">
          © {new Date().getFullYear()} Graze Lounge, Cyprus
        </p>
      </div>

      <div className="h-10 bg-[color-mix(in_srgb,var(--gold)_35%,white)]" />
    </footer>
  );
}

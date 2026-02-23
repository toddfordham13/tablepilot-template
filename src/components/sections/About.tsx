import Link from "next/link";

export default function About() {
  return (
    <section
      id="menu"
      style={{
        backgroundImage:
          "radial-gradient(900px 520px at 20% 0%, rgba(255,255,255,0.72), rgba(255,255,255,0) 60%)," +
          "radial-gradient(900px 620px at 90% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0) 62%)," +
          "url('/images/marble-soft.png')",
        backgroundSize: "auto, auto, cover",
        backgroundPosition: "center, center, center",
        backgroundRepeat: "no-repeat, no-repeat, no-repeat",
      }}
    >
      <div className="container-shell py-10 sm:py-14 text-center">
        <div className="section-title">ABOUT US</div>
        <div className="gold-hairline" />

        <p className="b-font mx-auto mt-5 sm:mt-6 max-w-[760px] text-[14px] sm:text-[15px] leading-7 text-charcoal/70">
          Graze Lounge is a relaxed cocktail bar in central Ayia Napa, Cyprus,
          designed for great drinks, music, and laid-back evenings with friends.
        </p>

        <div className="mt-7 sm:mt-8">
          <Link href="#menu" className="pill">
            <span aria-hidden>▸</span> VIEW MENU
          </Link>
        </div>
      </div>

      <div className="hairline" />
    </section>
  );
}
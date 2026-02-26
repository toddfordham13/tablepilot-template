import Link from "next/link";

export default function About() {
  return (
    <section
      id="about"
      className="relative"
      style={{
        backgroundColor: "#f5f4f1",
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

        <p className="b-font mx-auto mt-5 sm:mt-6 max-w-[780px] text-[15px] sm:text-[16px] leading-7 text-charcoal/75">
          A relaxed cocktail bar in central Ayia Napa — great drinks, music, and
          laid-back evenings with friends.
        </p>

        <p className="b-font mx-auto mt-3 max-w-[760px] text-[14px] sm:text-[15px] leading-7 text-charcoal/65">
          Come for the classics, stay for the atmosphere. Walk-ins welcome most
          nights.
        </p>

        <div className="mt-7 sm:mt-8 flex justify-center gap-3">
          <Link href="/menu" className="pill pill-primary" aria-label="View the menu">
            VIEW MENU
          </Link>
          <Link
            href="#find"
            className="pill"
            aria-label="Get directions to Graze Lounge"
          >
            <span aria-hidden>▸</span> GET DIRECTIONS
          </Link>
        </div>
      </div>

      <div className="hairline" />
    </section>
  );
}
import SiteHeader from "@/components/site/SiteHeader";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import SignatureCocktails from "@/components/sections/SignatureCocktails";
import Atmosphere from "@/components/sections/Atmosphere";
import Discover from "@/components/sections/Discover";
import FindContact from "@/components/sections/FindContact";
import SiteFooter from "@/components/site/SiteFooter";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Outer page padding */}
      <div className="px-4 sm:px-6 py-8 sm:py-10">
        <div className="mx-auto w-full max-w-[1120px]">
          {/* Header stays in the framed card */}
          <div className="page-card">
            <div className="page-wash">
              <SiteHeader />
            </div>
          </div>

          {/* Hero breathes outside the framed card */}
          <Hero />

          {/* Rest of page stays in the framed card */}
          <div className="page-card mt-6 sm:mt-8">
            <div className="page-wash">
              <About />
              <SignatureCocktails />
              <Atmosphere />
              <Discover />
              <div id="order" />
              <FindContact />
              <SiteFooter />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
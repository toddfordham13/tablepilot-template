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
      {/* Page padding + max-width */}
      <div className="px-4 sm:px-6 py-8 sm:py-10">
        <div className="mx-auto w-full max-w-[1120px]">
          {/* Header + Hero sit in the same "unframed" area */}
          <SiteHeader />
          <Hero />

          {/* Content suite in one consistent card */}
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
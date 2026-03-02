import SiteHeader from "@/components/site/SiteHeader";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import SignatureCocktails from "@/components/sections/SignatureCocktails";
import Atmosphere from "@/components/sections/Atmosphere";
import Discover from "@/components/sections/Discover";
import PrivateHire from "@/components/sections/PrivateHire";
import FindContact from "@/components/sections/FindContact";
import SiteFooter from "@/components/site/SiteFooter";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="px-4 sm:px-6 py-8 sm:py-10">
        <div className="mx-auto w-full max-w-[1120px]">
          <div className="page-card">
            <div className="page-wash">
              {/* This wrapper sets consistent spacing between major blocks */}
              <div className="flex flex-col gap-10 sm:gap-12">
                <SiteHeader />
                <Hero />
                <About />
                <SignatureCocktails />
                <Atmosphere />
                <Discover />

                {/* Keep anchor for any existing links (don’t break anything) */}


                {/* New: Private Hire (secondary conversion path) */}
                <PrivateHire />

                <FindContact />
                <SiteFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
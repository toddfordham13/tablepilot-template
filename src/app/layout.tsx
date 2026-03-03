import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MobileActionBar from "../components/site/MobileActionBar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_NAME = "Graze Lounge";
const SITE_URL = "https://grazelounge.com";

// Provided by you
const MAPS_URL =
  "https://www.google.co.uk/maps/search/Graze+Lounge+Ayia+Napa/@34.9898999,33.9966158,18z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D";
const GEO_LAT = 34.99001;
const GEO_LNG = 33.99777;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Graze Lounge | Cocktails in Ayia Napa",
    template: "%s | Graze Lounge",
  },
  description:
    "Graze Lounge is a relaxed cocktail bar in central Ayia Napa — crafted cocktails, great music, and laid-back evenings.",
  keywords: [
    "Graze Lounge",
    "Ayia Napa cocktails",
    "cocktail bar Ayia Napa",
    "Cyprus cocktail bar",
    "Ayia Napa nightlife",
    "cocktails and music",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Graze Lounge | Cocktails in Ayia Napa",
    description:
      "Crafted cocktails, great music, and laid-back evenings in the heart of Ayia Napa.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Graze Lounge",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Graze Lounge | Cocktails in Ayia Napa",
    description:
      "Crafted cocktails, great music, and laid-back evenings in the heart of Ayia Napa.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Fix: only reference files that exist (prevents 404 console errors)
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f4f1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    name: "Graze Lounge",
    url: SITE_URL,
    telephone: "+357 943 24677",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ippokratous 5",
      addressLocality: "Ayia Napa",
      postalCode: "5330",
      addressCountry: "CY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO_LAT,
      longitude: GEO_LNG,
    },
    hasMap: MAPS_URL,
    servesCuisine: "Cocktails",
    areaServed: "Ayia Napa",
    priceRange: "€€",
    sameAs: [
      "https://www.instagram.com/graze_lounge/",
      "https://www.facebook.com/profile.php?id=61588374581854",
    ],
  };

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen">
        {children}

        {/* Mobile-only sticky actions (conversion) */}
        <MobileActionBar />

        {/* LocalBusiness structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />

        {/* GA4 Tracking */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  anonymize_ip: true
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
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
const SITE_URL = "https://graze-lounge.com"; // change to real domain later

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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
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
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen">
        {children}
        {/* Mobile-only sticky actions (conversion) */}
        <MobileActionBar />
      </body>
    </html>
  );
}
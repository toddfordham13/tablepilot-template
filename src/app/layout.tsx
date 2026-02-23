import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Graze Lounge | Cocktails in Ayia Napa",
  description:
    "Graze Lounge is a relaxed cocktail bar in central Ayia Napa — crafted cocktails, great music, and laid-back evenings.",
  metadataBase: new URL("https://graze-lounge.com"), // change to real domain later
  openGraph: {
    title: "Graze Lounge | Cocktails in Ayia Napa",
    description:
      "Crafted cocktails, great music, and laid-back evenings in the heart of Ayia Napa.",
    url: "https://graze-lounge.com",
    siteName: "Graze Lounge",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Graze Lounge" }],
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
  icons: {
    icon: "/favicon.ico",
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
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
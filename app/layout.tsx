import React, { Suspense } from "react";

import type { Metadata } from "next";

import "./globals.css";
import "leaflet/dist/leaflet.css";

import Providers from "./providers";

import LayoutContent from "./components/ui/global/LayoutContent";

//General metadata including opengraph information
export const metadata: Metadata = {
  title: "EventOrbit",
  description:
    "Discover Krist, your ultimate destination for stylish and affordable men’s, women’s, and kids' wear. Explore a wide range of trendy outfits designed for every occasion and elevate your wardrobe with our premium-quality apparel. Shop now and experience fashion redefined!",
  openGraph: {
    title: "EventOrbit",
    description:
      "Discover Krist, your ultimate destination for stylish and affordable men’s, women’s, and kids' wear. Explore a wide range of trendy outfits designed for every occasion and elevate your wardrobe with our premium-quality apparel. Shop now and experience fashion redefined!",
    images:
      "https://res.cloudinary.com/ddcjuf3hq/image/upload/v1737908712/krist-og-image_rlbpuo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <Providers>
            <LayoutContent>{children}</LayoutContent>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}

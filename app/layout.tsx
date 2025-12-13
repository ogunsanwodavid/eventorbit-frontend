import { ReactNode, Suspense } from "react";

import type { Metadata } from "next";

import "./globals.css";
import "leaflet/dist/leaflet.css";

import Providers from "./providers";

import LayoutContent from "./components/ui/global/LayoutContent";

//General metadata including opengraph information
export const metadata: Metadata = {
  title: "EventOrbit",
  description:
    "EventOrbit is a modern ticketing platform designed to simplify how people discover, create, and attend events. With intuitive navigation and a seamless booking experience, EventOrbit makes it effortless for organizers to set up events and for attendees to secure their tickets. The platform is built to support events of all sizes — from small community gatherings to large-scale concerts — while delivering a smooth, reliable, and engaging experience for everyone involved.",
  openGraph: {
    title: "EventOrbit",
    description:
      "EventOrbit is a modern ticketing platform designed to simplify how people discover, create, and attend events. With intuitive navigation and a seamless booking experience, EventOrbit makes it effortless for organizers to set up events and for attendees to secure their tickets. The platform is built to support events of all sizes — from small community gatherings to large-scale concerts — while delivering a smooth, reliable, and engaging experience for everyone involved.",
    images:
      "https://res.cloudinary.com/ddcjuf3hq/image/upload/v1765594617/eventorbit-ogimage_f71z6o.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
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

"use client";

import { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { Toaster } from "sonner";

import Navbar from "./Navbar";
import Footer from "./Footer";

import PartnerWithUsFloatingBtn from "./PartnerWithUsFloatingBtn";

export default function LayoutContent({ children }: { children: ReactNode }) {
  //Pathname function
  const pathname = usePathname();

  //Define routes where Navbar and Footer should not appear
  const authRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/set-password",
    "/verify-email",
  ];

  //Check if route is an auth page
  const isAuthPage = authRoutes.includes(pathname);

  return (
    <main className="flex flex-col min-h-screen">
      {/*** Render Navbar if it is not an auth page */}
      {!isAuthPage && <Navbar />}

      {children}

      {/*** Render Footer if it is not an auth page */}
      {!isAuthPage && <Footer />}

      {/*** Render Partner with us floating button if its not an auth page */}
      {!isAuthPage && <PartnerWithUsFloatingBtn />}

      {/** Toaster */}
      <Toaster
        richColors
        position="top-center"
        className="!font-quicksand !z-30"
      />
    </main>
  );
}

"use client";

import { ReactNode } from "react";

import { useNavFooterVisibility } from "@/app/contexts/NavFooterVisibilityContext";

import { Toaster } from "sonner";

import Navbar from "./Navbar";
import Footer from "./Footer";

import PartnerWithUsFloatingBtn from "./PartnerWithUsFloatingBtn";

export default function LayoutContent({ children }: { children: ReactNode }) {
  //Nav and footer visibility
  const { showNav, showFooter } = useNavFooterVisibility();

  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      {showNav && <Navbar />}

      {children}

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Floating Button (depends on nav/footer being shown) */}
      {showNav && showFooter && <PartnerWithUsFloatingBtn />}

      {/** Toaster */}
      <Toaster
        richColors
        position="top-center"
        className="!font-quicksand !z-30"
      />
    </main>
  );
}

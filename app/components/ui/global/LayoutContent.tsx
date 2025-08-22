"use client";

import { ReactNode } from "react";

import { useNavFooterVisibility } from "@/app/contexts/NavFooterVisibilityContext";

import useWindowDimensions from "@/app/hooks/global/useWindowDimensions";

import { Toaster } from "sonner";

import Navbar from "./Navbar";
import Footer from "./Footer";

import PartnerWithUsFloatingBtn from "./PartnerWithUsFloatingBtn";

export default function LayoutContent({ children }: { children: ReactNode }) {
  //Nav and footer visibility
  const { showNav, showFooter } = useNavFooterVisibility();

  //Window dimensions
  const { windowHeight } = useWindowDimensions();

  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: `${windowHeight}px`,
      }}
    >
      {/* Navbar */}
      {showNav && <Navbar />}

      {/** Main content */}
      <main
        className={`${
          showNav && "flex-1 mt-[56px] flex flex-col lg:mt-[70px]"
        }`}
      >
        {children}
      </main>

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
    </div>
  );
}

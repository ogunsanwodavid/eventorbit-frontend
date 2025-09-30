"use client";

import { ReactNode } from "react";

import { useNavFooterVisibility } from "@/app/contexts/NavFooterVisibilityContext";

import useWindowDimensions from "@/app/hooks/global/useWindowDimensions";

import { useAppSelector } from "@/app/hooks/global/redux";

import { Toaster } from "sonner";

import Navbar from "./Navbar";
import Footer from "./Footer";

import PartnerWithUsFloatingBtn from "./PartnerWithUsFloatingBtn";

export default function LayoutContent({ children }: { children: ReactNode }) {
  //Nav and footer visibility
  const { showNav, showFooter } = useNavFooterVisibility();

  //Window dimensions
  const { windowHeight } = useWindowDimensions();

  //Nav height
  const navHeight = useAppSelector((state) => state.navHeight.height);

  return (
    <div
      className="flex flex-col duration-250 transition-all"
      style={{
        minHeight: `${windowHeight}px`,
      }}
    >
      {/* Navbar */}
      {showNav && <Navbar />}

      {/** Main content */}
      <main
        className={`${showNav && "flex-1  flex flex-col"}`}
        style={{
          marginTop: showNav ? `${navHeight}px` : undefined,
        }}
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
        className="!font-quicksand !z-99 !mt-[45px] lg:!mt-[60px] !text-[17px]"
        closeButton
      />
    </div>
  );
}

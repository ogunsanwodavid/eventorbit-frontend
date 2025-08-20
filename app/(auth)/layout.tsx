"use client";

import { ReactNode } from "react";

import useWindowDimensions from "../hooks/global/useWindowDimensions";

interface AllAuthPagesProps {
  children: ReactNode;
}

export default function AllAuthPages({ children }: AllAuthPagesProps) {
  //Window dimensions
  const { windowWidth, windowHeight } = useWindowDimensions();

  return (
    <div
      className="bg-blur-black w-screen min-h-screen flex items-center justify-center py-8 px-5 overflow-hidden"
      style={{
        width: `${windowWidth}px`,
        height: `${windowHeight}px`,
      }}
    >
      <main className="w-full max-w-[500px] mx-auto rounded-[6px] overflow-hidden">
        {children}
      </main>
    </div>
  );
}

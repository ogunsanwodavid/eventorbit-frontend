"use client";

import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import { useNavFooterVisibility } from "./contexts/NavFooterVisibilityContext";

import notFoundImg from "@/public/images/not-found.svg";

export default function PageNotFound() {
  //Nav footer visibility variables
  const { setShowFooter, showFooter } = useNavFooterVisibility();

  //Hide footer on mount
  useEffect(() => {
    setShowFooter(!showFooter);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {/** SVG */}
      <Image
        src={notFoundImg}
        className="w-full max-w-[200px]"
        alt="not found - 404 error"
      />

      <p className="text-base text-gray font-medium">Page not found</p>

      {/** Go to home */}
      <Link
        href="/"
        className="mt-2 py-2 px-4 border-[1px] border-teal text-[14px] text-teal font-semibold rounded-[6px] duration-250 transition-all hover:bg-teal hover:text-white cursor-pointer"
      >
        Go to Home
      </Link>
    </div>
  );
}

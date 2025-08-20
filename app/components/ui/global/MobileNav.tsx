import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/app/contexts/AuthContext";

import useWindowDimensions from "@/app/hooks/global/useWindowDimensions";

import X from "../icons/X";

import tealLogo from "@/public/images/logo-teal.png";

interface MobileNavProps {
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
}

export default function MobileNav({
  isMobileNavOpen,
  toggleMobileNav,
}: MobileNavProps) {
  //Auth status
  const { isAuthenticated } = useAuth();

  //Window dimensions
  const { windowWidth, windowHeight } = useWindowDimensions();

  return (
    <div
      className={`fixed top-0 right-0 bg-blur-black overflow-hidden z-50 transition-opacity duration-400 ${
        isMobileNavOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } lg:hidden`}
      style={{
        width: `${windowWidth}px`,
        height: `${windowHeight}px`,
      }}
    >
      {/** Main inner layer*/}
      <main
        className={`h-full w-full flex flex-col gap-16 max-w-[256px] ml-auto bg-white transition-transform duration-500 overflow-y-auto ${
          isMobileNavOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/** Upper Section */}
        <section className="w-full pt-2 pr-2 pl-6">
          {/** X Icon */}
          <div className="w-max ml-auto" onClick={toggleMobileNav}>
            <X size="25" color="gray" />
          </div>

          {/** Logo */}
          <Link href="/">
            <Image
              src={tealLogo}
              className="w-[140px] mt-2"
              alt="teal EventOrbit logo"
            />
          </Link>

          {/** Nav Links */}
          <div className="w-full pr-6 mt-5 flex flex-col gap-y-5 text-[#0e0e0e] text-[15px] font-medium">
            {/** Find Events */}
            <Link href="/explore">
              <span>Find Events</span>
            </Link>

            {/** Create Event */}
            <Link href="/create">
              <span>Create Event</span>
            </Link>
          </div>
        </section>

        {/** Lower Section */}
        <section className="w-full mt-auto border-t-[#cbcbcb] border-t-[1px] py-3 pl-6 flex flex-col gap-y-3 text-[#6f7881] text-[15px]">
          {/** Help */}
          <Link href="/help">
            <span>Help</span>
          </Link>

          {/** Log In & Sign Up */}
          {!isAuthenticated && (
            <>
              <Link href="/sign-in">
                <span>Log In</span>
              </Link>

              <Link href="/sign-up">
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

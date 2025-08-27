import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { redirect } from "next/navigation";

import { useAuth } from "@/app/contexts/AuthContext";

import useWindowDimensions from "@/app/hooks/global/useWindowDimensions";

import { signOut } from "@/app/api/auth/sign-out";

import { toast } from "sonner";

import Tadpole from "../spinners/TadPole";

import X from "../icons/X";
import CaretDownOutline from "../icons/CaretDownOutline";

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
  const { isAuthenticated, refreshAuth } = useAuth();

  //Window dimensions
  const { windowWidth, windowHeight } = useWindowDimensions();

  //States of dropdown
  const [isHostEventsDropdownOpen, setIsHostEventsDropdownOpen] =
    useState<boolean>(false);

  //Functions to toggle dropdowns
  function toggleHostEventsDropdown() {
    setIsHostEventsDropdownOpen((prev) => !prev);
  }

  //Loading states
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  //Sign out function
  const handleSignOut = async () => {
    try {
      //Set loading state true
      setIsSigningOut(true);

      const result = await signOut();

      //Check if successful
      if (result.success) {
        //Refresh auth status
        await refreshAuth({ setLoading: false });

        //Toast message
        toast.success(result.message);

        //Redirect to home
        redirect("/");
      } else {
        //Toast error
        toast.error(result.message);
      }
    } finally {
      //Set loading state false
      setIsSigningOut(false);
    }
  };

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
          <div className="w-full pr-6 mt-5 flex flex-col gap-y-0 text-[#0e0e0e] text-[15px] font-medium">
            {/** My Tickets */}
            {isAuthenticated && (
              <Link
                href="/tickets"
                className="pb-[15px] border-b-[1px] border-b-[#cbcbcb"
              >
                <span>My Tickets</span>
              </Link>
            )}

            {/** Find Events */}
            <Link
              href="/explore"
              className={isAuthenticated ? "pt-[15px]" : "pt-0"}
            >
              <span>Find Events</span>
            </Link>

            {/** Host Events drop down */}
            <div className="pt-5">
              {/** Header */}
              <header
                className="flex items-center justify-between"
                onClick={toggleHostEventsDropdown}
              >
                <span>Host Events</span>

                {/** Caret */}
                <span
                  className={`inline-block transform transition-all duration-250 ${
                    isHostEventsDropdownOpen ? "rotate-180" : "rotate-none"
                  }`}
                >
                  <CaretDownOutline size="20" fill="gray" />
                </span>
              </header>

              {/** Dropdown content */}
              <main
                className={`${
                  isHostEventsDropdownOpen ? "flex" : "hidden"
                } mt-5 flex-col gap-y-5 text-gray text-[14px] transition-all duration-300`}
              >
                <Link href="/create">Create Event</Link>
                <Link href="#">Features</Link>
                <Link href="#">Pricing</Link>

                <div className="flex gap-x-5">
                  <Link href="#" className="inline">
                    Clubs
                  </Link>
                  <Link href="#" className="inline">
                    Attractions
                  </Link>
                </div>
              </main>
            </div>
          </div>
        </section>

        {/** Lower Section */}
        <section className="w-full mt-auto border-t-[#cbcbcb] border-t-[1px] py-4 pl-6 flex flex-col gap-y-4 text-[#6f7881] text-[15px] font-medium">
          {/** Profile */}
          {isAuthenticated && (
            <Link href="#">
              <span>Profile</span>
            </Link>
          )}

          {/** Settings */}
          {isAuthenticated && (
            <Link href="/settings">
              <span>Settings</span>
            </Link>
          )}

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

          {/** Log out */}
          {isAuthenticated && (
            <div
              className="h-[22.5px] flex items-center"
              onClick={handleSignOut}
            >
              {isSigningOut ? <Tadpole size="19" /> : <span>Log Out</span>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";

import { redirect, usePathname } from "next/navigation";

import { useAuth } from "@/app/contexts/AuthContext";

import { useNavFooterVisibility } from "@/app/contexts/NavFooterVisibilityContext";

import Image from "next/image";
import Link from "next/link";

import { signOut } from "@/app/actions/auth/sign-out";

import { toast } from "sonner";

import MobileNav from "./MobileNav";

import NavHover from "../nav/NavHover";

import Menu from "../icons/Menu";

import Tadpole from "../spinners/TadPole";

import whiteLogo from "@/public/images/logo-white.png";

export default function Navbar() {
  //Navbar visibility
  const { showNav } = useNavFooterVisibility();

  //Auth context variables
  const { isAuthenticated, profile, refreshAuth } = useAuth();

  //Get the current pathname
  const pathname = usePathname();

  //Profile info
  const { info: { userType, firstName, lastName, organizationName } = {} } =
    profile ?? {};

  //State of the mobile nav
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  //Function to toggle mobile nav
  function toggleMobileNav() {
    setIsMobileNavOpen((prev) => !prev);
  }

  //States of dropdown
  const [isHostEventsDropdownOpen, setIsHostEventsDropdownOpen] =
    useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);

  //Functions to toggle dropdowns
  function toggleHostEventsDropdown() {
    setIsHostEventsDropdownOpen((prev) => !prev);

    //Close user dropdown
    setIsUserDropdownOpen(false);
  }
  function toggleUserDropdown() {
    setIsUserDropdownOpen((prev) => !prev);

    //Close host events dropdown
    setIsHostEventsDropdownOpen(false);
  }

  //EFFECT HANDLES ROUTE CHANGES
  useEffect(() => {
    //Close dropdowns and mobile nav on route change
    setIsMobileNavOpen(false);

    setIsHostEventsDropdownOpen(false);

    setIsUserDropdownOpen(false);
  }, [pathname]);

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
        await refreshAuth();

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

  //Dont show navbar if visibility false
  if (!showNav) return null;

  return (
    <nav className="fixed top-0 left-0 z-5 w-full bg-teal px-5 flex items-center justify-between lg:px-10">
      {/** Logo */}
      <Link href="/">
        <Image
          src={whiteLogo}
          className="w-[120px] lg:w-[135px]"
          alt="white eventorbit logo"
        />
      </Link>

      {/** Menu icon */}
      <section className="text-white py-3 lg:hidden" onClick={toggleMobileNav}>
        <Menu size="32" />
      </section>

      {/** Mobile Nav */}
      <MobileNav
        isMobileNavOpen={isMobileNavOpen}
        toggleMobileNav={toggleMobileNav}
      />

      {/** Text Links */}
      <section className="hidden gap-x-8 lg:flex">
        <Link href="/explore" className="block">
          <NavHover>Find Events</NavHover>
        </Link>

        {/** Host events dropdown */}
        <div className="relative">
          <NavHover onClick={() => toggleHostEventsDropdown()}>
            Host Events
          </NavHover>

          {isHostEventsDropdownOpen && (
            <div className="absolute left-1/2 min-w-[12rem] rounded-[0.5rem] py-2 bg-white -translate-x-1/2 -translate-y-[0.5rem] shadow-[0_0_7px_#0000001a] z-5 text-[15px] text-black-2 cursor-pointer">
              {/** Create event */}
              <Link
                href="/create"
                className="border-b-[1px] border-b-[#dcdcdc] h-[45px] flex items-center px-6"
              >
                Create Event
              </Link>

              {/** Features */}
              <Link href="#" className="h-[45px] flex items-center px-6">
                Features
              </Link>

              {/** Privacy */}
              <Link
                href="#"
                className="border-b-[1px] border-b-[#dcdcdc] h-[45px] flex items-center px-6"
              >
                Privacy
              </Link>

              {/** Attractions */}
              <Link href="#" className="h-[45px] flex items-center px-6">
                Attractions
              </Link>

              {/** Clubs */}
              <Link href="#" className="h-[45px] flex items-center px-6">
                Clubs
              </Link>
            </div>
          )}
        </div>

        {!isAuthenticated && (
          <>
            {/** Sign in */}
            <Link href="/sign-in" className="block">
              <NavHover>Log In</NavHover>
            </Link>

            {/** Sign up */}
            <Link href="/sign-up" className="block">
              <NavHover>Sign Up</NavHover>
            </Link>
          </>
        )}

        {/** User display picture and name */}
        {isAuthenticated && profile && (
          <div className="relative pr-4">
            <NavHover onClick={() => toggleUserDropdown()}>
              <div className="w-full h-full flex items-center gap-2">
                {/** Display pic
                 * or initials if no profile picture set
                 */}
                {profile.images?.profilePicture ? (
                  <Image
                    src={profile.images.profilePicture}
                    className="w-7 h-7 rounded-full"
                    alt={`${profile.info.firstName}'s picture`}
                    width={36}
                    height={36}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[14px] uppercase flex items-center justify-center">
                    {/** Provisional profile pic
                     * using intials of name
                     */}
                    {userType === "individual" &&
                      `${firstName?.charAt(0)}
                    ${lastName?.charAt(0)}`}

                    {userType === "organization" &&
                      `${organizationName?.charAt(0)}`}
                  </div>
                )}

                {/** First name or organization name */}
                <div className="text-white text-[15px] font-semibold">
                  {userType === "individual" ? firstName : organizationName}
                </div>
              </div>
            </NavHover>

            {isUserDropdownOpen && (
              <div className="absolute right-0 min-w-[12rem] rounded-[0.5rem] py-2 bg-white -mt-[0.5rem] transform-none shadow-[0_0_7px_#0000001a] z-5 text-[15px] text-black-2 cursor-pointer">
                {/** My Tickets */}
                <Link
                  href="/tickets"
                  className="border-b-[1px] border-b-[#dcdcdc] h-[45px] flex items-center px-6"
                >
                  My Tickets
                </Link>

                {/** Profile */}
                <Link href="#" className="h-[45px] flex items-center px-6">
                  Profile
                </Link>

                {/** Settings */}
                <Link
                  href="/settings"
                  className="h-[45px] flex items-center px-6"
                >
                  Settings
                </Link>

                {/** Help */}
                <Link href="/help" className="h-[45px] flex items-center px-6">
                  Help
                </Link>

                {/** Log out */}
                <div
                  className="h-[45px] flex items-center px-6"
                  onClick={() => handleSignOut()}
                >
                  {isSigningOut ? <Tadpole size="19" /> : <span>Log Out</span>}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </nav>
  );
}

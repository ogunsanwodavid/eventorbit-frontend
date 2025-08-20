import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { useAuth } from "@/app/contexts/AuthContext";

import Image from "next/image";
import Link from "next/link";

import MobileNav from "./MobileNav";

import NavHoverLink from "../nav/NavHoverLink";

import Menu from "../icons/Menu";

import whiteLogo from "@/public/images/logo-white.png";

export default function Navbar() {
  //Auth status
  const { isAuthenticated } = useAuth();

  //Get the current pathname
  const pathname = usePathname();

  //State of the mobile nav
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  //Effect to handle route changes
  useEffect(() => {
    //Close mobile nav on route change
    setIsMobileNavOpen(false);
  }, [pathname]);

  //Function to toggle mobile nav
  function toggleMobileNav() {
    setIsMobileNavOpen((prev) => !prev);
  }

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
      <section className="text-white py-4 lg:hidden" onClick={toggleMobileNav}>
        <Menu size="32" />
      </section>

      {/** Mobile Nav */}
      <MobileNav
        isMobileNavOpen={isMobileNavOpen}
        toggleMobileNav={toggleMobileNav}
      />

      {/** Text Links */}
      <section className="hidden gap-x-5 lg:flex">
        <NavHoverLink href="/explore">Find Events</NavHoverLink>
        <NavHoverLink href="/create">Create Event</NavHoverLink>
        <NavHoverLink href="/help">Help</NavHoverLink>
        {!isAuthenticated && (
          <>
            <NavHoverLink href="/sign-in">Log In</NavHoverLink>
            <NavHoverLink href="/sign-up">Sign Up</NavHoverLink>
          </>
        )}
      </section>
    </nav>
  );
}

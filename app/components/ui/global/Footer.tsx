import Link from "next/link";
import Image from "next/image";

import LanguageSelect from "../footer/LanguageSelect";

import XTwitter from "../icons/XTwitter";
import Instagram from "../icons/Instagram";
import Linkedin from "../icons/Linkedin";

import tealLogo from "@/public/images/logo-teal.png";

export default function Footer() {
  return (
    <div className="w-full bg-[#f5f5f5] mt-auto">
      <footer className="inner-screen-max py-16 px-5 md:!pb-24 lg:px-10 max:px-0">
        {/** Upper Section */}
        <section className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/** About Us */}
          <div>
            <h5 className="text-black text-[17px] font-bold">About Us</h5>

            {/** Sublinks */}
            <main className="mt-8 flex flex-col gap-y-4 text-[15px] text-[#0e0e0e]">
              <Link href="/about">Our Story</Link>
              <Link href="#">Jobs</Link>
              <Link href="/explore">Find Events</Link>
              <Link href="/partner-with-us">Partner With Us</Link>
            </main>
          </div>

          {/** Host Events */}
          <div>
            <h5 className="text-black text-[17px] font-bold">Host Events</h5>

            {/** Sublinks */}
            <main className="mt-8 flex flex-col gap-y-4 text-[15px] text-[#0e0e0e]">
              <Link href="/create">Create Event</Link>
              <Link href="#">Pricing</Link>
              <Link href="/explore">Features</Link>
              <Link href="#">Developers</Link>
              <Link href="#">Attractions</Link>
              <Link href="#">Clubs</Link>
            </main>
          </div>

          {/** Get Help */}
          <div>
            <h5 className="text-black text-[17px] font-bold">Get Help</h5>

            {/** Sublinks */}
            <main className="mt-8 flex flex-col gap-y-4 text-[15px] text-[#0e0e0e]">
              <Link href="#">Help Center (FAQs)</Link>
              <Link href="#">Contact Us</Link>
              <Link href="#">Where are my tickets?</Link>
              <Link href="#">Contact the event organizer</Link>
              <Link href="#">Can I get a refund?</Link>
            </main>
          </div>

          {/** Language Select */}
          <LanguageSelect />
        </section>

        {/** Lower Section */}
        <section className="w-full mt-16 pt-6 border-t-[1px] border-t-[#6f7881] flex flex-col justify-between gap-6 lg:flex-row">
          {/** Logo */}
          <Link href="/">
            <Image
              src={tealLogo}
              className="w-[100px]"
              alt="white eventorbit logo"
            />
          </Link>

          {/** Text Links */}
          <div className="flex flex-col gap-1.5 text-sm text-[#6f7881] md:flex-row md:flex-wrap">
            <Link href="#">
              Terms and Conditions{" "}
              <span className="hidden md:inline-block">|</span>
            </Link>
            <Link href="#">
              Terms of User <span className="hidden md:inline-block">|</span>
            </Link>
            <Link href="#">
              Privacy Policy <span className="hidden md:inline-block">|</span>
            </Link>
            <Link href="#">
              Do Not Sell or Share My Information{" "}
              <span className="hidden md:inline-block">|</span>
            </Link>
            <Link href="#">
              Cookie Policy <span className="hidden md:inline-block">|</span>
            </Link>
            <span>© EventOrbit {new Date().getFullYear()}</span>
          </div>

          {/** Social Links */}
          <div className="flex items-center gap-4">
            {/** X */}
            <Link href="https://x.com/i__am__0x" target="_blank">
              <XTwitter size="20" color="#6f7881" />
            </Link>

            {/** Instagram */}
            <Link href="https://instagram.com/i__am__0x" target="_blank">
              <Instagram size="20" fill="#6f7881" />
            </Link>

            {/** Linkedin */}
            <Link
              href="https://linkedin.com/in/ogunsanwo-david-399817238/"
              target="_blank"
            >
              <Linkedin size="20" color="#6f7881" />
            </Link>
          </div>
        </section>
      </footer>
    </div>
  );
}

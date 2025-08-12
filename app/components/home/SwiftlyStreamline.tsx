import Image from "next/image";
import Link from "next/link";

import FadeIn from "../ui/animations/FadeIn";

import List from "./List";

import analyticsLogo from "@/static/home/swiftly-streamline/analytics.png";
import tradableBitsLogo from "@/static/home/swiftly-streamline/tradable-bits.webp";
import mailchimpLogo from "@/static/home/swiftly-streamline/mailchimp.svg";
import googleAdsLogo from "@/static/home/swiftly-streamline/google-ads.png";
import zapierLogo from "@/static/home/swiftly-streamline/zapier.png";
import audienceRepublicLogo from "@/static/home/swiftly-streamline/audience-republic.png";

export default function SwiftlyStreamline() {
  //List items
  const listItems: string[] = [
    "Quickly create and manage general admission and timed-entry events with ease.",
    "Build and schedule recurring custom reports to gain clear insights and guide decisions.",
    "Streamline workflows by automating tasks and connecting with 5,000+ tools through Zapier.",
  ];

  return (
    <div className="w-full bg-white">
      <main className="inner-screen-max py-16 px-5 flex flex-col gap-y-8 lg:px-10 lg:gap-y-12 max:px-0">
        {/** Heading */}
        <FadeIn>
          <h2 className="leading-[1.2] text-black text-[2rem] font-semibold text-center lg:text-5xl">
            Swiftly streamline your events
          </h2>
        </FadeIn>

        {/** Mid Section */}
        <section className="w-full relative grid grid-cols-1 gap-12 items-center content-between lg:grid-cols-2 lg:gap-16">
          {/** Logos */}
          <FadeIn>
            <div className="w-full grid grid-cols-3 grid-rows-[auto] gap-12 content-between place-items-center">
              {/** Analytics */}
              <Image
                src={analyticsLogo}
                className="block w-full max-w-60 max-h-11 object-contain grayscale "
                alt="Analytics logo"
              />

              {/** Tradable Bits */}
              <Image
                src={tradableBitsLogo}
                className="block w-full max-w-60 max-h-11 object-contain grayscale "
                alt="Analytics logo"
              />

              {/** Mailchimp */}
              <Image
                src={mailchimpLogo}
                className="block w-full max-w-60 max-h-11 object-contain grayscale "
                alt="Analytics logo"
              />

              {/** Google Ads */}
              <Image
                src={googleAdsLogo}
                className="block w-full max-w-60 max-h-20 object-contain grayscale "
                alt="Analytics logo"
              />

              {/** Zapier */}
              <Image
                src={zapierLogo}
                className="block w-full max-w-60 max-h-11 object-contain grayscale  "
                alt="Analytics logo"
              />

              {/** Audience Republic */}
              <Image
                src={audienceRepublicLogo}
                className="block w-full max-w-64 max-h-14 object-contain grayscale "
                alt="Analytics logo"
              />
            </div>
          </FadeIn>

          {/** List */}
          <FadeIn>
            <List listItems={listItems} />
          </FadeIn>
        </section>

        {/** Button */}
        <FadeIn>
          <Link href="#" className="block w-full mt-6 lg:mt-12">
            <button className="block w-max mx-auto bg-white uppercase text-teal text-base font-semibold border-[1px] border-teal py-4 px-6 rounded-[0.5rem] transition-all duration-300 hover:bg-teal hover:text-white lg:text-lg">
              explore easy event creation
            </button>
          </Link>
        </FadeIn>
      </main>
    </div>
  );
}

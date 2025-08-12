import Image from "next/image";
import Link from "next/link";

import List from "./List";

import FadeIn from "../ui/animations/FadeIn";

import globe from "@/static/home/accelerate-your-growth/globe.jpg";

export default function AccelerateYourGrowth() {
  //List items
  const listItems: string[] = [
    "Tap into EventOrbit's four decades of worldwide ticketing experience.",
    "Partner with a dedicated local team to guide your event from start to finish.",
    "Give your customers exceptional care with scalable support in 15 countries, 7 languages, and multiple time zones.",
  ];

  return (
    <div className="w-full bg-white">
      <main className="inner-screen-max py-16 px-5 flex flex-col gap-y-8 lg:px-10 lg:gap-y-12 max:px-0">
        {/** Heading */}
        <FadeIn>
          <h2 className="leading-[1.2] text-black text-[2rem] font-semibold text-center lg:text-5xl">
            Accelerate your growth with expert guidance
          </h2>
        </FadeIn>

        {/** First Section */}
        <section className="w-full relative grid grid-cols-1 gap-12 items-center content-between lg:grid-cols-2 lg:gap-16">
          {/** Globe */}
          <FadeIn>
            <div className="w-full">
              <Image
                src={globe}
                className="block w-full max-w-[27rem] mx-auto"
                alt="globe image"
              />
            </div>
          </FadeIn>

          {/** List */}
          <FadeIn>
            <List listItems={listItems} />
          </FadeIn>
        </section>

        {/** Second section */}
        <section className="w-full max-w-[60rem] mx-auto mt-14 lg:mt-20">
          {/** Heading */}
          <FadeIn>
            <h2 className="leading-[1.2] text-black text-[2rem] font-semibold text-center lg:text-5xl">
              Elevate your event management and unlock new growth potential.
            </h2>
          </FadeIn>

          {/** Button */}
          <FadeIn>
            <Link href="/partner-with-us" className="block w-full mt-4 lg:mt-8">
              <button className="block w-max mx-auto bg-teal uppercase text-white text-base font-semibold border-[1px] border-teal py-4 px-6 rounded-[0.5rem] transition-all duration-300 hover:opacity-80 lg:text-lg">
                partner with us
              </button>
            </Link>
          </FadeIn>
        </section>
      </main>
    </div>
  );
}

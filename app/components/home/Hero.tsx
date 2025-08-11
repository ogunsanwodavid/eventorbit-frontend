"use client";

import { useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import { motion, useInView } from "motion/react";

import HeroImage1 from "@/static/home/hero/image-1.jpg";
import HeroImage2 from "@/static/home/hero/image-2.jpg";
import HeroImage3 from "@/static/home/hero/image-3.jpg";
import HeroImage4 from "@/static/home/hero/image-4.jpg";

export default function Hero() {
  //Refs for hero images
  const refImage1 = useRef<HTMLDivElement | null>(null);
  const inViewImage1 = useInView(refImage1, { amount: 0.3, once: false });

  const refImage3 = useRef<HTMLDivElement | null>(null);
  const inViewImage3 = useInView(refImage3, { amount: 0.3, once: false });

  //Animate if hero in view
  const inView = inViewImage1 && inViewImage3;

  return (
    <div className="w-full bg-[#0e0e0e]">
      <main className="inner-screen-max flex flex-col justify-between gap-12 pt-12 pb-10 px-5 lg:flex-row lg:px-10 max:px-0">
        {/** Texts Section */}
        <section className="w-full py-16 lg:py-40">
          <h1 className="max-w-[32rem] text-white text-6xl">
            Your event journey starts
          </h1>

          <h2 className="mt-4 text-white text-xl">
            Your trusted partner for smooth and successful events worldwide
          </h2>

          {/** Buttons */}
          <div className="w-full mt-10 max-w-[27rem] grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/** Partner With Us */}
            <Link href="/partner-with-us">
              <button className="w-full bg-teal uppercase text-center text-white font-medium rounded-[0.5rem] border-[1px] border-teal py-4 px-6 transition-all duration-300 hover:opacity-70">
                PARTNER WITH US
              </button>
            </Link>

            {/** Find Events */}
            <Link href="/explore">
              <button className="w-full bg-transparent uppercase text-center text-white font-medium rounded-[0.5rem] border-[1px] border-white py-4 px-6 transition-all duration-300 hover:bg-white hover:text-teal">
                FIND EVENTS
              </button>
            </Link>
          </div>
        </section>

        {/** Images Section */}
        <section className="w-full grid grid-cols-2 gap-6 lg:mt-10">
          {/** Image 1 */}
          <motion.div
            ref={refImage1}
            initial={{ y: 0 }}
            animate={{
              y: inView ? 64 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Image
              src={HeroImage1}
              className="h-64 object-cover rounded-[0.5rem] bg-scroll -mt-16 lg:h-72"
              alt="events"
            />
          </motion.div>

          {/** Image 2 */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: inView ? -24 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Image
              src={HeroImage2}
              className="h-64 object-cover rounded-[0.5rem] bg-scroll lg:h-72"
              alt="events"
            />
          </motion.div>

          {/** Image 3 */}
          <motion.div
            ref={refImage3}
            initial={{ y: 0 }}
            animate={{
              y: inView ? 64 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Image
              src={HeroImage3}
              className="h-64 object-cover rounded-[0.5rem] bg-scroll -mt-16 lg:h-72"
              alt="events"
            />
          </motion.div>

          {/** Image 4 */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: inView ? -24 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Image
              src={HeroImage4}
              className="h-64 object-cover rounded-[0.5rem] bg-scroll -mb-6 lg:h-72 lg:-mb-0"
              alt="events"
            />
          </motion.div>
        </section>
      </main>
    </div>
  );
}

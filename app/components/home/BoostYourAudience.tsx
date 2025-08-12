"use client";

import Image from "next/image";
import Link from "next/link";

import { useKeenSlider } from "keen-slider/react";

import FadeIn from "../ui/animations/FadeIn";

import image1 from "@/static/home/boost-your-audience/image-1.jpg";
import image2 from "@/static/home/boost-your-audience/image-2.jpg";
import image3 from "@/static/home/boost-your-audience/image-3.jpg";
import image4 from "@/static/home/boost-your-audience/image-4.webp";
import image5 from "@/static/home/boost-your-audience/image-5.webp";
import image6 from "@/static/home/boost-your-audience/image-6.webp";
import image7 from "@/static/home/boost-your-audience/image-7.jpg";

import klookLogo from "@/static/home/boost-your-audience/klook.png";
import bookingComLogo from "@/static/home/boost-your-audience/booking-com.png";
import viatorLogo from "@/static/home/boost-your-audience/viator.png";
import getYourGuideLogo from "@/static/home/boost-your-audience/get-your-guide.png";
import musementLogo from "@/static/home/boost-your-audience/musement.png";
import songkickLogo from "@/static/home/boost-your-audience/songkick.png";
import redeamLogo from "@/static/home/boost-your-audience/redeam.png";
import condeNastLogo from "@/static/home/boost-your-audience/conde-nast.png";
import bandsintownLogo from "@/static/home/boost-your-audience/bandsintown.png";
import spotifyLogo from "@/static/home/boost-your-audience/spotify.png";
import evvntLogo from "@/static/home/boost-your-audience/evvnt.png";
import ingressoLogo from "@/static/home/boost-your-audience/ingresso.png";
import vegasLogo from "@/static/home/boost-your-audience/vegas-com.png";
import youtubeLogo from "@/static/home/boost-your-audience/youtube.png";
import grouponLogo from "@/static/home/boost-your-audience/groupon.png";
import expediaLogo from "@/static/home/boost-your-audience/expedia.png";

export default function BoostYourAudience() {
  //Logos Slider
  const [logosSliderRef] = useKeenSlider(
    {
      loop: true,
      renderMode: "performance",
      drag: true,
      slides: { perView: 2, spacing: 32 },
      breakpoints: {
        "(min-width: 480px)": {
          slides: { perView: 3, spacing: 32 },
        },
        "(min-width: 650px)": {
          slides: { perView: 4, spacing: 32 },
        },
        "(min-width: 800px)": {
          slides: { perView: 5, spacing: 32 },
        },
        "(min-width: 1000px)": {
          slides: { perView: 6, spacing: 32 },
        },
      },
    },
    [
      // Autoplay plugin
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            slider.next();
          }, 2000); // 2s delay before each move
        }

        slider.on("created", nextTimeout);
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  return (
    <div className="w-full bg-[#fafafa]">
      <main className="inner-screen-max py-16 px-5 flex flex-col lg:py-24 lg:px-10 max:px-0">
        {/** Heading */}
        <FadeIn>
          <h2 className="leading-[1.2] text-black text-[2rem] font-semibold text-center lg:text-5xl">
            Boost your audience with world-class event marketing
          </h2>
        </FadeIn>

        {/** First section */}
        <section className="w-full relative grid grid-cols-1 gap-12 items-center content-between mt-16 lg:grid-cols-2 lg:gap-16 lg:mt-20">
          {/** Images */}
          <FadeIn>
            <div className="relative mt-6 w-4/5 mx-auto  lg:w-[90%]">
              {/** Main image */}
              <Image
                src={image1}
                className="block rounded-[0.5rem]"
                alt="marketing"
              />

              {/** Floating right image */}
              <div
                className="absolute top-0 right-0 -translate-x-1/3 -translate-y-1/2 w-[6rem] h-[6rem] mx-auto rounded-[0.5rem] bg-cover bg-center"
                style={{ backgroundImage: `url(${image2.src})` }}
              ></div>

              {/** Floating left image */}
              <div
                className="absolute bottom-0 left-0 -translate-x-1/2 -translate-y-1/3 w-[6rem] h-[6rem] mx-auto rounded-[0.5rem] bg-cover bg-center"
                style={{ backgroundImage: `url(${image7.src})` }}
              ></div>
            </div>
          </FadeIn>

          {/** Texts */}
          <div className="w-full mx-auto flex flex-col gap-4 lg:w-full lg:mx-0">
            <FadeIn>
              <h3 className="text-black text-2xl font-semibold">
                Your event is live
              </h3>
            </FadeIn>

            <FadeIn>
              <p className="text-gray text-lg font-medium md:text-xl">
                Showcase your event on one of the world&apos;s largest and most
                highly visible event marketplaces.
              </p>
            </FadeIn>

            <FadeIn>
              <div className="flex gap-12 max-w-[30rem]">
                <div>
                  <h4 className="text-teal text-4xl font-semibold">80M+</h4>
                  <p className="text-gray text-lg font-medium">
                    Monthly visitors
                  </p>
                </div>

                <div>
                  <h4 className="text-teal text-4xl font-semibold">21</h4>
                  <p className="text-gray text-lg font-medium">Countries</p>
                </div>

                <div>
                  <h4 className="text-teal text-4xl font-semibold">11M</h4>
                  <p className="text-gray text-lg font-medium">
                    Monthly app users
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/** Second section */}
        <section className="w-full flex flex-col gap-6 mt-24 text-center lg:gap-8 lg:mt-32">
          <FadeIn>
            <h3 className="text-black text-2xl font-semibold">
              Connect with over 1,000 distribution partners
            </h3>
          </FadeIn>

          <FadeIn>
            <p className="max-w-[48rem] mx-auto text-gray text-lg font-medium md:text-xl">
              Leverage our top-tier distribution network to showcase your event
              to new audiences in key markets through the world&apos;s most
              popular platforms.
            </p>
          </FadeIn>
        </section>

        {/** Partners' logos section */}
        <section
          ref={logosSliderRef}
          className="keen-slider mt-8 touch-pan-y lg:mt-12"
        >
          {/** Klook */}
          <div className="keen-slider__slide">
            <Image
              src={klookLogo}
              className="block max-w-full mx-auto"
              alt="klook"
            />
          </div>

          {/** Booking.com */}
          <div className="keen-slider__slide">
            <Image
              src={bookingComLogo}
              className="block max-w-full mx-auto"
              alt="booking.com"
            />
          </div>

          {/** Viator */}
          <div className="keen-slider__slide">
            <Image
              src={viatorLogo}
              className="block max-w-full mx-auto"
              alt="viator"
            />
          </div>

          {/** Get Your Guide */}
          <div className="keen-slider__slide">
            <Image
              src={getYourGuideLogo}
              className="block max-w-full mx-auto"
              alt="get your guide"
            />
          </div>

          {/** Musement */}
          <div className="keen-slider__slide">
            <Image
              src={musementLogo}
              className="block max-w-full mx-auto"
              alt="musement"
            />
          </div>

          {/** SongKick */}
          <div className="keen-slider__slide">
            <Image
              src={songkickLogo}
              className="block max-w-full mx-auto"
              alt="songkick"
            />
          </div>

          {/** Redeam */}
          <div className="keen-slider__slide">
            <Image
              src={redeamLogo}
              className="block max-w-full mx-auto"
              alt="redeam"
            />
          </div>

          {/** Conde Nast */}
          <div className="keen-slider__slide">
            <Image
              src={condeNastLogo}
              className="block max-w-full mx-auto"
              alt="conde nast"
            />
          </div>

          {/** Bandsintown */}
          <div className="keen-slider__slide">
            <Image
              src={bandsintownLogo}
              className="block max-w-full mx-auto"
              alt="bandsintown"
            />
          </div>

          {/** Spotify */}
          <div className="keen-slider__slide">
            <Image
              src={spotifyLogo}
              className="block max-w-full mx-auto"
              alt="spotify"
            />
          </div>

          {/** Evvnt */}
          <div className="keen-slider__slide">
            <Image
              src={evvntLogo}
              className="block max-w-full mx-auto"
              alt="evvnt"
            />
          </div>

          {/** Ingresso */}
          <div className="keen-slider__slide">
            <Image
              src={ingressoLogo}
              className="block max-w-full mx-auto"
              alt="ingresso"
            />
          </div>

          {/** Vegas.com */}
          <div className="keen-slider__slide">
            <Image
              src={vegasLogo}
              className="block max-w-full mx-auto"
              alt="vegas.com"
            />
          </div>

          {/** Youtube */}
          <div className="keen-slider__slide">
            <Image
              src={youtubeLogo}
              className="block max-w-full mx-auto"
              alt="youtube"
            />
          </div>

          {/** Groupon */}
          <div className="keen-slider__slide">
            <Image
              src={grouponLogo}
              className="block max-w-full mx-auto"
              alt="groupon"
            />
          </div>

          {/** Expedia */}
          <div className="keen-slider__slide">
            <Image
              src={expediaLogo}
              className="block max-w-full mx-auto"
              alt="expedia"
            />
          </div>
        </section>

        {/** Fourth section */}
        <section className="w-full relative grid grid-cols-1 gap-12 items-center content-between mt-24 lg:grid-cols-2 lg:gap-16 lg:mt-32">
          {/** Images */}
          <FadeIn>
            <div className="w-full relative flex items-center justify-center">
              {/** Main image */}
              <Image
                src={image3}
                className="block w-1/2 mx-auto"
                alt="woman using phone"
              />

              {/** Upper left image */}
              <Image
                src={image4}
                className="block absolute w-1/3 mx-auto inset-[-2rem_auto_auto_2rem] shadow-[0_4px_30px_#0000001a]"
                alt="product"
              />

              {/** Lower left image */}
              <Image
                src={image5}
                className="block absolute w-1/3 mx-auto inset-[1rem_auto_auto_1rem] shadow-[0_2px_30px_#0000001a]"
                alt="product"
              />

              {/** Right image */}
              <Image
                src={image6}
                className="block absolute w-1/3 mx-auto inset-[auto_2rem_1.25rem_auto] shadow-[0_4px_30px_#0000001a]"
                alt="product"
              />
            </div>
          </FadeIn>

          {/** Texts */}
          <div className="w-full flex flex-col gap-4">
            <FadeIn>
              <h3 className="text-black text-2xl font-semibold">
                Supercharge promotions using fan-driven data
              </h3>
            </FadeIn>

            <FadeIn>
              <p className="text-gray text-lg font-medium md:text-xl">
                Leverage expert guidance and exclusive access to a massive fan
                database to refine campaigns and maximize audience engagement.
              </p>
            </FadeIn>
          </div>
        </section>

        {/** Button */}
        <FadeIn>
          <Link href="#" className="block w-full mt-14 lg:mt-24">
            <button className="block w-max mx-auto bg-white uppercase text-teal text-base font-semibold border-[1px] border-teal py-4 px-6 rounded-[0.5rem] transition-all duration-300 hover:bg-teal hover:text-white lg:text-lg">
              explore unparalled marketing
            </button>
          </Link>
        </FadeIn>
      </main>
    </div>
  );
}

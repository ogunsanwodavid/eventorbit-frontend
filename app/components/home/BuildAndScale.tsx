import Image from "next/image";
import Link from "next/link";

import image1 from "@/static/home/build-and-scale/image-1.png";
import image2 from "@/static/home/build-and-scale/image-2.jpg";
import image3 from "@/static/home/build-and-scale/image-3.png";

export default function BuildAndScale() {
  //List items
  const listItems: string[] = [
    "Let fans find and buy tickets right on your site with one simple code snippet.",
    "Keep full control of customer data to grow your brand your way.",
    "Tailor checkout to boost sales, offer upgrades, and gain audience insights.",
  ];

  return (
    <div className="w-full bg-white">
      <main className="inner-screen-max py-16 px-5 flex flex-col gap-y-8 lg:px-10 lg:gap-y-12 max:px-0">
        {/** Heading */}
        <h2 className="leading-[1.2] text-black text-5xl font-semibold text-center">
          Build and scale your brand with cutting-edge tech
        </h2>

        {/** Mid Section */}
        <section className="w-full grid grid-cols-1 gap-12 items-center lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          {/** List */}
          <ul className="flex flex-col gap-y-8">
            {listItems.map((item, index) => {
              return (
                <li key={index} className="flex gap-x-4 shrink-0">
                  {/** List disc */}
                  <span className="inline-block w-3 h-3 bg-teal rounded-full shrink-0"></span>

                  {/** List text */}
                  <p className="text-gray text-xl -mt-2">{item}</p>
                </li>
              );
            })}
          </ul>

          {/** Images */}
          <div className="relative w-full mt-16">
            {/** Big image */}
            <Image src={image2} className="w-4/5 mx-auto" alt="event image" />

            {/** Top right image */}
            <Image
              src={image1}
              className="w-[65%] absolute inset-[-4rem_0_auto_auto]"
              alt="event image"
            />

            {/** Bottom left image */}
            <Image
              src={image3}
              className="w-3/5 absolute inset-[auto_auto_-1.5rem_2rem]"
              alt="event image"
            />
          </div>
        </section>

        {/** Button */}
        <Link href="#" className="w-full mt-6 lg:mt-12">
          <button className="block w-max mx-auto bg-white uppercase text-teal text-base font-semibold border-[1px] border-teal py-4 px-6 rounded-[0.5rem] transition-all duration-300 hover:bg-teal hover:text-white">
            explore brand-first solutions
          </button>
        </Link>
      </main>
    </div>
  );
}

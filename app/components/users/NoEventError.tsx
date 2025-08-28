import Image from "next/image";
import Link from "next/link";

import searchImg from "@/static/users/search.png";

interface NoEventErrorProps {
  text: string;
}

export default function NoEventError({ text }: NoEventErrorProps) {
  return (
    <div className="w-max flex flex-col items-center justify-center gap-y-5 text-center">
      {/** Search image */}
      <Image src={searchImg} className="w-20 h-20" alt="search icon" />

      <p className="text-base text-gray font-medium">{text}</p>

      <Link
        href="/explore"
        className="py-2 px-4 border-[1px] border-teal text-[14px] text-teal font-semibold rounded-[6px] duration-250 transition-all hover:bg-teal hover:text-white"
      >
        Discover other events
      </Link>
    </div>
  );
}

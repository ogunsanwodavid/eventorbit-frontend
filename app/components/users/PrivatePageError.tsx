import Image from "next/image";

import lockImg from "@/static/users/lock.png";

export default function PrivatePageError() {
  return (
    <div className="w-max flex flex-col items-center justify-center gap-y-5 text-center">
      {/** Lock image */}
      <Image src={lockImg} className="w-20 h-20" alt="search icon" />

      <p className="text-base text-gray font-medium">
        This profile is private.
      </p>
    </div>
  );
}

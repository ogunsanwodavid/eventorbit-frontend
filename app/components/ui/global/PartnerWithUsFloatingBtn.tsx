import Link from "next/link";

export default function PartnerWithUsFloatingBtn() {
  return (
    <Link href="/partner-with-us" className="block fixed right-5 bottom-8 z-3">
      <button className=" bg-white rounded-[0.5em] py-3 px-4 text-black text-[15px] font-medium shadow-[0_2px_8px_#00000014] transition-all duration-200 hover:bg-teal hover:text-white lg:right-8 lg:bottom-16 lg:text-base">
        Partner With Us
      </button>
    </Link>
  );
}

import { ReactNode } from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

interface TabLinkProps {
  href: string;
  children: ReactNode;
}

export default function TabLink({ href, children }: TabLinkProps) {
  //Pathname function
  const pathname = usePathname();

  //Function to check if a link is active
  const isLinkActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`inline-block text-nowrap pb-2 px-1 text-black-2 text-[16px] border-b-[2px] border-b-transparent mb-[1px] font-medium hover:text-teal hover:border-b-teal hover:font-semibold ${
        isLinkActive && "!text-teal !border-b-teal !font-semibold"
      }`}
    >
      {children}
    </Link>
  );
}

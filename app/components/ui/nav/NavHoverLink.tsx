import React from "react";

import Link from "next/link";

interface NavHoverLinkProps {
  children: React.ReactNode;
  href: string;
}

export default function NavHoverLink({ children, href }: NavHoverLinkProps) {
  return (
    <Link href={href}>
      <div className="pt-7 pb-5 border-b-2 border-b-teal text-[15px] text-white hover:border-b-white">
        {children}
      </div>
    </Link>
  );
}

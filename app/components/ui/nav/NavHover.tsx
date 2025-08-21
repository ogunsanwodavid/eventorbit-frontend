import React from "react";

interface NavHoverProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function NavHover({ children, onClick }: NavHoverProps) {
  return (
    <div
      className="h-full pt-7 pb-5 border-b-2 border-b-teal text-[15px] text-white cursor-pointer hover:border-b-white"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

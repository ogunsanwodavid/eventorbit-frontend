import React from "react";

interface NavHoverProps {
  children: React.ReactNode;
  onClick?: () => void;
  isTransparent?: boolean;
}

export default function NavHover({
  children,
  onClick,
  isTransparent,
}: NavHoverProps) {
  return (
    <div
      className={`h-full pt-7 pb-5 border-b-2 text-[15px] text-white cursor-pointer hover:border-b-white ${
        isTransparent ? "border-b-transparent" : "border-b-teal"
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

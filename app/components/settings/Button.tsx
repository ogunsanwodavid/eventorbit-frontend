import { MouseEventHandler } from "react";

import Tadpole from "../ui/spinners/TadPole";

interface ButtonProps {
  isLoading?: boolean;
  text: string;
  disabled?: boolean;
  className?: string;
  onClick?: MouseEventHandler;
}

export default function Button({
  isLoading,
  text,
  disabled,
  className,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`w-full py-2 px-4 bg-transparent border-[1px] border-teal rounded-[6px] text-teal text-[15px] capitalize flex items-center justify-center transition-all duration-250 ${className} ${
        disabled ? "!opacity-60" : "hover:bg-teal hover:text-white"
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {isLoading ? <Tadpole size="20" /> : text}
    </button>
  );
}

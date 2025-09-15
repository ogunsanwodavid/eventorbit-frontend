import { MouseEventHandler } from "react";

import Tadpole from "../ui/spinners/TadPole";

import CaretDownOutline from "../ui/icons/CaretDownOutline";

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
      className={`w-full py-2 px-4 bg-teal rounded-[6px] text-white text-[15px] font-medium flex items-center justify-center transition-all duration-250 ${className} ${
        disabled ? "!opacity-60" : "hover:opacity-90"
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {isLoading ? (
        <Tadpole size="18" />
      ) : (
        <div className="flex items-center justify-center gap-x-1">
          <span>{text}</span>

          <span className="inline-block rotate-270">
            <CaretDownOutline size="14" />
          </span>
        </div>
      )}
    </button>
  );
}

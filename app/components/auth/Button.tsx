import { MouseEventHandler } from "react";

import Tadpole from "../ui/spinners/TadPole";

type ButtonType = "submit" | "reset" | "button" | undefined;

interface ButtonProps {
  isLoading: boolean;
  text: string;
  disabled?: boolean;
  className?: string;
  type?: ButtonType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  isLoading,
  text,
  disabled,
  className,
  type,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`w-full h-[42px] bg-teal px-4 capitalize text-white text-[17px] rounded-[6px] flex items-center justify-center ${className}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {isLoading ? <Tadpole size="20" /> : text}
    </button>
  );
}

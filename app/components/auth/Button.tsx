import Tadpole from "../ui/spinners/TadPole";

interface ButtonProps {
  isLoading: boolean;
  text: string;
  className?: string;
}

export default function Button({ isLoading, text, className }: ButtonProps) {
  return (
    <button
      className={`w-full h-[42px] bg-teal px-4 capitalize text-white text-[17px] rounded-[6px] flex items-center justify-center ${className}`}
    >
      {isLoading ? <Tadpole size="20" /> : text}
    </button>
  );
}

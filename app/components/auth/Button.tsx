import Tadpole from "../ui/spinners/TadPole";

interface ButtonProps {
  isLoading: boolean;
  text: string;
}

export default function Button({ isLoading, text }: ButtonProps) {
  return (
    <button className="w-full h-[42px] bg-teal px-4 capitalize text-white text-[17px] rounded-[6px] flex items-center justify-center">
      {isLoading ? <Tadpole size="20" /> : text}
    </button>
  );
}

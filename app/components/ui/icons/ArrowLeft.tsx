type ArrowLeftProps = {
  size: string;
  stroke?: string;
};

const ArrowLeft = ({ size, stroke }: ArrowLeftProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke={stroke || "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 12h14m-7-7l-7 7l7 7"
    />
  </svg>
);

export default ArrowLeft;

type PlusProps = {
  size: string;
  fill?: string;
  stroke?: string;
};

const Plus = ({ size, fill, stroke }: PlusProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill || "currentColor"}
  >
    <path
      fill="none"
      stroke={stroke || "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 5v14m-7-7h14"
    />
  </svg>
);

export default Plus;

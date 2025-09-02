type Number1CircleProps = {
  size: string;
  fill?: string;
  stroke?: string;
};

const Number1Circle = ({ size, fill, stroke }: Number1CircleProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill || "currentColor"}
  >
    <g
      fill="none"
      stroke={stroke || "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
    >
      <path d="M12.5 17V7l-2 2" />
      <circle cx="12" cy="12" r="9" />
    </g>
  </svg>
);

export default Number1Circle;

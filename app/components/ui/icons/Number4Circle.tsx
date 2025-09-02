type Number4CircleProps = {
  size: string;
  fill?: string;
  stroke?: string;
};

const Number4Circle = ({ size, fill, stroke }: Number4CircleProps) => (
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
      <circle cx="12" cy="12" r="9" />
      <path d="m10.5 7l-1.272 4.45A2 2 0 0 0 11.152 14H14.5m0 0v-4m0 4v3" />
    </g>
  </svg>
);

export default Number4Circle;

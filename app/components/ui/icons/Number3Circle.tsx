type Number3CircleProps = {
  size: string;
  fill?: string;
  stroke?: string;
};

const Number3Circle = ({ size, fill, stroke }: Number3CircleProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill || "currentColor"}
  >
    <g fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={fill || "currentColor"}
        opacity=".16"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={stroke || "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        stroke={stroke || "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 16.236A3 3 0 1 0 12 11l3-4h-5"
      />
    </g>
  </svg>
);

export default Number3Circle;

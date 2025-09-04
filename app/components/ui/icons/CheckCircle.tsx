type CheckCircleProps = {
  size: string;
  fill?: string;
  stroke?: string;
};

const CheckCircle = ({ size, fill, stroke }: CheckCircleProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill || "currentColor"}
  >
    <g fill="none" stroke={stroke || "currentColor"} strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8 13l2.5 2.5L16 10"
      />
      <path d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z" />
    </g>
  </svg>
);

export default CheckCircle;

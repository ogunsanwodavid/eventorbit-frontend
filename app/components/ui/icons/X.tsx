type XProps = {
  size: string;
  fill?: string;
  color?: string;
};

const X = ({ size, fill, color }: XProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path
      fill={fill}
      stroke={color || "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M18 6L6 18M6 6l12 12"
    />
  </svg>
);

export default X;

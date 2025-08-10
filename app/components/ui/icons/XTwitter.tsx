type XTwitterProps = {
  size: string;
  color?: string;
};

const XTwitter = ({ size, color }: XTwitterProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke={color || "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m3 21l7.5-7.5m3-3L21 3M8 3H3l13 18h5Z"
    />
  </svg>
);

export default XTwitter;

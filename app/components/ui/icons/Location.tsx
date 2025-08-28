type LocationProps = {
  size: string;
  stroke?: string;
};

const Location = ({ size, stroke }: LocationProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <g
      fill="none"
      stroke={stroke || "currentColor"}
      strokeLinejoin="round"
      strokeWidth="1.5"
    >
      <path d="M6.4 4.76a7.92 7.92 0 0 1 11.2 11.2l-4.186 4.186a2 2 0 0 1-2.828 0L6.4 15.96a7.92 7.92 0 0 1 0-11.2Z" />
      <circle cx="12" cy="10.36" r="3" strokeLinecap="round" />
    </g>
  </svg>
);

export default Location;

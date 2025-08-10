type LinkedinProps = {
  size: string;
  color: string;
};

const Linkedin = ({ size, color }: LinkedinProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <g
      fill="none"
      stroke={color || "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <circle cx="4" cy="4" r="2" />
      <path d="M2 9h4v12H2Zm20 12h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 12 0Z" />
    </g>
  </svg>
);

export default Linkedin;

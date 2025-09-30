type ExpandSidebarRightProps = {
  size: string;
  fill?: string;
  stroke?: string;
};

const ExpandSidebarRight = ({
  size,
  fill,
  stroke,
}: ExpandSidebarRightProps) => (
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
      strokeWidth="2"
    >
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm11-2v16" />
      <path d="m10 10l-2 2l2 2" />
    </g>
  </svg>
);

export default ExpandSidebarRight;

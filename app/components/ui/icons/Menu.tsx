type MenuProps = {
  size: string;
  fill?: string;
  color?: string;
};

const Menu = ({ size, fill, color }: MenuProps) => (
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
      d="M3 12h18M3 6h18M3 18h18"
    />
  </svg>
);

export default Menu;

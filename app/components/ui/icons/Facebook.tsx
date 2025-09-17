type FacebookProps = {
  size: string;
  fill?: string;
};

const Facebook = ({ size, fill }: FacebookProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 224 488"
  >
    <path
      fill={fill || "currentColor"}
      d="M51 91v63H4v78h47v230h95V232h65q6-37 8-78h-72v-53q0-6 6.5-12.5T168 82h52V2h-71q-28 0-48.5 8.5T71 29.5T57 55t-5.5 21.5T51 91z"
    />
  </svg>
);

export default Facebook;

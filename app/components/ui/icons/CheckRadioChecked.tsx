type CheckRadioCheckedProps = {
  size: string;
  fill?: string;
};

const CheckRadioChecked = ({ size, fill }: CheckRadioCheckedProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill || "currentColor"}
  >
    <g fill={fill || "currentColor"}>
      <path d="M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0" />
      <path
        fillRule="evenodd"
        d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0 2a9 9 0 1 0 0-18a9 9 0 0 0 0 18"
        clipRule="evenodd"
      />
    </g>
  </svg>
);

export default CheckRadioChecked;

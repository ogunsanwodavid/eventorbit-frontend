type CheckRadioUncheckedProps = {
  size: string;
  fill?: string;
};

const CheckRadioUnchecked = ({ size, fill }: CheckRadioUncheckedProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill || "currentColor"}
  >
    <path
      fill={fill || "currentColor"}
      fillRule="evenodd"
      d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0 2a9 9 0 1 0 0-18a9 9 0 0 0 0 18"
      clipRule="evenodd"
      opacity=".5"
    />
  </svg>
);

export default CheckRadioUnchecked;

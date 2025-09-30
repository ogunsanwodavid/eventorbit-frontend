type HomeProps = {
  size: string;
  stroke?: string;
};

const Home = ({ size, stroke }: HomeProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke={stroke || "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M1 12L12 1l11 11m-2-2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10m6 12v-8h6v8"
    />
  </svg>
);

export default Home;

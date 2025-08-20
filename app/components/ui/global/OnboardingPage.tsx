import useWindowDimensions from "@/app/hooks/global/useWindowDimensions";

import BlocksWave from "../spinners/BlocksWave";

export default function OnboardingPage() {
  //Window dimensions
  const { windowWidth, windowHeight } = useWindowDimensions();

  return (
    <div
      className={`bg-white flex items-center justify-center text-teal overflow-hidden`}
      style={{
        width: `${windowWidth}px`,
        height: `${windowHeight}px`,
      }}
    >
      <BlocksWave size={windowWidth > 1000 ? "70" : "50"} />
    </div>
  );
}

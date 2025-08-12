import Hero from "./components/home/Hero";
import BuildAndScale from "./components/home/BuildAndScale";
import SwiftlyStreamline from "./components/home/SwiftlyStreamline";
import BoostYourAudience from "./components/home/BoostYourAudience";
import AccelerateYourGrowth from "./components/home/AccelerateYourGrowth";

export default function Home() {
  return (
    <div className="w-full">
      {/** Hero */}
      <Hero />

      {/** Build And Scale */}
      <BuildAndScale />

      {/** Swiftly Streamline */}
      <SwiftlyStreamline />

      {/** Boost Your Audience */}
      <BoostYourAudience />

      {/** Accelerate Your Growth */}
      <AccelerateYourGrowth />
    </div>
  );
}

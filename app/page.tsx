import Hero from "./components/home/Hero";
import BuildAndScale from "./components/home/BuildAndScale";
import SwiftlyStreamline from "./components/home/SwiftlyStreamline";

export default function Home() {
  return (
    <div className="w-full">
      {/** Hero */}
      <Hero />

      {/** Build And Scale */}
      <BuildAndScale />

      {/** Swiftly Streamline */}
      <SwiftlyStreamline />
    </div>
  );
}

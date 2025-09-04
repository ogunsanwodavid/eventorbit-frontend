"use client";

import { EventType } from "@/app/models/events";

import Basics from "./basics/Basics";
import TimeAndLocation from "./time-and-location/TimeAndLocation";

interface StepPageProps {
  type: EventType;
  step: number;
}

export default function StepPage({ type, step }: StepPageProps) {
  return (
    <div className="mt-6">
      {/** Inner */}
      <main className="w-full max-w-[900px] mx-auto px-5 lg:px-0">
        {/** Basics */}
        {step === 1 && <Basics type={type} />}

        {/** Time and Location */}
        {step === 2 && type === "regular" && <TimeAndLocation type={type} />}
      </main>
    </div>
  );
}

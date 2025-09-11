"use client";

import { usePathname } from "next/navigation";

import { EventType } from "@/app/models/events";

import Basics from "./basics/Basics";
import TimeAndLocation from "./time-and-location/TimeAndLocation";
import Schedules from "./schedules/Schedules";

interface StepPageProps {
  type: EventType;
  step: number;
}

export default function StepPage({ type, step }: StepPageProps) {
  //Pathname function
  const pathname = usePathname();

  const largeWidthPathnames = ["/create/timed-entry/2"];

  return (
    <div className="mt-6">
      {/** Inner */}
      <main
        className={`w-full mx-auto px-5 lg:px-10`}
        style={{
          maxWidth: largeWidthPathnames.includes(pathname) ? "1200px" : "900px",
        }}
      >
        {/** Basics */}
        {step === 1 && <Basics type={type} />}

        {/** Time and Location */}
        {step === 2 && type === "regular" && <TimeAndLocation type={type} />}

        {/** Schedules */}
        {step === 2 && type === "timed-entry" && <Schedules type={type} />}
      </main>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";

import { EventType } from "@/app/models/events";

import Basics from "./basics/Basics";
import TimeAndLocation from "./time-and-location/TimeAndLocation";
import Schedules from "./schedules/Schedules";
import Tickets from "./tickets/Tickets";

interface StepPageProps {
  type: EventType;
  step: number;
}

export default function StepPage({ type, step }: StepPageProps) {
  //Pathname function
  const pathname = usePathname();

  //Custon max-width for some pathnames
  const pathnameMaxWidths: Record<string, string> = {
    "/create/timed-entry/2": "1200px",
  };

  return (
    <div className="mt-6">
      {/** Inner */}
      <main
        className={`w-full mx-auto px-5 lg:px-10`}
        style={{
          maxWidth: pathnameMaxWidths[pathname] || "900px",
        }}
      >
        {/** Basics */}
        {step === 1 && <Basics type={type} />}

        {/** Time and Location */}
        {step === 2 && type === "regular" && <TimeAndLocation type={type} />}

        {/** Schedules */}
        {step === 2 && type === "timed-entry" && <Schedules type={type} />}

        {/** Tickets */}
        {step === 3 && <Tickets type={type} />}
      </main>
    </div>
  );
}

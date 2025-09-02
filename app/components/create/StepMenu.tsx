"use client";

import { useRouter } from "next/navigation";

import { useAppSelector } from "@/app/hooks/global/redux";

import Number1Circle from "../ui/icons/Number1Circle";
import Number2Circle from "../ui/icons/Number2Circle";
import Number3Circle from "../ui/icons/Number3Circle";
import Number4Circle from "../ui/icons/Number4Circle";

interface StepMenuProps {
  type: string;
}

export default function StepMenu({ type }: StepMenuProps) {
  //Router function
  const router = useRouter();

  //Get current step from redux state
  const { currentStep } = useAppSelector((state) => state.createEvent);

  //Event type state
  const isRegular = type === "regular";
  const isTimedEntry = type === "timed-entry";

  //Handle navigation
  function handleNavigation(argStep: number) {
    if (currentStep <= argStep) return;

    router.replace(`/create/${type}/${argStep}`);
  }

  return (
    <div className="w-full cursor-pointer">
      {/** Main content */}
      <main className="w-full max-w-[1100px] mx-auto grid grid-cols-4 px-5 lg:px-0">
        {/** Basics - 1 */}
        <div
          className={`flex items-center justify-center gap-x-2 px-8 py-5 text-[#a0b0b7] ${
            currentStep === 1 && "!text-teal"
          }`}
          onClick={() => handleNavigation(1)}
        >
          <span className="shrink-0">
            <Number1Circle size="20" />
          </span>

          <p className="hidden text-[15px] text-nowrap font-bold leading-[18px] md:block">
            BASICS
          </p>
        </div>

        {/** Time & Location - 2
         * show only if regular event
         */}
        {isRegular && (
          <div
            className={`flex items-center justify-center gap-x-2 px-8 py-4 text-[#a0b0b7] ${
              currentStep === 2 && "!text-teal"
            }`}
            onClick={() => handleNavigation(2)}
          >
            <span className="shrink-0">
              <Number2Circle size="20" />
            </span>

            <p className="hidden text-[15px] text-nowrap font-bold leading-[18px] md:block">
              TIME AND LOCATION
            </p>
          </div>
        )}

        {/** Schedules - 2
         * show only if timed-entry event
         */}
        {isTimedEntry && (
          <div
            className={`flex items-center justify-center gap-x-2 px-8 py-4 text-[#a0b0b7] ${
              currentStep === 2 && "!text-teal"
            }`}
            onClick={() => handleNavigation(2)}
          >
            <span className="shrink-0">
              <Number2Circle size="20" />
            </span>

            <p className="hidden text-[15px] text-nowrap font-bold leading-[18px] md:block">
              SCHEDULES
            </p>
          </div>
        )}

        {/** Tickets - 3 */}
        <div
          className={`flex items-center justify-center gap-x-2 px-8 py-4 text-[#a0b0b7] ${
            currentStep === 3 && "!text-teal"
          }`}
          onClick={() => handleNavigation(3)}
        >
          <span className="shrink-0">
            <Number3Circle size="20" />
          </span>

          <p className="hidden text-[15px] text-nowrap font-bold leading-[18px] md:block">
            TICKETS
          </p>
        </div>

        {/** Additional details - 4 */}
        <div
          className={`flex items-center justify-center gap-x-2 px-8 py-4 text-[#a0b0b7] ${
            currentStep === 4 && "!text-teal"
          }`}
          onClick={() => handleNavigation(4)}
        >
          <span className="shrink-0">
            <Number4Circle size="20" />
          </span>

          <p className="hidden text-[15px] text-nowrap font-bold leading-[18px] md:block">
            ADDITIONAL DETAILS
          </p>
        </div>
      </main>

      {/** Progress bar */}
      <div className="w-full h-[4px] bg-[#e2e5e7]">
        <div
          className="bg-teal h-full"
          style={{
            width: `${(currentStep / 4) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
}

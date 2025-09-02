"use client";

import { useAppSelector } from "@/app/hooks/global/redux";

import Basics from "@/app/components/create/Basics";

interface StepPageProps {
  type: string;
}

export default function StepPage({ type }: StepPageProps) {
  //Get current step from redux state
  const { currentStep } = useAppSelector((state) => state.createEvent);

  return (
    <div className="mt-6">
      {/** Inner */}
      <main className="w-full max-w-[900px] mx-auto px-5 lg:px-0">
        {/** Basics */}
        {currentStep === 1 && <Basics type={type} />}
      </main>
    </div>
  );
}

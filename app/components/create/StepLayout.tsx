"use client";

import { ReactNode, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAppSelector } from "@/app/hooks/global/redux";

import StepMenu from "./StepMenu";

interface StepLayoutProps {
  children: ReactNode;
  type: string;
  step: number;
}

export default function StepLayout({ children, type, step }: StepLayoutProps) {
  //Router function
  const router = useRouter();

  //Get current step from redux state
  const { currentStep } = useAppSelector((state) => state.createEvent);

  /* useEffect(() => {
    //Route to first step if user attempts to navigate to steps above current step
    //::RUN ONLY ON MOUNT
    if (step > currentStep) router.replace(`/create/${type}/1`);
  }, []); */

  return (
    <div className="w-full mb-16">
      {/** Create event step menu */}
      <StepMenu type={type} step={step} />

      {children}
    </div>
  );
}

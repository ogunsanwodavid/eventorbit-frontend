import { ReactNode } from "react";

import StepLayout from "@/app/components/create/StepLayout";

type paramsType = Promise<{ type: string; step: string }>;

interface CreateEventStepLayoutProps {
  children: ReactNode;
  params: paramsType;
}

export default async function CreateEventStepLayout({
  children,
  params,
}: CreateEventStepLayoutProps) {
  //Params
  const { type, step } = await params;

  return (
    <StepLayout type={type} step={Number(step)}>
      {children}
    </StepLayout>
  );
}

import StepPage from "@/app/components/create/StepPage";

import { EventType } from "@/app/models/events";

type paramsType = Promise<{ type: EventType; step: string }>;

interface CreateEventStepPageProps {
  params: paramsType;
}

export default async function CreateEventStepPage({
  params,
}: CreateEventStepPageProps) {
  //Params
  const { type, step } = await params;

  return <StepPage type={type} step={Number(step)} />;
}

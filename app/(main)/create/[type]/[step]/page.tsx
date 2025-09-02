import StepPage from "@/app/components/create/StepPage";

type paramsType = Promise<{ type: string; step: string }>;

interface CreateEventStepPageProps {
  params: paramsType;
}

export default async function CreateEventStepPage({
  params,
}: CreateEventStepPageProps) {
  //Params
  const { type } = await params;

  return <StepPage type={type} />;
}

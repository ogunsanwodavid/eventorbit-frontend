import { z } from "zod";

const TriggerUpdateEmailFormSchema = z.object({
  email: z.email("Invalid email address"),
});

export default TriggerUpdateEmailFormSchema;

export type TriggerEmailFormType = z.infer<typeof TriggerUpdateEmailFormSchema>;

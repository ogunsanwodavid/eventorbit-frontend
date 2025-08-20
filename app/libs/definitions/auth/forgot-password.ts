import { z } from "zod";

const ForgotPasswordFormSchema = z.object({
  email: z.email("Invalid email address"),
  pageRedirect: z.string().optional(),
});

export default ForgotPasswordFormSchema;

export type ForgotPasswordFormType = z.infer<typeof ForgotPasswordFormSchema>;

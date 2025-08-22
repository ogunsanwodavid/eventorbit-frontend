import { z } from "zod";

const UpdateEmailFormSchema = z.object({
  password: z.string().trim().nonempty("Password is required"),
});

export default UpdateEmailFormSchema;

export type UpdateEmailFormType = z.infer<typeof UpdateEmailFormSchema>;

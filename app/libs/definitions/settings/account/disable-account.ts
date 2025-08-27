import { z } from "zod";

const DisableAccountFormSchema = z.object({
  password: z.string().trim().nonempty("Password is required"),
});

export default DisableAccountFormSchema;

export type DisableAccountFormType = z.infer<typeof DisableAccountFormSchema>;

import { z } from "zod";

const UpdatePoliciesFormSchema = z.object({
  termsAndConditions: z
    .url()
    .refine((url) => !url || url.startsWith("https://"), {
      message: "Terms & Conditions must be an HTTPS URL",
    })
    .optional(),
  privacyPolicy: z
    .url()
    .refine((url) => !url || url.startsWith("https://"), {
      message: "Privacy Policy must be an HTTPS URL",
    })
    .optional(),
});

export default UpdatePoliciesFormSchema;

export type UpdatePoliciesFormType = z.infer<typeof UpdatePoliciesFormSchema>;

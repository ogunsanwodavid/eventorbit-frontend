import { z } from "zod";

const UpdateProfileInfoFormSchema = z.object({
  userType: z.enum(["individual", "organization"], {
    error: "User type must be 'individual' or 'organization'",
  }),
  firstName: z.string().trim().nonempty("First name is required").optional(),
  lastName: z.string().trim().nonempty("Last name is required").optional(),
  organizationName: z
    .string()
    .trim()
    .nonempty("Organization name is required")
    .optional(),
  description: z.string().optional(),
  profileSlug: z
    .string()
    .trim()
    .nonempty("Profile URL is required")
    .min(3, "Profile URL must be at least 3 characters"),
  isPrivate: z.boolean("isPrivate must be a boolean"),
  isABusinessSeller: z.boolean("isABusinessSeller must be a boolean"),
  businessAddress: z
    .string()
    .trim()
    .nonempty("Business address is required")
    .optional(),
  businessEmail: z.email().optional(),
  businessPhoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number") // allows + and 7–15 digits
    .optional(),
});

export default UpdateProfileInfoFormSchema;

export type UpdateProfileInfoFormType = z.infer<
  typeof UpdateProfileInfoFormSchema
>;

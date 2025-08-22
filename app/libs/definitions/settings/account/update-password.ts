import { z } from "zod";

const UpdatePasswordFormSchema = z
  .object({
    currentPassword: z.string().trim().nonempty("Current password is required"),
    newPassword: z
      .string()
      .trim()
      .nonempty("New password is required")
      .min(6, "New password must be at least 6 characters")
      .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
      .regex(/\d/, "New password must contain at least one digit")
      .regex(
        /[^A-Za-z0-9]/,
        "New password must contain at least one special character"
      ),
    confirmNewPassword: z.string().nonempty("Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"], //error will show on confirm field
    message: "Passwords do not match",
  });

export default UpdatePasswordFormSchema;

export type UpdatePasswordFormType = z.infer<typeof UpdatePasswordFormSchema>;

import { z } from "zod";

const SetPasswordFormSchema = z
  .object({
    email: z.email("Invalid email address"),
    newPassword: z
      .string()
      .trim()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one digit")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmNewPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"], //error will show on confirm field
    message: "Passwords do not match",
  })
  //Return only newPassword
  .transform(({ newPassword }) => ({
    newPassword,
  }));

export default SetPasswordFormSchema;

export type SetPasswordFormType = z.infer<typeof SetPasswordFormSchema>;

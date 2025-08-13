import { z } from "zod";

export const SignupFormSchema = z
  .object({
    userType: z.enum(["individual", "organization"], {
      error: "User type must be 'individual' or 'organization'",
    }),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    organizationName: z.string().optional(),
    email: z.email("Invalid email address"),
    password: z
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
  })
  .superRefine((data, ctx) => {
    if (data.userType === "individual") {
      if (!data.firstName || data.firstName.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "First name is required",
          path: ["firstName"],
        });
      }
      if (!data.lastName || data.lastName.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Last name is required",
          path: ["lastName"],
        });
      }
    }

    if (data.userType === "organization") {
      if (!data.organizationName || data.organizationName.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Organization name is required",
          path: ["organizationName"],
        });
      }
    }
  });

export type SignupFormState =
  | {
      errors?: Partial<
        Record<keyof z.infer<typeof SignupFormSchema>, string[]>
      >;
      message?: string;
    }
  | undefined;

import { z } from "zod";

const SignInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().trim().nonempty("Password is required"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  pageRedirect: z.string().optional(),
});

export default SignInFormSchema;

export type SignupFormState =
  | {
      errors?: Partial<
        Record<keyof z.infer<typeof SignInFormSchema>, string[]>
      >;
      message?: string;
    }
  | undefined;

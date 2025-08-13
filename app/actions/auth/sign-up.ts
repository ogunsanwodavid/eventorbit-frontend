import z from "zod";

import { SignupFormSchema } from "@/app/libs/definitions/auth/sign-up";

import flattenTreeErrors, {
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

//Signup function
export async function signUp(formData: FormData, pageRedirect: string) {
  const userType = String(formData.get("userType"));
  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));
  const organizationName = String(formData.get("organizationName"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    userType,
    firstName,
    lastName,
    organizationName,
    email,
    password,
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    const treeErrors = z.treeifyError(validatedFields.error) as ZodErrorTree;
    const flatErrors = flattenTreeErrors(treeErrors);

    return {
      validationErrors: flatErrors,
    };
  }

  return { success: true };
}

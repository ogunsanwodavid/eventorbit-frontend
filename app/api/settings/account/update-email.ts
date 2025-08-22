import z from "zod";

import axios from "axios";

import UpdateEmailFormSchema from "@/app/libs/definitions/settings/account/update-email";

import flattenTreeErrors, {
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

interface UpdateEmailApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

//Update email function
export async function updateEmail(email: string, formData: FormData) {
  //Form data
  const password = String(formData.get("password"));

  //Validate form fields
  const validatedFields = UpdateEmailFormSchema.safeParse({
    password,
  });

  //If any form fields are invalid, return early
  if (!validatedFields.success) {
    const treeErrors = z.treeifyError(validatedFields.error) as ZodErrorTree;
    const flatErrors = flattenTreeErrors(treeErrors);

    return {
      validationErrors: flatErrors,
    };
  }

  //Update email via API
  try {
    const response = await axios.patch<UpdateEmailApiResponse>(
      `${API_BASE_URL}/api/account/update-email`,
      { email, ...validatedFields.data },
      { withCredentials: true }
    );

    return {
      success: true,
      message:
        response.data.message ?? "Email updated and verification email sent.",
    };
  } catch (error) {
    let errorMessage = "Failed to update email.";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

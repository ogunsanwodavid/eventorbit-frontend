import z from "zod";

import axios from "axios";

import ForgotPasswordFormSchema from "@/app/libs/definitions/auth/forgot-password";

import flattenTreeErrors, {
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

interface ForgotPasswordApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

//Forgot password function
export async function forgotPassword(formData: FormData) {
  //Form data
  const email = String(formData.get("email"));
  const pageRedirect = String(formData.get("pageRedirect"));

  //Validate form fields
  const validatedFields = ForgotPasswordFormSchema.safeParse({
    email,
    pageRedirect,
  });

  //If any form fields are invalid, return early
  if (!validatedFields.success) {
    const treeErrors = z.treeifyError(validatedFields.error) as ZodErrorTree;
    const flatErrors = flattenTreeErrors(treeErrors);

    return {
      validationErrors: flatErrors,
    };
  }

  //Send reset link via API
  try {
    const response = await axios.post<ForgotPasswordApiResponse>(
      `${API_BASE_URL}/api/auth/forgot-password`,
      validatedFields.data,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Reset password email sent.",
    };
  } catch (error) {
    let errorMessage = "Failed to send reset email";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

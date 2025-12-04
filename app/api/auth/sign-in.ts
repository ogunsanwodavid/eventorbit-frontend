import z from "zod";

import axios from "axios";

import SignInFormSchema from "@/app/libs/definitions/auth/sign-in";

import flattenTreeErrors, {
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

interface SignInApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

//Sign in function
export async function signIn(formData: FormData) {
  //Form data
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  const pageRedirect = String(formData.get("pageRedirect"));

  //Validate form fields
  const validatedFields = SignInFormSchema.safeParse({
    email,
    password,
    latitude: latitude || undefined,
    longitude: longitude || undefined,
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

  //Sign in user via API
  try {
    const response = await axios.post<SignInApiResponse>(
      `${API_BASE_URL}/api/auth/signin`,
      validatedFields.data,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Sign in successful",
    };
  } catch (error) {
    let errorMessage = "Failed to sign in";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

import z from "zod";

import axios from "axios";

import SetPasswordFormSchema from "@/app/libs/definitions/auth/set-password";

import flattenTreeErrors, {
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

interface SetPasswordApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

//Set new password function
export async function setPassword(formData: FormData) {
  //Form data
  const email = String(formData.get("email"));
  const newPassword = String(formData.get("newPassword"));
  const confirmNewPassword = String(formData.get("confirmNewPassword"));

  //Validate form fields
  const validatedFields = SetPasswordFormSchema.safeParse({
    email,
    newPassword,
    confirmNewPassword,
  });

  //If any form fields are invalid, return early
  if (!validatedFields.success) {
    const treeErrors = z.treeifyError(validatedFields.error) as ZodErrorTree;
    const flatErrors = flattenTreeErrors(treeErrors);

    return {
      validationErrors: flatErrors,
    };
  }

  try {
    await axios.post<SetPasswordApiResponse>(
      `${API_BASE_URL}/api/auth/reset-password`,
      validatedFields.data,
      { withCredentials: true }
    );

    return {
      success: true,
      message: "Password set successfully",
    };
  } catch (error) {
    let errorMessage = "Failed to set up password";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = "Failed to set up password";
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

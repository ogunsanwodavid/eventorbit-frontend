import z from "zod";

import axios from "axios";

import UpdatePasswordFormSchema from "@/app/libs/definitions/settings/account/update-password";

import flattenTreeErrors, {
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

interface UpdatePasswordApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

//Update password function
export async function updatePassword(formData: FormData) {
  //Form data
  const currentPassword = String(formData.get("currentPassword"));
  const newPassword = String(formData.get("newPassword"));
  const confirmNewPassword = String(formData.get("confirmNewPassword"));

  //Validate form fields
  const validatedFields = UpdatePasswordFormSchema.safeParse({
    currentPassword,
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

  //Update email via API
  try {
    const response = await axios.patch<UpdatePasswordApiResponse>(
      `${API_BASE_URL}/api/account/update-password`,
      validatedFields.data,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Password updated successfully.",
    };
  } catch (error) {
    let errorMessage = "Failed to update password.";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

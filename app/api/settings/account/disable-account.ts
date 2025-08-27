import z from "zod";

import axios from "axios";

import DisableAccountFormSchema from "@/app/libs/definitions/settings/account/disable-account";

import flattenTreeErrors, {
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

interface DisableAccountApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

//Disable account function
export async function disableAccount(formData: FormData) {
  //Form data
  const password = String(formData.get("password"));

  //Validate form fields
  const validatedFields = DisableAccountFormSchema.safeParse({
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

  //Disable account via API
  try {
    const response = await axios.post<DisableAccountApiResponse>(
      `${API_BASE_URL}/api/account/disable`,
      validatedFields.data,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Account disabled successfully.",
    };
  } catch (error) {
    let errorMessage = "Failed to disable account.";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

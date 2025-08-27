import z from "zod";

import axios from "axios";

import UpdatePoliciesFormSchema from "@/app/libs/definitions/settings/account/update-policies";

import flattenTreeErrors, {
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

interface UpdatePoliciesApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

//Update privacy function
export async function updatePolicies(formData: FormData) {
  //Form data
  const termsAndConditions = String(formData.get("termsAndConditions"));
  const privacyPolicy = String(formData.get("privacyPolicy"));

  //Validate form fields
  const validatedFields = UpdatePoliciesFormSchema.safeParse({
    termsAndConditions: termsAndConditions || undefined,
    privacyPolicy: privacyPolicy || undefined,
  });

  //If any form fields are invalid, return early
  if (!validatedFields.success) {
    const treeErrors = z.treeifyError(validatedFields.error) as ZodErrorTree;
    const flatErrors = flattenTreeErrors(treeErrors);

    return {
      validationErrors: flatErrors,
    };
  }

  //Update Policies via API
  try {
    const response = await axios.patch<UpdatePoliciesApiResponse>(
      `${API_BASE_URL}/api/account/update-policies`,
      validatedFields.data,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Policies updated successfully.",
    };
  } catch (error) {
    let errorMessage = "Failed to update policies.";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

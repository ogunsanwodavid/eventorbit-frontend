import z from "zod";

import axios from "axios";

import UpdateLocationFormSchema from "@/app/libs/definitions/settings/account/update-location";

import flattenTreeErrors, {
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

interface UpdateLocationApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

//Update location function
export async function updateLocation(formData: FormData) {
  //Form data
  const location = String(formData.get("location"));

  //Validate form fields
  const validatedFields = UpdateLocationFormSchema.safeParse({
    location,
  });

  //If any form fields are invalid, return early
  if (!validatedFields.success) {
    const treeErrors = z.treeifyError(validatedFields.error) as ZodErrorTree;
    const flatErrors = flattenTreeErrors(treeErrors);

    return {
      validationErrors: flatErrors,
    };
  }

  //Update location via API
  try {
    const response = await axios.patch<UpdateLocationApiResponse>(
      `${API_BASE_URL}/api/account/update-location`,
      validatedFields.data,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Location updated successfully.",
    };
  } catch (error) {
    let errorMessage = "Failed to update Location.";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

import z from "zod";

import axios from "axios";

import UpdateProfileSocialUrlsFormSchema from "@/app/libs/definitions/settings/profile/update-profile-social-urls";

import flattenTreeErrors, {
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

interface UpdateProfileSocialUrlsApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function updateProfileSocialUrls(formData: FormData) {
  //Form data
  const website = String(formData.get("website"));
  const facebook = String(formData.get("facebook"));
  const x = String(formData.get("x"));
  const instagram = String(formData.get("instagram"));

  //Validate form fields
  const validatedFields = UpdateProfileSocialUrlsFormSchema.safeParse({
    website: website || undefined,
    facebook: facebook || undefined,
    x: x || undefined,
    instagram: instagram || undefined,
  });

  //If any form fields are invalid, return early
  if (!validatedFields.success) {
    const treeErrors = z.treeifyError(validatedFields.error) as ZodErrorTree;
    const flatErrors = flattenTreeErrors(treeErrors);

    return {
      validationErrors: flatErrors,
    };
  }

  //Update Profile info via API
  try {
    const response = await axios.patch<UpdateProfileSocialUrlsApiResponse>(
      `${API_BASE_URL}/api/profile/update-profile-social-urls`,
      validatedFields.data,
      { withCredentials: true }
    );

    return {
      success: true,
      message:
        response.data.message ?? "Profile social URLs updated successfully.",
    };
  } catch (error) {
    let errorMessage = "Failed to update profile social URLs.";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

import z from "zod";

import axios from "axios";

import UpdateProfileInfoFormSchema from "@/app/libs/definitions/settings/profile/update-profile-info";

import flattenTreeErrors, {
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

interface UpdateProfileInfoApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function updateProfileInfo(formData: FormData) {
  //Form data
  const userType = String(formData.get("userType"));
  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));
  const organizationName = String(formData.get("organizationName"));
  const description = String(formData.get("description"));
  const profileSlug = String(formData.get("profileSlug"));
  const isPrivate = Boolean(String(formData.get("isPrivate")) === "true");
  const isABusinessSeller = Boolean(
    String(formData.get("isABusinessSeller")) === "true"
  );
  const businessAddress = String(formData.get("businessAddress"));
  const businessEmail = String(formData.get("businessEmail"));
  const businessPhoneNumber = String(formData.get("businessPhoneNumber"));

  //Useful variables
  const isOrganization = userType === "organization";

  //Validate form fields
  const validatedFields = UpdateProfileInfoFormSchema.safeParse({
    userType,
    firstName: !isOrganization ? firstName : undefined,
    lastName: !isOrganization ? lastName : undefined,
    organizationName: isOrganization ? organizationName : undefined,
    description: description || undefined,
    profileSlug,
    isPrivate,
    isABusinessSeller,
    businessAddress: isABusinessSeller ? businessAddress : undefined,
    businessEmail: isABusinessSeller ? businessEmail : undefined,
    businessPhoneNumber: isABusinessSeller ? businessPhoneNumber : undefined,
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
    const response = await axios.patch<UpdateProfileInfoApiResponse>(
      `${API_BASE_URL}/api/profile/update-profile-info`,
      validatedFields.data,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Profile updated successfully.",
    };
  } catch (error) {
    let errorMessage = "Failed to update profile.";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

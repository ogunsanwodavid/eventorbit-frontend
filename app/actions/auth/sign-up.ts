import z from "zod";

import axios from "axios";

import { SignupFormSchema } from "@/app/libs/definitions/auth/sign-up";

import flattenTreeErrors, {
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

interface SignUpApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

//Signup function
export async function signUp(formData: FormData) {
  //Form data
  const userType = String(formData.get("userType"));
  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));
  const organizationName = String(formData.get("organizationName"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  const pageRedirect = String(formData.get("pageRedirect"));

  //Check if user is individual or organization
  const isIndividual = userType === "individual";
  const isOrganization = userType === "organization";

  //Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    userType,
    firstName: isIndividual ? firstName : undefined,
    lastName: isIndividual ? lastName : undefined,
    organizationName: isOrganization ? organizationName : undefined,
    email,
    password,
    latitude,
    longitude,
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

  //Sign up user via API
  try {
    const response = await axios.post<SignUpApiResponse>(
      `${API_BASE_URL}/api/auth/signup`,
      validatedFields.data,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "User created successfully",
    };
  } catch (error) {
    let errorMessage = "Failed to sign up";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

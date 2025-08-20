import axios from "axios";

interface ValidateResetTokenApiResponse {
  message: string;
  email?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

//Validate reset token function
export async function validateResetToken(token: string) {
  try {
    const response = await axios.get<ValidateResetTokenApiResponse>(
      `${API_BASE_URL}/api/auth/validate-reset-token/${token}`,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Reset token valid",
      email: response.data?.email,
    };
  } catch (error) {
    let errorMessage = "Invalid or expired token";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

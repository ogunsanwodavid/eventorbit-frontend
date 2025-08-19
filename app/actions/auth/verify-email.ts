import axios from "axios";

interface VerifyEmailApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

//Verify email function
export async function verifyEmail(token: string) {
  try {
    const response = await axios.get<VerifyEmailApiResponse>(
      `${API_BASE_URL}/api/auth/verify-email?token=${token}`,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Email verified successfully",
    };
  } catch (error) {
    let errorMessage = "Verification failed";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

import axios from "axios";

interface SignOutApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

//Sign out function
export async function signOut() {
  try {
    const response = await axios.get<SignOutApiResponse>(
      `${API_BASE_URL}/api/auth/signout`,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Signed out successful.",
    };
  } catch (error) {
    let errorMessage = "Failed to log out.";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

import axios from "axios";

interface DraftEventApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function draftEvent(eventId: string) {
  try {
    const response = await axios.patch<DraftEventApiResponse>(
      `${API_BASE_URL}/api/events/draft/${eventId}`,
      undefined, //No request body
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Event drafted successfully",
    };
  } catch (error) {
    let errorMessage = "Failed to draft event";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

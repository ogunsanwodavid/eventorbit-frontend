import axios from "axios";

interface PublishEventApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function publishEvent(eventId: string) {
  try {
    const response = await axios.patch<PublishEventApiResponse>(
      `${API_BASE_URL}/api/events/publish/${eventId}`,
      undefined, //No request body
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Event published successfully",
    };
  } catch (error) {
    let errorMessage = "Failed to publish event";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

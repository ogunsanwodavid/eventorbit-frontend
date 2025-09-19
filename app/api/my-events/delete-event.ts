import axios from "axios";

interface DeleteEventApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function deleteEvent(eventId: string) {
  try {
    const response = await axios.get<DeleteEventApiResponse>(
      `${API_BASE_URL}/api/events/delete/${eventId}`,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Event deleted successfully",
    };
  } catch (error) {
    let errorMessage = "Failed to delete event";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

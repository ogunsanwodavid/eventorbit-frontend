import axios from "axios";

import { Event } from "@/app/models/events";

export interface RecentlyUpdatedEvent extends Event {
  updatedAt: Date;
}

interface GetRecentlyUpdatedApiResponse {
  message: string;
  events: RecentlyUpdatedEvent[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getRecentlyUpdated(number: number) {
  //Query parameters
  const params = new URLSearchParams();

  //Append only valid params
  if (number !== undefined) params.append("number", String(number));

  try {
    const response = await axios.get<GetRecentlyUpdatedApiResponse>(
      `${API_BASE_URL}/api/events/get-recently-updated?${params.toString()}`,
      { withCredentials: true }
    );

    return {
      success: true,
      message:
        response.data.message ?? "Recently updated events fetched successfully",
      events: response.data.events,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch recently updated events";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

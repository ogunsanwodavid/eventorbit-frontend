import axios from "axios";

import { Pagination } from "@/app/models/global";

import { Event, EventStatus } from "@/app/models/events";

interface GetMyEventsApiResponse {
  message: string;
  events: Event[];
  pagination: Pagination;
}

interface GetMyEventsOptions {
  page?: number;
  limit?: number;
  status?: EventStatus;
  search?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getMyEvents({
  page,
  limit,
  status,
  search,
}: GetMyEventsOptions) {
  //Query parameters
  const params = new URLSearchParams();

  //Append only valid params
  if (page !== undefined) params.append("page", String(page));
  if (limit !== undefined) params.append("limit", String(limit));
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  try {
    const response = await axios.get<GetMyEventsApiResponse>(
      `${API_BASE_URL}/api/events/get-my-events?${params.toString()}`,
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Your events fetched successfully",
      events: response.data.events,
      pagination: response.data.pagination,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch your event";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

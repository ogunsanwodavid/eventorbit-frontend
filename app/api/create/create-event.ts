import axios from "axios";

import { Event } from "@/app/models/events";

import { CreateEvent } from "@/app/redux/slices/create/createEventSlice";

interface CreateEventApiResponse {
  message: string;
  event: Event;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function createEvent(event: CreateEvent) {
  try {
    const response = await axios.post<CreateEventApiResponse>(
      `${API_BASE_URL}/api/events/create`,
      {
        ...event,
        duration: event.type === "regular" ? event.duration : undefined,
        schedules: event.type === "timed-entry" ? event.schedules : undefined,
      },
      { withCredentials: true }
    );

    return {
      success: true,
      message: response.data.message ?? "Event created successfully",
      event: response.data.event,
    };
  } catch (error) {
    let errorMessage = "Failed to create event";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

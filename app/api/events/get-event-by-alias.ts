import axios from "axios";

import { Profile } from "@/app/models/auth";

import { Event } from "@/app/models/events";

interface GetEventByAliasApiResponse {
  message: string;
  event: Event;
  host: Profile;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getEventByAlias(alias: string) {
  try {
    const response = await axios.get<GetEventByAliasApiResponse>(
      `${API_BASE_URL}/api/events/get-by-alias/${alias}`,
      { withCredentials: true }
    );

    return {
      success: true,
      event: response.data.event,
      host: response.data.host,
    };
  } catch {
    return { success: false, event: null, host: null };
  }
}

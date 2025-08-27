import axios from "axios";

import { EmailPreferences } from "@/app/models/settings";

interface GetEmailPreferencesApiResponse {
  message: string;
  emailPreferences?: EmailPreferences;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getEmailPreferences() {
  const response = await axios.get<GetEmailPreferencesApiResponse>(
    `${API_BASE_URL}/api/email-preferences/get`,
    {
      withCredentials: true,
    }
  );

  return response.data.emailPreferences;
}

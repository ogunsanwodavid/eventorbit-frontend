import axios from "axios";

import { Profile } from "@/app/models/auth";

interface GetProfileApiResponse {
  message: string;
  profile?: Profile;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getProfile() {
  const response = await axios.get<GetProfileApiResponse>(
    `${API_BASE_URL}/api/profile/get`,
    { withCredentials: true }
  );

  return response.data.profile;
}

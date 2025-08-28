import axios from "axios";

import { Profile } from "@/app/models/auth";

interface GetProfileBySlugApiResponse {
  message: string;
  profile?: Profile;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getProfileBySlug(slug: string) {
  const response = await axios.get<GetProfileBySlugApiResponse>(
    `${API_BASE_URL}/api/profile/get-by-slug/${slug}`,
    { withCredentials: true }
  );

  return response.data.profile;
}

import axios from "axios";

interface GetAuthStatusApiResponse {
  authenticated?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getAuthStatus() {
  const response = await axios.get<GetAuthStatusApiResponse>(
    `${API_BASE_URL}/api/auth/status`,
    { withCredentials: true }
  );

  console.log(response);

  return response.data.authenticated ?? false;
}

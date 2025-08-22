import axios from "axios";

import { Account } from "@/app/models/settings";

interface GetAccountApiResponse {
  message: string;
  account?: Account;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getAccount() {
  const response = await axios.get<GetAccountApiResponse>(
    `${API_BASE_URL}/api/account/get`,
    { withCredentials: true }
  );

  return response.data.account;
}

import axios from "axios";

import { Code } from "@/app/models/discount-codes";

interface GetDiscountCodesApiResponse {
  message: string;
  discountCodes: Code[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getDiscountCodes(eventId: string) {
  try {
    const response = await axios.get<GetDiscountCodesApiResponse>(
      `${API_BASE_URL}/api/discount-codes/get/${eventId}`,
      { withCredentials: true }
    );

    return response.data.discountCodes;
  } catch {
    return null;
  }
}

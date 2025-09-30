import axios from "axios";

import { Question } from "@/app/models/checkout-questions";

interface GetCheckoutQuestionsApiResponse {
  message: string;
  checkoutQuestions: Question[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getCheckoutQuestions(eventId: string) {
  try {
    const response = await axios.get<GetCheckoutQuestionsApiResponse>(
      `${API_BASE_URL}/api/checkout-questions/get/${eventId}`,
      { withCredentials: true }
    );

    return response.data.checkoutQuestions;
  } catch {
    return null;
  }
}

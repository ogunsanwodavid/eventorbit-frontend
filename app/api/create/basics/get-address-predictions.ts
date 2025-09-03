import axios from "axios";

export interface PlacePrediction {
  placePrediction: {
    placeId: string;
    text: {
      text: string;
    };
  };
}

interface GetAddressPredictionsApiResponse {
  suggestions: PlacePrediction[];
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export async function getAddressPredictions(input: string) {
  const response = await axios.post<GetAddressPredictionsApiResponse>(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      input,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY!,
        "X-Goog-FieldMask": "suggestions.placePrediction", //Return only place predictions
      },
    }
  );

  return response.data.suggestions;
}

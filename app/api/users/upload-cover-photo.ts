import axios from "axios";

interface UploadCoverPhotoApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function uploadCoverPhoto(file: File) {
  const formData = new FormData();
  formData.append("coverPhoto", file);

  try {
    const response = await axios.patch<UploadCoverPhotoApiResponse>(
      `${API_BASE_URL}/api/profile/upload-cover-photo`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      success: true,
      message: response.data.message ?? "Cover photo uploaded successfully",
    };
  } catch (error) {
    let errorMessage = "Failed to upload cover photo";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

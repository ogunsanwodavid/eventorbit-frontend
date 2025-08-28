import axios from "axios";

interface UploadProfilePictureApiResponse {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function uploadProfilePicture(file: File) {
  const formData = new FormData();
  formData.append("profilePicture", file);

  try {
    const response = await axios.patch<UploadProfilePictureApiResponse>(
      `${API_BASE_URL}/api/profile/upload-profile-pic`,
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
      message: response.data.message ?? "Profile picture uploaded successfully",
    };
  } catch (error) {
    let errorMessage = "Failed to upload profile picture";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}
